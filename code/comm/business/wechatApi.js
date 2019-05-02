// 其他公共api

import FetchBase from 'comm/utils/core/FetchBase'
import {wechatUrls} from 'config/wechatInfo'
import {getQueryString} from 'comm/utils/url'

let {authApi, authUrl} = wechatUrls

const http = new FetchBase()


// 获取用户微信授权信息的标识
const appIdInfoSesionStorageId = '__appIdInfoSesionStorageId__'

// 获取用户微信授权信息的标识
const wechatAuthInfoSesionStorageId = '__wechatAuthInfoSesionStorageId__'



/**
 * [getWechatApiInfo 获取调用WeChat功能前所需的appId等信息]
 * @param  {Number} [type=1] [1使用缓存数据（数据可能过期），2不使用缓存数据]
 * @return {object}          [返回结果promise]
 */
export function getWechatApiInfo(type = 1) {
  return new Promise((resolve, reject) => {
    let appIdInfo = sessionStorage.getItem(appIdInfoSesionStorageId)
    if(appIdInfo){
      resolve(JSON.parse(appIdInfo))
    }else{
      http.post('weixin/getWeiXinJsTicket', {
        apiType: 'activity',
        params: {
          url: encodeURIComponent(location.href.split('#')[0]),
          type
        }
      }).then(res => {
        let {respCode, data} = res
        if (respCode == '0000') {
          // data: {appId: '', signature: '', ...}
          sessionStorage.setItem(appIdInfoSesionStorageId, JSON.stringify(data))
          resolve(data)
        }else{
          if(type === 2){
            reject(res)
          }else{
            getWechatApiInfo(2).then(res=>{
              sessionStorage.setItem(appIdInfoSesionStorageId, JSON.stringify(data))
              resolve(data)
            }).catch(reson=>{
              reject(res)
            })
          }
        }
      }).catch(reson => {
        reject(reson)
      })
    }
  })
}

/**
 * [getWechatAuthInfo 通过授权code获取用户微信信息]
 * @param  {string} [code=getQueryString('code'] [授权回跳地址的code参数]
 * @return {object}                              [返回promise]
 */
export function getWechatAuthInfo(code = getQueryString('code'), appId) {
  return new Promise((resolve, reject) => {
    let wechatAuthInfo = JSON.parse(sessionStorage.setItem(wechatAuthInfoSesionStorageId)) || {}
    let {openid} = wechatAuthInfo
    if(openid){
      resolve(wechatAuthInfo)
    }else{
      if(code){
        http.toGet(authApi, {
          code,
          appId
        }).then(res=>{
          // res: {sex: 1, nickname: '微信昵称', openid: 'openid', headimgurl: '微信头像'}
          let {openid: resOpenid} = res
          if(resOpenid){
            sessionStorage.setItem(wechatAuthInfoSesionStorageId, JSON.stringify(res))
            resolve(res)
          }else{
            reject(res)
          }
        }).catch(reson=>{
          reject(reson)
        })
      }else{
        reject('code参数不存在')
      }
    }
  })
}


// 获取授权地址，授权后url地址会携带code参数
export function getAuthUrl(appid, url = location.href, state = 'niiwoo'){
  let params = [
    `appid=${appid}`,
    `redirect_uri=${encodeURIComponent(url)}`,
    'response_type=code',
    'scope=snsapi_userinfo',
    `state=${state}#wechat_redirect`
  ]
  return `${authUrl}?${params.join('&')}`
}
