<template>
    <div class="pages_index f30">
        <div class="index_hd">
            <div class="swiper-indexHd">
                <swiper class="swiper-wrapper" :options="swiperOption1">
                    <swiper-slide>
                        <img
                            class="wh100"
                            src="../../resource/img/index/swiper/1.png"
                            @click="$router.push('/CompanyProfile')"
                            alt
                        >
                    </swiper-slide>
                    <swiper-slide>
                        <img
                            class="wh100"
                            src="../../resource/img/index/swiper/2.jpg"
                            @click="$router.push('/CompanyProfile')"
                            alt
                        >
                    </swiper-slide>
                    <swiper-slide>
                        <img
                            class="wh100"
                            src="../../resource/img/index/swiper/3.jpg"
                            @click="$router.push('/CompanyProfile')"
                            alt
                        >
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
        </div>
        <div class="index_grid flex items-center wrap bg_fff text-center">
            <div class="grid_item" @click="$router.push({path:'/agreement/list'})">
                <img src="../../resource/img/index/htgl.png" alt="合同管理">
                <div class="grid_title f26 f_666">合同管理</div>
            </div>
            <div class="grid_item" @click="$router.push({path:'/review/list'})">
                <img src="../../resource/img/index/htsp.png" alt="合同审批">
                <div class="grid_title f26 f_666">合同审批</div>
            </div>
            <div class="grid_item" @click="$router.push({path:'/check/list'})">
                <img src="../../resource/img/index/hdzd.png" alt="核对账单">
                <div class="grid_title f26 f_666">核对账单</div>
            </div>
            <div class="grid_item" @click="$router.push({path:'/message'})">
                <img src="../../resource/img/index/xx.png" alt="消息">
                <div class="grid_title f26 f_666">消息</div>
            </div>
            <div class="grid_item" @click="$router.push({path:'/user/myCustomService'})" v-if="userType == 1">
                <img src="../../resource/img/index/kf.png" alt="我的客服(客服)">
                <div class="grid_title f26 f_666">客服</div>
            </div>
            <div class="grid_item" @click="$router.push({path:'/user/customService'})" v-else>
                <img src="../../resource/img/index/kf.png" alt="我的客服(客户)">
                <div class="grid_title f26 f_666">客服</div>
            </div>
        </div>
        <div
            class="index_notice hb_t_c_b bg_fff flex items-center"
            v-if="noticeList.length"
            @click="$router.push('/notice')"
        >
            <img class="notice_img mg_r_20" src="../../resource/img/index/notice.png" alt="公告">
            <div class="swiper-notice">
                <swiper class="swiper-wrapper" :options="swiperOption2">
                    <swiper-slide
                        class="swiper-slide notice_item flex items-center"
                        v-for="(item,index) in noticeList"
                        :key="index"
                        @click="$router.push({path:'/notice/detail',query:{noticeId:item.id}})"
                    >
                        <div class="notice_title overhide flex1 f26">{{item.title}}</div>
                        <div
                            class="notice_date text-right f22"
                        >{{item.createTime | dateF('yyyy-MM-dd')}}</div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div
            class="index_msg bg_fff mg_t_15"
            v-if="msgList.length"
            @click="$router.push('/message')"
        >
            <div class="msg_hd f30 f_666 hb_l_c_b">消息通知</div>
            <div class="msg_list">
                <div class="msg_li hb_t_c_b flex" v-for="(item,index) in msgList" :key="index">
                    <div class="msg_title flex1 f28 f_000 overhide2">{{item.title}}</div>
                    <div
                        class="msg_date f22 text-right"
                    >{{item.createTime | dateF('yyyy-MM-dd hh:mm')}}</div>
                </div>
            </div>
        </div>
        <Pages_foot/>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import Pages_foot from "../../components/foot.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.min.css";

@Component({
    components: {
        Pages_foot,
        swiper,
        swiperSlide
    }
})
export default class Pages_index extends Mixins(VueMixin) {
    pageName: string = "pages_index";
    noticeList: any[] = [];
    msgList: any[] = [];
    swiperOption1: any = {
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination"
        }
    };
    swiperOption2: any = {
        direction: "vertical"
    };
    get userType(): number {
        return this.$user().userType;
    }
    mounted() {
        this.initIndexHd(); // 幻灯片
        this.getNotice(); // 获取公告
        this.getmsg(); // 获取消息
    }
    initIndexHd(): void {
        // 幻灯片
        this.$nextTick(() => {
            // const mySwiper: Swiper = new Swiper(".swiper-indexHd", {
            //     loop: true, // 循环模式选项
            //     // 如果需要分页器
            //     pagination: {
            //         el: ".swiper-pagination"
            //     },
            // });
        });
    }
    initNotice(): void {
        // 公告轮播
        this.$nextTick(() => {
            // const mySwiper: Swiper = new Swiper(".swiper-notice", {
            //     direction: 'vertical', // 垂直切换选项
            //     loop: true, // 循环模式选项
            //     autoplay:true, // 自动切换
            // });
        });
    }
    getNotice(): void {
        (this as any)
            .$post("app/noticeMessage/queryPage", {
                // useMock:'hecheng',// 启用mock数据
            })
            .then(
                (res: any): void => {
                    this.noticeList = res.data.items.slice(0, 5);
                    this.initNotice(); // 公告滚动
                }
            );
    }
    getmsg(): void {
        (this as any)
            .$post("app/message/queryPage", {
                // useMock:'hecheng',// 启用mock数据
                timing: this.$dateFormat("yyyy-MM-dd")
            })
            .then(
                (res: any): void => {
                    this.msgList = res.data.items;
                }
            );
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.pages_index {
    padding-bottom: 1.2rem;
    .index_hd {
        .swiper-indexHd {
            width: 7.5rem;
            height: 3.1rem;
            position: relative;
            overflow: hidden;
        }
    }
    .index_grid {
        padding: 0.02rem 0.24rem;
        .grid_item {
            width: 1.26rem;
            height: 1.68rem;
            padding: 0.2rem 0.54rem;
            img {
                width: 1.26rem;
                height: 1.26rem;
            }
        }
    }
    .index_notice {
        padding: 0 0.2rem 0 0.24rem;
        .notice_img {
            width: 0.33rem;
            height: 0.28rem;
        }
        .swiper-notice {
            width: 100%;
            height: 0.76rem;
            overflow: hidden;
            .notice_item {
                height: 0.76rem;
                .notice_date {
                    width: 1.63rem;
                }
            }
        }
    }
    .index_msg {
        .msg_hd {
            height: 0.68rem;
            line-height: 0.68rem;
            padding-left: 0.43rem;
            &::before {
                left: 0.24rem;
                top: 0.2rem;
                width: 0.08rem;
                height: 0.26rem;
                background-color: #29a1f7;
                border-radius: 0.02rem;
            }
        }
        .msg_list {
            .msg_li {
                padding: 0.24rem 0.38rem 0.24rem 0.45rem;
                .msg_date {
                    width: 2.48rem;
                    color: #a8a8a8;
                }
            }
        }
    }
}
</style>
