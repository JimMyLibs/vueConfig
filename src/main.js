import App from './App.vue'
import router from './router'
import modules from './store'
import './worker/registerServiceWorker'

import createApp from '@/resource/vues/createApp'

Vue.config.productionTip = false

console.log('环境变量', process.env)


createApp({
    App,
    conf,
    router,
    modules,
  })