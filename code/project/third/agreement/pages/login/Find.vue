<template>
  <CommPage
    :isWhite="true"
    title="忘记密码"
    :isShowLine="true"
  >
    <div class="form-page">
      <div class="form-section">
        <div class="form-inner">
          <ul class="form-list">
            <li class="input-phone"><input
                type="tel"
                v-model="mobile"
                placeholder="请输入手机号码"
                maxlength="11"
              /></li>
            <li class="input-code"><input
                type="number"
                v-model="smsCode"
                placeholder="请输入验证码"
                maxlength="6"
              />
              <span
                class="code"
                @click="sendCode"
              >{{codeMsg}}</span>
            </li>
            <li class="input-password"><input
                type="password"
                v-model="password"
                placeholder="请设置密码"
                maxlength="16"
              /></li>
            <li class="input-password"><input
                type="password"
                v-model="passwordAgain"
                placeholder="请确认密码"
                maxlength="16"
              /></li>
          </ul>
          <a
            class="form-button"
            :class="{'button-disable': !isCollect}"
            @click="toRegister"
          >确定</a>
        </div>
      </div>
    </div>
  </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import CommPage from "../../components/CommPage.vue"

const pwdReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/
const mobileReg = /^1\d{10}$/
const codeReg = /\d{6}/

// 获取验证码倒计时总秒数
const totalSeconds = 120

@Component({
  components: {
    CommPage
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  mobile: string = ''
  password: string = ''
  passwordAgain: string = ''
  smsCode: string = ''
  seconds: number = totalSeconds
  isSended: boolean = false
  timmer: any = null
  sendCode() {
    let { mobile, seconds } = this
    if (seconds === totalSeconds) {
      if (!(mobileReg.test(mobile))) {
        this.$tip('手机号输入有误')
        return false
      }

      if (seconds === totalSeconds) {
        this.toSend()
        return false
      }
    } else {
      return false
    }
  }

  toSend() {
    let { mobile, seconds } = this
    this.$post('app/user/sendCode', {
      // useMock:'hecheng',// 启用mock数据  
      mobile,
      type: 2
    }).then(res => {
      this.isSended = true
      this.countdown()
    })
  }

  toRegister() {
    let { isCollect, mobile, password, smsCode, isSended, isSame } = this
    if (isCollect) {
      this.$post('app/updatePasswordForget', {
        // useMock:'hecheng',// 启用mock数据  
        mobile,
        password,
        smsCode
      }).then((res: any) => {
        let { data } = res
        // this.$user({ ...data })
        this.$router.replace('/login')
      })
    } else {

      if (!(mobileReg.test(mobile))) {
        this.$tip('手机号输入有误')
        return false
      }

      if (!(codeReg.test(smsCode))) {
        this.$tip('验证码输入有误')
        return false
      }

      if (!isSended) {
        this.$tip('请先获取验证码')
        return false
      }

      if (!(pwdReg.test(password))) {
        this.$tip('密码必须6-16位字母、数字或特殊符号组合')
        return false
      }

      if (!isSame) {
        this.$tip('确认密码与设置密码不一致')
        return false
      }
    }
  }

  countdown() {
    let { timmer } = this
    this.seconds = totalSeconds - 1
    clearInterval(timmer)
    this.timmer = setInterval(() => {
      let { seconds, timmer } = this
      if (seconds === 1) {
        clearInterval(timmer)
        this.seconds = totalSeconds
      } else {
        this.seconds = seconds - 1
      }
    }, 1000)
  }

  get codeMsg() {
    let { seconds, isSended } = this
    if (seconds === totalSeconds) {
      return isSended ? '重新获取' : '获取验证码'
    } else {
      return `${seconds}s`
    }
  }

  get isCollect() { // 校验输入是否正确
    let { mobile, password, smsCode, isSended, isSame } = this
    if (mobileReg.test(mobile) && codeReg.test(smsCode) && isSended && isSame) {
      return true
    } else {
      return false
    }
  }

  get isSame(){
    let {password, passwordAgain} = this
    if(pwdReg.test(password) && pwdReg.test(passwordAgain) && password === passwordAgain){
      return true
    }
    return false
  }

  destroyed() {
    let { timmer } = this
    clearInterval(timmer)
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.form-page {
  padding-top: 0.8rem;
}
.form-section {
  flex: 1;
  h1 {
    font-size: 0.54rem;
    font-weight: normal;
    color: #333333;
    padding: 0.82rem 0 1.08rem 0;
    text-align: center;
  }
}
.form-list {
  li {
    border-bottom: solid 1px #e4e4e4;
    margin-bottom: 0.5rem;
    display: flex;
    background-repeat: no-repeat;
    background-position: 0.22rem center;
    padding: 0.2rem 0 0.2rem 0;
    background-size: 0.3rem auto;
    input {
      font-size: 0.32rem;
      background: transparent;
      flex: 1;
      padding-left: 0.8rem;
    }
    .code {
      width: 2.16rem;
      text-align: center;
      font-size: 0.32rem;
      color: #333333;
      border-left: solid 1px #e4e4e4;
      white-space:nowrap;
    }
  }
}
.input-phone {
  background-image: url(../../assets/icon_phone.png);
}
.input-code {
  background-image: url(../../assets/icon_code.png);
}
.input-password {
  background-image: url(../../assets/icon_password.png);
}
.form-button {
  color: #ffffff;
  display: block;
  text-align: center;
  line-height: 0.94rem;
  background-color: #29a1f7;
  border-radius: 0.08rem;
}
.button-disable {
  background-color: rgba(41, 161, 247, 0.3);
}

.form-inner {
  padding: 0 0.66rem;
}
.find-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.3rem;
  color: #898989;
  margin-top: 0.36rem;
  a {
    color: #898989;
    &.link {
      color: #fa9d3b;
    }
  }
}
.wechat-login {
  text-align: center;
  padding: 0.76rem 0;
  font-size: 0.28rem;
  color: #878787;
  .login-text {
    display: flex;
    margin-bottom: 0.36rem;
    justify-content: center;
    align-items: center;
    &::before {
      content: "";
      width: 0.42rem;
      height: 1px;
      background: #878787;
      margin-right: 0.2rem;
    }
    &::after {
      content: "";
      width: 0.42rem;
      height: 1px;
      background: #878787;
      margin-left: 0.2rem;
    }
  }
  img {
    width: 1rem;
  }
}
</style>
