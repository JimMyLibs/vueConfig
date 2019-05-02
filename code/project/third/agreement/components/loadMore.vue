<template>
    <div class="pages_loadMore">
        <div class="loadMore_bd" ref="loadMore_bd">
            <div ref="loadMore_list">
                <slot name="list"></slot>
            </div>
            <div ref="loadMore_text" class="loadMore text-center pd_20 f_aaa f26">
                <template v-if="text == 1">正在加载<i class="weui-loading"></i></template>
                <template v-else-if="text == 2">加载更多<i class="weui-loading"></i></template>
                <template v-else-if="text == 3">加载完成</template>                    
                <template v-else-if="text == 4">
                    <slot name="noData" v-if="this.$slots.noData"></slot>
                    <slot v-else>暂无数据</slot>
                </template>                    
                <template v-else-if="text == 5">加载失败</template>                    
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Pages_loadMore extends Vue {
    @Prop() lock!: boolean;
    @Prop() loadOver!: boolean;
    pageName: string = "pages_loadMore";
    text: number = 1;
    mounted() {
        window.addEventListener('scroll', this.scrollRun);// 监听滚动
    }
    destroyed() {
        window.removeEventListener('scroll', this.scrollRun);// 监听滚动dddd
    }
    scrollRun(): void {
        // 加载并渲染完数据
        this.$nextTick(()=>{
            if(this.lock&&this.$refs.loadMore_bd&&this.$refs.loadMore_list){
                const clientWidth: number = document.body.offsetWidth;
                const clientHeight: number = (this.$refs.loadMore_bd as HTMLDivElement).clientHeight*(375/clientWidth);
                const scrollHeight: number = (this.$refs.loadMore_list as HTMLDivElement).scrollHeight*(375/clientWidth);
                const offsetTop: number = (this.$refs.loadMore_text as HTMLDivElement).getBoundingClientRect().top*(375/clientWidth);
                console.log('滚动',offsetTop,scrollHeight,clientHeight,clientHeight-offsetTop)
                if(scrollHeight < 10*(375/clientWidth)){// 没有数据
                    this.text = 4;
                }else if(scrollHeight <= clientHeight || this.loadOver){// 所有数据总高度 < 窗口高度：总数据不满一屏
                    this.text = 3;
                }else{
                    this.text = 2;
                    if(clientHeight-offsetTop>20){//loadMore被拉出底部20px时
                        this.$emit('getMore');
                    }
                }
            }
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_loadMore {
    .loadMore_bd{        
        height: 100vh;
    }
}
</style>
