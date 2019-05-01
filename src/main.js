import App from './App.vue'
import router from './router'
import modules from './store'
import conf from './config/conf' // 项目配置信息
import './worker/registerServiceWorker'

import createApp from '@/resource/vues/createApp' // 构建项目

console.log('环境变量', process.env)

createApp({
    App,
    conf,
    router,
    modules,
})