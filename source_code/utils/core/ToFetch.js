// fetch请求封装

import {jsonToParams} from 'utils/url'

// 测试环境打印信息
import {isEmpty} from 'utils/utils'

// 请求基类，可根据实际需要进行扩展
export default class Http {

  constructor() {
    // dosomething
  }

  // get请求简化封装
  toGet(url, params) {
    let {reqUrl, reqConf} = this.getGetConf(url, params)
    return this.toFetch(reqUrl, reqConf)
  }

  // post请求简化封装
  toPost(url, params) {
    let reqConf = this.getPostConf(params)
    return this.toFetch(url, reqConf)
  }

  // get类型请求配置设置
  getGetConf(url, options) {
    let {method, params, headers} = this.getReqConf(options)
    method = method
      ? method
      : 'get'
    let conf = {
      reqConf: {
        method: method.toUpperCase()
      }
    }

    if (params) {
      if (typeof params === 'string') {
        params = `${params}&t=${Date.now()}`
      }

      if (typeof params === 'object') {
        params = jsonToParams(Object.assign({
          t: Date.now()
        }, params))
      }
      url = url.includes('?')
        ? `${url}&${params}`
        : `${url}?${params}`
    }

    if (headers) {
      conf.reqConf.headers = headers
    }

    conf.reqUrl = url

    return conf
  }

  // post类型请求配置设置
  getPostConf(options) {
    let {method, params, headers} = this.getReqConf(options)
    method = method
      ? method
      : 'post'
    let conf = {
      method: method.toUpperCase()
    }

    let {formatHeaders, formatParams} = this.setFormatBody(headers, params)
    if (formatHeaders) {
      conf.headers = formatHeaders
    }
    if (formatParams) {
      conf.body = formatParams
    }
    return conf
  }

  setFormatBody(headers, params) {
    // other Content-Type
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    let formatHeaders = {
      'Content-Type': 'application/json; charset=UTF-8'
    }

    formatHeaders = typeof headers === 'object'
      ? Object.assign(formatHeaders, this.repairContentType(headers))
      : formatHeaders

    let formatParams = typeof params === 'object'
      ? JSON.stringify(params)
      : params

    if (typeof headers === 'object') {
      let reg = /content-type[^,]+/i
      let matchContentType = JSON.stringify(formatHeaders).match(reg)
      if (matchContentType) {
        if (matchContentType[0].includes('application/x-www-form-urlencoded')) {
          if (typeof params === 'object') {
            formatParams = jsonToParams(params)
          }
        }
      }
    }
    return {formatHeaders, formatParams}
  }

  getReqConf(options) {
    // undefined, json, string
    if (typeof options === 'object') {
      let {params, headers} = options
      if (params || headers) {
        return options
      } else {
        return {params: options}
      }
    }

    if (typeof options === 'string') {
      return {params: options}
    }

    if (typeof options === 'undefined') {
      return {params: ''}
    }
  }

  // 返回多个异步返回结果
  all(...fetchArray) {
    return Promise.all([...fetchArray])
  }

  // 发送fetch请求统一入口
  toFetch(url, reqConf) {
    this.beforeFetch(url, reqConf)
    return fetch(url, reqConf).then(data => {
      // in some SAMSUNG mobile data.ok is undefined so add data.status
      if (data.ok || data.status === 200) {
        return data.json()
      } else {
        // 未正常返回数据，则抛出异常
        throw new Error(`响应数据异常，错误码：${data.status}`)
      }
    }).then(data => {
      let filterData = this.afterFetch(data, url)
      // 成功返回数据的处理
      return filterData
        ? filterData
        : data
    })
  }

  // 注意，该方法已被废弃
  // 自定义设置headers
  // isMixDefault 是否自动混合Content-Type
  getMixHeaders(headers = {}, isMixDefault = true) {
    let defaultHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    if (isMixDefault) {
      return Object.assign({}, defaultHeaders, headers)
    } else {
      return headers
    }
  }

  repairContentType(headers={}) {
    let keys = ['Content-Type','Content-type', 'content-type',  'content-Type']
    let result = {}
    if(isEmpty(headers)){
      return result
    }

    for( let key in headers){
      if( keys.includes(key) ){
        for( let k of keys){
          if( k in headers){
            result['Content-Type'] = headers[key]
            break
          }
        }
      }else{
        result[key] = headers[key]
      }
    }
    return result
  }

  // fetch请求之前的处理，暂时作为提供外部覆盖接口
  beforeFetch(url, reqConf) {}

  // 对返回结果进行处理，暂时作为提供外部覆盖接口
  afterFetch(data, url) {
    return data
  }

}
