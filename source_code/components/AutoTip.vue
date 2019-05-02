<template>
<Tip :isShow="isShowTip" :msg="msg.text">
</Tip>
</template>
<script>
import Tip from 'components/Tip'
export default {
    components: {
        Tip
    },
    props: {
        // 提示信息
        // 必须是对象的形式，要不同一个提示字符串，不能再次提示
        msg: {
            type: Object,
            required: true,
            default () {
                return {
                    text: ''
                }
            }
        }
    },
    data() {
        // 是否显示提示
        return {
            isShowTip: false
        }
    },
    methods: {
        // 显示提示，2秒后自动消失
        startShow() {
            clearTimeout(this.timer)
            // 还需要完善动画
            this.isShowTip = true
            this.timer = setTimeout(() => {
                this.isShowTip = false
            }, 2000)
        }
    },
    watch: {
        // 监测输入msg的变化，改变则显示提示语
        // 注意这里输入msg比如是对象形式，若为字符串，同一个字符串不能连续提示
        msg() {
            if (this.msg.text) {
                this.startShow()
            }
        }
    }
}
</script>
