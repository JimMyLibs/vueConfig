<template>
<transition name="fade">
    <div class="center_fixed tip" v-show="isShow">{{msg}}</div>
</transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop({ default: false }) isShow!: boolean
  @Prop({ default: '' }) msg?: string
}
</script>
<style scoped>
.tip {
    text-align: center;
    width: 5.2rem;
    z-index: 18000;
    padding: 0.26rem;
    background: rgba(0,0,0,.6);
    color: #ffffff;
    font-size: 0.32rem;
    border-radius: 0.5rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
