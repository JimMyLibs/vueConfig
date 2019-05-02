import Vue from 'vue'
import mixinRouter from 'comm/vues/mixinRouter'
import mixinStore from 'comm/vues/mixinStore'
import mixinFilters from 'comm/vues/mixinFilters'
import mixinMethods from 'comm/vues/mixinMethods'
import vueExtend from 'comm/vues/vueExtend'
import {setProjectInfo, getProjectInfo} from 'comm/business/projectInfo'
import {fetchApiInfo} from 'comm/business/commApi'
import UtmCollect from 'comm/utils/core/UtmCollect'

// 初始化页面
import 'comm/utils/initPage'

import 'comm/public/reset'

export default({
  App,
  router,
  conf = {},
  modules = {},
  filters = {},
  methods = {},
  vueExtends = {},
  el = '#app'
}) => {

  if (typeof App === 'undefined') {
    throw new Error('params App is not find!')
  }
  setProjectInfo(conf)

  const {
    isUtm,
    projectType,
    projectName,
    version,
    isAutoCollect = true
  } = getProjectInfo()

  let utm = null
  if (isUtm) {
    utm = new UtmCollect(
      projectName, // 项目名称
      version, // 项目版本号
      isAutoCollect, // 是否启用eventid埋点
      projectType // utm or sweet
    )
  }

  mixinFilters(filters)
  mixinMethods(methods)
  vueExtend(vueExtends, isAutoCollect, utm)

  let options = {
    el,
    store: mixinStore(modules),
    render: h => h(App)
  }

  if (typeof router !== 'undefined') {
    mixinRouter(router, conf, utm)
    options = {
      ...options,
      router
    }
  }

  fetchApiInfo().then(res => {
    return new Vue(options)
  }).catch(err => {
    throw new Error(err)
  })

}
