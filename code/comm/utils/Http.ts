import FetchBase from "comm/utils/core/FetchBase";
import { FetchOptions, ConfOptions } from "comm/utils/PublicInterface";
import { deepAssign } from "comm/utils/utils";
import { getProjectInfo } from "comm/utils/env";
import { getApiInfo } from "comm/business/commApi";
import { user } from "comm/business/user";

// 特殊接口参数
const specialKeys = ["apiType", "headers", "body", "apiInfo", "method"];

let {
  isDev,
  mockType,
  shortPath,
  mockPort,
  activityCode,
  isConsole,
  apiInfo: envApiInfo = {}
} = getProjectInfo()

const defaultApiType = shortPath.replace(/\/\w+$/, '')

export default class Http extends FetchBase {
  publicOptions: FetchOptions
  initPromise: any
  apiInfo: any

  constructor(conf: FetchOptions = {}) {
    super();
    this.initPromise = null
    this.publicOptions = this.formatConf(conf)
    this.init();
  }

  init() {
    this.initPromise = new Promise((resolve, reject) => {
      if (isDev) {
        resolve({})
      } else {
        getApiInfo().then(res => {
          this.apiInfo = res
          resolve(res)
        }).catch(reson => {
          reject(reson)
        })
      }
    })
  }

  formatConf(conf: FetchOptions = {}) {
    let isFindSpecial = Object.keys(conf).some((key: string) => {
      return specialKeys.includes(key);
    });

    if (!isFindSpecial) {
      return {
        body: {
          ...conf
        }
      }
    }
    return { ...conf }
  }

  $get(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, 'get')
  }

  $post(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, 'post')
  }

  $upload(api: string, options?: ConfOptions) {
    return this.$fetch(api, options, "upload");
  }

  $fetch(api: string, options: ConfOptions = {}, method: string = 'post') {
    return new Promise((resolve, reject) => {

      this.initPromise.then(() => {
        // method = ''
        let { headers, body, apiInfo, apiType } = this.getMixConf(options)
        let reqUrl: string = '';
        
        if (isDev && mockType.trim() !== '') {
          if (mockType === 'json') {
            method = 'get'
            reqUrl = `${location.origin}/mock/${api}.json`
            if (isConsole) {
              console.log('mock功能已启用，post请求会改为get请求')
            }
          } else if (mockType === 'node') {
            reqUrl = `${location.protocol}//${location.hostname}:${mockPort}/${api}`
            if (isConsole) {
              console.log('mock功能已启用，请开启node mock功能')
            }
          } else {
            throw new Error(`mockType is only use node、json, ''`)
          }
          
        } else {
          reqUrl = this.getApiUrl(api, apiType, apiInfo);
        }

        (this as any)[`to${method.replace(/^\w/, w => w.toUpperCase())}`](reqUrl, {
          headers, body
        }).then((res: any) => {
          resolve(res)
        }).catch((reson: any) => {
          reject(reson)
        })
      })

    })
  }

  getApiUrl(api: string, apiType: string = defaultApiType, apiInfo: any = this.apiInfo): string {
    if (api.search(/^https?/) > -1) {
      return api
    }
    api = api.replace(/^\/+/, '')

    if (isDev) {
      if (typeof apiInfo !== 'object' || !(apiType in apiInfo)) {
        apiInfo = { ...envApiInfo }
      }
    }
    return `${apiInfo[apiType].replace(/\/+$/, '')}/${api}`
  }

  getMixConf(options?: ConfOptions) {
    let { publicOptions, apiInfo } = this
    let { headers = {}, body = {}, ...conf } = deepAssign(publicOptions, this.formatConf(options))
    return {
      headers: deepAssign(this.mixHeaders(headers)),
      body: deepAssign(this.mixBody(body)),
      ...conf
    }
  }

  // 合并默认参数
  mixBody(body = {}) {
    if (typeof body === 'string') {
      return body
    }
    let baseData: any = {}
    let { token, openid }: any = user()
    if (activityCode) {
      baseData.activityCode = activityCode
    }
    if (openid) {
      baseData.openid = openid
    }
    return deepAssign({ ...baseData }, body)
  }

  // headers混合
  mixHeaders(headers = {}) {
    let { token }: any = user()
    let contentItem = Object.keys(headers).find(item => item.toLocaleLowerCase() === 'content-type')
    if (typeof contentItem === 'undefined') {
      headers = {
        ...headers,
        'Content-type': 'application/json; charset=UTF-8'
      }
    }
    if (token) {
      headers = { token, ...headers }
    }
    return { ...headers }
  }


}
