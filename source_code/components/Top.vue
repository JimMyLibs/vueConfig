<template>
<a class="top" @click="toTop" v-show="isShow"><img src="../assets/top.png" /></a>
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
  data(){
    return {
      isShow: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.bindScroll, false)
  },
  methods: {
    toTop(){
      if (document.documentElement && document.documentElement.scrollTop != 0) {
        document.documentElement.scrollTop = 0
      } else {
        document.body.scrollTop = 0
      }
    },
    bindScroll() {
      let topNum = document.documentElement.scrollTop || document.body.scrollTop
      if( topNum > 100 ){
        this.isShow = true
      }else{
        this.isShow = false
      }
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.bindScroll, false)
  }
}
</script>
<style scoped>
.top {
  position: fixed;
  width: .6rem;
  right: .2rem;
  bottom: .5rem;
  z-index: 12;
}
</style>
