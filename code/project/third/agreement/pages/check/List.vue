<template>
  <CommPage
    :isShowBack="false"
    :isShowFoot="true"
    :isShowLine="true"
    title="核对账单列表"
  >
    <ul class="tab-list">
      <li :class="{active: receiveStatus == 0}">
        <a @click="changeTab(0)">待核对账单</a>
      </li>
      <li :class="{active: receiveStatus == 1}">
        <a @click="changeTab(1)">已核对账单</a>
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-item">
        <div class="item-section form-section">
          <ul class="form-list">
            <li>
              <p>合同名称：</p>
              <p>
                <input
                  type="text"
                  placeholder="请输入"
                  v-model="billTitle"
                  maxlength="20"
                >
              </p>
            </li>
            <li>
              <p>签收时间：</p>
              <div class="date-line">
                <input
                  type="date"
                  v-model="startTime"
                  placeholder="请输入"
                >
                <span>-</span>
                <input
                  type="date"
                  v-model="endTime"
                  placeholder="请输入"
                >
              </div>
            </li>
          </ul>
          <p class="list-button">
            <a
              class="form-button"
              @click="getList(false)"
            >查看</a>
          </p>
        </div>

        <div
          class="item-section"
          v-if="isDone && items.length > 0"
          v-for="item in items"
          @click="toDetail(item.id)"
        >
          <h2 class="gfht">{{item.billTitle}}</h2>
          <div class="section-info">
            <ul class="info-list">
              <li>
                <p>时间</p>
                <p>{{item.createTime|dateF('yyyy-MM-dd')}}</p>
              </li>
              <li>
                <p>{{item.receiveStatus == 1 ? '已核对账单' : '待核对账单'}}</p>
              </li>
            </ul>
            <a
              class="form-button no-bg"
            >查看</a>
          </div>
        </div>
      </div>

      <p
        class="load-more"
        v-if="isLoadingMore"
      >加载更多…</p>

      <div
        class="empty-list text-center pd_20"
        v-if="isDone && items.length === 0"
      >
        <p>
          <img src="../../assets/no_data.png">
        </p>
        <p>暂无相关账单...</p>
      </div>
    </div>

    <Scroll @scrollFn="getList"></Scroll>
  </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import CommPage from "../../components/CommPage.vue";
import Scroll from "../../components/Scroll.vue";

@Component({
  components: {
    CommPage,
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

  categoryId: number | string = -1;
  billTitle: string = "";
  startTime: number | string = "";
  endTime: number | string = "";
  receiveStatus: number | string = 0;

  mounted() {
    this.getList(false);
  }

  changeTab(id: number) {
    this.receiveStatus = id;
    this.getList(false);
  }

  toDetail(id: string | number) {
    // sessionStorage.setItem("__check__detail__", JSON.stringify(item));
    this.$router.push({
      path: "detail",
      query: {
        id: `${id}`
      }
    });
  }

  getList(isMore = true) {
    let {
      pageNumber,
      pageSize,
      totalPage,
      items,
      isLoadingMore,
      receiveStatus,
      billTitle,
      startTime,
      endTime
    } = this;

    if (isLoadingMore) {
      return true;
    }

    if (startTime !== "") {
      startTime = new Date(startTime).getTime();
    }

    if (endTime !== "") {
      endTime = new Date(endTime).getTime();
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

    this.$post("app/billCheck/queryPage", {
      // useMock:'xiewen',// 启用mock数据  
      pageNumber,
      pageSize,
      billTitle,
      receiveStatus,
      startTime,
      endTime
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.tab-list {
  display: flex;
  line-height: 0.82rem;
  border-top: solid 1px #adadad;
  border-bottom: solid 2px #d8d8d8;
  font-size: 0.3rem;
  color: #333333;
  background: #fff;
  li {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      a {
        border-bottom: solid 0.06rem #29a1f7;
        padding: 0 0.1rem;
      }
    }
  }
}
.item-section {
  background: #fff;
  margin-top: 0.2rem;
  font-size: 0.28rem;
  color: #333333;
}
.form-section {
  padding: 0 0.38rem;
}
.form-list {
  li {
    line-height: 0.82rem;
    border-bottom: solid 1px #dedede;
    display: flex;
    p:first-child {
      width: 6em;
    }
    p:last-child {
      flex: 1;
      input {
        width: 100%;
        font-size: 0.28rem;
      }
    }
    .date-line {
      display: flex;
      input {
        width: 2.2rem;
        border: 0;
        background: #fff;
        box-shadow: none;
      }
    }
  }
}
.list-button {
  padding: 0.3rem 0;
  display: flex;
  justify-content: center;
}
.form-button {
  width: 1.5rem;
  border-radius: 0.32rem;
  background-color: #29a1f7;
  text-align: center;
  color: #fff;
  font-size: 0.28rem;
  line-height: 0.64rem;
  height: 0.64rem;
}
.no-bg {
  background: none;
  color: #29a1f7;
  border: solid 1px #29a1f7;
}
.gfht {
  line-height: 0.8rem;
  padding: 0 0.28rem;
  border-bottom: dashed 0.02rem #e9e9e9;
  color: #333333;
}
.section-info {
  padding: 0 0.4rem 0 0.46rem;
  display: flex;
  align-items: center;
  .info-list {
    flex: 1;
    li {
      display: flex;
      margin: 0.25rem 0;
      p:first-child {
        color: #999999;
        width: 6em;
      }
    }
  }
}
.empty-list {
  font-size: 0.3rem;
  color: #666666;
  margin-top: 0.8rem;
  img {
    width: 1.5rem;
    margin-bottom: 0.3rem;
  }
}
</style>
