import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/Index'
import NoPath from 'comm/components/NoPath'


Vue.use(VueRouter)

const routes = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/index',
    component: Index,
    meta: {
      // isLogin: true,
      title: 'demo-index',
      utmName: 'test-utmName'
    }
  }, {
    path: '/fetch',
    component: () => import('../pages/Fetch'),
    meta: {
      // isLogin: true,
      title: 'demo-fetch',
      utmName: 'test-utmName-fetch'
    }
  }, {
    path: '/components',
    component: () => import('../pages/Components'),
    meta: {
      // isLogin: true,
      title: 'demo-components',
      utmName: 'test-utmName-components'
    }
  }, {
    // 404路由，该路由配置请当道最后
    path: '*',
    component: NoPath
  }]
})

export default routes
