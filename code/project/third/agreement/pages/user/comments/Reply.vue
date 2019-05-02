<template>
    <div class="pages_reply">
        <div class="reply_hd flex topBar">
            <div class="hd_title flex1 text-center">回复留言</div>
            <div class="hd_look f28" @click="$router.push('/user/comments')">查看</div>
        </div>
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
            <picUpload id="reply_picUpload" @getPicLIst="getPicLIst" />
        </div>
        <div class="reply_ft text-center">
            <button class="btn" :disabled="!allowSub" @click="submitReply">发布</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import picUpload from '../../../components/picsUpload.vue'

@Component({
    components:{
        picUpload
    }
})
export default class Pages_reply extends Mixins(VueMixin) {
    pageName: string = "pages_reply";
    textarea: string = '';
    picList: string[] = [];
    get allowSub(): boolean {
        return this.textarea && !!this.picList.length;
    }
    getPicLIst(res: any): void {
        this.picList = res;
    }
    submitReply(): void {
        console.log('完成');
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
