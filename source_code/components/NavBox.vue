<template>
<div :class="[typeName]" v-if="status">
  <p class="nav-block"></p>
  <div class="nav-content" :class="{'nav-bg':isBackground}">
    <p class="nav-top"></p>
    <div class="nav">
      <slot></slot>
    </div>
  </div>
</div>
</template>
<script>
/**
 * isBackground 是否显示默认背景图片，true显示，false不显示
 */
export default {
  props: {
    isBackground: {
      type: Boolean,
      default: true
    },
    showStatus: { // 显示环境，1非你我金融app中显示，2仅在你我金融app中才显示，3不管什么环境都显示, 4都不显示，5仅在投资全流程中显示
      type: [Number, String],
      default: 1
    }
  },
  data() {
    return {
      typeName: 'web', // web：浏览器，android-app：android你我金融app，ios-app：ios你我金融app, iphonex-app：iphoneX你我金融app
      isApp: false
    }
  },
  mounted() {
    let isIphoneX = /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    this.$native('getSystemInfo').then(res => {
      let {
        deviceType
      } = res.data
      this.isApp = deviceType ? true : false
      let typeName = 'android-app'
      if (/ios/i.test(deviceType)) {
        typeName = isIphoneX ? 'iphonex-app' : 'ios-app'
      }
      this.typeName = typeName
    })
  },
  computed: {
    status(){
      // 2、3的情况需要设置客户端方法setNav的isShow为false，建议在路由中的beforeEach方法来设置
      let {showStatus, isApp} = this
      if( showStatus == 5 ){
        return sessionStorage.getItem('niiwoo_project_type') === 'touziquanliucheng'
      }else if(showStatus == 4){
        return false
      }else{
        if( isApp ){
          if( showStatus == 1 ){
            return false
          }else{
            return true
          }
        }else{
          if( showStatus == 2 ){
            return false
          }else{
            return true
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.nav-block {
  height: .88rem;
}
.nav-top{
  display:none;
}

.ios-app{
  .nav-block {
    height: 1.28rem;
  }
  .nav-top{
    height: .4rem;
    display:block;
  }
}

.iphonex-app{
  .nav-block {
    height: 1.78rem;
  }
  .nav-top{
    height: .9rem;
    display:block;
  }
}


.nav-content {
  position: fixed;
  z-index: 999;
  width: 100%;
  left: 0;
  top: 0;
  .nav {
    display: flex;
    align-items: center;
    height: .5rem;
    line-height: .5rem;
    padding: .19rem .21rem;
    color: #FFFFFF;
    font-size: .3rem;
    a {
      color: #FFFFFF;
    }
    h1 {
      font-weight: normal;
      color: #FFFFFF;
    }
  }
}

.nav-bg {
  background: url(../assets/nav.png) center bottom no-repeat #26ca8e;
  background-size: 100% auto;
}
</style>
