<template>
<div>
    <!-- 活动尚未开始 -->
    <div v-if="status == 0">
        <Popup :isShow="true" :isShowClose="false">
            <div class="activity-status">
                <h1>活动尚未开始</h1>
            </div>
        </Popup>
    </div>

    <!-- 活动进行中 -->
    <div v-if="status == 1">
        <slot></slot>
    </div>

    <!-- 活动已结束 -->
    <div v-if="status == 2">
        <Popup :isShow="true" :isShowClose="false">
            <div class="activity-status">
                <h1>活动已结束</h1>
            </div>
        </Popup>
    </div>
</div>
</template>
<script>
import Popup from 'components/Popup'
// isShow: 是否显示弹窗
export default {
    components: {
        Popup
    },
    props: {
        status: {
            type: [Number, String],
            default: 3
        }
    }
}
</script>
<style scoped>
.activity-status {
    padding: 1rem 0;
    text-align: center;
    h1 {
        font-size: .28rem;
        color: #ff5a57;
    }
}
</style>
