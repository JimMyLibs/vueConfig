

const origin = location.origin

// 微信功能列表配置
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

// 微信相关地址
export const wechatUrls = {

  // 微信登录地址
  login: `${origin}/html5/public/wechat/#/bind`,

  // 调用微信功能前，需要首先加载微信JDK的文件
  jdkUrl: 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',

  // 微信授权地址
  authUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',

  // 通过code获取微信授权信息接口地址，需携带code参数
  authApi: `${origin}/public/authApi.php`

}
