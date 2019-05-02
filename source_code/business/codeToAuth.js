import http from 'utils/Http'
import {getQueryString} from 'utils/url'

// 获取调用WeChat功能前所需的appid等信息
export default function(code = getQueryString('code')) {
  let authApi = `${location.origin}/h5/h5-base/php/authApi.php?code=${code}`
  return http.toGet(authApi)
}
