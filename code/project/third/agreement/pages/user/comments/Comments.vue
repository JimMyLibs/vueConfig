<template>
    <div class="pages_comments">
        <div class="com_hd">
            <div class="com_tab topBar">
                <div
                    class="tab_li"
                    v-for="(item,index) in tab.list"
                    :key="index"
                    :class="{'active':tab.active==item.value}"
                    @click="tab.active = item.value"
                >{{item.name}}</div>
            </div>
        </div>
        <div class="com_bd">
            <div class="com_list" v-show="tab.active == 1">
                <loadMore ref="loadMore" :lock="loadMore.lock" @getMore="getComments">
                    <div class="com_slot_list" slot="list">
                        <div class="com_li bg_fff" v-for="(item,index) in comments.total" :key="index">
                            <div class="com_con">
                                <div class="li_hd flex items-center">
                                    <div class="userName f32 flex1">
                                        <label class="userName f_999">用户名：</label>
                                        <span class="nameText">xxx</span>
                                        <div class="com_time f24">2018-01-10 12:00</div>
                                    </div>
                                    <div class="btn_reply f_blue text-center" @click="$router.push({path:'/user/reply',query:{commentId:100}})">回复</div>
                                </div>
                                <div class="li_bd f28 overhide3">一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十</div>
                            </div>
                            <div class="replyLIst" v-if="item%3==0">
                                <div class="reply_title f_blue f28">回复：</div>
                                <div class="li_hd flex items-end">
                                    <div class="userName f32 flex1">
                                        <div class="com_time f24">2018-01-10 12:00</div>
                                    </div>
                                    <div class="btn_reply f_blue text-center" @click="$router.push({path:'/user/reply',query:{commentId:100}})">回复</div>
                                </div>
                                <div class="li_bd f28 overhide3">一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十</div>
                            </div>
                        </div>                        
                    </div>
                    <div class="com_slot_noData text-center" slot="noData">
                        <img src="../../../resource/img/icon/noData.png" alt="">
                        <div class="f30 f_666">暂无留言，试试新建个留言</div>
                    </div>
                </loadMore>
            </div>
            <div class="com_add" v-show="tab.active == 2">
                <textarea
                    class="add_textarea mg_t_20 f30 noResize"
                    name="commentAdd"
                    id="commentAdd"
                    rows="10"
                    placeholder="说说您的留言"
                    maxlength="255"
                    v-model="textarea"
                ></textarea>
                <div class="add_ft text-center">
                    <button class="btn" :disabled="!allowSub" @click="submitComment">发布</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import loadMore from '../../../components/loadMore.vue';
@Component({
    components:{
        loadMore
    }
})
export default class Pages_comments extends Mixins(VueMixin) {
    pageName: string = "pages_comments";
    tab = {
        list:[
            { name:'用户留言',value:'1'},
            { name:'留言',value:'2'},
        ],
        active: 1,
    }
    comments = {
        total: 0,
        pageNum: 0,
        pageSize: 10,
    }
    loadMore = {
        lock: true,
    }
    textarea: string = '';
    get allowSub(): string {        
        return this.textarea;
    }
    mounted() {
        this.getComments();
    }
    getComments(pageNum: number = ++this.comments.pageNum): any {
        this.loadMore.lock = false;// 关锁，防止频繁请求
        setTimeout(()=>{
            if(1){// 请求成功
                console.log(`加载第${this.comments.pageNum}页`);
                // this.comments.total++;
                this.loadMore.lock = true;// 请求完，解开锁   
                (this.$refs.loadMore as any).scrollRun();             
            }else{// 请求失败
                
            }
        },1000)
    }
    submitComment(): void {
        console.log('完成');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_comments {
    padding-top: 0.74rem;
    .com_hd {
        .com_tab {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            text-align: center;
            padding: 0 1.5rem;
            .tab_li {
                flex: 1;
                margin: 0 0.1rem;
                &.active {
                    border-bottom: 0.04rem solid #29a1f7;
                }
            }
        }
    }
    .com_bd {
        .com_list {
            .com_li {
                .com_con {
                    margin-top: 0.2rem;
                    padding: 0.36rem 0.28rem;
                }
                .li_hd {
                    .com_time {
                        margin-top: 0.25rem;
                    }
                    .btn_reply {
                        width: 1.49rem;
                        height: 0.48rem;
                        line-height: 0.48rem;
                        background-color: #e9f5fe;
                        border-radius: 0.24rem;
                    }
                }
                .li_bd {
                    margin-top: 0.5rem;
                }
                .replyLIst {
                    padding: 0.3rem 0.28rem;
                    border-top: 1px solid #dadada;
                }
            }
            .com_slot_noData{
                img {
                    width: 1.32rem;
                    height: 1.04rem;
                    opacity: 0.4;
                    margin-top: 0.84rem;
                    margin-bottom: 0.5rem;
                }
            }
        }
    }
    .com_add {
        .add_textarea {
            width: 100%;
            border: 0;
            padding: 0.3rem 0.4rem;
            box-sizing: border-box;
        }
        .add_ft {
            margin-top: 0.44rem;
        }
    }
}
</style>
