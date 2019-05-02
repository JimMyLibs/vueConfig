import http from 'utils/Http'

// app中获取右上角分享文案
export default function(shareCode) {
  return http.post('homePage/getShareInfo', {
    apiType: 'activity',
    params: {
      shareCode
    }
  })
}
