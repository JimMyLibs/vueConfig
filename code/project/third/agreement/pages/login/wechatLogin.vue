<template>
    <CommPage :isWhite="true" :isShowBack="true" title>
        <div class="form-section">
            <h1>绑定登录</h1>
            <div class="form-inner">
                <ul class="form-list">
                    <li class="input-phone">
                        <input type="tel" v-model="mobile" placeholder="请输入手机号码" maxlength="11">
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
                <a class="form-button" :class="{'button-disable': !isCollect}" @click="login">登录</a>
                <p class="find-line">
                    <router-link to="find"></router-link>
                    <router-link to="wechatReg">注册</router-link>
                </p>
            </div>
        </div>
    </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import CommPage from "../../components/CommPage.vue";

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
    mounted() {
        let { mobile, password } = this.$route.query;
        if (typeof mobile !== "undefined") {
            this.mobile = mobile as string;
        }
        if (typeof password !== "undefined") {
            this.password = password as string;
        }
    }

    login() {
        let { isCollect, mobile, password } = this;
        if (isCollect) {
            this.$post("app/third/bindLogin", { 
                isTip: false,
                body: {
                    // useMock:'lile',// 启用mock数据  
                    mobile,
                    password,
                    wxOpenId: (this.$user() as any).wxOpenId
                }
            }).then((res: any) => {
                // 0000 成功，0001失败，0002 未知错误，0003 未绑定APP帐号,0004 未登录，0005 无权限操作 0006 未注册
                let { respCode, data, errorMessage, message } = res;
                if (respCode === "0000") {
                    this.goWhere(data);
                } else if (respCode === "0006") {
                    this.$router.replace("wechatReg");
                } else {
                    this.$tip(errorMessage || message);
                }
            }).catch(err=>{
                console.log('err',err)
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
        if(userType == 1){
            this.$router.replace("/");
        }else{                        
            if (materialStatus == 0) {
                this.$router.replace("/user/perfectMyInfo?type=edit");
            }else if(materialStatus == 1){
                this.$router.replace("/user/checkState");
            }else if(materialStatus == 2){
                this.$router.replace("/");
            }else if(materialStatus == 3){
                this.$router.replace("/user/perfectMyInfo?type=fail");
            }
        }
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
