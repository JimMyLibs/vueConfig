<template>
  <div>
    <ul class="list">
      <li @click="toPost">post</li>
      <li @click="toGet">get</li>
      <li @click="toUpload">upload</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class FetchPage extends Mixins(VueMixin) {
  toPost() {
    this.$post('test', {some: 'some'}).then(res => {
      console.log('res')
    })
  }
  toGet() {
    this.$get('test').then(res => {
      console.log('res')
    }).catch(reson => {
      console.log('reson')
    })
  }
  toUpload() {
    this.$upload('some-api').then(res => {
      console.log('res')
    }).catch(reson => {
      console.log('reson')
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
