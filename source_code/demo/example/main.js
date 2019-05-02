import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store'
import './utils/init'
import UtmCollect from 'utils/utmCollect'

// 扩展Vue.prototype
Object.defineProperty(Vue.prototype, '$utm', {value: new UtmCollect(
  '投资全流程',  // 项目名称
  '5.6.0',  // 项目版本号
  true,  // 是否启用eventid埋点
  'utm' // utm or sweet
)})

require('public/reset')
require('public/public')
require('./public/public')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
