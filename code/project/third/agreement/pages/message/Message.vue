<template>
    <CommPage :isShowNav="false" :isShowLine="false">
        <NavBox :isShow="true">
            <div class="nav-left">
                <Back/>
            </div>
            <h1 class="nav-center ellipsis">消息</h1>
            <div class="nav-right" v-if="isDone && items.length > 0">
                <span @click="allDelete">清空</span>
                <span @click="allRead">全部已读</span>
            </div>
        </NavBox>

        <ul class="message-list" v-if="isDone && items.length > 0">
            <li
                v-for="({createTime, id, isRead, sendContent, title}) in items"
                :key="id"
                @click="oneRead(id,isRead)"
            >
                <p class="time">{{createTime|dateF('MM月dd日')}}</p>
                <div class="info">
                    <p class="ellipsis f_333">{{title}}</p>
                    <p class="three-ellipsis">{{sendContent}}</p>
                </div>
                <p class="status" v-if="isRead == 1">已读</p>
                <p class="status orange" v-else>未读</p>
            </li>
        </ul>

        <p class="load-more" v-if="isLoadingMore">加载更多…</p>

        <div class="empty-list" v-if="isDone && items.length === 0">
            <p>
                <img src="../../assets/empty.png">
            </p>
            <p>暂无数据...</p>
        </div>

        <Scroll @scrollFn="getList"></Scroll>
    </CommPage>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import NavBox from "comm/components/NavBox.vue";
import Back from "comm/components/Back.vue";
import CommPage from "../../components/CommPage.vue";
import Popup from "comm/components/Popup.vue";
import Scroll from "../../components/Scroll.vue";

@Component({
    components: {
        CommPage,
        Back,
        NavBox,
        Popup,
        Scroll
    }
})
export default class FetchPage extends Mixins(VueMixin) {
    pageNumber: number = 1;
    pageSize: number = 10;
    totalPage: number = 0;
    totalCount: number = 0;
    items: any[] = [];
    isLoadingMore: boolean = false;
    isDone: boolean = false;

    mounted() {
        this.getList(false);
    }

    getList(isMore = true) {
        let { pageNumber, pageSize, totalPage, items, isLoadingMore } = this;

        if (isLoadingMore) {
            return true;
        }

        if (isMore) {
            pageNumber = pageNumber + 1;
            if (pageNumber > totalPage) {
                return false;
            }
            this.isLoadingMore = true;
        } else {
            pageNumber = 1;
        }

        this.$post("app/message/queryPage", {
            // useMock: "xiewen",
            pageNumber,
            pageSize
        }).then((res: any) => {
            let { totalPage, totalCount, items: newItems } = res.data;
            this.totalPage = totalPage;
            this.totalCount = totalCount;
            this.pageNumber = pageNumber;
            if (isMore) {
                this.isLoadingMore = false;
                this.items = [...items, ...newItems];
            } else {
                this.items = [...newItems];
                this.isDone = true;
            }
        });
    }

    allDelete() {
        this.$post("app/message/allDelete", {
            // useMock: 'xiewen',
        }).then((res: any) => {
            this.getList(false);
        });
    }

    allRead() {
        this.$post("app/message/allRead", {
            // useMock: 'xiewen',
        }).then((res: any) => {
            this.getList(false);
        });
    }

    oneRead(id: string,isRead: number): void {
        if (isRead != 1) {
            this.$post("app/message/oneRead", {
                // useMock: 'xiewen',
                id
            }).then((res: any) => {
                this.getList(false);
            });
        }
    }

    toDetail(id: string | number) {
        this.$router.push({
            path: "/agreement/Detail",
            query: {
                id: `${id}`
            }
        });
    }

    goBack() {
        window.history.go(-1);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.nav-left {
    min-width: 1rem;
    max-width: 7em;
    height: 100%;
    display: flex;
    justify-content: flex-start;
}

.nav-center {
    flex: 1;
    text-align: center;
    font-size: 0.36rem;
}

.nav-right {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    span:last-child {
        margin-left: 0.3rem;
    }
}

.message-list {
    margin-bottom: 0.2rem;
    color: #666666;
    font-size: 0.32rem;
    li {
        margin-top: 0.2rem;
        background: #fff;
        .time {
            text-align: center;
            font-size: 0.28rem;
            color: #999999;
            padding: 0.3rem 0 0 0;
        }
        .info {
            padding: 0.42rem 0 0.36rem 0.34rem;
            margin-right: 0.34rem;
            border-bottom: solid 1px #e1e1e1;
            p {
                padding-right: 0.6rem;
            }
            p:first-child {
                padding-bottom: 0.1rem;
            }
            /* Jim：因原型有错，消息列表没有详情页，不可点击，所以去掉箭头 */
            /* background: url(../../assets/arrow.png) right center no-repeat; */
            /* background-size: 0.26rem auto; */
        }
        .status {
            font-size: 0.32rem;
            color: #999999;
            padding: 0.25rem 0.34rem;
        }
        .orange {
            color: #ff6600;
        }
    }
}
.empty-list {
    padding: 0.8rem 0;
    text-align: center;
    font-size: 0.3rem;
    color: #333333;
    img {
        width: 1.5rem;
    }
    p:last-child {
        margin-top: 0.3rem;
    }
}

.three-ellipsis {
    max-height: 3.1em;
    overflow: hidden;
}
.load-more {
    text-align: center;
    line-height: 3em;
}
</style>
