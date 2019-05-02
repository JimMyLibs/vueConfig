import globalAction from 'business/globalAction'
import collectBehavior from 'utils/CollectBehavior'

/**
 * [description]
 * @param  {[Object]}   routes    [VueRouter实例对象]
 * @param  {Object} [http=new HttpBase()]   [HttpBase实例对象]
 */
export default (routes, isNeedCollect = true, proTypeName) => {
  routes.beforeEach((to, from, next) => {
    let {meta} = to
    meta = typeof meta === 'object'
      ? meta
      : {}
    let {isNeedLogin} = meta

    // 检测登录，未登录则先登录再跳转
    if (isNeedLogin) {
      globalAction.G_CheckLogin(true).then(()=>{
        next()
      }).catch(reson=>{
        console.log(reson)
      })
    }else{
      next()
    }
  })


  routes.afterEach((to, from) => {
    let {path, meta} = to
    meta = typeof meta === 'object'
      ? meta
      : {}
    let {pageName, title} = meta

    if( isNeedCollect ){
      // 页面id不存在则用路由代替
      pageName = pageName
        ? pageName
        : path.replace('/', '')

      if (pageName) {
        // 埋点处理
        // 自动页面埋点，'yd'为云贷项目，非云贷项目不用第三个参数
        collectBehavior.start(pageName, true, proTypeName)
      }
    }

    if( title ){
      // 设置页面标题
      globalAction.G_SetTitle(title)
    }

  })
}
