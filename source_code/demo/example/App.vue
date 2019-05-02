<template>
<div>
  <router-view></router-view>
  <Tip :isShow="tip.isShow" :msg="tip.msg"></Tip>
  <Loading :type="loadingStatus"></Loading>
</div>
</template>
<script>
import {
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
import Tip from 'components/Tip'
import Loading from 'components/Loading'

export default {
  components: {
    Tip,
    Loading
  },
  data() {
    return {
      isInit: false
    }
  },
  methods: {
    ...mapMutations([
      'G_SetInit'
    ]),
  },
  computed: {
    ...mapGetters(['loadingStatus']),
    ...mapState({
      tip(state) {
        return state.tip
      }
    }),
  },
  watch: {
    '$route' (to, from) {
      this.G_SetInit()
    }
  }
}
</script>
<style scoped>
.test {
  display: block;
  background: green;
  margin: 1rem;
}
</style>
