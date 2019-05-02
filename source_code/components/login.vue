<template>
    <div class="bg fz-14">
        <div class="fixed" v-if="successTip">
            <div class="successTip">登录成功</div>
        </div>
        <div v-if="errorTip" class="errorTip">{{txtTip}}</div>
        <div class="header">
            <img width="100%" height="100%" :src="urlHeaderImg">
        </div>
        <div class="content">
            <div class="h-60"></div>
            <div class="inputbox">
                <div class="icon phone_icon" :style="phone_icon"></div>
                <input class="fz-14 pleft-86" type="text" name="" v-model="phone" placeholder="请输入你我金融账号">
            </div>
            <div class="h-30"></div>
            <div class="inputbox">
                <div class="icon pwd_icon" :style="pwd_icon"></div>
                <div v-if="showPwd" class="icon show_icon" :style="showPwd_icon" @click="btnHidePwd"></div>
                <div v-else class="icon close_icon" :style="hidePwd_icon" @click="btnShowPwd"></div>
                <input v-if="showPwd" class="fz-14 pleft-86" type="text" name="" v-model="pwd" placeholder="请输入登录密码">
                <input v-else class="fz-14 pleft-86" type="password" name="" v-model="pwd" placeholder="请输入登录密码">
            </div>
            <div class="h-30"></div>
            <div v-if="isShowCodeBox" class="inputbox">
                <input class="fz-14 pleft-30" style="padding-left:0.3rem" type="tel" name="" placeholder="请输入验证码" v-model="phoneValNum" maxlength="6">
                <div v-if="isGetCode" class="btnGetCode" @click="btnGetCode">{{btnValNum}}</div>
                <div v-else class="btnGetCode">
                    <span class="opacity-60">重新获取</span>
                    <span>{{codetime}}s</span>
                </div>
            </div>
            <div class="h-30"></div>
            <div class="btn fz-16" @click="btnLogin">登 录</div>
            <div class="h-30"></div>
            <div class="txt flex color-999">
                <div v-if="isShowRegister" class="flex-2">还没有账号？
                    <span class="color-00ac67" @click="btnRegister">马上注册</span>
                </div>
                <div v-if="isShowForgetPwd" class="flex-1 tl-right" @click="btnForgetPwd">忘记密码？</div>
            </div>
        </div>
        <!-- 帐号登录锁定24小时提示 -->
        <transition name="fade">
            <article class="mask" v-if="isForbidLogin">
                <div class="popLayer">
                    <div class="popLayerMain">
                        <p>账号登录锁定24小时，可通过忘记密码来重置密码进行登录，如需帮助请联系客服
                            <a href="tel:400-0991-888" class="popLayerTel">400-0991-888</a>
                        </p>
                    </div>
                    <footer class="popLayerFt">
                        <button type="button" name="" class="popLayerBtn" style="border-right: 1px solid #d9d9d9;" @click="navForgetPwd">忘记密码</button>
                        <button type="button" name="" class="popLayerBtn" @click="isForbidLogin=false">放弃登录</button>
                    </footer>
                </div>
            </article>
        </transition>
        <transition name="fade">
            <article class="mask" v-if="pwdErrorTip">
                <div class="popLayer">
                    <div class="popLayerMain">
                        <p>
                            密码错误，请重输！您还有1次机会，错误5次系统将锁码24小时。
                        </p>
                    </div>
                    <footer class="popLayerFt">
                        <button type="button" name="" class="popLayerBtn" style="border-right: 1px solid #d9d9d9;" @click="navForgetPwd">忘记密码</button>
                        <button type="button" name="" class="popLayerBtn" @click="pwdErrorTip=false">再试试</button>
                    </footer>
                </div>
            </article>
        </transition>
    </div>
</template>
<script>
import { checkPassword, checkPhoneNum } from "../public/utils";
import { setUserInfo } from 'business/userInfo.js'
export default {
    data() {
        return {
            urlHeaderImg:
                "https://www.niiwoo.com/h5/h5-base/images/login/banner.png",
            phone_icon: {
                backgroundImage:
                    "url(https://www.niiwoo.com/h5/h5-base/images/login/login_icon.png)",
                backgroundPosition: "0 -0.83rem"
            },
            pwd_icon: {
                backgroundImage:
                    "url(https://www.niiwoo.com/h5/h5-base/images/login/login_icon.png)",
                backgroundPosition: "0 -0.42rem"
            },
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
            errorTip: false,
            txtTip: "",
            showPwd: false,
            successTip: false,
            phone: "",
            pwd: "",
            isShowRegister: true,
            isShowForgetPwd: true,
            isShowCodeBox: false,
            isGetCode: true,
            codetime: 119,
            btnValNum: "获取验证码",
            phoneValNum: "",
            pwdErrorTip: false, //密码错误4次弹窗
            isForbidLogin: false
        };
    },
    watch: {
        phone() {
            //输入的手机号正确
            if (checkPhoneNum(this.phone) === 1) {
                //判断是否需要显示短信框
                let obj = {
                    loginMobileNo: this.phone
                };
                this.$http
                    .post("userBasic/login/smsCodeStatus", obj)
                    .then(res => {
                        if (res.respCode !== "0000") {
                            this.errorCb(res);
                        } else {
                            this.isShowCodeBox = false;
                        }
                    });
            }
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
    },
    mounted() {
        document.title = "登录";
        let query = this.$route.query
        if(query.loginMobileNo) {
            this.phone = query.loginMobileNo
        }
    },
    methods: {
        btnGetCode() {
            if (checkPhoneNum(this.phone) !== 1) {
                this.tip(utils.checkPhoneNum(this.phone));
            } else {
                let obj = {
                    loginMobileNo: this.phone,
                    bizType: 2
                };
                this.$http.post("userBasic/sms", obj).then(res => {
                    if (res.respCode === "0000") {
                        this.countdown(); //开始倒计时
                    } else {
                        this.tip(res.message);
                    }
                });
            }
        },
        btnShowPwd() {
            this.showPwd = true;
        },
        btnHidePwd() {
            this.showPwd = false;
        },
        tip(txt) {
            this.errorTip = true;
            this.txtTip = txt;
            setTimeout(() => {
                this.errorTip = false;
            }, 2000);
        },
        btnLogin() {
            if (checkPhoneNum(this.phone) !== 1) {
                this.tip(checkPhoneNum(this.phone));
                return false;
            }
            if (checkPassword(this.pwd) !== 1) {
                this.tip(checkPassword(this.pwd));
                return false;
            }
            if (
                this.isShowCodeBox &&
                !this.checkValidateNum(this.phoneValNum)
            ) {
                this.tip("请输入正确的短信验证码");
                return false;
            }

            let obj = {
                loginMobileNo: this.phone,
                password: this.pwd,
                deviceType: "H5"
            };
            if (this.isShowCodeBox) {
                obj.smsCode = this.phoneValNum;
            }
            this.$http
                .post("user/login", obj)
                .then(res => {
                    if (res.respCode === "0000") {
                        this.successCb(res.data);
                    } else {
                        this.errorCb(res);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        btnForgetPwd() {
            this.$router.push({
                path: "/forgetPwd"
            });
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
        checkValidateNum(num) {
            var re = /^\d{6}$/;
            if (!!re.test(num)) {
                return true;
            } else {
                return false;
            }
        },
        setLocalData: function(c) {
            localStorage.setItem(c.name, JSON.stringify(c.value));
        },
        //登录成功处理
        successCb(result) {
            setUserInfo(result)
            this.successTip = true;
            setTimeout(() => {
                this.successTip = false;
                if (!!sessionStorage.getItem("backUrl")) {
                    location.href = sessionStorage.getItem("backUrl");
                }
            }, 1000);
        },
        //登录失败处理(需要短信验证码,限制登录)
        errorCb(result) {
            if (result.respCode === "USR19009") {
                //输错5次密码，账号锁了
                this.isForbidLogin = true;
            } else if (result.respCode === "USR19012") {
                //需要短信验证码提示框
                this.isShowCodeBox = true;
            } else if (result.respCode === "USR19057") {
                //输错4次密码提示
                this.pwdErrorTip = true;
            } else {
                this.tip(result.message);
            }
        },
        navForgetPwd() {
            this.isForbidLogin = false;
            this.pwdErrorTip = false;
            this.$router.push({
                path: "/forgetPwd"
            });
        },
        btnRegister() {
            this.$router.push({
                path: "/register"
            });
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

.radius {
    border-radius: 0.88rem;
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

.content input {
    height: 0.88rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    border-radius: 0.1rem;
    box-sizing: border-box;
    padding: 0.2rem 0.8rem;
}

.content .btn {
    width: 100%;
    height: 0.88rem;
    text-align: center;
    line-height: 0.88rem;
    background-color: #00ac67;
    color: #fff;
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
    top: 0;
    left: 0;
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
    color: rgb(0, 172, 103);
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

.popLayer {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 6.3rem;
    background-color: white;
    border-radius: 0.15rem;
}

.popLayerMain {
    padding: 0.4rem;
    box-sizing: border-box;
}

.popLayerMain p {
    font-size: 0.32rem;
    color: #000;
}

.popLayerFt {
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border-top: 1px solid #d9d9d9;
    display: flex;
}

.popLayerBtn {
    color: #1fba66;
    font-size: 0.36rem;
    flex: 1;
}

.popLayerTel {
    color: #1fba66;
}
</style>
