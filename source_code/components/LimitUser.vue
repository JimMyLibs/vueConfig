<template>
<Popup :isShow="status == 1" :isShowClose="false">
    <div class="limit_user">
        <h1>亲,您是特殊用户,不能领取奖励哦</h1>
        <p>如有疑问,请联系客服钱小二</p>
        <p>或致电客服热线
            <Tel tel="400-0683-666" className="test"></Tel>
        </p>
    </div>
</Popup>
</template>
<script>
import Popup from 'components/Popup'
import Tel from 'components/Tel'
// isShow: 是否显示弹窗
export default {
    components: {
        Popup,
        Tel
    },
    props: {
        status: {
            type: [String, Number],
            default: 0
        }
    }
}
</script>
<style scoped>
.limit_user {
    padding: .4rem 0;
    text-align: center;
    line-height: 2em;
}

.limit_user h1 {
    font-size: .28rem;
    color: #ff5a57;
    margin-bottom: .2rem;
}

.limit_user p {
    color: #333333;
    font-size: .24rem;
}
</style>
