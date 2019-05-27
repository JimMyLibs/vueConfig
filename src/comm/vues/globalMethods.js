import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
import Http from 'comm/js/http/Http'
import Native from 'comm/js/Native/Native'
import { getProjectInfo } from 'comm/business/projectInfo'
import { checkResponse } from 'comm/business/commApi'
import { user, login, setTitle } from 'comm/business/user'
import { p } from 'comm/js/utils/utils'

const { appName } = process.env.PROJECT_INFO;

const http = new Http()
const native = new Native()

// 特殊接口参数
const specialKeys = [
    'apiType',
    'headers',
    'body',
    'apiInfo',
    'method',
    'isConsole',
    'isTip',
    'isLoading',
    'loginUrl'
]

// mixin公共方法
// import globalAction from 'business/globalAction'

export default (projectMethods = {}) => {
    Vue.mixin({
        methods: {
            ...projectMethods,
            $user(info, isAppLogin) {
                return user(info, isAppLogin)
            },
            $login(isLogin = true, loginUrl, backUrl = location.href) {
                return login(isLogin, loginUrl, backUrl = location.href)
            },
            $setTitle(title) {
                setTitle(title)
            },
            $fetch(api, data = {}, method = 'post', options) {
                return new Promise((resolve, reject) => {
                    let conf = getProjectInfo()
                    if (typeof data === 'object' && Object.keys(data).some(item => specialKeys.includes(item))) {
                        conf = {
                            ...conf,
                            ...data
                        }
                    }
                    let {
                        isConsole = true,
                        isTip = true,
                        isLoading = true
                    } = conf

                    // 显示loading
                    if (isLoading) {
                        this.$loading(true)
                    }

                    http[`$${method}`](api, data, options).then(res => {
                        if (isLoading) {
                            this.$loading(false)
                        }

                        // 打印日志
                        if (isConsole) {
                            p('<================== fetch ===================>')
                            p(`${api} 请求及响应数据为：`)
                            p(data)
                            p(res)
                        }

                        // 判断fetch结果是否正确
                        let { isCorrect, msg } = checkResponse(res, conf)
                        if (isCorrect) {
                            resolve(res)
                        } else {
                            if (isTip) {
                                this.$tip(msg)
                                reject(res)
                            } else {
                                resolve(res)
                            }
                        }
                    }).catch(err => {
                        // 异常处理
                        if (isLoading) {
                            this.$loading(false)
                        }
                        this.$tip(
                            typeof err === 'string'
                                ? err
                                : '网络异常，请稍后再试！')
                        reject(err)
                    })
                })
            },
            $get(api, data) {
                return this.$fetch(api, data, 'get')
            },
            $post(api, data) {
                return this.$fetch(api, data)
            },
            $upload(api, data, options) {
                // options [其他请求配置，如apiType，headers，params等]
                return this.$fetch(api, data, 'upload', options)
            },
            $native(actionName, data) {
                return new Promise((resolve, reject) => {
                    native.action(actionName, data).then(res => {
                        let { isCorrect } = checkResponse(res)
                        if (isCorrect) {
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    }).catch(reson => {
                        if (typeof reson === 'string' && !(reson.includes(`not in ${appName}`))) {
                            this.$tip(reson)
                        }
                        reject(reson)
                    })
                })
            },
            $setNative(fnName, callback) {
                // fnName为H5与客户端协定的函数名，callback为客户端调用H5方法后的毁掉函数
                native.setAction(fnName, callback)
            },
            // ...globalAction,
            $tip(msg, seconds) {
                return new Promise((resolve, reject) => {
                    this.G_SetTip({
                        msg,
                        seconds,
                        callback: () => {
                            resolve()
                        }
                    })
                })

            },
            ...mapActions(['G_SetTip']), // 混合全局错误提示方法
            ...mapMutations({
                '$loading': 'G_SetLoading' // 混合全局loading方法
            })
        }
    })
}
