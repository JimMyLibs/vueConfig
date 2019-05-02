// 业务类公共接口
import FetchBase from 'comm/utils/core/FetchBase'
const http = new FetchBase()

// 获取活动分享信息
export default function(activityCode) {
  return http.post('third/login', {
    apiType: 'product',
    params: {
      blackBox: '0',
      platformId: '2',
      deviceType: '2',
      // openId: wxData.openid,
      // nickName: wxData.nickname,
      // headImage: wxData.headimgurl,
      // provinceName: wxData.province,
      // cityName: wxData.city,
      // sex: wxData.sex
    }
  }).then(res => {
    let {bindType, loginMobileNo, token, userId} = res.data

    if (bindType == 1) { // 微信登录成功
      this.G_SetUserInfo({token, userId, loginMobileNo})
      // return this.$fetch(api, data, method, options)
    } else {
      location.href = `${location.origin}/html5/public/wechat/#/code?backUrl=${encodeURIComponent(location.href)}&isBind=0`
      return false
    }
  }).catch(reson => {
    this.G_SetTip('服务器异常，请稍后重试！')
    return false
  })
}
