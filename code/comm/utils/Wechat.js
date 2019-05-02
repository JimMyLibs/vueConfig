// 微信分享相关

import {getWechatApiInfo, getWechatAuthInfo} from 'business/commApi'
import {jdkUrl, jsApiList, getAuthUrl} from 'config/wechatInfo'
import {isWeChat, creatScript, p} from 'utils/utils'
import {getQueryString} from 'utils/url'

// 基类，可根据实际需要进行扩展
export class WeChat {
  /**
   * [constructor 初始化]
   * @param {Object} [options={}] [配置信息，如{debug = false, jsApiList: []}]
   */
  constructor(options = {}) {

    // 获取api的promise
    this.wechatPromise = null

    this.options = {
      ...options
    }

    this.wechatConf = {}

    // 初始化，首次获取api信息
    this.init()

  }

  init() {
    // 引入jdk，获取appid等信息
    this.wechatPromise = new Promise((resolve, reject) => {
      if (isWeChat()) {
        if (typeof wx === 'object') {
          this.getAppIdInfo().then(res => {
            resolve(res)
          }).catch(reson => {
            reject(reson)
          })
        } else {
          creatScript(jdkUrl).then(() => {
            this.getAppIdInfo().then(res => {
              resolve(res)
            }).catch(reson => {
              reject(reson)
            })
          }).catch(reson => {
            reject(reson)
          })
        }
      } else {
        reject('not in wechat')
      }
    })

    this.wechatPromise.catch(e => {
      p(e)
    })
  }

  /**
   * [getAppIdInfo 获取调用微信功能所需appId等信息]
   * @return {object}          [获取接口promise]
   */
  getAppIdInfo() {
    return new Promise((resolve, reject) => {
      getWechatApiInfo().then(res => {
        // res: {appId: '', signature: '', ...}
        let {options} = this
        let {
          debug = false,
          jsApiList: optionsJsApiList = jsApiList
        } = options
        let wechatConf = {
          debug,
          jsApiList: optionsJsApiList,
          ...res
        }
        this.wechatConf = wechatConf
        resolve(wechatConf)
      }).catch(reson => {
        reject(reson)
      })
    })
  }

  /**
   * [getAuthInfo 获取当前用户微信授权信息，如：openid, nickname]
   * @return {object}       [{sex: 1, nickname: '微信昵称', openid: 'openid', headimgurl: '微信头像'}]
   */
  getAuthInfo(code = getQueryString('code')) {
    return new Promise((resolve, reject) => {
      this.wechatPromise.then(res => {
        let {wechatConf} = this
        let {appId} = wechatConf
        getWechatAuthInfo(code, appId).then(res => {
          resolve(res)
        }).catch(reson => {
          reject(reson)
        })
      })
    })
  }

  /**
   * [goToAuth 跳转到微信授权页面]
   * @param  {string} [backUrl=location.href] [授权完成后的回跳地址，回跳地址会携带code参数]
   * 通过backUrl的code参数，调用方法，可以获取到用户信息
   */
  goToAuth(backUrl = location.href) {
    this.wechatPromise.then(res => {
      let {wechatConf} = this
      let {appId} = wechatConf
      location.href = getAuthUrl(appId, backUrl)
    }).catch(reson => {
      p(reson)
    })
  }

  // 隐藏所有非基础按钮接口
  hideMenu() {
    this.wechatPromise.then(res => {
      let {wechatConf} = this
      wx.config(wechatConf)
      wx.ready(function() {
        wx.hideOptionMenu()
      })
    })
  }

  /**
   * [setShareInfo 设置微信分享信息]
   * @param {object}  info           [分享信息，其中分享成功success及分享失败cancel回调函数可不传]
   * @example info: {title: '分享标题', desc: '分享描述', link: '分享链接', imgUrl: '分享图标地址', success: '分享成功回调', cancel: '分享失败回调'}
   * @param {Boolean} [isAuth=false] [分享地址是否需要授权打开]
   */
  setShareInfo(info, isAuth = false) {
    this.wechatPromise.then(res => {
      let {wechatConf} = this
      let {appId} = wechatConf

      let {
        link = location.href,
        success,
        cancel
      } = info

      // 如果是hash值路径，则转换为对应绝对路径
      link = isAuth
        ? getAuthUrl(appId, link)
        : link

      info.link = link

      if (typeof success !== 'function') {
        info.success = () => {}
      }

      if (typeof cancel !== 'function') {
        info.cancel = () => {}
      }

      // 分享配置错误处理
      wx.error(reson => {
        p(reson)
      })

      wx.config(wechatConf)

      //分享到QQ
      wx.ready(function() {

        // 显示所有功能按钮接口
        wx.showOptionMenu()

        p('分享信息为：')
        p(info)

        //分享到朋友圈
        wx.onMenuShareTimeline(info)

        //分享到微信好友
        wx.onMenuShareAppMessage(info)

        //分享到QQ
        wx.onMenuShareQQ(info)

      })
    }).catch(reson => {
      p(reson)
    })
  }
}
