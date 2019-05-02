<template>
  <div>
    <!-- <EleNav :isShowBack="true" :isShow="true" title="hello"></EleNav> -->
    <EleNav
      :isShowBack="true"
      :isShow="true"
      title="自定义导航"
    >
      <div slot="left">left</div>
      <div slot="right">right</div>
    </EleNav>
    <ul class="list">
      <li @click="toLoading">loading</li>
      <li @click="toTip">tip</li>
      <li @click="popupNum = 1">普通弹窗-单个按钮</li>
      <li @click="popupNum = 2">普通弹窗-多按钮</li>
      <li @click="popupNum = 3">普通弹窗-无按钮</li>
    </ul>
    <Popup
      :isShow="popupNum === 1"
      @callback="popupNum = 0"
    >
      <div>1</div>
    </Popup>
    <Popup
      :isShow="popupNum === 2"
      :buttons="buttonsList"
      @callback="clickPopup"
    >
      <div>1</div>
    </Popup>
    <Popup :isShow="popupNum === 3" buttons="">
      <div>1</div>
    </Popup>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from "comm/components/EleNav.vue"
import Popup from "comm/components/Popup.vue"

@Component({
  components: {
    EleNav,
    Popup
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  popupNum = 0
  buttonsList = [
    {
      text: '取消',
      isGray: true
    },
    {
      text: '确定',
      isGray: false
    }
  ]
  toTip() {
    this.$tip('hello word!')
  }
  toLoading() {
    this.$loading(true)
  }
  clickPopup(index = 0){
    alert(`点击了第${index + 1}个按钮`)
  }
}
</script>
<style lang="postcss" scoped>
.list {
  padding: 0.5rem 0.2rem;
  li {
    background: orange;
    color: #fff;
    line-height: 3em;
    margin-bottom: 2em;
    border-radius: 1rem;
    text-align: center;
  }
}
</style>
