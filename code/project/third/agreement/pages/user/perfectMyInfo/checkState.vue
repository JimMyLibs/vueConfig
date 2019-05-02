<template>
    <div class="pages_checkState text-center">
        <EleNav :title="'审核状态'"></EleNav>
        <div class="checkState">
            <img src="../../../assets/empty.png" alt="">
            <div class="state_text f30 f_666">您的资料正在审核中...</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from "comm/components/EleNav.vue";

@Component({
    components: {
        EleNav
    }
})
export default class Pages_checkState extends Mixins(VueMixin) {
    pageName: string = "pages_checkState";
    mounted() {
        this.getMyInfo();
    }
    getMyInfo(): void {
        this.$post('app/company/queryDetail',{   
            // useMock:'hecheng',// 启用mock数据   
        }).then((res: any)=>{
            let { respCode, data: { materialStatus }, errorMessage } = res;       
            // 审核状态：0 未填写，1 未审核， 2 审核通过， 3 审核不通过        
            this.$user({materialStatus});// 更新资料状态
            if (materialStatus == 0) {
                this.$router.replace("/user/perfectMyInfo?type=edit");
            }else if(materialStatus == 1){
                this.$router.replace("/user/checkState");
            }else if(materialStatus == 2){
                this.$router.replace("/");
            }else if(materialStatus == 3){
                this.$router.replace("/user/perfectMyInfo?type=fail");
            }
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_checkState {
    .checkState{
        margin-top:0.8rem;
        img{
            width: 1.5rem;
        }
        .state_text{
            margin-top:0.3rem;
        }
    }
}
</style>
