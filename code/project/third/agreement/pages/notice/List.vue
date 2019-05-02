    <template>
    <div class="pages_noticeList">
        <EleNav :title="'公告列表'"></EleNav>
        <div class="notice_hd">
            <div class="query_bd">
                <div class="query_date flex items-center">
                    <label for="date">时间：</label>
                    <input type="date" v-model="date" placeholder="请选择">
                </div>
                <div class="query_text flex items-center">
                    <label for="date">内容：</label>
                    <input type="text" v-model="text" placeholder="请输入">
                </div>
            </div>
            <div class="editPw_ft">
                <button class="btn" :disabled="!allowSub" @click="getNotice(1)">查询</button>
            </div>
        </div>
        <div class="notice_bd mg_t_20">
            <loadMore ref="loadMore" :lock="loadMore.lock" :loadOver="loadMore.over" @getMore="getNotice">
                <div class="com_slot_list" slot="list">
                    <div
                        class="com_li bg_fff hb_b_c_b flex items-center"
                        v-for="(item,index) in notice.list"
                        :key="index"
                        @click="$router.push({path:'/notice/detail',query:{noticeId:item.id}})"
                    >
                        <div class="li_hd flex1 overhide f30 f_000">{{item.title}}</div>
                        <div class="li_bd text-right f24 f_999">{{item.createTime | dateF('yyyy-MM-dd')}}</div>
                    </div>
                </div>
                <div class="com_slot_noData text-center" slot="noData">
                    <img src="../../resource/img/icon/noData.png" alt>
                    <div class="f30 f_666">暂无数据</div>
                </div>
            </loadMore>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import EleNav from "comm/components/EleNav.vue";
import loadMore from "../../components/loadMore.vue";

@Component({
    components: {
        EleNav,
        loadMore
    }
})
export default class Pages_noticeList extends Mixins(VueMixin) {
    pageName: string = "pages_noticeList";
    date: string = "";
    text: string = "";
    notice: any = {
        list: [],
        total: 15,
        pageNum: 0,
        pageSize: 10
    };
    loadMore = {
        lock: true,
        over: false,
    };
    get allowSub(): boolean {
        return true;
        // return this.pageName && !!this.text;
    }
    mounted() {
        // this.date = this.$dateFormat("yyyy-MM-dd");
        this.getNotice();
    }
    getNotice(pageNum: number = ++this.notice.pageNum): any {
        this.loadMore.lock = false; // 关锁，防止频繁请求
        (this as any).$post("app/noticeMessage/queryPage", {
            // useMock:'hecheng',// 启用mock数据
            pageNumber: pageNum,
            pageSize: this.notice.pageSize,
            startTime: this.date,
            sendContent: this.text
        }).then(
            (res: any): void => {
                console.log(`加载第${this.notice.pageNum}页`);
                if (pageNum === 1) {
                    this.notice.list = [];
                }
                this.notice.list.push(...res.data.items);
                this.loadMore.over = pageNum === res.data.totalPage; // 请求完，解开锁
                this.loadMore.lock = true; // 请求完，解开锁
                (this.$refs.loadMore as any).scrollRun();
            }
        );
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_noticeList {
    .notice_hd {
        background: #fff;
        .query_bd {
            & > div {
                position: relative;
                font-size: 0.28rem;
                padding: 0 0.38rem;
                &::before {
                    content: "";
                    position: absolute;
                    display: block;
                    bottom: 0;
                    left: 0.38rem;
                    right: 0.38rem;
                    height: 1px;
                    transform: scaleY(0.5);
                    background: #dedede;
                }
                input {
                    height: 0.85rem;
                    line-height: 0.85rem;
                    border: 0;
                    background: #fff;
                    box-shadow: none;
                    font-size: 0.28rem;
                }
            }
        }
        .editPw_ft {
            text-align: center;
            padding: 0.3rem 0;
            .btn {
                width: 1.49rem;
                height: 0.64rem;
                line-height: 0.64rem;
                border-radius: 0.32rem;
                font-size: 0.28rem;
            }
        }
    }
    .notice_bd {
        .com_li {
            height: 0.97rem;
            padding: 0 0.3rem;
            .li_bd {
                width: 2rem;
            }
        }
        .com_slot_noData {
            img {
                width: 1.32rem;
                height: 1.04rem;
                margin-top: 0.84rem;
                margin-bottom: 0.5rem;
            }
        }
    }
}
</style>
