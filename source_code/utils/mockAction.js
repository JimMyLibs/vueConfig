/**
 * mock数据分发处理，对API对应地址做mock数据处理
 * @example
 * api: 'user/login'
 * 对应mock文件: 项目目录/mock/login.json
 * login.json可为json数据或符合mockjs语法的动态json
 */
import Mock from 'mockjs'

/**
 * api使用mock数据处理
 * @param  {String} api 接口请求地址
 * @return {Promise}     动态加载mock数据的Promise
 */
export default(api) => {
  if (typeof api !== 'string' || api.trim() === '') {
    // throw new Error('接口地址必须为非空字符串')
    return new Promise((resolve, reject)=>{
      resolve()
    })
  } else {
    // api以 '/' 分割后的最后一截字符串为对应mock文件名处理
    let fileName = api.split('?')[0].replace(/^\/+/, '').replace('undefined', '')
    let name = fileName.replace(/\//g, '_')
    return import (`projectPath/mock/${name}.json`).then(module => {
      typeof module.default === 'object'
        ? delete module.default
        : ''
      return Mock.mock(module)
    })
  }
}
