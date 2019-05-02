<template>
<div>
    <div v-if="type==1">
        <div class="loading_block"></div>
        <div class="loading_content">
            <div class="spinning_page_loading"></div>
        </div>
    </div>
    <div v-if="type==2">
        <div class="loading_block"></div>
        <div class="loading_content">
            <div class="spokes_page_loading"></div>
        </div>
    </div>
    <div class="loading" v-if="type==3">
      <span class="loading_spinning">{{text}}</span>
    </div>
    <div class="loading" v-if="type==4">
      <span class="loading_spokes">{{text}}</span>
    </div>
</div>
</template>
<script>
/*
 * text: 提示文字,
 * type: loading类型
 *           1页面渐变旋转类型
 *           2页面旋转小点类型
 *           3局部渐变旋转类型
 *           4局部旋转小点类型
 */
export default {
    props: {
        text: {
            type: String,
            default: '正在加载…'
        },
        type: {
            type: [Number, String],
            default: 1
        }
    }
}
</script>
<style scoped>
.loading {
    text-align: center;
    padding: .5rem 0;
    font-size: .3rem;
    line-height: .5rem;
}

.loading_spokes,
.loading_spinning {
    background-size: .9rem .9rem;
    padding-left: .7rem;
    display: inline-block;
    height: .5rem;
}

.loading_spokes {
    background: url('../assets/loading-spokes.svg') left center no-repeat;
}

.loading_spinning {
    background: url('../assets/loading-spinning-bubbles.svg') left center no-repeat;
}

.loading_block {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9996;
}

.loading_content {
    position: fixed;
    width: 1.6rem;
    height: 1.6rem;
    left:50%;
    top:50%;
    margin-top:-.8rem;
    margin-left:-.8rem;
    z-index: 9996;
    background: rgba(0, 0, 0, .3);
    border-radius: .3rem;
}

.spokes_page_loading,
.spinning_page_loading {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 56% auto;
    background-position: center center;
}

.spokes_page_loading {
    background-image: url('../assets/loading-spokes.svg');
}

.spinning_page_loading {
    background-image: url('../assets/loading-spinning-bubbles.svg');
}
</style>
