<template>
<div v-if="isShow" class="popup">
  <div class="popup_bg"></div>
  <div class="center_fixed popup_main" :style="styleObj">
    <div class="popup_content">
      <div class="popup_close" v-if="isShowClose" @click="$emit('closeFn')"></div>
      <slot></slot>
    </div>
  </div>
</div>
</template>
<script>
/*
 * isShow: 是否显示弹窗,
 * isShowClose: 是否显示关闭按钮,
 * closeFn: 点击关闭按钮执行的函数
 * styleObj: 针对弹窗的附加样式，建议为left及width值
 * 注意styleObj中的样式是叠加 transform: translate(-50%, -60%)后的样式
 */
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isShowClose: {
      type: Boolean,
      default: false
    },
    styleObj: String,
    closeFn: Function
  },
  data() {
    return {
      oriBodyStyle: {}
    }
  },
  mounted() {
    let bodyStyle = document.body.style
    let oriPosition = bodyStyle.position || 'static'
    let oriWidth = bodyStyle.width || '100%'
    let oriHeight = bodyStyle.height || 'auto'
    let oriOverflow = bodyStyle.overflow || 'auto'
    this.oriBodyStyle = {
      oriPosition,
      oriWidth,
      oriHeight,
      oriOverflow
    }
  },
  watch: {
    isShow() {
      let {
        oriPosition,
        oriWidth,
        oriHeight,
        oriOverflow
      } = this.oriBodyStyle
      let bodyStyle = document.body.style
      if (this.isShow) {
        bodyStyle.position = 'fixed'
        bodyStyle.width = '100%'
        bodyStyle.height = '100%'
        bodyStyle.overflow = 'hidden'
      } else {
        bodyStyle.position = oriPosition
        bodyStyle.width = oriWidth
        bodyStyle.height = oriHeight
        bodyStyle.overflow = oriOverflow
      }
    }
  }
}
</script>
<style scoped>
.popup,
.popup_bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.popup {
  z-index: 901;
}

.popup_bg {
  background-color: rgba(0, 0, 0, .6);
  z-index: 998
}

.popup_main {
  background: #ffffff;
  border-radius: .16rem;
  width: 6.3rem;
  z-index: 999;
}

.popup_content {
  position: relative;
  color: #615850;
  font-size: .24rem;
}

.popup_close {
  position: absolute;
  right: -0.26rem;
  top: -0.26rem;
  z-index: 1200;
  width: .66rem;
  height: .66rem;
  background: url('../assets/close_icon.png') center center no-repeat;
  background-size: 100% auto;
}
</style>
