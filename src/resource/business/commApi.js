// 其他公共api

import FetchBase from 'comm/utils/core/FetchBase'
import { publicUrls } from 'config/urlInfo'
import { getProjectInfo } from 'comm/business/projectInfo'
import devApiInfo from 'config/devApiInfo'
import { successCondition, loginInvalidCondition, msgKeys } from 'config/fetchConf'
import { toLogin, logout } from 'comm/business/user'

const http = new FetchBase()

// 存储api数据的sessionStorage标识
const apiInfoSessionId = '__apiInfoSessionId__'

// 同步获取api地址信息
export function getApiInfo() {
    const { ISDEV } = getProjectInfo()
    if (ISDEV) {
        return devApiInfo
    }
    return JSON.parse(sessionStorage.getItem(apiInfoSessionId))
}

// 保存api地址信息
export function setApiInfo(info) {
    sessionStorage.setItem(apiInfoSessionId, JSON.stringify(info))
}

// 异步获取api地址信息
export function fetchApiInfo() {
    const { ISDEV } = getProjectInfo()
    let currentInfo = getApiInfo()
    return new Promise((resolve, reject) => {
        console.log('______ ISDEV ______', ISDEV, devApiInfo)
        if (ISDEV) {
            resolve(devApiInfo)
        } else {
            if (currentInfo) {
                resolve(currentInfo)
            } else {
                http.toGet(publicUrls['apiHost']).then(res => {
                    setApiInfo(res)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }
        }
    })
}

/**
 * [checkResponse fetch请求结果是否正确判断处理]
 * @param  {object}  res          [请求结果]
 * @param  {Boolean} [isTip=true] [是否自动处理错误，如登陆失效后自动跳转到登陆页]
 * @return {object}               [判断结果对象]
 */
export function checkResponse(res, conf = {}) {
    let isCorrect = true
    let msg = '系统异常，请稍后重试！'
    if (typeof res === 'object') {
        let successKey = Object.keys(res).find(item => Object.keys(successCondition).includes(item))
        let msgKey = Object.keys(res).find(item => msgKeys.includes(item))

        if (successKey && res[successKey] != successCondition[successKey]) {
            let { isTip, loginUrl, backUrl } = conf
            if (res[successKey] == loginInvalidCondition[successKey]) {
                if (isTip) {
                    logout(isTip, loginUrl, backUrl)
                } else {
                    logout(isTip, loginUrl, backUrl)
                }

            }
            isCorrect = false
        }

        if (msgKey && res[msgKey]) {
            msg = res[msgKey]
        }

    }
    return {
        isCorrect,
        msg
    }
}
