<template>
    <div class="pages_selector">
        <div class="select_panel" :class="{'wh100':show}">
            <transition name="slideUp">
                <div class="select_ul" v-if="show">
                    <div class="select_li halfBorder" :class="{'active':selected==item.key}" v-for="(item,index) in sexList" :key="index" @click="changeSelect(item)">{{item.key}}</div>
                </div>
            </transition>
            <transition name="fade">
                <div class="select_mask" v-if="show" @click="closeSelect"></div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class Pages_selector extends Vue {
    pageName: string = "pages_selector";
    @Prop() show: boolean;
    @Prop() sexList: any[];
    @Prop() selected: string;
    @Emit()
    changeSelect(item: any): void {}
    @Emit()
    closeSelect(): void {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_selector {
    .select_panel{  
        &.wh100{
            position:fixed;
            top:0;
            bottom:0;
            left:0;
            right:0;
            z-index: 1000;
        }
        .select_ul{
            position:fixed;
            bottom:0;
            left:0;
            width:100%;
            background:#fff;
            z-index: 1001;
            padding-left:0.2rem;
            .select_li{
                height:1rem;
                line-height: 1rem;
                position:relative;
                text-indent:0.1rem;
                font-size:0.3rem;
                &.active{
                    &::after{
                        content: '';
                        position:absolute;
                        top:50%;
                        margin-top:-0.2rem;
                        right:0.6rem;
                        width:0.35rem;
                        height:0.18rem;
                        border-top:1px solid #29a1f7;
                        border-right:1px solid #29a1f7;
                        transform: rotate(135deg);
                    }
                }
            }
        }
        .select_mask{
            position:fixed;
            top:0;
            bottom:0;
            left:0;
            right:0;
            z-index: 1000;
            background:rgba($color: #000000, $alpha: 0.65);
        }
    }
}
</style>
