// 活动类公共接口
// status


import FetchBase from 'comm/utils/core/FetchBase'
const http = new FetchBase()

// 获取活动分享信息
export default function(activityCode) {
  return http.get('activityController/ActivityShare', {
    apiType: 'activity',
    params: {
      activityCode
    }
  })
}
