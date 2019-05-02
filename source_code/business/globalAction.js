// 系统功能函数
import native from 'utils/Native'
import weChat from 'utils/WeChat'
import collectBehavior from 'utils/CollectBehavior'
import {isInNiiwooApp, isEmpty, isWeChat} from 'utils/utils'
import {setUserInfo, getUserInfo} from 'business/userInfo'
import {successCondition, loginInvalidCondition, msgKey} from 'config/responseInfo'
import {login} from 'config/links'

// 作用： 检测fetch返回数据是否正确
// params :
//   res : api返回数据,
//   isAutoLogin : 如果判断登录已失效，是否去登录
//   backUrl : 登录后的返回地址
//   loginUrl : 登录页地址
// output :
//   {
//     isCorrect: true / false, // 数据是否正确
//     msg: 错误提示语
//   }
function G_CheckResponse(res, isAutoLogin = true, backUrl = location.href, loginUrl = login) {
  // 配置全局检测fetch数据是否正确方法
  let isCorrect = false
  let msg = '系统异常，请稍后重试！'
  if (typeof res === 'object') {

    // 判断返回数据是否正确
    for (let key of Object.keys(successCondition)) {
      if (key in res && successCondition[key] == res[key]) {
        isCorrect = true
        break
      }
    }

    // 判断登录态是否失效
    if (isAutoLogin) {
      for (let key of Object.keys(loginInvalidCondition)) {
        if (key in res && loginInvalidCondition[key] == res[key]) {
          toLogin(true, backUrl, loginUrl)
          break
        }
      }
    }

    // 获取错误提示语
    for (let key of msgKey) {
      if (key in res && res[key].trim() !== '') {
        msg = res[key]
        break
      }
    }

  }
  return {isCorrect, msg}
}

// 作用： 去登录
// params :
//   isInvalid : true/false   // 当前登录是否已经失效（api判断app登录态失效时需设置该项为true）,
//   backUrl : 登录后的返回地址
//   loginUrl : 登录页地址
function toLogin(isInvalid = false, backUrl = location.href, loginUrl = login) {
  if (isInNiiwooApp()) {
    nativeLogin(true, isInvalid)
  } else {
    let {inviterUserId} = getUserInfo()
    let inviterStr = inviterUserId
      ? `&inviterUserId=${inviterUserId}`
      : ''
    location.href = `${loginUrl}?backUrl=${encodeURIComponent(backUrl)}${inviterStr}`
  }
}

// 作用： 获取app中用户的登录信息
// params :
//   isNeedLogin : 是否需要弹出app登录功能
//   isInvalid : true/false   // 当前登录是否已经失效（api判断app登录态失效时需设置该项为true）
function nativeLogin(isNeedLogin = false) {
  // app中检测用户是否登录，如登录则存储登录信息
  return new Promise((resolve, reject) => {
    native.action('login', {
      isNeedLogin,
    }).then(res => {
      let {isCorrect} = G_CheckResponse(res, false)
      if (isCorrect) {
        // 存储用户信息
        setUserInfo(res.data)
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(reson => {
      reject(reson)
    })
  })
}

export default {

  // 检测fetch返回数据是否正确
  G_CheckResponse,

  // 作用： 去登录
  // params :
  //   isInvalid : true/false   // 当前登录是否已经失效（api判断app登录态失效时需设置该项为true）,
  //   backUrl : 登录后的返回地址
  //   loginUrl : 登录页地址
  G_ToLogin(isInvalid = false, backUrl = location.href, loginUrl = login) {
    toLogin(isInvalid, backUrl, loginUrl)
  },

  // 作用： 检测当前用户是否登录
  // params :
  //   isAutoLogin : true/false   // 如果判断未登录，是否去登录
  //   backUrl : 登录后的返回地址
  //   loginUrl : 登录页地址
  // 使用示例：
  // G_CheckLogin().then(()=>{
  // // 已登录处理
  // }).catch(()=>{
  // // 未登录处理
  // })
  G_CheckLogin(isAutoLogin = false, backUrl = location.href, loginUrl = login) {
    return new Promise((resolve, reject) => {
      let info = getUserInfo()
      let {token} = info
      if (token) {
        // 已登录
        resolve(info)
      } else {
        // app中检测用户是否登录，如登录则存储登录信息
        if (isInNiiwooApp()) {
          nativeLogin(isAutoLogin).then(res => {
            // 调用登录功能
            resolve(getUserInfo())
          }).catch(reson => {
            reject(reson)
          })
        } else {
          if (isAutoLogin) {
            toLogin(false, backUrl, loginUrl)
          } else {
            resolve(info)
          }
        }
      }
    })
  },

  // 作用： 设置微信分享信息，或者调用app分享功能
  // params :
  //   微信分享信息
  //   shareInfo :
  //   {
  //      title: 分享标题,
  //      desc: 分享描述,
  //      link: 分享链接,
  //      imgUrl: 图片地址,
  //      success: 成功回调函数,
  //      cancel: 取消分享回调函数
  //      type: ["0","1"]  // 调用app分享时使用，0: 微信好友, 1：朋友圈, 2：微博, 3：短信,4：你我好友,5：你我圈,6：QQ,7：QQ空间
  //   }
  //   isAuth : true/false   // 是否需要授权
  G_SetShare(shareInfo, isAuth) {
    // 确保数据不为空的情况下执行
    if (typeof shareInfo === 'object' && typeof shareInfo.title !== 'undefined') {
      if (isWeChat()) {
        weChat.setShareInfo(shareInfo, isAuth)
      }
      if (isInNiiwooApp()) {
        native.share(shareInfo, isAuth)
      }
    }
  },

  // 作用： 调用app功能方法
  // params :
  //   微信分享信息
  //   actionName: 事件名称
  //   data: 事件参数
  G_NativeAction(actionName, data) {
    return native.action(actionName, data)
  },

  // H5设置方法供客户端调用
  G_NativeSetAction(fnName, callback){
    native.setAction(fnName, callback)
  },

  // 作用： 设置页面title
  // params :
  //   title  需要设置的标题
  G_SetTitle(title) {
    if (isInNiiwooApp()) {
      native.action('setNav', {isShow: true, 'title': title, type: 1})
    } else if (isWeChat()) {
      // 微信中可能需要引入iframe处理，发现有问题再解决
      document.title = title
    } else {
      document.title = title
    }
  },

  // 作用： 触发埋点事件
  // params :
  //   eventId  事件id
  //   eventType  事件类型(ClickTrace点击事件)
  G_SendEvent(eventId = '', eventType = 'ClickTrace') {
    collectBehavior.sendBehavior(eventId, eventType)
  },

  // 作用： 存储用户相关信息，如token,userId,openid等
  // params :
  //   info  用户相关信息
  //   eventType  事件类型(ClickTrace点击事件)
  G_SetUserInfo(info = {}) {
    if (!isEmpty(info)) {
      setUserInfo(info)
    }
  },

  // 作用： 获取用户相关信息，如token,userId,openid等
  // params :
  //   isCanUseLast: true/false  如果本次判断未登录，是否可以使用上一次的登录信息
  // 没有用户信息的时候返回 {}
  // output :
  //   {
  //     userId: '...'
  //     ...
  //   }
  G_GetUserInfo(isCanUseLast = false) {
    return getUserInfo(isCanUseLast)
  }

}
