<template>
  <div>
    <ul class="list">
      <li @click="toSetTitle">设置标题</li>
      <li @click="toSetFn">设置右上角事件</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class FetchPage extends Mixins(VueMixin) {
  toSetTitle() {
    this.$native('setNav', {
      isShow: true,
      title: 'hello'
    })
  }
  toSetFn(){
    this.$setNative('clickRight', ()=>{
      alert('what happend?')
    })
    this.$native('setNav', {
      isShow: true,
      title: 'hello',
      type: 1,
      rightText: '点我',
      rightFnName: 'clickRight'
    })
  }

}
</script>
<style lang="postcss" scoped>
.list {
  padding: 0.3rem;
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
