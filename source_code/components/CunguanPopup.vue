<template>
<div v-if="isShow" class="popup">
  <div class="popup_bg"></div>
  <div class="center_fixed popup_main">
    <div class="popup_content">
      <span class="close" @click="$emit('closeFn')"></span>
      <p>
        <img src="../assets/cunguan.png" />
      </p>
      <ul class="buttons">
        <li v-if="role == 0 || role == 2">
          <a :href="`${url}&accountRole=2`">开通投资存管账户</a>
        </li>
        <li v-if="role == 0 || role == 3">
          <a :href="`${url}&accountRole=3`">开通借款存管账户</a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
/*
 * isShow: 是否显示弹窗,
 * closeFn: 点击关闭按钮执行的函数
 * sureText: 确认按钮文字
 * sureFn：确认回调事件
 */
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    role: {
      // 1担保机构,2投资人,3借款人
      type: [Number, String],
      required: true
    },
    closeFn: Function
  },
  data(){
    return {
      url: `${location.origin}/html5/project/open_account/#/?returnUrl=${encodeURIComponent(location.href)}`
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
  z-index: 998;
}

.close {
  width: .44rem;
  height: .44rem;
  position: absolute;
  z-index: 1000;
  right: .2rem;
  top: .2rem;
  background: url(../assets/close.png) center center no-repeat;
  background-size: .34rem auto;
}

.popup_main {
  background: #ffffff;
  border-radius: .2rem;
  width: 6.3rem;
  z-index: 999;
  overflow: hidden;
}

.popup_content {
  position: relative;
  font-size: .3rem;
  color: #828282;
}

.buttons {
  text-align: center;
  font-size: .36rem;
  color: #1ECC6E;
  padding: 0 .3rem;
  li {
    text-align: center;
    padding: .42rem 0;
    border-bottom: solid 1px #D0D0D0;
    a {
      color: #1ECC6E;
      text-decoration: none;
    }
    &:last-child {
      border: none;
    }
  }
}
</style>
