<template>
<transition name="fade">
    <div class="center_fixed tip" v-show="isShow">{{msg}}</div>
</transition>
</template>
<script>
export default {
    props: {

        // 是否显示提示窗
        isShow: {
            type: Boolean,
            default: false
        },

        // 提示信息
        msg: {
          type: String,
          default: ''
        }
    }
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
