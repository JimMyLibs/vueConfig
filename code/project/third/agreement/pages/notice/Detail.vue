<template>
    <div class="pages_noticeDetail">
        <EleNav :title="'公告详情'"></EleNav>
        <div class="detail_bd bg_fff mg_t_20">
            <div class="detail_title f36 f_000">
                {{noticeDetail.title}}
            </div>
            <div class="detail_date f28">
                {{noticeDetail.date}}
            </div>
            <div class="detail_con f30">
                {{noticeDetail.con}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';

@Component({
    components:{
        EleNav
    }
})
export default class Pages_noticeDetail extends Mixins(VueMixin) {
    pageName: string = "pages_noticeDetail";
    noticeDetail:any = {
        title:'',
        date:'',
        con:'',
    }
    mounted() {
        this.getNoticeDetail();
    }
    getNoticeDetail(): void {
        (this as any).$post('app/noticeMessage/queryDetail',{
            // useMock:'hecheng',// 启用mock数据
            id: (this as any).$route.query.noticeId
        }).then((res : any)=>{
            this.noticeDetail.title = res.data.title;
            this.noticeDetail.date = res.data.createTime;
            this.noticeDetail.con = res.data.sendContent;
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_noticeDetail {
    .detail_bd{
        padding: 0.55rem 0.6rem;
        .detail_date{
            margin-top:0.3rem;
            color: #b8b8b8;
        }
        .detail_con{
            margin-top:0.4rem;
            color: #060606;  
        }
    }
}
</style>
