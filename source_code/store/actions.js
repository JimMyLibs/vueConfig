import {G_SetTip} from 'store/mutation-types'
export default {
  [G_SetTip]({
    commit
  }, msg) {
    // 页面提示设置
    commit('G_SetTip', {msg})
    let timmer = setTimeout(() => {
      commit('G_SetTip', {msg, timmer})
    }, 2000)
  }
}
