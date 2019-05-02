<template>
  <div
    class="comm-page"
    :class="{'white-page': isWhite}"
  >
    <EleNav
      :title="title"
      :isShowBack="isShowBack"
      :isShow="isShowNav"
    ></EleNav>
    <p
      class="nav-line"
      v-if="isShowLine"
    ></p>
    <slot></slot>
    <PagesFoot :isShow="isShowFoot" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from "comm/components/EleNav.vue"
import PagesFoot from "./foot.vue";

@Component({
  components: {
    PagesFoot,
    EleNav
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  @Prop({ default: false }) isWhite?: boolean
  @Prop({ default: true }) isShowNav?: boolean
  @Prop({ default: true }) isShowBack?: boolean
  @Prop({ default: false }) isShowLine?: boolean
  @Prop({ default: false }) isShowFoot?: boolean
  @Prop({ default: document.title }) title?: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.comm-page {
  min-height: 100vh;
  box-sizing: border-box;
  color: #333333;
  font-size: 0.28rem;
  display: flex;
  flex-flow: column;
  background: #f4f4f4;
}
.white-page {
  background: #ffffff;
}
</style>
