import http from 'utils/Http'

// 获取调用WeChat功能前所需的appid等信息
export default function(OpenId){
    return http.post('GetWeiXinGZHFollowInfo', {
      apiType: 'product',
      params: {
        OpenId,
        version: '3.4'
      }
    })
}
