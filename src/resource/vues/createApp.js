import Vue from 'vue'
import mixinRouter from 'comm/vues/mixinRouter' // 路由: 管理登录态及页面埋点
import mixinStore from 'comm/vues/mixinStore' // 状态
import mixinFilters from 'comm/vues/mixinFilters' // 过滤器
import mixinMethods from 'comm/vues/mixinMethods' // 混入方法
import vueExtend from 'comm/vues/vueExtend' // 拓展
import { setProjectInfo, getProjectInfo } from 'comm/business/projectInfo' // 项目信息
import { fetchApiInfo } from 'comm/business/commApi' // fetch api
import UtmCollect from 'comm/utils/core/UtmCollect' // 埋点

// 初始化页面
import '../utils/initPage'
// 全局样式默认入口
import '../style/index.scss'

export default ({
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
        Vue.config.productionTip = false
        return new Vue(options)
    }).catch(err => {
        throw new Error(err)
    })

}
