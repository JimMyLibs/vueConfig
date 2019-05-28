import Vue from 'vue'
import globalRouter from 'comm/vues/globalRouter' // 路由: 管理登录态及页面埋点
import globalStore from 'comm/vues/globalStore' // 状态
import globalFilters from 'comm/vues/globalFilters' // 过滤器
import globalMethods from 'comm/vues/globalMethods' // 混入方法
import globalExtends from 'comm/vues/globalExtends' // 拓展
import { setProjectInfo, getProjectInfo } from 'comm/business/projectInfo' // 项目信息
import { fetchApiInfo } from 'comm/business/commApi' // fetch api
import UtmCollect from 'comm/js/core/UtmCollect' // 埋点

// 初始化页面
import '../js/init/initPage'
// 全局样式默认入口
import '../style/index.scss'

export default ({
    App,
    router,
    conf = {},
    projectStore = {},
    projectFilters = {},
    projectMethods = {},
    projectExtends = {},
    el = '#app'
}) => {

    if (typeof App === 'undefined') {
        throw new Error('params App is not find!')
    }
    setProjectInfo(conf)

    const {
        isUtm,
        projectType,
        projectTag,
        version,
        isAutoCollect = true
    } = getProjectInfo()

    let utm = null
    if (isUtm) {
        utm = new UtmCollect(
            projectTag, // 项目标识
            version, // 项目版本号
            isAutoCollect, // 是否启用eventid埋点
            projectType // utm or sweet
        )
    }

    globalFilters(projectFilters)
    globalMethods(projectMethods)
    globalExtends(projectExtends, isAutoCollect, utm)

    let options = {
        el,
        store: globalStore(projectStore),
        render: h => h(App),
        created(){
            fetchApiInfo().then(res => {
                Vue.config.productionTip = false
                return console.log('请求文件正常');
            }).catch(err => {
                this.$tip('apiSource请求失败')
                throw new Error(err)
            })
        },
    }

    if (typeof router !== 'undefined') {
        globalRouter(router, conf, utm)
        options = {
            ...options,
            router
        }
    }

    new Vue(options)


}
