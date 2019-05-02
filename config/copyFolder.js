const path = require('path')
const fs = require('fs')
const pathExtend = require('./pathExtend')

/**
 * [copy 拷贝目录或文件, 或拷贝并重命名文件]
 * @param  {[String]}  src                [需拷贝的目录或文件]
 * @param  {[String]}  dest               [目标目录名或文件名]
 * @param  {[Object]}  exclude            [源文件中需要排除的文件，正则格式]
 * @param  {Boolean} [isShowError=true]   [如果被拷贝文件或目录不存在，是否提示错误]
 */
function copyFolder(src, dest, exclude, isShowError = false) {
  // 参数兼容处理
  if (typeof exclude === 'undefined' || typeof exclude === 'boolean') {
    isShowError = exclude
  }

  // 文件为排除文件，则不予处理
  if (typeof exclude === 'object' && exclude.test(src)) {
    return false
  }

  if (typeof src === 'undefined') {
    throw new Error('拷贝源路径或文件不能为空')
  }

  if (fs.existsSync(src)) {
    let srcStat = fs.statSync(src)

    if (!fs.existsSync(dest)) {
      deepMkdir(dest)
    }

    let {dir, isFile} = pathExtend(dest, true)

    if (srcStat.isFile()) { // src为文件，直接拷贝
      if (!(typeof exclude === 'object' && exclude.test(src))) {
        let srcBasename = path.basename(src)
        // 如果dest为文件名，则直接使用dest名，否则使用src文件名
        let destFile = isFile
          ? dest
          : path.join(dir, srcBasename)
        fs.copyFileSync(src, destFile)
      }

    }

    if (srcStat.isDirectory()) {
      // 遍历目录，深层复制
      let pathArr = fs.readdirSync(src)
      pathArr.forEach(pathItem => {
        let itemSrc = path.join(src, pathItem)
        let eachDest = path.join(dir, pathItem)
        copyFolder(itemSrc, eachDest, exclude, isShowError)
      })

    }

  } else {
    if (isShowError) {
      throw new Error(`拷贝源路径或文件${src}不存在`)
    }
  }
}

/**
 * [deepMkdir 深层创建目录]
 * @param  {[String]} dest [需创建目录字符串]
 */
function deepMkdir(dest) {
  let {dir} = pathExtend(dest, true)
  let dirArr = dir.split(path.sep)
  let tempDir = ''
  if (dirArr.length > 0) {
    if (dest.startsWith(path.sep)) {
      dirArr[0] = path.sep
    }
    for (let item of dirArr) { // 逐层创建目录
      tempDir = path.join(tempDir, item)
      tempDir = tempDir.includes(':') && !(tempDir.includes(':\\')) ? tempDir.replace(':',':\\') : tempDir
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }
    }
  }
}

module.exports = {
  copyFolder,
  deepMkdir
}
