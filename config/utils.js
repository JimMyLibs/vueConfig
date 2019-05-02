const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const os = require('os')

// 当前项目目录名
// const projectConfig = require('../projectConfig')
let {PROJECT_DIR_NAME, isAutoGetIp, isRandPort} = require('../projectConfig')

// 判断是否为线上环境
// const isProd = process.env.NODE_ENV === 'prod'

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// 获取当前主机ip地址
exports.getLocalIp = function() {
  let localIp = '0.0.0.0'

  // 不需要获取ip地址，则直接返回 0.0.0.0
  if (!isAutoGetIp) {
    return localIp
  }

  // 获得网络接口列表
  let networkStr = JSON.stringify(os.networkInterfaces())

  let matchIPv4Arr = networkStr.match(/\{[^{}]*IPv4[^{}]*\}/gi)
  matchIPv4Arr = matchIPv4Arr
    ? matchIPv4Arr.join(',')
    : null
  let ipReg = /(\d{1,3}\.){3}\d{1,3}/g
  matchIPv4Arr = matchIPv4Arr
    ? matchIPv4Arr.match(ipReg)
    : null

  if (matchIPv4Arr) {
    for (let i = 0; i < matchIPv4Arr.length; i++) {
      if (!matchIPv4Arr[i].match(/^(255|127)/)) {
        localIp = matchIPv4Arr[i]
        break
      }
    }
  }
  return localIp
}

// 项目目录信息
exports.projectPathInfo = {

  // 生成目录函数
  resolve: resolve,

  // 当前项目目录名，非完整路径
  PROJECT_DIR_NAME: PROJECT_DIR_NAME,

  // 代码主目录
  codePath: resolve('source_code'),

  // 当前项目路径地址
  projectPath: resolve(`source_code/${PROJECT_DIR_NAME}`),

  // 发布目录规则 release/demo
  releasePath: resolve(`release/${PROJECT_DIR_NAME}`),

  // 静态资源地址
  staticPath: resolve('source_code/project_static'),

  // 公共库文件导出路径
  dllPath: resolve('dll'),

  // 是否随机端口号
  isRandPort: isRandPort

  // 发布目录规则 release/demo_2017_04_13_1648
  // releaseSavePath: resolve(`release/${PROJECT_DIR_NAME}_${getNowTime()}`)

}

// 生成当前时间字符串2017_04_13_1648
// function getNowTime() {
//
//   // 数字如果为一位数，前面加0
//   function t(num) {
//     return Number(num) < 10
//       ? `0${num}`
//       : num
//   }
//
//   let time = new Date()
//   let jsonDate = {
//     y: time.getFullYear(), //年
//     M: time.getMonth() + 1, //月
//     d: time.getDate(), //日
//     h: time.getHours(), //时
//     m: time.getMinutes(), //分
//     s: time.getSeconds(), //秒
//     q: Math.floor((time.getMonth() + 3) / 3) //季度
//   }
//   let {
//     y,
//     M,
//     d,
//     h,
//     m,
//     s
//   } = jsonDate
//   return `${y}_${t(M)}_${t(d)}_${t(h)}_${t(m)}`
// }

// 生成cssloader
exports.getCssLoaders = function(fallback, specialLoader) {

  let loaders = ['css-loader', 'postcss-loader']
  if (typeof specialLoader !== 'undefined') {
    loaders.push(specialLoader)
  }
  return ExtractTextPlugin.extract({fallback: fallback, use: loaders, publicPath: '../'})
}
