const path = require('path')
const fs = require('fs')

/**
 * [parsePath 格式化路径]
 * @param  {[String]}  pathStr            [需格式化的路径]
 * @param  {[String]}  [sep=path.sep]     [路径分隔符，默认为当前操作系统的分隔符]
 * @param  {Boolean} [isLocalFile=true]   [是否为本地文件，本地文件可使用fs.statSync方法来准确判断文件类型，非本地存在的文件通过是否有后缀名的方式来判断是文件还是文件夹，不一定100%准确]
 * @return {[Json]}                       [格式化的路径]
 */
module.exports = function parsePath(pathStr, isLocalFile = true, sep = path.sep) {
  let {dir, base} = path.parse(pathStr)
  let realDir = `${dir}${sep}${base}`
  let fileResult = {
    dir,  // 路径名
    name: base, // 文件名
    fullname: pathStr,  // 完整路径
    isFile: true, // 是否为文件
    isDirectory: false // 是否为目录
  }
  let dirResult = {
    dir: realDir,
    name: '',
    fullname: realDir,
    isFile: false,
    isDirectory: true
  }

  if (isLocalFile && fs.existsSync(pathStr)) {
    let pathStat = fs.statSync(pathStr)
    if (pathStat.isFile()) {
      return fileResult
    }
    // 暂不做严格处理，否则可能返回undefined，导致处理出错
    // if (pathStat.isDirectory()) {
    //   return dirResult
    // }
    return dirResult
  } else {
    if (/\.[^.]+$/.test(base)) { // file
      return fileResult
    }else{
      return dirResult
    }
  }
}
