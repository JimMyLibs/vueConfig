/**
 * api请求统一封装
 *
 * 实例化对象是，传入参数为全局参数，参数配置见setConf方法
 * 调用实例get及post方法的时候，传入配置会同全局配置合并
 * 若调用实例方法参数配置不包含header，params，则该配置会自动作为params处理
 * 具体实例请参考demo示例
 */

// fetch请求基类
import ToFetch from 'utils/core/ToFetch'

// 获取api信息地址
// import apiUrl from 'config/apiUrl'

// mockAction文件，未启用mock数据时为: {}
import mockAction from 'mockAction'

// 项目配置文件，非开发环境为: {}
import {apiInfo, apiHost} from 'apiConf'

// 测试环境打印信息
import {p, isEmpty, deepCopy} from 'utils/utils'

import {getUserInfo} from 'business/userInfo'

// 存储api数据的sessionStorage标识
const apiInfoSessionId = '__apiInfoSessionId__'

// 若配置了mock项，则取配置值，默认不启用mock
const isUseMock = typeof mockAction === 'function'

// 当前项目标识（即根文件夹名）
const PROJECT_DIR_NAME = process.env.PROJECT_DIR_NAME

// 请求基类，可根据实际需要进行扩展
export default class Http extends ToFetch {

  constructor(conf) {
    super()
    // 初始化api信息
    // {
    //   activity: 'https://activity/link',
    //   product: 'https://product/link',
    // }
    this.apiInfo = null

    // 获取api的promise
    this.getApiPromise = null

    this.setConf(conf)

    // 初始化，首次获取api信息
    this.init()
  }

  init() {
    /**
     * [getApiPromise 初始化api接口信息及按需加载mock功能]
     * @type {Promise}
     */
    this.getApiPromise = new Promise((resolve, reject) => {
      if(isUseMock){
        this.toFetch = (url, reqConf) =>{
          return mockAction(url)
        }
        resolve()
      }else{
        if(typeof apiInfo === 'object'){  // dev
          this.apiInfo = this.apiInfo ? this.apiInfo : apiInfo
          resolve()
        }else{  // build
          let sessionInfo = JSON.parse(sessionStorage.getItem(apiInfoSessionId))
          if (isEmpty(sessionInfo)) {
            // 拉取对应环境api信息
            this.toGet(apiHost).then(res => {
              this.setApiInfo(res)
              resolve(res)
            }).catch(reson => {
              p(reson)
            })
          } else {
            // 已存在缓存数据，则直接使用
            this.setApiInfo(sessionInfo)
            resolve(sessionInfo)
          }
        }
      }
    })
  }

  /**
   * [setConf 设置全局统一配置]
   * @param {Object} [conf={}] [配置项]
   */
  setConf(conf = {}) {
    // 默认配置
    let defaultConf = {
      // 默认接口类型（已目录接口名为接口名）
      apiType: this.getDevApiType()

      // headers: {},

      // params: {}

      // 不通过接口，直接配置apiInfo
      // apiInfo: {
      //   activity: 'https://activity',
      //   product: 'https://product'
      // }
    }

    // 如果传入了apiInfo，则直接使用传入的apiInfo
    if ('apiInfo' in conf) {
      this.setApiInfo(conf.apiInfo)
    }

    this.conf = deepCopy({}, defaultConf, conf)
  }

  /**
   * [setApiInfo 存储接口地址信息]
   * @param {[json]} apiInfo [接口地址信息]
   */
  setApiInfo(apiInfo) {
    sessionStorage.setItem(apiInfoSessionId, JSON.stringify(apiInfo))
    this.apiInfo = apiInfo
  }

  // 根据目录获取默认api类型
  /**
   * [getDevApiType 根据当前项目所在目录，自动判断接口类型]
   * @return {[string]} [接口类型字符串]
   */
  getDevApiType() {
    let dev = PROJECT_DIR_NAME.split('/')[0]
    if (dev === 'activities') {
      // 兼容以前程序处理
      return 'activity'
    }
    return dev
  }

  // get请求封装
  get(url, options) {
    return this.getApiPromise.then(() => {
      let {reqUrl, conf} = this.getFetchConf(url, options)
      return this.toGet(reqUrl, conf)
    })
  }

  // post请求封装
  post(url, options) {
    return this.getApiPromise.then(() => {
      let {reqUrl, conf} = this.getFetchConf(url, options)
      return this.toPost(reqUrl, conf)
    })
  }

  /**
   * [upload description]
   * @param  {[string]} url     [接口路径]
   * @param  {[json]} data    [请求数据]
   * @param  {[json]} options [其他请求配置，如apiType，headers，params等]
   * @return {[promise]}         [请求promise]
   */
  upload(url, data, options) {
    return this.getApiPromise.then(() => {
      let {reqUrl, conf} = this.getFetchConf(url, options)
      let {method, params, headers} = conf

      method = method
        ? method
        : 'post'
      let fetConf = {
        method: method.toUpperCase()
      }

      let fetHeaders = {}
      if (!isEmpty(headers) && typeof headers === 'object') {
        for (let key in headers) {
          if (key !== 'Content-type') {
            fetHeaders[key] = headers[key]
          }
        }
      }

      if (!isEmpty(fetHeaders)) {
        fetConf.headers = fetHeaders
      }

      let body = new FormData()

      if (!isEmpty(data) && typeof data === 'object') {
        for (let key in data) {
          body.append(key, data[key])
        }
      }

      if (!isEmpty(params) && typeof params === 'object') {
        for (let key in params) {
          body.append(key, params[key])
        }
      }
      fetConf.body = body
      return this.toFetch(reqUrl, fetConf)
    })
  }

  /**
   * [getReqUrl 获取完整请求路径]
   * @param  {[string]} url                       [请求路劲]
   * @param  {[json]} [assignOptions=this.conf] [接口配置]
   * @return {[string]}                           [返回完整路径]
   */
  getReqUrl(url, assignOptions = this.conf) {
    if(isUseMock){
      return url
    }else{
      let {apiType} = assignOptions
      if (!(url.startsWith('http'))) {
        if (apiType in this.apiInfo) {
          url = `${this.apiInfo[apiType]}${url.replace(/^\/+/, '')}`
        } else {
          throw new Error(`接口类型 ${apiType} 不存在，请正确配置`)
        }
      }
      return url
    }
  }

  /**
   * [getFetchConf 组合请求配置]
   * @param  {[string]} url     [请求路径]
   * @param  {[json]} options [请求配置]
   * @return {[json]}         [请求信息配置]
   */
  getFetchConf(url, options = {}) {
    if ('headers' in options) {
      options.headers = this.repairContentType(options.headers)
    }
    let assignOptions = this.getMixParams(options)
    let reqUrl = this.getReqUrl(url, assignOptions)
    let {params, headers} = assignOptions
    let conf = {
      reqUrl,
      conf: {}
    }

    if (headers) {
      conf.conf.headers = headers
    }
    if (params) {
      conf.conf.params = params
    }
    return conf
  }

  // 请求数据整合，自动添加token及openid
  getMixParams(options = {}) {
    let defaultParams = {}
    let {token, openid} = getUserInfo()
    if (!isEmpty(token)) {
      defaultParams.headers = {
        token
      }
    }
    if (!isEmpty(openid)) {
      defaultParams.params = {
        openid
      }
    }
    return deepCopy(this.conf, defaultParams, this.getReqConf(options))
  }

}
