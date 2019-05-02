import Vue from 'vue'
import Router from 'vue-router'
import Fetch from '../pages/Fetch.vue'
// ... 其他组件

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/fetch"
    },
    {
      path: "/fetch",
      component: Fetch
    },
    {
      path: "/components",
      component: (): any => import("../pages/Components.vue")
    },
    {
      path: "/native",
      component: (): any => import("../pages/Native.vue")
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   setTimeout(()=>{
//     next()
//   }, 2000)
// })

export default router
