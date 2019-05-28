<template>
    <div id="app">
        <router-view></router-view>
        <Tip :isShow="tip.isShow" :msg="tip.msg"></Tip>
        <Loading :type="loadingStatus"></Loading>
    </div>
</template>
<script>
import Tip from "comm/components/Tip";
import Loading from "comm/components/Loading";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
    components: {
        Tip,
        Loading
    },
    computed: {
        ...mapGetters(["loadingStatus"]),
        ...mapState({
            tip(state) {
                return state.tip;
            }
        })
    }
};
</script>
<style lang="scss">
#app {
    
}
</style>
