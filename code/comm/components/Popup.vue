<template>
<div class="popup">
  <transition :name="maskType === 'black' ? 'fade' : ''">
    <p @click="$emit('clickMask')" class="fixed-mask" v-if="maskType" :class="{'opacity-mask': maskType === 'opacity'}"></p>
  </transition>
  <FixedBox :isShow="isShow" :position="position" :isTransition="isTransition">
    <div class="popup-box">
      <span class="close"></span>
      <slot></slot>
    </div>
  </FixedBox>
</div>
</template>
<script>
import FixedBox from 'comm/components/FixedBox'
export default {
  components: {
    FixedBox
  },
  props: {
    isShow: { // 是否显示
      type: Boolean,
      default: false
    },
    position: { // 垂直方向位置： top 顶部；center 中间；bottom 底部，自动根据位置值展示动画效果
      type: String,
      default: 'center' // top,center,bottom
    },
    isTransition: { // 是否使用动画效果
      type: Boolean,
      default: true
    },
    mask: { // 是否显示遮罩, hide 不显示，opacity 显示透明遮罩，black显示半透明黑色遮罩
      type: String,
      default: 'hide' // hide, opacity, black
    }
  },
  computed: {
    maskType() {
      let {
        isShow,
        mask
      } = this
      if (isShow && mask !== 'hide') {
        return mask
      }
      return ''
    }
  }
}
</script>
<style scoped>
.fixed-mask {
  position: fixed;
  z-index: 17999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .6);
}

.opacity-mask {
  opacity: 0;
}

.popup-box {
  flex: 1;
  position: relative;
}
.close{
  position: absolute;
  width:.44rem;
  height:.44rem;
  background:#ccc;
  border-radius: 50%;
  right:0;
  top: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
