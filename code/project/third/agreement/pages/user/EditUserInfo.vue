<template>
    <div class="user_editUserInfo">
        <EleNav :title="'修改个人信息'"></EleNav>
        <div class="editUserInfo_bd mg_t_20">
            <div class="realName halfBorder">
                <label for="realName">姓名</label>
                <input type="text" id="realName" v-model="userInfo.realName" placeholder="请输入姓名">
            </div>
            <div class="sex halfBorder">
                <label for="sex">性别</label>
                <select name="sex" id="sex" v-model="userInfo.gender">
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>
                <div class="sex_ft angleBracket"></div>
            </div>
            <div class="phone">
                <label for="phone">电话号码</label>
                <input
                    type="text"
                    id="phone"
                    maxlength="11"
                    v-model="userInfo.mobile"
                    @input="phoneCheck($event)"
                    placeholder="请输入电话号码"
                >
            </div>
        </div>
        <div class="editUserInfo_ft">
            <button class="btn" :disabled="!allowSub" @click="submitUserInfo">完成</button>
        </div>
        <!-- <selector :show="sex.show" :sexList="sex.list" :selected="userInfo.gender" @change-select="changeSelect" @close-select="closeSelect" /> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import EleNav from "comm/components/EleNav.vue";
import selector from "../../components/selector.vue";
import { reg } from "../../resource/js/regular";

@Component({
    components: {
        selector,
        EleNav
    }
})
export default class User_editUserInfo extends Mixins(VueMixin) {
    pageName: string = "user_editUserInfo";
    userInfo = {
        realName: "",
        gender: "1",
        mobile: ""
    };
    isShow: boolean = false;
    msg: string = "";
    sex: any = {
        show: false,
        list: [{ key: 1, value: "男" }, { key: 2, value: "女" }]
    };
    get allowSub(): boolean {
        return (
            this.userInfo.realName &&
            this.userInfo.gender &&
            reg.phone.test(this.userInfo.mobile)
        );
    }
    mounted() {
        this.getUserInfo(); // 获取个人信息
    }
    phoneCheck(e: any): void {
        this.userInfo.mobile = e.target.value.replace(/[^\d]/g, "");
    }
    closeSelect(): void {
        this.sex.show = false;
    }
    changeSelect(item: any): void {
        // console.table(Object.entries(item));
        this.userInfo.gender = item.key;
        this.sex.show = false;
    }
    submitUserInfo(): void {
        (this as any).$post("app/user/update", {
            // useMock:'hecheng',// 启用mock数据
            realName: this.userInfo.realName,
            gender: this.userInfo.gender,
            mobile: this.userInfo.mobile
        })
        .then((res: any) => {
            this.$tip("修改成功",1000).then((res: any)=>{
                (this as any).$router.back()
            })
        });
    }
    getUserInfo(): void {
        (this as any).$post("app/user/queryById",{
            // useMock:'hecheng',// 启用mock数据
        })
        .then((res: any) => {
            if(res.data){
                this.userInfo = res.data;
            }
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.user_editUserInfo {
    .editUserInfo_bd {
        & > div {
            position: relative;
            display: flex;
            align-items: center;
            background: #fff;
            font-size: 0.3rem;
            height: 0.85rem;
            label {
                width: 2rem;
                padding-left: 0.28rem;
            }
            input,
            select {
                width: 100%;
                height: 0.85rem;
                line-height: 0.85rem;
                border: 0;
                background: #fff;
                box-shadow: none;
                font-size: 0.3rem;
                padding: 0 0.38rem;
                text-align: right;
                flex: 1;
            }
            .sex_ft {
                width: 0.2rem;
                height: 0.85rem;
                &::before {
                    right: 0.2rem;
                    border-color: #dedede;
                }
            }
        }
    }
    .editUserInfo_ft {
        text-align: center;
        margin-top: 0.6rem;
    }
}
</style>
