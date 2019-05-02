<template>
<div>
  <div class="middle-page" v-if="isWrong">
    <div class="middle-img">
      <img src="../assets/choose.png" />
    </div>
    <div class="middle-text">
      <p>
        请在{{devText}}中
      </p>
      <p>
        打开该页面
      </p>
    </div>
  </div>
  <slot v-if="!isWrong"></slot>
</div>
</template>
<script>
import {
  isWeChat,
  isInNiiwooApp
} from 'utils/utils'

export default {
  props: {
    type: {
      // 0、不限
      // 1、仅能在微信中查看
      // 2、仅能在app中查看，
      // 3、仅能在微信或者你我金融app中查看
      default: 0
    }
  },
  computed: {
    isWrong() {
      let {
        type
      } = this
      let isInWeChat = isWeChat()
      let isInApp = isInNiiwooApp()

      if (type === 1 && !isInWeChat) {
        return true
      }

      if (type === 2 && !isInApp) {
        return true
      }

      if (type === 3) {
        if (!(isInWeChat || isInApp)) {
          return true
        }
      }

      return false
    },
    devText() {
      let {
        type
      } = this
      let text = ''
      switch (type) {
        case 1:
          text = '微信'
          break
        case 2:
          text = '你我金融客户端'
          break
        case 3:
          text = '微信或你我金融客户端'
          break
      }
      return text
    }
  }
}
</script>
<style scoped>
.middle-page {
  text-align: center;
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: #ddd;
  color: #aa0000;
  font-size: .36rem;
  line-height: 1.5em;
}

.middle-img {
  padding: 2rem 0 .3rem 0;
  img {
    width: 1.69rem;
  }
}
</style>
