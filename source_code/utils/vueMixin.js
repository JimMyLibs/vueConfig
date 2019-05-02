import Vue from 'vue'

// mixin公共方法
import globalAction from 'business/globalAction'
import HttpBase from 'utils/core/HttpBase'
import {mapActions, mapMutations} from 'vuex'
import {p, deepCopy, isWeChat} from 'utils/utils'
import fetchTimeout from 'business/fetchTimeout'

export default (http = new HttpBase(), isWechatLogin = false) => {
  Vue.mixin({
    methods: {
      $fetch(api, data = {}, method = 'post', options) {
        return new Promise((resolve, reject) => {
          let {isShowConsole, isShowError, isShowLoading, backUrl} = deepCopy(http.conf, data)

          // 显示loading
          if (isShowLoading) {
            this.G_SetLoading(true)
          }

          fetchTimeout(http[method](api, data, options)).then(res=>{
            if (isShowLoading) {
              this.G_SetLoading(false)
            }

            // 打印日志
            if (isShowConsole) {
              p('<================== fetch ===================>')
              p(`${api} 请求及响应数据为：`)
              p(data)
              p(res)
            }

            // 微信免登陆处理
            let {respCode} = res

            if( respCode === 'SYS10000'){
              location.href = `${location.origin}/html5/guid/index.html`
            }
            if(isWeChat() && isWechatLogin && respCode === 'BSC10005'){
              let wxData = this.getWechatInfo()
              http[method]('third/login', {
                apiType: 'product',
                params: {
                  blackBox: '0',
                  platformId: '2',
                  deviceType: '2',
                  openId: wxData.openid,
                  nickName: wxData.nickname,
                  headImage: wxData.headimgurl,
                  provinceName: wxData.province,
                  cityName: wxData.city,
                  sex: wxData.sex
                }
              }).then(res => {
                let {
                  bindType,
                  loginMobileNo,
                  token,
                  userId
                } = res.data

                if (bindType == 1) { // 微信登录成功
                  this.G_SetUserInfo({
                    token,
                    userId,
                    loginMobileNo
                  })
                  return this.$fetch(api, data, method, options)
                } else {
                  location.href = `${location.origin}/html5/public/wechat/#/code?backUrl=${encodeURIComponent(location.href)}&isBind=0`
                  return false
                }
              }).catch(reson=>{
                this.G_SetTip('服务器异常，请稍后重试！')
                return false
              })
            }


            // 判断fetch结果是否正确
            let {isCorrect, msg} = this.G_CheckResponse(res, isShowError, backUrl)
            if (isCorrect) {
              resolve(res)
            } else {
              if (isShowError) {
                this.G_SetTip(msg)
              }
              reject(res)
            }
          }).catch(reson=>{
            // 异常处理
            if (isShowLoading) {
              this.G_SetLoading(false)
            }
            this.G_SetTip(typeof reson === 'string' ? reson : '网络异常，请稍后再试！')
            reject(reson)
          })
        })
      },
      $get(api, data) {
        return this.$fetch(api, data, 'get')
      },
      $post(api, data) {
        return this.$fetch(api, data)
      },
      $upload(api, data, options) {
        // options [其他请求配置，如apiType，headers，params等]
        return this.$fetch(api, data, 'upload', options)
      },
      $native(actionName, data) {
        return new Promise((resolve, reject) => {
          globalAction.G_NativeAction(actionName, data).then(res => {
            let {isCorrect, msg} = this.G_CheckResponse(res)
            if (isCorrect) {
              resolve(res)
            } else {
              reject(res)
            }
          }).catch(reson => {
            if (!(reson.includes('not in niiwoo'))) {
              this.G_SetTip(reson)
            }
            reject(reson)
          })
        })
      },
      $setNative(fnName, callback){
        // fnName为H5与客户端协定的函数名，callback为客户端调用H5方法后的毁掉函数
        globalAction.G_NativeSetAction(fnName, callback)
      },
      ...globalAction,
      ...mapActions([// 混合全局错误提示方法
        'G_SetTip']),
      ...mapMutations([// 混合全局loading方法
        'G_SetLoading'])
    }
  })
}
