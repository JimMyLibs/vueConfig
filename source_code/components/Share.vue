<template>
<div v-if="isRealShow">
  <div class="share_bg" @click="$emit('clickFn', false)"></div>
  <div class="share_content">
    <div class="default_content" v-if="isUseDefault">
      <p class="share_img">
        <img src="../assets/default_share_bg.png" />

      </p>
      <p class="share_button">
        <img @click="$emit('clickFn', false)" src="../assets/default_share_button.png" />

      </p>
    </div>
    <slot v-if="!isUseDefault"></slot>
  </div>
</div>
</template>
<script>
/*
 * isShow: 是否显示分享提示或者显示app分享按钮,
 * isAuthorization: 是否需要先授权,
 * shareInfo: 分享信息
  {
    // type 分享类型 0: 微信好友, 1：朋友圈, 2：微博, 3：短信,4：你我好友,5：你我圈,6：QQ,7：QQ空间
    type: ["0","1"],  //仅对你我金融app生效
   title: "分享标题",
   desc: "分享描述",
   imgUrl: "分享icon图片地址",
   link: "分享链接地址",
   success: ()=>{}, // 分享成功时候的回调函数，客户端中无法准确判断成功与失败
   cancel: ()=>{} // // 分享失败时候的回调函数，客户端中无法准确判断成功与失败
   isUseDefault: true // 是否显示默认背景图片
  }
 *
 * clickFn: 关闭微信中分享提示弹窗事件
 */

import native from 'utils/Native'
import {
  isInNiiwooApp,
  isWeChat
} from 'utils/utils'
import weChat from 'utils/WeChat'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isUseDefault: {
      type: Boolean,
      default: true
    },
    isAuthorization: {
      type: Boolean,
      default: false
    },
    shareInfo: {
      type: Object,
      default: {}
    },
    clickFn: Function
  },
  data() {
    return {
      // 是否显示显示分享提示遮罩
      isRealShow: false
    }
  },
  mounted() {
    this.setShare()
  },
  methods: {
    setShare() {
      let {
        shareInfo
      } = this
      let {
        success,
        cancel,
        ...other
      } = shareInfo
      shareInfo.type = Array.isArray(shareInfo.type) && shareInfo.type.length > 0 ? shareInfo.type : [0, 1]
      // 确保数据不为空的情况下执行
      if (typeof shareInfo === 'object' && typeof shareInfo.title !== 'undefined') {
        if (isInNiiwooApp() && this.isShow) {

          native.share(other, this.isAuthorization).then(res => {
            let {
              respCode
            } = res
            if (respCode === '0000') {
              if (typeof success === 'function') {
                success(res)
              }
            } else {
              if (typeof cancel === 'function') {
                cancel(res)
              }
            }
            // this.$emit('clickFn', false)
          }).catch(reson => {
            if (typeof cancel === 'function') {
              cancel(reson)
            }
          })
          // this.$emit('clickFn', false)
        }
        if (isWeChat()) {
          let {
            type,
            ...info
          } = shareInfo
          this.isRealShow = this.isShow
          weChat.setShareInfo(info, this.isAuthorization)
        }
      }
    }
  },
  watch: {
    shareInfo() {
      // 客户端bug，临时添加项
      this.setShare()
    },
    isShow() {
      if (isWeChat()) {
        this.isRealShow = this.isShow
      } else {
        this.setShare()
      }
    }
  }
}
</script>
<style scoped>
.share_bg {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, .8);
  width: 100%;
  height: 100%;
  z-index: 901;
}

.share_content {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 902;
  color: #fff;
}

.default_content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 903;
  color: #fff;
}

.share_img {
  width: 100%;
  margin-top: .4rem;
  text-align: center;

  img {
    width: 5.32rem;
  }
}

.share_button {
  text-align: center;
  margin-top: .7rem;

  img {
    width: 2.59rem;
  }
}
</style>
