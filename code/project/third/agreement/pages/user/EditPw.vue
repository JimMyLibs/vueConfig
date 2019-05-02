<template>
    <div class="user_editPw">
        <EleNav :title="'修改密码'"></EleNav>
        <div class="editPw_bd mg_t_20">
            <div class="oldPw">
                <input type="password" v-model="editPw.oldPw" placeholder="请输入旧的密码">
            </div>
            <div class="newPw">
                <input type="password" v-model="editPw.newPw" placeholder="请输入新密码（6-16位大小写字母和数字的组合）">
            </div>
            <div class="checkPw">
                <input type="password" v-model="editPw.checkPw" placeholder="请再次输入新密码">
            </div>
        </div>
        <div class="editPw_ft">
            <button class="btn" :disabled="!allowSub" @click="submitPw">完成</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';
import { reg } from '../../resource/js/regular'

@Component({
    components:{
        EleNav
    }
})
export default class User_editPw extends Mixins(VueMixin) {
    pageName: string = "user_editPw";
    editPw = {
        oldPw: '',
        newPw: '',
        checkPw: '',
    }
    isShow: boolean = false;
    msg: string = "";
    get allowSub(): boolean {        
        // return this.editPw.oldPw&&reg.AzNumEn_2_3.test(this.editPw.newPw)&&reg.AzNumEn_2_3.test(this.editPw.checkPw)&&this.editPw.newPw==this.editPw.checkPw;
        return this.editPw.oldPw&&this.editPw.newPw&&!!this.editPw.checkPw;
    }
    submitPw(): void {
        const allFull: boolean = Object.keys(this.editPw).every(item=>{
            if(!(this.editPw as any)[item]){
                switch(item){
                    case 'oldPw': this.$tip('旧密码不能为空');
                        break;
                    case 'oldPw': this.$tip('新密码不能为空');
                        break;
                    case 'oldPw': this.$tip('确认密码不能为空');
                        break;
                }
            }
            return (this.editPw as any)[item];
        })
        if(allFull){
            if(this.editPw.newPw == this.editPw.checkPw){
                if(reg.AzNumEn_2_3.test(this.editPw.newPw)){
                    this.updatePassword();
                }else{
                    this.$tip('密码必须是6-16位大小写字母和数字的组合');
                } 
            }else{
                this.$tip('新密码与确认密码不一致');
            }            
        }
    }
    updatePassword():void {
        (this as any).$post('app/user/updatePassword',{
            // useMock:'hecheng',// 启用mock数据
            oldPassword:this.editPw.oldPw,
            password:this.editPw.newPw,
        }).then((res: any)=>{
            this.$tip("修改成功").then((res: any)=>{
                (this as any).$router.back()
            })
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.user_editPw {
    .editPw_bd{
        &>div{
            position: relative;
            &:not(:last-child){
                &::before{
                    content:'';
                    position:absolute;
                    display: block;
                    bottom:0;
                    left:0.38rem;
                    right:0.38rem;
                    height:1px;
                    transform: scaleY(0.5);
                    background:#dedede;
                }
            }
            input{
                width:100%;
                height:0.85rem;
                line-height: 0.85rem;
                border:0;
                background:#fff;
                box-shadow: none;
                font-size: 0.28rem;
                padding:0 0.38rem;
            }

        }
    }
    .editPw_ft{
        text-align: center;
        margin-top:0.6rem;
    }
}
</style>
