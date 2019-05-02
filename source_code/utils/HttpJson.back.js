
// 废弃，待删除

import {jsonToParams} from 'utils/url'

// fetch请求基类
import ToFetch from 'utils/core/ToFetch'

// 加密算法
import encrypt from 'utils/encrypt'

// 获取api信息地址
import apiUrl from 'config/apiUrl'

// 存储api数据的sessionStorage标识
const apiInfoSessionId = '__apiInfoSessionId__'

// 测试环境打印信息
import {p} from 'utils/utils'

import {getToken} from 'business/userInfo'

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'dev'

// 若配置了mock项，则取配置值，默认不启用mock
const isUseMock = process.env.isUseMock

// 当前项目标识（即根文件夹名）
const PROJECT_DIR_NAME = process.env.PROJECT_DIR_NAME




/*
* 如果要使用Http实例，请直接引入'utils/core/HttpBase'文件
* 本文件主要导出作用为导出HttpBase实例，后续导出Http部分代码可能会被废弃
 */

// fetch请求基类
import HttpBase from 'utils/core/HttpBase'

// 该部分仅仅为了兼容2017-06-05前的代码，若要扩展Http功能，请直接继承HttpBase，方法如下
// 请求基类，可根据实际需要进行扩展
export class HttpJson extends HttpBase {
  constructor(conf) {
    super(conf)
  }

  // 请求统一入口
  fetchRequest(url, options, method = 'post') {
    let {apiType, params, headers} = this.getMixOptions(options)
    let requestUrl = ''
    let body = null
    this.beforeFetch(url, params, method)

    if (url.startsWith('http')) {
      requestUrl = url
    } else {
      if (apiType in this.apiInfo) {
        requestUrl = this.apiInfo[apiType] + url
      } else {
        if (isDev && isUseMock) {
          requestUrl = this.apiInfo[apiType] + url
        } else {
          throw new Error(`接口类型 ${apiType} 不存在，请正确配置`)
        }
      }
    }

    // 需要加密的处理
    if (this.conf.isNeedEncrypt) {
      let joinStr = requestUrl.includes('?')
        ? '&'
        : '?'
      let {query, jsonString} = encrypt(params, this.conf.projectType)
      requestUrl = `${requestUrl}${joinStr}${query}`
      body = {
        jsonString: encodeURIComponent(jsonString)
      }
    }else{
      body = params
    }


    let baseParams = {
          token:sessionStorage.getItem('token'),
          version:'1.0'
    }


    if( headers && JSON.stringify(headers).includes('json') ){
      headers = Object.assign(baseParams,headers, {
        'Content-type': 'application/json'
      })
      if (body) {
        if (typeof body === 'object') {
          body = JSON.stringify(body)
        }
      }
    }else{
      headers = Object.assign(baseParams,{}, headers, {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
      if (body) {
        if (typeof body === 'object') {
          body = jsonToParams(body)
        }
      }
    }

    let reqConf = {
      method: method.toUpperCase(),
    }

    if(headers){
      reqConf.headers = headers
    }

    if(body){
      reqConf.body = body
    }
    console.log('oooooooo')
    console.log(reqConf)
    return fetch(requestUrl, reqConf).then(data => {
      // in some SAMSUNG mobile data.ok is undefined so add data.status
      if (data.ok || data.status === 200) {
        return data.json()
      } else {
        // 未正常返回数据，则抛出异常
        throw new Error(`响应数据异常，错误码：${data.status}`)
      }
    }).then(data => {
      let filterData = this.afterFetch(data, url, params, method)
      // 成功返回数据的处理
      return filterData
        ? filterData
        : data
    })
  }

  // options三种情况统一处理
  // options  => undefined
  //            {apiType:'activity', params: {}, headers: {}}
  //            {key1: val1, key2: val2}
  getMixOptions(options) {
    let optionsFormat = this.parseOptions(options)
    let defaultFormat = this.conf
    let mixFormat = this.parseOptions(this.getMixParams({}))
    let headers = Object.assign({},defaultFormat.headers || {}, mixFormat.headers || {}, optionsFormat.headers || {})
    let lastConf = Object.assign({}, defaultFormat, mixFormat, optionsFormat,{headers})
    let {defaultApiType, apiType} = lastConf
    apiType = apiType ? apiType : defaultApiType
    return Object.assign({}, lastConf, {apiType})
  }

  // 请求数据整合
  getMixParams(params, method = 'post') {

    let defaultParams = {
      t: Date.now() // 添加当前时间戳
    }

    if (getToken() && method.toLocaleLowerCase() !== 'get') {
      defaultParams.token = getToken()
    }
    return Object.assign({}, defaultParams, params)
  }

  // 格式化options
  // {},
  // {parmas:{}}
  // {headers:{}}
  // {headers:{},parmas:{}}
  parseOptions(options) {
    if (typeof options === 'undefined') { // 未传任何参数，直接取默认参数
      return {}
    } else if (typeof options === 'object') { // 未传任何参数，直接取默认参数
      if ('params' in options || 'headers' in options) {
        return options
      } else {
        return {params: options}
      }
    } else {
      // string
      return {params: options}
    }
  }

}

// 主要导出HttpBase实例
// export default new HttpBase()
