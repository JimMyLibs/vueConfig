<template>
<LimitUser :status="status"></LimitUser>
</template>
<script>
// 是否为限制用户逻辑组件
import LimitUser from 'components/LimitUser'
// isShow: 是否显示弹窗
export default {
    components: {
      // 0：未开始，1：进行中，2：已结束
        LimitUser
    },
    props: {
        response: {
            type: Object,
            required: true
        }
    },
    computed: {
        // 0：不是限制用户，1：是限制用户
        status() {
            if (this.response.Data && this.response.Result == 1) {
              return this.response.Data.LimitStatus
            }else{
              return 0
            }
        }
    }
}
</script>
