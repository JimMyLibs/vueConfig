import {G_SetLoading, G_SetInit, G_SetTip} from 'store/mutation-types'
import weChat from 'utils/WeChat'

export default {
  [G_SetInit](state) {

    // 存储用户微信授权信息，方便后续用getUserInfo方法获取
    weChat.getUserWxData()

    // 页面初始化操作
    let {timmer} = state.tip

    // 清除loading
    state.loadingNum = 0

    // 清除tip定时器
    state.tip.isShow = false
    clearTimeout(timmer)
  },
  [G_SetLoading](state, status = true) {
    // 设置loading状态
    let {loadingNum} = state
    loadingNum = status
      ? loadingNum + 1
      : loadingNum - 1
    state.loadingNum = loadingNum < 0
      ? 0
      : loadingNum
  },
  [G_SetTip](state, {msg, timmer}) {
    // 页面提示设置
    let {timmer: tipTimmer} = state.tip
    clearTimeout(tipTimmer)

    if (typeof timmer === 'undefined') {
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
