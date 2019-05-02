<template>
    <div class="user_set">
        <EleNav :title="'设置'"></EleNav>
        <div class="set_bd mg_t_20">
            <div class="db_cell" @click="clearCache">
                <span class="flex1">我的缓存</span>
                <span class="set_mem angleBracket">0.{{cache}}m</span>
            </div>
        </div>
        <div class="set_ft">
            <div class="btn logout" @click="logout">退出登录</div>
        </div>
        <Tip :isShow="isShow" :msg="msg"></Tip>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';
import Tip from 'comm/components/Tip.vue'

@Component({
    components: {
        EleNav,Tip
    }
})
export default class User_set extends Mixins(VueMixin) {
    pageName: string = "user_set";
    cache: number = Math.ceil(Math.random()*100);
    isShow: boolean = false;
    msg: string = '清除成功';
    clearCache(): void {
        this.isShow = true;
        this.cache = 0;
        setTimeout(()=>{
            this.isShow = false;
        },1000)
    }
    logout(): void {
        this.$post('app/logout',{

        }).then((res: any)=>{
            this.$clearUser();
            this.$router.replace('/login');
        }).catch((err: any)=>{
            this.$clearUser();
            this.$router.replace('/login');
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.user_set {
    min-height: 100%;
    .set_bd {
        .db_cell {
            display: flex;
            align-items: center;
            height: 1rem;
            background: #fff;
            padding: 0 0.38rem 0 0.5rem;
            font-size: 0.32rem;
            &:active {
                background: #eee;
            }
            span.flex1 {
                flex: 1;
            }
            span.set_mem {
                padding-right:0.4rem;
                &::before {
                    border-color: #333;
                }
            }
        }
    }
    .set_ft{
        position:absolute;
        bottom:0.6rem;
        left:50%;
        transform: translateX(-50%);
    }
}
</style>
