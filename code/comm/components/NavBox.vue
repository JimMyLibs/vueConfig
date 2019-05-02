<template>
  <div
    :class="[typeName]"
    v-if="isShow"
  >
    <p
      class="nav-block"
      v-if="isPlaceholder"
    ></p>
    <div
      class="nav-content"
      :class="{'isOpacity': isOpacity}"
    >
      <p class="nav-top"></p>
      <div class="nav">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class Counter extends Mixins(VueMixin) {
  @Prop({ default: true }) isShow?: boolean
  @Prop({ default: false }) isWhite?: boolean
  @Prop({ default: false }) isOpacity?: boolean// 是否透明背景
  @Prop({ default: true }) isPlaceholder?: boolean// 是否占位
  typeName = 'web'
  isApp = true
  mounted() {
    let userAgent = navigator.userAgent.toLowerCase()
    let isIphone = /iphone/g.test(userAgent)
    let isIphoneX = isIphone && (screen.height == 812 && screen.width == 375)
    if(isIphone){
      this.typeName = isIphoneX ? 'iphonex-app' : 'ios-app'
    }else{
      this.typeName = 'android-app'
    }
  }
}
</script>
<style lang="postcss" scoped>
.nav-block {
  height: 0.88rem;
}
.nav-top {
  display: none;
}

.ios-app {
  .nav-block {
    height: 1.28rem;
  }
  .nav-top {
    height: 0.4rem;
    display: block;
  }
}

.iphonex-app {
  padding-top: 0.6rem; /* iphoneX适配 */
  .nav-block {
    height: 1.78rem;
  }
  .nav-top {
    height: 0.9rem;
    display: block;
  }
  .nav-content {
    top: .6rem;
  }
}

.nav-content {
  position: fixed;
  z-index: 999;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff;
  &.isOpacity {
    background: rgba(255, 255, 255, 0);
  }
  .nav {
    display: flex;
    align-items: center;
    height: 0.5rem;
    line-height: 0.5rem;
    padding: 0.19rem 0.21rem;
    color: #000000;
    font-size: 0.3rem;
    a {
      color: #000000;
    }
    h1 {
      font-weight: normal;
      color: #000000;
    }
  }
}
</style>
