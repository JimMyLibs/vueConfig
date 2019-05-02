import { StateType } from "./StateType";
import { ActionTree } from "vuex";
import { TIP } from 'comm/vues/store/mutation-types'


export const actions: ActionTree<StateType, any> = {
  [TIP]({ state: StateType, commit }, payload: {
    msg?: string,
    time?: number
  }) {
    let { msg, time = 2000 } = payload
    commit('TIP', msg)
    let timmer = setTimeout(() => {
      clearTimeout(timmer)
      commit('TIP')
    }, time)
  }
};
