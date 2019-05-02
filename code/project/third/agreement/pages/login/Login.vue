<template>
  <CommPage
    :isWhite="true"
    :isShowBack="false"
    title
  >
    <div class="form-section">
      <h1>登录</h1>
      <div class="form-inner">
        <ul class="form-list">
          <li class="input-phone">
            <input
              type="tel"
              v-model="mobile"
              placeholder="请输入手机号码"
              maxlength="11"
            >
          </li>
          <li class="input-password">
            <input
              type="password"
              v-model="password"
              placeholder="请输入密码"
              maxlength="16"
            >
          </li>
        </ul>
        <a
          class="form-button"
          :class="{'button-disable': !isCollect}"
          @click="login"
        >登录</a>
        <p class="find-line">
          <router-link to="find">忘记密码</router-link>
          <router-link to="register">注册</router-link>
        </p>
      </div>
    </div>
    <!-- 临时调试 -->
    <div
      class="devTest f30 text-center"
      v-if="locationHostname=='172.21.0.21'||locationHostname=='testh5.niiwoo.com'||locationHostname=='agree.91525.net'||locationHostname=='127.0.0.1'||locationHostname=='119.23.189.143'"
    >
      <a
        class="btn"
        href="http://172.21.0.21:8088/#/"
      >跳转本地{{locationHref}}</a>
      <div class="flex wrap">
        <button
          class="btn flex1"
          @click="autoLogin"
        >自动登录</button>
        <button
          class="btn flex1"
          @click="clearCache"
        >清除缓存</button>
        <button
          class="btn flex1"
          @click="reload"
        >刷新页面</button>
        <!-- <button class="btn flex1" @click="gobaidu">去百度</button> -->
        <a
          class="btn flex1"
          href="http://agree.91525.net/#/user"
        >112</a>
      </div>
    </div>
    <!-- 需求更改，移除 -->
    <div class="form-bottom">
      <div class="wechat-login">
        <p class="login-text">
          <span>使用其他账号登录</span>
        </p>
        <p>
          <img
            @click="wechatLogin"
            src="../../assets/wechat_box.png"
          >
        </p>
      </div>
    </div>
  </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import CommPage from "../../components/CommPage.vue";
import simpleNative from "comm/utils/simpleNative";

const pwdReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
const mobileReg = /^1\d{10}$/;


@Component({
  components: {
    CommPage
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  mobile: string = "";
  password: string = "";
  res: any = {};// 临时调试
  get locationHostname(): string {
    return location.hostname;
  }
  get locationHref(): string {
    return location.href;
  }
  get LStext(): string {
    return localStorage.test;
  }
  clearCache(): void {
    localStorage.clear();
    sessionStorage.clear();
    alert('清除成功');
  }
  reload(): void {
    location.reload();
  }
  gobaidu(): void {
    location.href = 'https://www.baidu.com'
    alert('执行完成');
  }
  mounted() {
    let { mobile, password } = this.$route.query;
    if (typeof mobile !== "undefined") {
      this.mobile = mobile as string;
    }
    if (typeof password !== "undefined") {
      this.password = password as string;
    }
  }
  autoLogin(): void {
    this.mobile = "13189748386";
    this.password = "test123";
    this.login();
  }

  login() {
    let { isCollect, mobile, password } = this;
    if (isCollect) {
      this.$post("app/login", {
        isTip: false,
        body: {
          // useMock:'lile',// 启用mock数据  
          mobile,
          password
        }
      }).then((res: any) => {
        this.res = res;// 临时调试
        let { respCode, data, errorMessage, message } = res;
        if (respCode === "0000") {
          this.goWhere(data);
        } else if (respCode === "0006") {
          this.$router.replace("register");
        } else {
          this.$tip(errorMessage || message);
        }
      }).catch(err => {
        console.log('请求失败', err)
      })
    } else {
      if (!mobileReg.test(mobile)) {
        this.$tip("手机号输入有误");
        return false;
      }

      if (!pwdReg.test(password)) {
        this.$tip("密码必须6-16位字母、数字或特殊符号组合");
        return false;
      }
    }
  }

  goWhere(data) {
    let { materialStatus, userType } = data;
    this.$user({ ...data });
    if (userType == 1) {
      this.$router.replace("/");
    } else {
      if (materialStatus == 0) {
        this.$router.replace("/user/perfectMyInfo?type=edit");
      } else if (materialStatus == 1) {
        this.$router.replace("/user/checkState");
      } else if (materialStatus == 2) {
        this.$router.replace("/");
      } else if (materialStatus == 3) {
        this.$router.replace("/user/perfectMyInfo?type=fail");
      }
    }
  }

  wechatLogin() {
    (window as any).getWxRes = (appRes) => {
      if(typeof appRes === 'string'){
        appRes = {openid: appRes}
      }
      if (appRes) {
        const { openid } = appRes;
        this.$user({ wxOpenId: openid });
        this.$post("app/third/login", {
          isTip: false,
          body: {
            // useMock:'lile',// 启用mock数据  
            wxOpenId: openid,
          }
        }).then((res: any) => {
          let { respCode, data, errorMessage, message } = res;
          // 0000 成功，0001失败，0002 未知错误，0003 未绑定APP帐号,0004 未登录，0005 无权限操作 0006 未注册
          if (respCode === "0000") {
            this.goWhere(data);
          } else if (respCode === "0003") {
            this.$router.replace("wechatLogin");
          } else if (respCode === "0006") {
            this.$router.replace("wechatReg");
          } else {
            this.$tip(errorMessage || message);
          }
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        this.$tip('微信登录失败，请重试');
      }

    };
    // (window as any).App.WXLogin();

    simpleNative('WXLogin')




  }

  get isCollect() {
    // 校验输入是否正确
    let { mobile, password } = this;
    if (mobileReg.test(mobile) && pwdReg.test(password)) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
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
    padding: 0.2rem 0.22rem 0.2rem 0;
    background-size: 0.3rem auto;
    input {
      font-size: 0.32rem;
      background: transparent;
      flex: 1;
      padding-left: 0.8rem;
    }
  }
}
.input-phone {
  background-image: url(../../assets/icon_phone.png);
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
