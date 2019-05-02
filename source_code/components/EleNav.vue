<template>
<NavBox :isBackground="isBackground" :showStatus="showStatus">
  <div class="nav-left">
    <a v-if="isShowBack" @click="goBack" class="back"></a>
    <slot v-else name="left"></slot>
  </div>
  <h1 class="nav-center ellipsis">{{title}}</h1>
  <div class="nav-right">
    <slot name="right"></slot>
  </div>
</NavBox>
</template>
<script>
import NavBox from 'components/NavBox'
export default {
  components: {
    NavBox
  },
  props: {
    // 是否显示导航背景图片
    isBackground: {
      type: Boolean,
      default: true
    },
    // 是否显示返回按钮
    isShowBack: {
      type: Boolean,
      default: true
    },
    // 是否需要返回app来源，(从你我金融app进入H5项目的第一页面的导航，若点击返回需要回到app，则设置为true)
    isBackApp: {
      type: Boolean,
      default: false
    },
    // 页面标题
    title: {
      type: [String, Number],
      default: document.title
    },
    // 显示环境，1非你我金融app中显示，2仅在你我金融app中才显示，3不管什么环境都显示，4都不显示，5投资全流程中显示
    showStatus: {
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      isIos: true,
      isApp: false
    }
  },
  methods: {
    goBack() {
      let {isBackApp, isApp} = this
      if (isBackApp && isApp) {
        this.$native('goBack')
      } else {
        window.history.go(-1)
      }
    }
  },
  mounted() {
    this.$native('getSystemInfo').then(res => {
      let {
        deviceType
      } = res.data
      this.isApp = deviceType ? true : false
      if (/android/i.test(deviceType)) {
        this.isIos = false
      }
    })
  }
}
</script>
<style scoped>
.nav-left {
  min-width: 1rem;
  max-width: 7em;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.nav-center {
  flex: 1;
  text-align: center;
  font-size: .36rem;
}

.nav-right {
  min-width: 1rem;
  max-width: 7em;
  height: 100%;
  display: flex;
  justify-content: flex-end;
}

.back {
  width: .44rem;
  height: 100%;
  background: url(../assets/back.png) left center no-repeat;
  background-size: .21rem auto;
}
</style>
