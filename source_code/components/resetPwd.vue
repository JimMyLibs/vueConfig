<template>
    <div class="bg fz-14">
        <div v-if="errorTip" class="errorTip">{{txtTip}}</div>
        <div class="fixed" v-if="successTip">
            <div class="successTip">新密码设置成功</div>
        </div>
        <div class="content">
            <div class="h-60"></div>
            <div class="inputbox">
                <input class="fz-14 pleft-30" v-model="phone" type="text" name="" placeholder="请输入注册时的手机号码" maxlength="11">
            </div>
            <div class="h-30"></div>
            <div class="inputbox">
                <input class="fz-14 pleft-30" type="text" name="" placeholder="请输入验证码" v-model="phoneValNum" maxlength="6">
                <div v-if="isGetCode" class="btnGetCode" @click="btnGetCode">{{btnValNum}}</div>
                <div v-else class="btnGetCode" >
                    <span class="opacity-60">重新获取</span>
                    <span>{{codetime}}s</span>
                </div>
            </div>
            <div class="h-30"></div>
            <div class="inputbox">
                <input class="fz-14 pleft-30" type="password" name="" placeholder="密码为6~16个字符，包含字母与数字" v-model="pwd">
                <div class="icon"></div>
            </div>
            <div class="h-30"></div>
            <div class="btn" @click="btnSubmit">{{submitTxt}}</div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    data: function() {
        return {
            phone: "",
            inputStyle:{},
            readonly: false,
            isGetCode: true,
            codeStyle: {
                color: "#00ac67",
                borderLeftColor: "#ccc"
            },
            codetime: 119,
            phoneValNum: "",
            btnValNum: "获取验证码",
            errorTip: false,
            txtTip: "",
            isGetPhoneCode: false,
            pwd: "",
            successTip: false,
            submitTxt: "完 成",
        }
    },
    mounted() {
        document.title = "忘记密码";
        if(this.$route.query.phoneNum) {
            this.phone = this.$route.query.phoneNum
        }
    },
    methods: {
        btnGetCode() {
            if (this.checkPhoneNum(this.phone) !== 1) {
                this.tip(this.checkPhoneNum(this.phone));
            } else {
                let obj = {
                    apiType: "product",
                    params: {
                        bizType: 3,
                        loginMobileNo: this.phone
                    }
                };
                this.$http.post("userBasic/sms", obj).then((res) => {
                    if (res.respCode === "0000") {
                        this.isGetPhoneCode = true;

                        this.countdown(); //开始倒计时
                    } else {
                        this.tip(res.message);
                    }
                });
            }
        },
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
        tip(txt) {
            this.errorTip = true;
            this.txtTip = txt;
            setTimeout(() => {
                this.errorTip = false;
            }, 2000);
        },
        btnSubmit() {
            if (this.checkPhoneNum(this.phone) !== 1) {
                this.tip(this.checkPhoneNum(this.phone));
            } else if (!this.isGetPhoneCode) {
                this.tip("请先获取短信验证码");
            } else if (!this.checkValidateNum(this.phoneValNum)) {
                this.tip("请输入正确的短信验证码");
            } else if (this.checkPassword(this.pwd) !== 1) {
                this.tip(this.checkPassword(this.pwd));
            } else {
                let obj = {
                    apiType: "product",
                    params: {
                        loginMobileNo: this.phone,
                        smsCode: this.phoneValNum,
                        password: this.pwd
                    }
                };
                this.$http.post("userBasic/loginPwdSMSReset", obj).then((res) => {
                    if (res.respCode == "0000") {
                        this.successTip = true;
                        setTimeout(() => {
                            this.successTip = false
                            this.$router.back();

                            // this.$router.push({
                            //     path:'/login'
                            // })
                        }, 1000);
                    } else {
                        this.tip(res.message);
                    }
                });
            }
        },
        checkValidateNum(num) {
            var re = /^\d{6}$/;
            if (!!re.test(num)) {
                return true;
            } else {
                return false;
            }
        },
        checkPhoneNum(num) {
            var re = /^1[34578]\d{9}$/;
            if (!num) {
                return '请输入手机号码';
            } else if (num.length != 11) {
                return '手机号码格式错误';
            } else if (!re.test(num)) {
                return '手机号码格式错误';
            } else {
                return 1;
            }
        },
        checkPassword(pwd) {
            let re = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
            if (!pwd) {
                return '请输入密码';
            } else if (!re.test(pwd)) {
                return '密码应为6-16个字符，含字母和数字';
            } else {
                return 1;
            }
        }
    }
}
</script>
<style type="text/css" scoped>
html,body,h1,h2,h3,h4,h5,h6,p,br,form,input,button,textarea,select,fieldset,legend,blockquote,ul,ol,li,dl,dt,dd,pre,table,caption,tr,td,th,
article,aside,details,figcaption,figure,footer,header,canvas,menu,nav,section,summary,time,mark,audio,video {margin: 0;padding: 0;}
.fz-10 {
    font-size: 10px;
}
[data-dpr="2"] .fz-10 {
    font-size: 20px;
}

[data-dpr="3"] .fz-10 {
    font-size: 30px;
}
.fz-12 {
    font-size: 12px;
}

[data-dpr="2"] .fz-12 {
    font-size: 24px;
}

[data-dpr="3"] .fz-12 {
    font-size: 36px;
}

.fz-14 {
    font-size: 14px;
}

[data-dpr="2"] .fz-14 {
    font-size: 28px;
}

[data-dpr="3"] .fz-14 {
    font-size: 42px;
}

.fz-16 {
    font-size: 16px;
}

[data-dpr="2"] .fz-16 {
    font-size: 32px;
}

[data-dpr="3"] .fz-16 {
    font-size: 48px;
}

.fz-20 {
    font-size: 20px;
}

[data-dpr="2"] .fz-20 {
    font-size: 40px;
}

[data-dpr="3"] .fz-20 {
    font-size: 60px;
}
a,a:visited {text-decoration:none;}
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
    height: .2rem;
}
.h-30 {
    width: 100%;
    height: .3rem;
}

.h-60 {
    width: 100%;
    height: .6rem;
}

.content {
    padding: 0 0.55rem;
    flex: 1;
}
.pleft-86 {
    padding-left: .86rem;
}
.pleft-30 {
    padding-left: .3rem;
}
.content input {
    height: .88rem;
    line-height: .88rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid #dcdcdc;
    border-radius: .1rem;
    box-sizing: border-box;
}

.content .btn {
    width: 100%;
    height: .88rem;
    text-align: center;
    line-height: .88rem;
    background-color: #00ac67;
    color: #fff;
    border-radius: .1rem;
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
    width: .36rem;
    height: .36rem;
    background-repeat: no-repeat;
    background-size: cover;
}
.icon.pwd_icon {
    top: .25rem;
    left: .3rem;
}
.icon.phone_icon {
    top: .25rem;
    left: .3rem;
}
.icon.show_icon {
    top: .25rem;
    right: .3rem;
}
.icon.close_icon {
    top: .25rem;
    right: .3rem;
}

.errorTip {
    position: fixed;
    width: 100%;
    height: .6rem;
    background: rgba(255,60,81,0.7);
    color: #fff;
    text-align: center;
    line-height: .6rem;
    z-index: 10;
    top:0;
    left:0;
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
    height: .88rem;
    line-height: .88rem;
    left: 50%;
    margin-left: -2.1rem;
    top: 50%;
    margin-top: -0.44rem;
    text-align: center;
    color: #fff;
    background: rgba(0,0,0,0.7);
    border-radius: .1rem;
    z-index: 10;
}
.btnGetCode {
    position: absolute;
    width: 2rem;
    height: .3rem;
    line-height: .3rem;
    text-align: center;
    border-left: 1px solid;
    top: 50%;
    margin-top: -0.15rem;
    right: 0;
    color: #00ac67;
    border-left-color: #ccc;
}
.opacity-60 {
    opacity: .6;
}

.ta-center {
    text-align: center;
}
</style>
