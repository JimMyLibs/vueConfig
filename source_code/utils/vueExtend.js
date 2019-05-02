// 旧文件，已被utils/vueUtils替换（扔可正常使用）
import Vue from 'vue'
import Http from 'utils/core/HttpBase'
// 扩展Vue.prototype
Object.defineProperty(Vue.prototype, '$http', {value: new Http()})
