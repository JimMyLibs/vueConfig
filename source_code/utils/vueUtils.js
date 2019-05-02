import Vue from 'vue'
import globalUtils from 'business/globalUtils'
import HttpBase from 'utils/core/HttpBase'



// Vue扩展G_Utils全局工具方法对象
Object.defineProperty(Vue.prototype, 'G_Utils', {value: globalUtils})

export default (http = new HttpBase()) => {
  // Vue扩展 $http对象，
  // 兼容以前项目处理，后续可能废弃
  Object.defineProperty(Vue.prototype, '$http', {value: http})
}
