<template>
  <a class="normal_button" @click="$emit('clickFn')" :class="[status, className]">{{text}}</a>
</template>
<script>
/*
 * text: 按钮显示文本,
 * clickFn: 点击触发函数,
 * className: 附加class名
 * status: 按钮状态
 *           normal:正常（默认状态）
 *           press:按压时，
 *           disable:不可点击状态
 */

export default {
    props: {
        text: {
            type: String,
            default: '提交'
        },
        clickFn: Function,
        className: String,
        status: {
            type: String,
            default: 'normal'
        }
    }
}
</script>
<style scoped>
.normal_button {
    display: block;
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #ffffff;
    font-size: 0.3rem;
    text-align: center;
    background-color: #ffaa3c;
    border-radius: 0.4rem;
    box-shadow: 0 -0.06rem 0 #e59936 inset;
}
.disable {
    background-color: #e5e1e1;
    box-shadow: 0 -0.06rem 0 #cecaca inset;
}
.normal:active {
    transition: all 0.2s;
    box-shadow: none;
    transform: scale(.9,.9);
}
</style>
