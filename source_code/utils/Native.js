/*
* H5与客户端交互封装类
* 使用方法：
* 1、import native form 'utils/Native'
* 2、native.action(code, data = {}).then(res=>{
*     console.log(res)
* })
* code为事件代码
* data为实际json参数（没有可以不传该参数）
* res为客户回传参数（如果该事件对应有返回结果）
* 没有返回结果的时候，可以省略.then部分
 */

// import getAppIdInfo from 'business/getAppInfo'
// import {getRedirectUri} from 'config/weChatApi'
import {getRealLink, getChangeUrl} from 'utils/url'
import {transitionUrl} from 'config/weChatApi'
import {isAndroid, isIOS, p} from 'utils/utils'

// 基于基类NativeBridge进行扩展
import NativeBridge from 'utils/core/NativeBridge'

// js与app交互基类，可根据实际需要进行扩展
// 常用action方法即继承自基类NativeBridge
export class Native extends NativeBridge {

  constructor() {
    super()
  }

  // 客户端登录功能的封装
  // isNeedLogin为是否需要拉取客户端登录功能，默认为不拉取
  login(isNeedLogin = false) {
    return this.action('login', {isNeedLogin})
  }

  // 客户端分享功能的封装
  // options:
  /*
  {
    title: "分享标题",
    desc: "分享描述",
    imgUrl: "分享icon地址",
    link: "分享回跳地址",
    success: 成功回调函数,
    cancel: 取消分享回调函数
    type: ["0","1"]  // 调用app分享时使用，0: 微信好友, 1：朋友圈, 2：微博, 3：短信,4：你我好友,5：你我圈,6：QQ,7：QQ空间
  }
   */
  share(options, isAuth) {
    let {
      link,
      isShow,
      type
    } = options

    // 如果是hash值路径，则转换为对应绝对路径
    let realLink = getRealLink(link)

    if (isAuth) {
      // 转换地址为授权地址
      realLink = getChangeUrl({
        url: transitionUrl,
        params: {
          backUrl: encodeURIComponent(realLink)
        }
      })
    }

    options.type = Array.isArray(type) && type.length > 0  ? type : [0, 1]
    options.isShow = typeof isShow === 'undefined' ? true : isShow
    options.link = realLink

    return this.action('setShare', options)
  }


  /**
   * [setAction H5设置方法供客户端调用]
   * @param {[String]}   fnName   [提供客户端调用的函数名, 需与客户端协商]
   * @param {Function} callback [客户单调用执行的H5操作函数]
   */
  setAction(fnName, callback) {
    if( isAndroid() ){
      window[fnName] = (data)=>{
        callback(data)
      }
    }else if( isIOS() ){
      this.connectWebViewJavascriptBridge(bridge => {
        bridge.registerHandler(fnName, function(data, responseCallback) {
          callback(data)
        })
      })
    }else{
      p('not in niiwoo')
    }

  }

}

export default new Native()
