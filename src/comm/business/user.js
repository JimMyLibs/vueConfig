// 用户相关业务
import Native from 'comm/js/Native/Native'
import { isApp } from 'comm/js/env/env'
import { publicUrls } from 'config/urlInfo'

// 用户信息标识
const userInfoId = '__userInfo__'

// 上一次存储的用户信息标识
const localUserInfoId = '__localUserInfoId__'

const native = new Native()

let { login: publicLoginUrl } = publicUrls

/**
 * [user 获取或存储用户信息, 通常为登录信息]
 * @param  {[undefined, true, object]} info [description]
 * info: undefined  获取用户信息（如：{token: '', userId: '', ...}）
 * info: true 若获取 sessionStorage失败，则获取 localStorage 的用户信息(boolean 值只能为true)
 * object： 存储用户信息
 * @param  {boolean = true} isAppLogin [app中是否进行app登录操作]
 * @return {[undefined, object]}      [用户信息]
 */
export function user(info, isAppLogin = true) {
    let currentInfo = JSON.parse(sessionStorage.getItem(userInfoId)) || {}
    if (typeof info === 'undefined') {// this.$user()获取个人信息
        return currentInfo
    }

    if (info === true) {// this.$user(true),若已登录则获取当前登录的用户信息，若未登录则获取上次存储的用户信息
        let { token } = currentInfo
        let localInfo = JSON.parse(localStorage.getItem(localUserInfoId)) || {}
        return token ? currentInfo : localInfo;
    }

    // 存储/更新用户信息
    let mixInfo = JSON.stringify(Object.assign({}, currentInfo, info))
    sessionStorage.setItem(userInfoId, mixInfo)
    localStorage.setItem(localUserInfoId, mixInfo)
    if (isAppLogin) { // native login
        native.login(info)
    }
}



/**
 * [toLogin 去登录]
 * @param  {Boolean} [isLogin=true] [若检测为未登录状态，是否先进行登录操作]
 * @param  {string}  [loginUrl=publicLoginUrl]       [登录的web地址，app客户端中无效]
 * @param  {string}  [backUrl=location.href] [未登录状态下，登录成功后的回跳地址]
 * @return {object}                 [登录状态promise]
 */
export function toLogin(isLogin = true, loginUrl = publicLoginUrl, backUrl = location.href) {
    return new Promise((resolve, reject) => {
        if (isApp()) {
            native.login(isLogin).then(res => {
                let { data } = res
                let { token } = data
                if (token) {
                    user(data)
                    resolve(data)
                } else {
                    if (isLogin) {
                        reject(data)
                    } else {
                        resolve(data)
                    }
                }
            })
        } else {
            let { inviterUserId } = user()
            let inviterStr = inviterUserId ? `&inviterUserId=${inviterUserId}` : '';
            location.href = `${loginUrl}?backUrl=${encodeURIComponent(backUrl)}${inviterStr}`
        }
    })
}


/**
 * [login 登录或获取登录信息]
 * @param  {Boolean} [isLogin=true] [若检测为未登录状态，是否先进行登录操作]
 * @param  {string}  [loginUrl=publicLoginUrl]       [登录的web地址，app客户端中无效]
 * @param  {string}  [backUrl=location.href] [未登录状态下，登录成功后的回跳地址]
 * @return {object}                 [登录状态promise]
 */
export function login(isLogin = true, loginUrl = publicLoginUrl, backUrl = location.href) {
    return new Promise((resolve, reject) => {
        let info = user()
        let { token } = info
        if (token) {  // 已登录
            resolve(info)
        } else {
            return toLogin(isLogin, loginUrl, backUrl)
        }
    })
}

/**
 * [logout 退出登录]
 */
export function logout(isLogin = true, loginUrl = publicLoginUrl, backUrl = location.href) {
    sessionStorage.removeItem(userInfoId)
    localStorage.removeItem(localUserInfoId)
    if (isLogin) {
        toLogin(isLogin, loginUrl, backUrl)
    }
}

export function setTitle(title) {
    let info = null
    if (typeof title === 'string') {
        info = {
            title
        }
    }
    if (typeof title === 'object' && info.title) {
        info = { ...title }
    }
    if (info) {
        document.title = info.title
        native.action('setNav', { ...info })
    }
}
