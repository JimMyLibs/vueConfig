<template>
    <div class="pages_myCustomService">
        <EleNav :title="'我的客服'"></EleNav>
        <div class="com_bd">
            <div class="com_list">
                <loadMore ref="loadMore" :lock="loadMore.lock" :loadOver="loadMore.over" @getMore="getComments">
                    <div class="com_slot_list" slot="list">
                        <div class="com_li" v-for="(item,index) in comments.list" :key="index">
                            <div class="com_con bg_fff">
                                <div class="li_con">
                                    <div class="li_hd flex items-center">
                                        <div class="userName f32 flex1">
                                            <span class="nameText">{{item.realName || userInfo.realName}}</span>
                                            <div class="com_time f24">{{item.createTime | dateF('yyyy-MM-dd hh:mm')}}</div>
                                        </div>
                                    </div>
                                    <div class="li_bd f28 overhide3">{{item.askContent}}</div>
                                </div>
                                <div class="li_ft f_blue f28 hb_t_c_b text-right" v-if="item.replyList?!item.replyList.length:true" @click="$router.push({path:'/user/reply',query:{commentId:item.id}})">回复</div>
                            </div>
                            <div class="replyList" v-if="item.replyList?item.replyList.length:false">
                                <div class="replyLi bg_fff" v-for="(cell,j) in item.replyList" :key="j">
                                    <div class="li_con">
                                        <div class="li_hd flex items-end">
                                            <div class="userName f32 flex1">
                                                <span class="nameText">客服{{cell.realName || userInfo.realName}}回复：</span>
                                                <div class="com_time f24">{{cell.createTime | dateF('yyyy-MM-dd hh:mm')}}</div>
                                            </div>
                                        </div>
                                        <div class="li_bd f28">
                                            <div class="reply_con overhide3">
                                                {{cell.askContent}}
                                            </div>
                                            <div class="reply_pic flex wrap">
                                                <previewPic id="reply_previewPic" :picList="cell.imageList" />
                                            </div>
                                        </div>                                        
                                    </div>
                                    <div class="li_ft f_blue f28 hb_t_c_b text-right" @click="$router.push({path:'/user/reply',query:{commentId:item.id}})">继续回复</div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <div class="com_slot_noData text-center" slot="noData">
                        <img src="../../../resource/img/icon/noData.png" alt="">
                        <div class="f30 f_666">暂无留言</div>
                    </div>
                </loadMore>
            </div>
        </div>
        <dialogBox v-if="dialog.show">
            <div class="addComment" slot="dialog_bd">
                <div class="reply_bd">            
                    <textarea
                        class="reply_textarea f30 noResize"
                        name="replyAdd"
                        id="replyAdd"
                        rows="10"
                        placeholder="说说您的留言"
                        maxlength="255"
                        v-model="dialog.textarea"
                    ></textarea>
                </div>
                <div class="reply_ft text-center flex">
                    <button class="btn" @click="dialog.show = false">取消</button>
                    <button class="btn hb_l_c_b" :disabled="!allowSub" @click="submitComment">确定</button>
                </div>  
            </div>
        </dialogBox>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';
import loadMore from '../../../components/loadMore.vue';
import dialogBox from '../../../components/dialogBox.vue';
import previewPic from '../../../components/previewPic.vue'
@Component({
    components:{
        EleNav,loadMore,dialogBox,previewPic
    }
})
export default class Pages_myCustomService extends Mixins(VueMixin) {
    pageName: string = "pages_myCustomService";
    comments:any = {
        total: 0,
        pageNum: 0,
        pageSize: 10,
        list: [],
    }
    loadMore = {
        lock: true,
        over: false,
    }
    dialog = {
        show:false,
        textarea:'',
    }
    get allowSub(): string {        
        return this.dialog.textarea;
    }
    get userInfo() :any {
        return this.$user();
    }
    mounted() {
        this.getComments();
    }
    getComments(pageNum: number = ++this.comments.pageNum): any {
        this.loadMore.lock = false;// 关锁，防止频繁请求
        (this as any).$post("app/leaveMessage/queryList", {
            // useMock:'hecheng',// 启用mock数据
            pageNumber: pageNum,
            pageSize: this.comments.pageSize
        }).then(
            (res: any): void => {
                console.log(`加载第${this.comments.pageNum}页`);
                if (pageNum === 1) {
                    this.comments.list = [];
                }
                this.comments.list.push(...res.data.items);
                this.loadMore.over = pageNum === res.data.totalPage; // 请求完，解开锁
                this.loadMore.lock = true; // 请求完，解开锁
                (this.$refs.loadMore as any).scrollRun();
            }
        );
    }
    submitComment(): void {
        console.log('完成');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_myCustomService {
    .com_bd {
        .com_list {
            .com_li {
                /* 留言&&回复公共样式 */
                .li_con{
                    padding: 0.3rem 0.28rem;
                    .li_hd {
                        .com_time {
                            margin-top: 0.25rem;
                        }
                    }
                    .li_bd {
                        margin-top: 0.5rem;
                    }
                }
                .li_ft{
                    height: 1rem;
                    line-height: 1rem;
                    padding-right:0.4rem;
                }
                /* 留言& */
                .com_con {
                    margin-top: 0.2rem;
                }
                /* 回复 */
                .replyList {
                    .replyLi{
                        margin-top: 0.2rem;
                        .li_con{
                            .li_bd{
                                .reply_pic{
                                    margin-top: 0.3rem;
                                    #reply_previewPic{
                                            padding:0;
                                        .weui-uploader{
                                            padding:0;
                                        }
                                        .weui-uploader__file{
                                            margin-right: 0.15rem;
                                            margin-bottom: 0.15rem;
                                            width: 0.9rem;
                                            height: 0.9rem;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .com_slot_noData{
                img {
                    width: 1.32rem;
                    height: 1.04rem;
                    margin-top: 0.84rem;
                    margin-bottom: 0.5rem;
                }
            }
        }
    }
    .dialog{
        .addComment{            
            z-index: 1001;
            border-radius: 0.1rem;
            width: 5.90rem;
            overflow: hidden;
            .reply_bd{
                background: #fff;
                padding: 0.3rem 0.4rem;
                .reply_textarea {
                    width: 100%;
                    border: 0;
                    box-sizing: border-box;
                }
            }
            .reply_ft{
                border-top: solid 1px #dedede;
                .btn{
                    display: inline-block;
                    width: 100%;
                    height: 0.95rem;
                    background-color: #fff;
                    border-radius: 0;
                    color: #29a1f7;
                    font-size: 0.34rem;
                    line-height: 0.95rem;
                    text-align: center;
                    border: 0;
                    &:disabled{
                        color: #dedede;
                        background-color: #fff;
                    }
                }
            }
        }
    }
}
</style>
