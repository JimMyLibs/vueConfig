<template>
<ActivityStatus :status="status"></ActivityStatus>
</template>
<script>
// 活动状态逻辑组件
import ActivityStatus from 'components/ActivityStatus'
// isShow: 是否显示弹窗
export default {
    components: {
      // 0：未开始，1：进行中，2：已结束
        ActivityStatus
    },
    props: {
        response: {
            type: Object,
            required: true
        }
    },
    computed: {
        status() {
            if (this.response.Data && this.response.Result == 1) {
                return this.response.Data.ActivityList[0].Status
            }
        }
    }
}
</script>
