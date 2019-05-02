// 用户相关信息处理

// 用户token标识
// 因为其他项目也可能通过token名称来获取token，所以该标识名称暂不可改变
const tokenId = 'token'

// 用户信息标识
const userInfoId = '__userInfo__'

// 上一次存储的用户信息标识
const lastUserInfoId = '__lastUserInfoId__'

// 保存用户token
// 这里存储localStorage存在一个隐患，即很可能取到的token是上次的token

// 获取用户token
export function getToken() {
  return sessionStorage.getItem(tokenId)
}

// 从sessionStorage获取用户token 已废弃
// export function getSessionToken() {
//   return sessionStorage.getItem(tokenId)
// }

// 设置token
// 老项目会从localStorage中获取token，所以需要做兼容
export function setToken(token) {
  sessionStorage.setItem(tokenId, token)
}

// 清除token
export function removeToken() {
  sessionStorage.removeItem(tokenId)
}

// 获取用户信息，没有用户信息的时候返回{}
// isCanUseLast如果本次登录信息不存在，是否可以使用上次的登录信息
export function getUserInfo(isCanUseLast = false) {
  let info = JSON.parse(sessionStorage.getItem(userInfoId)) || {}
  let {token, openid} = info
  if (token) {
    return info
  } else if (getToken()) {
    let tokenInfo = {}
    tokenInfo[tokenId] = getToken()
    setUserInfo(tokenInfo)
    return tokenInfo
  } else {
    if (isCanUseLast) {
      // 使用上次登录信息的处理
      let lastInfo = JSON.parse(localStorage.getItem(lastUserInfoId)) || {}
      let {token: lastToken, openid: lastOpenid} = lastInfo
      if (lastToken) {
        // 存在上一次的登录信息
        if (openid && lastOpenid) {
          if (openid === lastOpenid) {
            // 上一次与本次的openid相同，则判断为可以沿用上一次的登录信息
            setUserInfo(lastInfo)
            return getUserInfo(false)
          } else {
            // 非同一个微信openid，判断上一次登录信息无效
            localStorage.removeItem(lastUserInfoId)
            return info
          }
        } else {
          // 没有对比凭证，直接沿用上一次登录信息
          setUserInfo(lastInfo)
          return getUserInfo(false)
        }
      } else {
        // 不存在上一次的登录信息
        return info
      }
    } else {
      return info
    }
  }
}

// 设置用户信息
// 注意对应大小写
//
// info:
//  {
//   nickname:  // 微信昵称
//   openid:  // 微信Openid
//   headimgurl: // 微信头像地址
//   inviterOpenid:  // 邀请人Openid
//   inviterUserId:  // 邀请人userId
//   token:  // 登录token (首字母小写)
//   userId: // 用户id (首字母小写)
//   loginMobileNo: // 用户手机号码
// }

// info为上述一种或多种选项，不限于上述选项
// token信息也可以存储在这里
export function setUserInfo(info = {}) {
  // 先获取已经存在的用户信息
  if (typeof info[tokenId] === 'undefined' && typeof info.UserToken !== 'undefined') {
    // 针对客户端UserToken的兼容
    info[tokenId] = info.UserToken
  }

  if (typeof info.userId === 'undefined' && typeof info.UserId !== 'undefined') {
    // 针对客户端UserId的兼容
    info.userId = info.UserId
  }

  let tempInfo = JSON.parse(sessionStorage.getItem(userInfoId)) || {}
  let jsonInfo = Object.assign({}, tempInfo, info)
  // 同步更新token
  if (jsonInfo[tokenId]) {
    setToken(jsonInfo[tokenId])
  }
  jsonInfo = JSON.stringify(jsonInfo)
  sessionStorage.setItem(userInfoId, jsonInfo)

  // 存储用户信息，作为下一次使用
  localStorage.setItem(lastUserInfoId, jsonInfo)
}

// 清除用户信息
export function removeUserInfo() {
  sessionStorage.removeItem(userInfoId)
}
