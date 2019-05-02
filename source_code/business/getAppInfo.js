import http from 'utils/Http'

// 获取调用WeChat功能前所需的appid等信息
export default function(Type = 1) {
  return http.post('weixin/getWeiXinJsTicket', {
    apiType: 'activity',
    params: {
      url: encodeURIComponent(location.href.split('#')[0]),
      type: Type
    }
  })
}
