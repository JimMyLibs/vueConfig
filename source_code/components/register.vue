<template>
    <div class="fz-14 bg" :style="bgColor">
        <div class="fixed" v-if="successTip">
            <div class="successTip">注册成功</div>
        </div>
        <div class="header">
            <img width="100%" height="100%" :src="urlHeaderImg">
        </div>
        <div v-if="errorTip" class="errorTip">{{txtTip}}</div>
        <div class="content">
            <div class="h-60"></div>
            <div class="inputbox">
                <input class="fz-14 pleft-30" v-model="phone" type="tel" name="" maxlength="11" placeholder="请输入您本人实名登记的手机号">
            </div>
            <div class="h-30"></div>
            <div class="inputbox">
                <input class="fz-14 pleft-30" type="tel" name="" placeholder="请输入验证码" v-model="phoneValNum" maxlength="6">
                <div v-if="isGetCode" class="btnGetCode" :style="codeStyle" @click="btnGetCode">{{btnValNum}}</div>
                <div v-else class="btnGetCode" :style="codeStyle">
                    <span class="opacity-60">重新获取</span>
                    <span>{{codetime}}s</span>
                </div>
                <div class=""></div>
            </div>
            <div class="h-30"></div>
            <div class="inputbox">
                <!-- <input class="fz-14 pleft-30" type="password" v-model="registerPwd" name="" placeholder="请输入登录密码"> -->
                <div v-if="showPwd" class="icon show_icon" :style="showPwd_icon" @click="btnHidePwd"></div>
                <div v-else class="icon close_icon" :style="hidePwd_icon" @click="btnShowPwd"></div>
                <input v-if="showPwd" class="fz-14 pleft-30" type="text" name="" maxlength="16" v-model="registerPwd" placeholder="请设置密码">
                <input v-else class="fz-14 pleft-30" type="password" name="" maxlength="16" v-model="registerPwd" placeholder="请设置密码">
            </div>
            <template v-if="!!isShowInviter">
                <div class="h-30"></div>
                <div class="inputbox">
                    <input class="fz-14 pleft-30" type="" name="" placeholder="请输入邀请人手机号码,没有可不填" v-model="inviterPhoneNum" maxlength="11">
                </div>
            </template>
            <div class="h-20"></div>
            <div class="fz-12" :style="{color:agreementOColor}">
                <label>
                    <input type="checkbox" value="" />我已阅读并同意
                </label>
                <a :style="{color:agreementColor}" :href="agreementUrl">《你我金融注册协议》</a>

            </div>
            <div class="h-30"></div>
            <div class="btn fz-16" :style="registerStyle" @click="btnRegister">注 册</div>
            <div class="h-60"></div>
            <div v-if="isShowLogin" class="ta-center" :style="loginOColor">

                <span>已有你我金融账户,请</span>
                <a class="" @click="btnLogin" :style="loginColor">直接登录</a>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import { checkPassword, checkPhoneNum } from "../public/utils";
export default {
    data: function() {
        return {
            readyonlyPhone: false, //手机号码是否可编辑
            urlHeaderImg:
                "https://www.niiwoo.com/h5/h5-base/images/login/banner.png",
            bgColor: {
                backgroundColor: ""
            },
            errorTip: false,
            txtTip: "",
            phone: "",
            isGetPhoneCode: false, //判断发送短信验证码是否成功
            registerPwd: "",
            inviterUserId: "",
            isGetCode: true,
            codetime: 119,
            btnValNum: "获取验证码",
            inviterPhoneNum: "",
            agreementUrl: "https://www.niiwoo.com/html5/agreements/niiwoo.html",
            showPwd_icon: {
                backgroundImage:
                    "url(https://www.niiwoo.com/h5/h5-base/images/login/login_icon.png)",
                backgroundPosition: "0 -1.25rem"
            },
            hidePwd_icon: {
                backgroundImage:
                    "url(https://www.niiwoo.com/h5/h5-base/images/login/login_icon.png)",
                backgroundPosition: "0 0"
            },
            showPwd: false,
            phone: "",
            codeStyle: {
                color: "#00ac67",
                borderLeftColor: "#ccc"
            },
            isShowLogin: true,
            agreementOColor: "#999",
            agreementColor: "#00ac67",
            isShowInviter: true,
            registerStyle: {
                color: "#fff",
                backgroundColor: "#00ac67"
            },

            successTip: false,
            phoneValNum: "",
            loginColor: {
                color: "#00ac67"
            },
            loginOColor: {
                color: "#999"
            }
        };
    },
    mounted() {
        document.title = "注册";
        if (
            sessionStorage.getItem("inviterUserId") ||
            sessionStorage.getItem("inviterMobileNo")
        ) {
            this.isShowInviter = false;
        } else {
            this.isShowInviter = true;
        }
    },
    created() {
        let query = this.$route.query;
        //登录成功之后的返回地址
        if (!!query.backUrl) {
            sessionStorage.setItem(
                "backUrl",
                decodeURIComponent(query.backUrl)
            );
        }
        if (!!query.inviterUserId) {
            sessionStorage.setItem("inviterUserId", query.inviterUserId);
        }
        if (!!query.inviterMobileNo) {
            sessionStorage.setItem("inviterMobileNo", query.inviterMobileNo);
        }
        if (!!query.recommendUrl) {
            sessionStorage.setItem("recommendUrl", query.recommendUrl);
        }
    },
    methods: {
        btnGetCode() {
            if (checkPhoneNum(this.phone) !== 1) {
                this.tip(checkPhoneNum(this.phone));
            } else {
                let obj = {
                    loginMobileNo: this.phone,
                    bizType: 1
                };
                this.$http.post("userBasic/sms", obj).then(_res => {
                    console.log(_res);
                    if (_res.respCode === "0000") {
                        // this.isGetPhoneCode = true;
                        this.countdown(); //开始倒计时
                    } else {
                        this.tip(_res.message);
                    }
                });
            }
        },
        btnLogin() {
            this.$router.push({
                path: "/login"
            });
        },
        btnRegister() {
            let checkbox = document.querySelector("input[type=checkbox]");
            if (checkPhoneNum(this.phone) !== 1) {
                this.tip(checkPhoneNum(this.phone));
                return false;
            }
            /*
            if (!this.isGetPhoneCode) {
                this.tip("请先获取短信验证码");
                return false;
            }
            */
            if (!this.checkValidateNum(this.phoneValNum)) {
                this.tip("请输入正确的短信验证码");
                return false;
            }
            if (checkPassword(this.registerPwd) !== 1) {
                this.tip(checkPassword(this.registerPwd));
                return false;
            }
            if (!this.valInviterPhoneNum()) {
                this.tip("请输入正确的邀请人手机号码");
                return false;
            }
            if (!checkbox.checked) {
                this.tip("请确认服务协议");
                return false;
            }
            let _obj = {
                loginMobileNo: this.phone,
                password: this.registerPwd,
                smsCode: this.phoneValNum,
                deviceType: 2,
                inviterUserId: sessionStorage.getItem("inviterUserId") || "",
                inviterMobileNo:
                    sessionStorage.getItem("inviterMobileNo") ||
                    this.inviterPhoneNum,
                recommendUrl: sessionStorage.getItem("recommendUrl") || ""
            };
            this.$http.post("user/register", _obj).then(result => {
                if (result.respCode === "0000") {
                    this.successTip = true;
                    setTimeout(() => {
                        this.successTip = false;
                        this.$router.push({
                            path: "/login",
                            query: {
                                loginMobileNo: result.data.loginMobileNo
                            }
                        });
                    }, 1000);
                } else {
                    this.tip(result.message);
                }
            });
        },
        tip(txt) {
            this.errorTip = true;
            this.txtTip = txt;
            setTimeout(() => {
                this.errorTip = false;
            }, 2000);
        },
        //验证邀请人手机号码是否正确
        valInviterPhoneNum() {
            let result = false;
            if (!this.inviterPhoneNum) {
                result = true;
            } else if (checkPhoneNum(this.inviterPhoneNum) !== 1) {
                result = false;
            } else {
                result = true;
            }
            return result;
        },
        //短信验证码倒计时
        countdown() {
            this.isGetCode = false;
            //获取当前手机时间戳
            let startTime = new Date().getTime();
            let count = 119;
            let countdownTimer = setInterval(() => {
                let curTime = new Date().getTime();
                let rest = count - parseInt((curTime - startTime) / 1000);
                this.codetime = rest;
                if (rest < 1) {
                    clearInterval(countdownTimer);
                    this.btnValNum = "重新获取";
                    this.isGetCode = true;
                    this.codetime = 119;
                }
            }, 1000);
        },
        btnShowPwd() {
            this.showPwd = true;
        },
        btnHidePwd() {
            this.showPwd = false;
        },
        setLocalData: function(c) {
            localStorage.setItem(c.name, JSON.stringify(c.value));
        },
        checkValidateNum(num) {
            var re = /^\d{6}$/;
            if (!!re.test(num)) {
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>
<style type="text/css" scoped>
.box {
    position: relative;
    width: 100%;
    height: 100%;
}

.bg {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    max-width: 10rem;
}

.header {
    width: 100%;
    height: 2rem;
    position: relative;
}

.h-20 {
    width: 100%;
    height: 0.2rem;
}

.h-30 {
    width: 100%;
    height: 0.3rem;
}

.h-60 {
    width: 100%;
    height: 0.6rem;
}

.content {
    padding: 0 0.55rem;
    flex: 1;
}

.pleft-86 {
    padding-left: 0.86rem;
}

.pleft-30 {
    padding-left: 0.3rem;
}

input:not([type="checkbox"]) {
    height: 0.88rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    border-radius: 0.1rem;
    box-sizing: border-box;
    padding: 0.2rem;
}
input[type="checkbox"] {
    width: 0.25rem;
    height: 0.25rem;
    margin-right: 0.1rem;
    -webkit-appearance: checkbox;
    vertical-align: -0.03rem;
}
.content .btn {
    width: 100%;
    height: 0.88rem;
    text-align: center;
    line-height: 0.88rem;
    /*  background-color: #00ac67;
    color: #fff;*/
    border-radius: 0.1rem;
}

.flex {
    display: flex;
}

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2;
}

.color-00ac67 {
    color: #00ac67;
}

.color-999 {
    color: #999;
}

.tl-right {
    text-align: right;
}

.inputbox {
    position: relative;
}

.icon {
    position: absolute;
    width: 0.36rem;
    height: 0.36rem;
    background-repeat: no-repeat;
    background-size: cover;
}

.icon.pwd_icon {
    top: 0.25rem;
    left: 0.3rem;
}

.icon.phone_icon {
    top: 0.25rem;
    left: 0.3rem;
}

.icon.show_icon {
    top: 0.25rem;
    right: 0.3rem;
}

.icon.close_icon {
    top: 0.25rem;
    right: 0.3rem;
}

.errorTip {
    position: fixed;
    width: 100%;
    height: 0.6rem;
    background: rgba(255, 60, 81, 0.7);
    color: #fff;
    text-align: center;
    line-height: 0.6rem;
    z-index: 10;
}

.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.successTip {
    position: fixed;
    width: 4.2rem;
    height: 0.88rem;
    line-height: 0.88rem;
    left: 50%;
    margin-left: -2.1rem;
    top: 50%;
    margin-top: -0.44rem;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0.1rem;
    z-index: 10;
}

.btnGetCode {
    position: absolute;
    width: 2.5rem;
    height: 0.88rem;
    line-height: 0.88rem;
    text-align: center;
    top: 0;
    right: 0;
}
.btnGetCode:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.25rem;
    height: 0.4rem;
    border-left: 1px solid #ccc;
}

.opacity-60 {
    opacity: 0.6;
}

.ta-center {
    text-align: center;
}
</style>
