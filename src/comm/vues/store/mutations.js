import { G_SetLoading, G_SetInit, G_SetTip } from 'comm/vues/store/mutation-types'

export default {
    [G_SetInit](state) {
        // 页面初始化操作
        let { timmer } = state.tip

        // 清除loading
        state.loadingNum = 0

        // 清除tip定时器
        state.tip.isShow = false
        clearTimeout(timmer)
    },
    [G_SetLoading](state, status = true) {
        // 设置loading状态
        let { loadingNum } = state
        loadingNum = status ? loadingNum + 1 : loadingNum - 1
        state.loadingNum = loadingNum < 0 ? 0 : loadingNum
    },
    [G_SetTip](state, { msg, timmer }) {
        // 首次调用时，state.tip.timmer = null，本句无效
        // 二次调用时(定时器调用)，state.tip.timmer = timmer，本句清楚定时器
        let { timmer: tipTimmer } = state.tip
        clearTimeout(tipTimmer)

        if (typeof timmer === 'undefined') {// 首次调用，只传msg，timer=undefined
            let text = '服务器异常，请稍后重试！'
            if (typeof msg === 'string' && msg.trim() !== '') {
                text = msg
            }
            if (typeof msg === 'object' && msg.toString() !== '') {
                text = msg.toString()
            }
            state.tip.isShow = true
            state.tip.msg = text
            state.tip.timmer = timmer
        } else {
            state.tip.isShow = false
        }
    }
}