import Vue from 'vue'
import Vuex from 'vuex'
import actions from 'comm/vues/store/actions'
import getters from 'comm/vues/store/getters'
import mutations from 'comm/vues/store/mutations'
import state from 'comm/vues/store/state'

Vue.use(Vuex)

export default (modules = {}, conf) => {
  return new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules
  })
}
