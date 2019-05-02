<template>
    <div class="comm_foot" v-if="isShow">
        <div class="pages_foot">
            <router-link to="/" class="nav-item home">主页</router-link>
            <router-link to="/agreement/list" class="nav-item contract">合同管理</router-link>
            <router-link to="/user" class="nav-item my">我的</router-link>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Pages_foot extends Vue {
    @Prop({ default: true }) isShow: boolean;
}
</script>
<style lang="scss" scoped>
.pages_foot {
    display: flex;
    align-items: center;
    width: 100%;
    height: 1rem;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    .nav-item {
        flex: 1;
        box-sizing: border-box;
        height: 0.69rem;
        padding-top: 0.5rem;
        color: #cfcfcf;
        font-size: 0.2rem;
        &.home {
            background: url(../resource/img/foot/home.png) no-repeat center top /
                0.43rem 0.43rem;
        }
        &.contract {
            background: url(../resource/img/foot/contract.png) no-repeat center
                top / 0.43rem 0.43rem;
        }
        &.my {
            background: url(../resource/img/foot/my.png) no-repeat center top /
                0.43rem 0.43rem;
        }
        &.router-link-exact-active,
        &:active {
            color: #29a1f7;
            &.home {
                background: url(../resource/img/foot/home-active.png) no-repeat
                    center top / 0.43rem 0.43rem;
            }
            &.contract {
                background: url(../resource/img/foot/contract-active.png)
                    no-repeat center top / 0.43rem 0.43rem;
            }
            &.my {
                background: url(../resource/img/foot/my-active.png) no-repeat
                    center top / 0.43rem 0.43rem;
            }
        }
    }
}
.comm_foot {
    &::before {
        content: "";
        display: block;
        width: 100%;
        height: 1rem;
    }
}
</style>

