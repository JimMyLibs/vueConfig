import App from './App.vue'
import router from './router'
import modules from './store'
import conf from './config/conf'
import './worker/registerServiceWorker'

import createApp from '@/resource/vues/createApp'

console.log('环境变量', process.env)

createApp({
    App,
    conf,
    router,
    modules,
  })