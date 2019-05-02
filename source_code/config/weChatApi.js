// 调用微信功能前，需要首先加载微信JDK的文件
export const weChatJDKUrl = 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'

// 微信授权地址
export const authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'

// 获取授权用户openid接口地址，请确保在对应环境服务器存在对应文件
export const userOpenidApiUrl = '/h5/h5-base/php/wechatAuthorization.php'

// 授权中间页
export const transitionUrl = `${location.origin}/html5/activity/wechat/#/index`

// 测试授权过度授权页面
// export const userOpenidApiUrl = `/h5/activity/CreditMonthExam/wechatAuthorization.php`

// 微信分享jsApi配置
export const jsApiList = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getLocation'
]

// 授权后回跳地址配置
// 'scope=snsapi_base'的时候，从app中分享出来没办法正确跳转
export function getRedirectUri(appid, path = location.href) {
  path = `${getUserOpenidApiUrl()}?back_url=${encodeURIComponent(path)}`
  let params = [
    'appid=' + appid,
    'redirect_uri=' + encodeURIComponent(path),
    'response_type=code',
    // 'scope=snsapi_base',
    'scope=snsapi_userinfo',
    'state=niiwoo#wechat_redirect'
  ]
  return `${authorizeUrl}?${params.join('&')}`
}

// 获取用户Openid的接口地址
export function getUserOpenidApiUrl() {
  return `${location.protocol}//${location.host}${userOpenidApiUrl}`
}
