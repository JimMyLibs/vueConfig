import { MutationTree } from 'vuex'
import { StateType } from 'comm/vues/store/StateType'
import { LOADING, TIP } from 'comm/vues/store/mutation-types'


export const mutations: MutationTree<StateType> = {
  [LOADING](state: StateType, status = true) {
    let { loadingNum } = state
    loadingNum = status
      ? loadingNum + 1
      : loadingNum - 1
    state.loadingNum = loadingNum < 0
      ? 0
      : loadingNum
  },
  [TIP](state: StateType, msg?: string) {
    // 页面提示设置
    if (typeof msg === 'undefined') {
      state.isShowTip = false
    } else {
      let text = '服务器异常，请稍后重试！'
      if (typeof msg === 'string' && msg.trim() !== '') {
        text = msg
      }
      state.isShowTip = true
      state.tip = {
        text
      }
    }
  }
}
