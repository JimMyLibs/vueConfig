<template>
<transition :name="transitionType">
  <div class="fixed-box" :class="[`position-${position}`]" v-if="isShow">
    <slot></slot>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    isShow: { // 是否显示
      type: Boolean,
      default: false
    },
    position: { // 垂直方向位置： top 顶部；center 中间；bottom 底部，自动根据位置值展示动画效果
      type: String,
      default: 'center' // top center bottom
    },
    isTransition: { // 是否使用动画效果
      type: Boolean,
      default: true
    }
  },
  computed: {
    transitionType() {
      let {
        isTransition,
        position
      } = this
      if (isTransition) {
        return position
      }
      return ''
    }
  }
}
</script>
<style scoped>
.fixed-box {
  position: fixed;
  z-index: 18000;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* .fixed-mask {
  position: fixed;
  z-index: 17999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  background: #000000;
} */

.position-top {
  top: 0;
}

.top-enter-active,
.top-leave-active {
  transition: transform .2s;
}

.top-enter,
.top-leave-to {
  transform: translateY(-100%);
}

.position-center {
  top: 50%;
  transform: translateY(-50%);
}

.center-enter-active,
.center-leave-active {
  transition: opacity .2s;
}

.center-enter,
.center-leave-to {
  opacity: 0;
}

.position-bottom {
  bottom: 0;
}

.bottom-enter-active,
.bottom-leave-active {
  transition: transform .2s;
}

.bottom-enter,
.bottom-leave-to {
  transform: translateY(100%);
}
</style>
