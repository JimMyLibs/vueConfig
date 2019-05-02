<template>
  <a
    v-if="isShow"
    @click="goBack"
    class="back"
  ></a>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class FetchPage extends Mixins(VueMixin) {
  @Prop({ default: false }) isBackApp?: boolean
  @Prop({ default: true }) isShow?: boolean

  isApp = false

  mounted() {
    this.$native('getSystemInfo').then((res: any) => {
      let {
        deviceType
      } = res.data
      this.isApp = deviceType ? true : false
    })
  }
  
  goBack() {
    let { isBackApp, isApp } = this
    if (isBackApp && isApp) {
      this.$native('goBack')
    } else {
      window.history.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.back {
  width: 0.44rem;
  height: 100%;
  background-size: 0.21rem auto;
  display: flex;
  align-items: center;
  &::before {
    content: "";
    display: block;
    width: 0.26rem;
    height: 0.26rem;
    border-left: solid 0.06rem #29a1f7;
    border-top: solid 0.06rem #29a1f7;
    transform: rotate(-45deg);
  }
}
</style>
