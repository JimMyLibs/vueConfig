import getAppIdInfo from 'business/getAppInfo'
import {weChatJDKUrl, jsApiList, getRedirectUri, transitionUrl} from 'config/weChatApi'
import {isWeChat, creatScript, p} from 'utils/utils'
import {getRealLink, getChangeUrl, getQueryString} from 'utils/url'
import {setUserInfo} from 'business/userInfo'
import codeToAuth from 'business/codeToAuth'

// 获取用户微信授权信息的标识
const wxDataLocalStorageId = '__wxDataLocalStorageId__'

// 记录微信授权次数
const authTimesLocalStorageId = '__authTimesLocalStorageId__'

// 基类，可根据实际需要进行扩展
export class WeChat {
  // 初始化
  constructor() {

    // 载入JDK文件次数
    this.loadJDKTimes = 0

    // 载入JDK文件超过6次加载失败，则不再加载
    this.maxLoadJDKTimes = 6

    // 载入JDK文件的promise
    this.loadJDKPromise = null

    // 已经获取初始化信息次数
    this.getApiInfoTimes = 0

    // 最多获取api次数
    this.maxGetApiInfoTimes = 6

    // 调用微信出错次数
    this.wxErrorTimes = 0

    // 允许调用微信最大出错次数
    this.maxWxErrorTimes = 6

    // 获取api的promise
    this.wechatPromise = null

    // // 获取用户openid的promise
    // this.userOpenidPromise = null

    // 用户微信openid，头像，昵称等信息
    // this.userWechatInfo = getWechatUserInfo()

    // 初始化，首次获取api信息
    this.init()

  }

  init() {
    // 引入jdk，获取appid等信息
    this.wechatPromise = new Promise((resolve, reject) => {
      if (isWeChat()) {
        // 首先获得loadJDKPromise
        if (!this.loadJDKPromise) {
          this.loadWXJDKFile()
        }
        this.loadJDKPromise.then(() => {
          this.getApiInfo(resolve, reject)
        }).catch(reson => {
          console.log(reson)
        })
      } else {
        reject('not in wechat')
      }
    })

    this.wechatPromise.catch(e=>{
      p(e)
    })

  }

  // 载入微信JDK文件
  loadWXJDKFile() {
    let _this = this
    // 载入微信JDK文件
    function tryLoad(resolve, reject) {
      if (_this.loadJDKTimes < _this.maxLoadJDKTimes) {
        _this.loadJDKTimes++;
        creatScript(weChatJDKUrl).then(() => {
          resolve()
        }).catch(reson => {
          console.log(reson)
          tryLoad(resolve, reject)
        })
      } else {
        reject('载入wxJDK文件失败，已超过最大尝试次数')
      }
    }
    // 设置loadJDK的Promise
    this.loadJDKPromise = new Promise((resolve, reject) => {
      if (typeof wx === 'object') {
        // 已经成功载入了
        resolve()
      } else {
        tryLoad(resolve, reject)
      }
    })
  }

  // 获取调用微信功能所需api信息
  /*
    {
      "RawString": "jsapi_ticket=kgt8ON7yVITDhtdwci0qeR1tp5Y9eLHsBr1LMSkIFxuW4YIPpNuQJg8VcuWWn63HrsZ5gT1EgfO_E_dNFV5KkQ&noncestr=a85673b3-332e-45fd-9872-f2cbb8eae453&timestamp=1494316545&url=https://test.niiwoo.com:5006/h5/activity/lixiong/index.html?code=051vWJWt1OeYfb0zg8Xt1dBPWt1vWJWj&state=niiwoo",
      "Url": "https://test.niiwoo.com:5006/h5/activity/lixiong/index.html?code=051vWJWt1OeYfb0zg8Xt1dBPWt1vWJWj&state=niiwoo",
      "NonceStr": "a85673b3-332e-45fd-9872-f2cbb8eae453",
      "AppId": "wxb3d25457b5a6fe49",
      "Timestamp": "1494316545",
      "Signature": "cfdeffca8da81aabe5b8d094a56e3978b55a5de6"
    }
    */
  getApiInfo(resolve, reject, type = 1) {
    let _this = this
    function tryGetApi() {
      if (_this.getApiInfoTimes < _this.maxGetApiInfoTimes) {
        // 未获取到api信息及请求测试未超过最大次数的时候，则进行请求
        // 累计请求次数
        _this.getApiInfoTimes++;
        getAppIdInfo(type).then(res => {
          let {respCode, data} = res
          if (respCode == '0000') {
            let {
              appId,
              timestamp,
              nonceStr,
              signature
            } = data
            // 请求成功则设置信息
            _this.weChatAppIdInfo = {
              debug: false,
              appId,
              timestamp,
              nonceStr,
              signature,
              jsApiList: jsApiList
            }
            resolve()
          } else {
            // 获取信息失败则再次请求
            console.log(res)
            tryGetApi()
          }
        }).catch(reson => {
          console.log(reson)
          tryGetApi()
        })
      } else {
        reject('获取微信api信息失败，已超过最大尝试次数')
      }
    }

    if (this.apiInfo && type == 1) {
      // 已经成功获取过，则不需要再次获取
      resolve()
    } else {
      this.loadJDKPromise.then(() => {
        tryGetApi()
      }).catch(reson => {
        console.log(reson)
      })
    }
  }

  // 获取当前用户微信授权信息，主要获取openid
  /*
      {
      "sex": 1,
      "nickname": "微信昵称",
      "province": "广东",
      "openid": "openid",
      "headimgurl": '微信头像'
        …
      }
     */
  // 出错时候的返回结果
  // {"errcode":40163,"errmsg":"code been used, hints: [ req_id: Zqxw0a0920th46 ]"}
  // isAutoAuth 当获取授权信息失败的时候，是否自动调转到授权页面
  // backUrl 授权完成后的回跳地址，默认为当前url
  getUserWxData(isAutoAuth = false, backUrl = location.href) {
    let wxData = JSON.parse(sessionStorage.getItem(wxDataLocalStorageId))
    // 判断是否正确返回了数据
    if (wxData && wxData.openid) {
      setUserInfo(wxData)
      localStorage.removeItem(authTimesLocalStorageId)
      return wxData
    } else {
      if (isWeChat()) {
        let authFailTimes = localStorage.getItem(authTimesLocalStorageId) || 0
        // 连续3次授权失败，则不再跳转到授权页面，避免死循环
        if (isAutoAuth && authFailTimes < 3) {
          this.goToAuth(backUrl)
        }
      }
      return null
    }
  }

  setUserWxData(info){
    sessionStorage.setItem(wxDataLocalStorageId, JSON.stringify(info))
  }

  // 是否在微信环境
  isInWeChat() {
    return isWeChat()
  }

  // 通过微信code从接口获取授权信息
  apiAuth(){
    return codeToAuth(getQueryString('code')).then(res=>{
      this.setUserWxData(res)
      return res
    })
  }

  // 跳转到授权页
  // backUrl 授权完成后的回跳地址，默认为当前url
  goToAuth(backUrl = location.href) {
    this.wechatPromise.then(res => {
      backUrl = getRealLink(backUrl)
      let appid = this.weChatAppIdInfo.appId
      let authFailTimes = localStorage.getItem(authTimesLocalStorageId) || 0
      localStorage.setItem(authTimesLocalStorageId, ++authFailTimes)
      location.href = getRedirectUri(appid, backUrl)
      // location.replace(getRedirectUri(appid, backUrl))
    }).catch(reson => {
      console.log(reson)
    })
  }

  // 隐藏所有非基础按钮接口
  hideMenu() {
    this.wechatPromise.then(res => {
      wx.config(this.weChatAppIdInfo)

      //分享到QQ
      wx.ready(function() {
        wx.hideOptionMenu()
      })

    })
  }

  // 如果调用微信api出错后，则再次调用
  tryAgain(options) {
    this.wxErrorTimes++;
    if (this.wxErrorTimes < this.maxWxErrorTimes) {
      this.getApiInfo(() => {
        this.setShareInfo(options)
      }, reson => {
        console.log(reson)
      }, 2)
    } else {
      console.log('调用微信功能失败，已超过最大尝试次数')
    }
  }

  // 设置分享信息内容
  //
  // options:
  // {
  //   title:'分享标题',
  //   desc:'分享描述',
  //   link:'https://www…', // 支持绝对地址或者hash(如/index)值路径
  //   imgUrl: '分享图标地址'
  // }

  // 分享地址如果需要授权，请设置一个授权过度页
  setShareInfo(options, isAuth = false) {
    this.wechatPromise.then(res => {
      // 如果是hash值路径，则转换为对应绝对路径
      let link = getRealLink(options.link)

      if (isAuth) {
        link = getChangeUrl({
          url: transitionUrl,
          params: {
            backUrl: encodeURIComponent(link)
          }
        })
      }

      p('微信分享信息为：')
      p(Object.assign({}, options, {link}))

      // 分享配置错误处理
      wx.error(reson => {
        // appid可能失效
        // if (reson && reson.errMsg && reson.errMsg.includes('invalid signature')) {
        this.tryAgain(options)
        // }
      })

      wx.config(this.weChatAppIdInfo)

      //分享到QQ
      wx.ready(function() {

        // 显示所有功能按钮接口
        wx.showOptionMenu()

        p('分享信息为：')
        p(Object.assign(options, {link}))

        let {title, desc, imgUrl, success, cancel} = options

        if (typeof success !== 'function') {
          success = () => {}
        }

        if (typeof cancel !== 'function') {
          cancel = () => {}
        }

        //分享到朋友圈
        wx.onMenuShareTimeline({title, link, imgUrl, success, cancel})

        //分享到微信好友
        wx.onMenuShareAppMessage({
          title,
          desc,
          link,
          imgUrl,
          success,
          cancel
        })

        //分享到QQ
        wx.onMenuShareQQ({
          title,
          desc,
          link,
          imgUrl,
          success,
          cancel
        })

      })
    }).catch(reson => {
      console.log(reson)
    })
  }

}

export default new WeChat()
