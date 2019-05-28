import App from './App.vue'
import router from './router'
import projectStore from './store'
import projectFilters from './resource/vues/filters' // 过滤器
import projectMethods from './resource/vues/methods' // 混入方法
import projectExtends from './resource/vues/extends' // 混入方法
import conf from './config' // 项目配置信息
import './worker/registerServiceWorker'

import createApp from 'comm/vues/createApp' // 构建项目

import './resource/style/index.scss'

// console.log('环境变量', process.env.PROJECT_INFO)

createApp({
    App,
    conf,
    router,
    projectStore,
    projectFilters,
    projectMethods,
    projectExtends,
})