// https://www.jianshu.com/p/78dda0c32d0c

// https://www.cnblogs.com/jkchao/p/8022586.html

import { Vue } from "vue-property-decorator";
import Vuex from 'vuex'
import { state } from 'comm/vues/store/state'
import { mutations } from 'comm/vues/store/mutations'
import { actions } from 'comm/vues/store/actions'
import { getters } from 'comm/vues/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
