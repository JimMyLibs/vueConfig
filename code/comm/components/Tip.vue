<template>
  <FixedBox :isShow="isShow">
    <p class="tip-msg">{{msg}}</p>
  </FixedBox>
</template>
<script>
// 提示窗组件
import FixedBox from 'comm/components/FixedBox'
export default {
  components: {
    FixedBox
  },
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
.tip-msg {
  background: rgba(0, 0, 0, .6);
  border-radius: .08rem;
  padding: .23rem .3rem;
  text-align: center;
  max-width: 60%;
  font-size: .3rem;
  color: #FFFFFF;
}

</style>
