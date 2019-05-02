<template>
<div>
    <div v-if="len == 0" class="list_status">
      <p class="list_empty">{{text}}</p>
    </div>
    <div v-if="len > 0">
      <slot></slot>
    </div>
</div>
</template>
<script>
/*
 * text: 提示文版,
 * type: loading动画类型
 *           1渐变旋转类型
 *           2旋转小点类型
 */
export default {
    props: {
        text: {
            type: String,
            default: '暂无数据'
        },
        len: {
            type: Number,
            required: true
        }
    }
}
</script>
<style scoped>
.list_status{
  text-align:center;
  padding:1.5rem .2rem;
}
.list_empty{
  background:url('../assets/icon/empty.png') left center no-repeat;
  background-size:auto 100%;
  display:inline-block;
  height:.5rem;
  line-height:.5rem;
  padding-left:.6rem;
  font-size:.3rem;
}
</style>
