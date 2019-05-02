
import { Vue } from 'vue-property-decorator'
import router from './router'
import store from 'comm/vues/store'
import App from './App.vue'
import 'comm/utils/page'

require('comm/public/reset')
require('comm/public/style')

const app = new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
