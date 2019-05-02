<template>
<div>
    <div v-if="resultStatus == 10">
        <!-- entry -->
    </div>
    <div v-if="resultStatus == 11">
        <Loading :type="loadingType"></Loading>
    </div>
    <div v-if="resultStatus == 1">
        <slot></slot>
    </div>
    <div v-if="isShowPageError">
      <div v-if="resultStatus == -1" class="fetch_error">
          <p class="icon_sad">{{errorMsg.text}}</p>
      </div>
      <div v-if="resultStatus == 0" class="fetch_error">
        <p class="icon_error">{{errorMsg.text}}</p>
          <!-- 返回错误码，请处理错误 -->
      </div>
      <div v-if="resultStatus == 2" class="fetch_error">
          <!-- 登录失效，请重新登录 -->
      </div>
    </div>
    <AutoTip :msg="errorMsg"></AutoTip>
</div>
</template>
<script>
/*
 * resultStatus: 当前状态
 *           10:默认空白
 *           11:加载中
 *           -1:服务端异常（未正常返回错误码）,
 *           0:服务端返回了错误码
 *           1:返回正确结果
 *           2:token失效（根据错误规则设置，判断是否进入登录页）
 */
import Loading from 'components/Loading'
import AutoTip from 'components/AutoTip'
import errorCodes from 'config/errorCode'
import native from 'utils/Native'
import {
  setUserInfo
} from 'business/userInfo'
import {
  isInNiiwooApp,
  isWeChat
} from 'utils/utils'

export default {
    components: {
        Loading,
        AutoTip,
    },
    props: {
        // 当前状态
        httpStatus: {
            // 10：初始化，11：加载中，-1加载失败（服务端异常），0：返回错误码，1：请求成功，2：token错误
            type: Number,
            default: 10,
            required: true
        },

        // 加载效果类型
        // 1页面渐变旋转类型
        // 2页面旋转小点类型
        // 3局部渐变旋转类型
        // 4局部旋转小点类型
        loadingType: {
            default: 1
        },

        // 本地错误代码
        currentErrorCodes: Object,

        // 响应结果
        response: {
            // type: [Object, String],
            required: true
        },

        // 是否在页面显示错误提示语
        isShowPageError: {
            type: Boolean,
            default: false
        },

        // 错误处理规则，
        // 可通过此项配置覆盖默认规则
        errorRule: Object
    },
    data() {
        return {


            // 错误处理函数
            // httpStatus为0的时候，自动的处理函数，出入则不自动报错
            // 默认自动报错处理
            // errorFn: Function,

            // 错误信息
            errorInfo: {},

            // 默认请求状态
            resultStatus: 10

        }
    },
    mounted() {
        this.resultStatus = this.httpStatus
        this.httpResponse = this.response
    },
    methods: {
      // token失效的情况下，自动登录
      toLogin(){
        if( isInNiiwooApp() ){
          // app中，必须先完成登录操作
          native.action('login', {
            Status: true,
            IsTokenInvalid: true
          }).then(res => {
            if (res.Result == 1) {
              // 存储用户信息
              setUserInfo(res.Data)
            } else {
                // 提示出错信息
              this.errorInfo = res
            }
          }).catch(reson => {
            this.errorInfo = reson
          })
        }else{
          this.errorInfo = '登录失效，请重新登录'
          // this.$router.push('/login')
        }
      }
    },
    computed: {
        // 错误提示语处理
        errorMsg(){
          let msg = ''
          let mixErrorCodes = Object.assign({},errorCodes)
          if( typeof this.errorInfo === 'string' ){
            msg = this.errorInfo
          }

          if( typeof this.errorInfo === 'object' ){
            let theErrorCode = this.errorInfo.ErrorCode
            if( typeof this.currentErrorCodes === 'object' ){
              mixErrorCodes = Object.assign({},mixErrorCodes, this.currentErrorCodes)
            }

            if( theErrorCode && mixErrorCodes[theErrorCode] ){
              msg = mixErrorCodes[theErrorCode]
            }else{
              // 默认提示语
              msg = mixErrorCodes['1001']
            }
          }

          return {
              text: msg
          }
        }
    },
    watch: {
        // 监听实际请求状态
        httpStatus() {
            this.resultStatus = this.httpStatus
            if (this.httpStatus == 10 || this.httpStatus == 11) {
                this.httpResponse = {}
            }
        },
        // 监听实际返回结果
        response() {
            if (typeof this.response === 'object') {
                // let mixErrorRule = this.mixErrorRule()
                let result = this.response.Result

                // 请求已经返回结果的处理
                if (typeof result !== 'undefined') {
                    this.resultStatus = result

                    // 服务端返回结果，但服务端异常
                    // 提示错误
                    if (result == -1) {
                        this.errorInfo = this.response
                    }

                    // 服务器端返回错误码，自动提示错误
                    // 若不需要自动提示错误，请对传入的response先行处理，使response.result不为0
                    if (result == 0 ) {
                      this.errorInfo = this.response
                    }

                    // token失效的情况下，自动登录
                    // 若不需要自动登录，请对传入的response先行处理，使response.result不为2
                    if (result == 2) {
                        this.toLogin()
                    }

                } else {
                    // 未开始请求，请求中
                    // 请求异常（未正常返回结果）的处理，会走下面string的处理
                    this.resultStatus = this.httpStatus
                }
            }

            // 请求为返回结果，异常请款处理，通常为fetch的catch抛出的错误提示
            if (typeof this.response === 'string') {
                this.resultStatus = -1
                this.errorInfo = this.response
            }
        }
    }
}
</script>
<style scoped>
.fetch_error {
    text-align: center;
    font-size: 0.3rem;
    padding: 1rem .2rem;
}

.icon_sad {
    display: inline-block;
    background-size: auto .4rem;
    line-height: .5rem;
    height: .5rem;
    padding-left: .3rem;
}

.icon_error {
    display: inline-block;
    background: url('../assets/icon/ic_verification_failed.png') left center no-repeat;
    background-size: auto .4rem;
    line-height: .5rem;
    height: .5rem;
    padding-left: .6rem;
}
</style>
