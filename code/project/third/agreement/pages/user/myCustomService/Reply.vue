<template>
    <div class="pages_reply">
        <EleNav :title="'回复留言'">
            <div class="hd_look f28" slot="right" @click="$router.push('/user/myCustomService')">查看</div>
        </EleNav>
        <div class="reply_bd mg_t_20">            
            <textarea
                class="reply_textarea f30 noResize"
                name="replyAdd"
                id="replyAdd"
                rows="10"
                placeholder="说说您的留言"
                maxlength="255"
                v-model="textarea"
            ></textarea>
            <picsUpload id="reply_picUpload" @getPicLIst="getPicLIst" />
        </div>
        <div class="reply_ft text-center">
            <button class="btn" :disabled="!allowSub" @click="submitReply">发布</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';
import picsUpload from '../../../components/picsUpload.vue'

@Component({
    components:{
        EleNav,picsUpload
    }
})
export default class Pages_reply extends Mixins(VueMixin) {
    pageName: string = "pages_reply";
    textarea: string = '';
    picList: string[] = [];
    get allowSub(): boolean {
        return !!this.textarea;
    }
    getPicLIst(res: any): void {
        this.picList = res;
    }
    submitReply(): void {
        this.$post('app/leaveMessage/replay',{
            // useMock:'hecheng',// 启用mock数据
            content:this.textarea,// 内容	body	false	string	
            leaveMessageId:this.$route.query.commentId,// 消息id	body	false	int64	
            photoList:this.picList,// 图片	body	false	array
        }).then((res:any)=>{
            this.$tip('回复成功',500).then(()=>{
                this.$router.back();
            })
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_reply {
    .reply_bd{
        background: #fff;
        .reply_textarea {
            width: 100%;
            border: 0;
            padding: 0.3rem 0.4rem;
            box-sizing: border-box;
        }
        #reply_picUpload{
            .weui-uploader__file{
                margin-right: 0.15rem;
                margin-bottom: 0.15rem;
                width: 2.2rem;
                height: 2.2rem;
            }
            .weui-uploader__input-box {
                margin-right: 0.15rem;
                margin-bottom: 0.15rem;
                width: 2.2rem;
                height: 2.2rem;
                border: 0.02rem dashed #e1e1e1;
                &:before,&:after {
                    background-color: #e1e1e1;
                }
            }
        }
    }
    .reply_ft{
        margin-top: 0.6rem;
    }
}
</style>
