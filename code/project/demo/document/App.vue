<template>
  <div>
    <router-view></router-view>
    <Loading :isShow="loadingStatus"></Loading>
    <Tip
      :isShow="isShowTip"
      :msg="tip.text"
    ></Tip>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { State, Action, Mutation, Getter } from "vuex-class";
import VueMixin from "comm/vues/VueMixin"
import Loading from "comm/components/Loading.vue"
import Tip from "comm/components/Tip.vue"

@Component({
  components: {
    Loading,
    Tip
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  @Getter loadingStatus: boolean;
  @State isShowTip: boolean
  @State tip: any
}
</script>