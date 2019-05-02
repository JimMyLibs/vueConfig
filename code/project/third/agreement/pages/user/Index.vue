<template>
    <div class="user_index">
        <div class="user_hd">
            <div class="hd_corner" :class="[typeName]">
                <div class="msg_tag" @click="$router.push('/message')" v-if="!!msg_tag">{{msg_tag}}</div>
                <img src="../../resource/img/user/icon/msg.png" alt class="corner_msg" @click="$router.push('/message')">
                <img src="../../resource/img/user/icon/set.png" alt class="corner_set" @click="$router.push('/user/set')">
            </div>
            <div class="hd_info">
                <img class="hd_avatar" src="../../resource/img/user/hd_avatar.png" alt>
                <div class="hd_name angleBracket">{{userInfo.realName}}</div>
            </div>
        </div>
        <div class="user_bd">
            <div class="db_cell" @click="$router.push('/message')">
                <img src="../../resource/img/user/icon/myMsg.png" alt="我的消息">
                <span class="angleBracket">我的消息</span>
            </div>
            <!-- <div class="db_cell" @click="$router.push('/user/comments')">
                <img src="../../resource/img/user/icon/myCustomService.png" alt="我的客服">
                <span class="angleBracket">用户留言(废弃)</span>
            </div> -->
            <div class="db_cell" @click="$router.push('/user/myCustomService')" v-if="userType == 1">
                <img src="../../resource/img/user/icon/myCustomService.png" alt="我的客服(客服)">
                <span class="angleBracket">我的客服</span>
            </div>
            <div class="db_cell" @click="$router.push('/user/customService')" v-else>
                <img src="../../resource/img/user/icon/myCustomService.png" alt="我的客服(客户)">
                <span class="angleBracket">我的客服</span>
            </div>
            <!-- 审核状态：0 未填写，1 未审核， 2 审核通过， 3 审核不通过 -->
            <template v-if="userType !== 1">
                <div class="db_cell" @click="$router.push('/user/perfectMyInfo?type=edit')" v-if="materialStatus === 0">
                    <img src="../../resource/img/user/icon/perfectMyInfo.png" alt="完善个人信息">
                    <span class="angleBracket">完善个人信息</span>
                </div>  
                <div class="db_cell" @click="$router.push('/user/checkState')" v-else-if="materialStatus === 1">
                    <img src="../../resource/img/user/icon/perfectMyInfo.png" alt="审核状态">
                    <span class="angleBracket">查看个人信息</span>
                </div>
                <div class="db_cell" @click="$router.push('/user/perfectMyInfo?type=read')" v-else-if="materialStatus === 2">
                    <img src="../../resource/img/user/icon/perfectMyInfo.png" alt="完善个人信息">
                    <span class="angleBracket">查看个人信息</span>
                </div>
                <div class="db_cell" @click="$router.push('/user/perfectMyInfo?type=fail')" v-else-if="materialStatus === 3">
                    <img src="../../resource/img/user/icon/perfectMyInfo.png" alt="审核不通过">
                    <span class="angleBracket">查看个人信息</span>
                </div>
            </template>
            <div class="db_cell" @click="$router.push('/user/editPw')">
                <img src="../../resource/img/user/icon/editPw.png" alt="修改密码">
                <span class="angleBracket">修改密码</span>
            </div>
            <div class="db_cell" @click="$router.push('/user/editUserInfo')">
                <img src="../../resource/img/user/icon/seeMyInfo.png" alt="修改个人信息">
                <span class="angleBracket">修改个人信息</span>
            </div>      
            <!-- 临时调试 -->      
            <div class="devTest f30 text-center flex mg_t_20" v-if="locationHref=='172.21.0.21'||locationHref=='testh5.niiwoo.com'">
                <a class="btn flex1" href="https://weui.io/">weui</a>
                <button class="btn flex1 mg_l_20" @click="reload">刷新页面</button>
            </div>
        </div>
        <Pages_foot/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import Pages_foot from "../../components/foot.vue";

@Component({
    components: {
        Pages_foot
    }
})
export default class User_index extends Mixins(VueMixin) {
    // data
    pageName: string = "user_index";
    tagNum: number = 0;
    typeName = 'web'
    userInfo: any = {
        realName: '',
        materialStatus: 0,// 审核状态：0 未填写，1 未审核， 2 审核通过， 3 审核不通过
        userType: 0,// 用户类型 1、内部员工 2、供应商用户 3、经销商用户	byte
    };
    get userType(): number {
        return this.$user().userType;
    }
    get materialStatus(): number {
        return this.userInfo.materialStatus || this.$user().materialStatus;
    }
    get msg_tag(): number | string {
        return this.tagNum>99?'···':this.tagNum;
    }
    get locationHref(): string {
        return location.hostname;
    }
    mounted() {    
        this.isIphone();// iphone适配
        this.getmsg();// 获取消息        
        this.getUserInfo();// 获取个人信息         
    }
    isIphone(): void {        
        let userAgent = navigator.userAgent.toLowerCase()
        let isIphone = /iphone/g.test(userAgent)
        let isIphoneX = isIphone && (screen.height == 812 && screen.width == 375)
        if(isIphone){
        this.typeName = isIphoneX ? 'iphonex-app' : 'ios-app'
        }else{
        this.typeName = 'android-app'
        }
    }
    reload(): void {
        location.reload();
    }
    getmsg(): void {
        (this as any).$post('app/message/queryPage',{
            // useMock:'hecheng',// 启用mock数据
            timing:this.$dateFormat('yyyy-MM-dd'),
            isRead: 0,// 未读消息 樊跃飞 20190304-10:57
        }).then((res: any): void=>{
            this.tagNum = res.data.totalCount;
        })
    }
    getUserInfo(): void {
        (this as any).$post('app/user/queryById',{
            // useMock:'hecheng',// 启用mock数据
        }).then((res: any)=>{
            this.userInfo = res.data;
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.user_index {
    .user_hd {
        height: 3.07rem;
        background: url(../../resource/img/user/user_hd.png) #2fa1f7 no-repeat center center / 100% 100%;
        .hd_corner {
            position: absolute;
            right: 0.14rem;
            top: 0.1rem;            
            &.ios-app {
                top: 0.4rem; 
            }
            &.iphonex-app {
                top: 0.4rem; 
            }
            .msg_tag {
                /* 角标 */
                position: absolute;
                top: 0;
                left: 0.4rem;
                width: 0.36rem;
                height: 0.36rem;
                background: #f23030;
                border-radius: 50%;
                color: #fff;
                font-size: 0.24rem;
                line-height: 0.36rem;
                text-align: center;
                transform: scale(0.7);
            }
            img {
                padding: 0.14rem;
                &.corner_msg {
                    width: 0.45rem;
                    height: 0.41rem;
                }
                &.corner_set {
                    width: 0.38rem;
                    height: 0.38rem;
                }
            }
        }
        .hd_info {
            position: absolute;
            top: 1.2rem;
            left: 0.2rem;
            right: 0.47rem;
            height: 1.3rem;
            display: flex;
            align-items: center;
            .hd_avatar {
                width: 1.3rem;
                height: 1.3rem;
                border-radius: 50%;
            }
            .hd_name {
                flex: 1;
                color: #fff;
                font-size: 0.32rem;
                margin-left: 0.24rem;
            }
        }
    }
    .user_bd {
        .db_cell {
            display: flex;
            align-items: center;
            height: 1rem;
            margin-top: 0.2rem;
            background: #fff;
            padding: 0 0.38rem 0 0.34rem;
            &:active {
                background: #eee;
            }
            img {
                width: 0.38rem;
                height: 0.38rem;
            }
            span {
                flex: 1;
                font-size: 0.32rem;
                margin-left: 0.22rem;
                &::before {
                    border-color: #333;
                }
            }
        }
    }
}
</style>
