<template>
<div class="hide">
</div>
</template>
<script>
/**
 * limit 滚动距离底部多少开始触发滚动事件
 * scrollFn 滚动事件触发的回调函数
 */
export default {
  props: {
    limit: {
      type: Number,
      default: 20
    },
    scrollFn: Function
  },
  mounted() {
    window.addEventListener('scroll', this.bindScroll, false)
  },
  methods: {
    bindScroll() {

      let bodyEle = document.body
      let docEle = document.documentElement

      let bodyHeight = bodyEle.scrollHeight
      let docHeight = docEle.clientHeight

      let topNum = docEle.scrollTop || bodyEle.scrollTop

      // 滚动至底部的距离
      let dis = bodyHeight - (topNum + docHeight)

      // 距离底部的距离
      if (dis <= this.limit) {
        this.$emit('scrollFn')
      }
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.bindScroll, false)
  }
}
</script>
<style scoped>
.hide {
  display: none;
}
</style>
