// 接口信息文件地址，通过该地址可获取各个环境接口地址

const fileName = 'apiSource.v1.json'

// 主机地址通用后缀，请确保在对应环境服务器存在对应文件
const hostSuffix = `/h5/h5-base/json/${fileName}`

// 本地开发的时候，直接使用project_static/apiSource.json配置
// 避免跨域问题引起的不方便调试问题（如需要在手机端调试)
const localHostSuffix = `project_static/${fileName}`

// 判断是否为生产环境
const isProd = process.env.NODE_ENV === 'prod'

// 判断当前所在环境的主机前缀
function getCurrentHost() {
  if (isProd) {
    return `${location.origin}${hostSuffix}`
  } else {
    return localHostSuffix
  }
}


// apiSource文件对应数据说明
// {
//   "product": 产品接口地址,
//   "activity": 活动接口地址,
//   "shendun": 神盾接口地址,
//   "mvcApi": 新api接口地址(2017-11-06),
//   "collect": 埋点api接口地址,
//   "env": "test", 当前代码运行环境标识(test: 测试环境，dev: 开发环境， tiyan: 体验环境, www: 线上环境)
//   "version": "v1", 前端公用代码目前版本
// }


// 输出配置地址
export default getCurrentHost()
