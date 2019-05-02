// 公共业务逻辑
// 判断当前用户是否为限制用户
import http from 'utils/Http'
export default function(ActivityCode){
  return http.post('UserLimitCheck', {
    ActivityCode,
    version: '4.0'
  })
}
