<template>
  <div class="loading" v-if="isShow">
    <div class="loading_block"></div>
    <div class="loading_content">
      <div class="loading-img"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop({ default: false }) isShow!: boolean
  // @Prop({default: false}) isShow!: boolean
}
</script>
<style scoped lang="postcss">
.loading {
  .loading_block {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9996;
  }

  .loading_content {
    position: fixed;
    width: 1.6rem;
    height: 1.6rem;
    left: 50%;
    top: 50%;
    margin-top: -0.8rem;
    margin-left: -0.8rem;
    z-index: 9996;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.3rem;
  }

  .loading-img {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 56% auto;
    background-position: center center;
    background-image: url("../assets/loading-spinning-bubbles.svg");
  }
}
</style>
