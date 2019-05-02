import http from 'utils/Http'

// 获取活动分享信息
export default function(activityCode) {
  return http.get('activityController/ActivityShare', {
    apiType: 'activity',
    params: {
      activityCode
    }
  })
}
