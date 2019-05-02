import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/Index'
import NoPath from 'components/NoPath'
import setGlobalRouter from 'utils/vueRouter'

// 项目类型名称，云贷项目请设置为 'yd',
export const proTypeName = ''

// 是否需要埋点
const isNeedCollect = false

Vue.use(VueRouter)

const routes = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    }, {
      path: '/index',
      component: Index,
      meta: {
        title: 'example'
        // 当前路由是否一定需要登录后才能访问，默认为false
        // isNeedLogin: true
      }
    }, {
    //   path: '/test',
    //   component: resolve => require(['../pages/Test'], resolve),
    //   meta: {
    //     title: '充值记录_你我金融',
    //     isNeedLogin: false
    //   }
    // }, {
      // 404路由，该路由配置请当道最后
      path: '*',
      component: NoPath
    }
  ]
})

setGlobalRouter(routes, isNeedCollect, proTypeName)

export default routes
