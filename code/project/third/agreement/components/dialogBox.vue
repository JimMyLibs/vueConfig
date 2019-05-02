<template>
    <div class="pages_dialogBox">
        <transition name="fade">
            <div class="dialog mask">
                <div class="dialog_panel">
                    <slot name="dialog_hd"></slot>
                    <slot name="dialog_bd"></slot>
                    <slot name="dialog_ft"></slot>
                </div>
                <div class="mask mask65" @touchmove.prevent></div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Pages_dialogBox extends Vue {
    pageName: string = "pages_dialogBox";
    mounted() {
        this.iosFixedInput();
    }
    iosFixedInput(): void {
        this.$nextTick((): void => {
            const textareas: any = this.$el.querySelectorAll('textarea');
            const inputs: any = this.$el.querySelectorAll('input');
            [textareas, inputs].map((arr: NodeList): void =>{
                (arr as any).forEach((item: any, index: number) => {  
                    item.addEventListener('click',(): void =>{
                        setTimeout(()=>{
                            console.log('点击',item)
                            // document.body.scrollTop = 0;
                            textareas[index].scrollIntoView();
                        },0)  
                    })
                });
            })
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_dialogBox {
    .dialog_panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1002;
    }
}
</style>
