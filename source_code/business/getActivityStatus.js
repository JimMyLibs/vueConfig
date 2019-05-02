// 公共业务逻辑
// 获取活动状态
import http from 'utils/Http'
export default function(ActivityCode){
  return http.post('PostActivityInfoList', {
    ActivityCode,
    version: '3.9'
  })
}
