<template>
  <NavBox
    :isShow="isShow"
    :isOpacity="isOpacity"
    :isPlaceholder="isPlaceholder"
  >
    <div class="nav-left">
      <Back :isShow="isShowBack" :isBackApp="isBackApp"></Back>
      <slot
        v-if="!isShowBack"
        name="left"
      ></slot>
    </div>
    <h1 class="nav-center ellipsis">{{title}}</h1>
    <div class="nav-right">
      <slot name="right"></slot>
    </div>
  </NavBox>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import NavBox from 'comm/components/NavBox.vue'
import Back from 'comm/components/Back.vue'

@Component({
  components: {
    NavBox,
    Back
  }
})
export default class Counter extends Mixins(VueMixin) {
  @Prop({ default: true }) isShowBack?: boolean
  @Prop({ default: false }) isBackApp?: boolean
  @Prop({ default: document.title }) title?: number | string
  @Prop({ default: true }) isShow?: boolean
  @Prop({ default: false }) isOpacity?: boolean// 是否透明背景
  @Prop({ default: true }) isPlaceholder?: boolean// 是否占位

}
</script>
<style lang="postcss" scoped>
.nav-left {
  min-width: 1rem;
  max-width: 7em;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.nav-center {
  flex: 1;
  text-align: center;
  font-size: 0.36rem;
}

.nav-right {
  min-width: 1rem;
  max-width: 7em;
  height: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
