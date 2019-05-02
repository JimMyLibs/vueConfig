import publicError from 'config/errorCode'

/**
* code（string） - 错误码
* localError(object) - 当前活动errorCode
**/
export default function(code, localError) {
    let allError = publicError;
    if (!!localError && typeof localError == "object") {
        allError = Object.assign(publicError, localError)
    }
    let message = "抱歉，服务器开小差了，请稍后再试哦！"
    if (!!allError[code]) {
        message = allError[code]
    }
    return message
}
