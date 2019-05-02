import {
  G_SetTip
} from 'comm/vues/store/mutation-types'
export default {
  [G_SetTip]({
    commit
  }, {msg, seconds = 2, callback}) {
    // 页面提示设置
    commit('G_SetTip', {
      msg
    })
    let timmer = setTimeout(() => {
      if(typeof callback === 'function'){
        callback()
      }
      commit('G_SetTip', {
        msg,
        timmer
      })
    }, seconds * 1000)
  }
}
