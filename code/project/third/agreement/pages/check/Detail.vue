<template>
  <CommPage title="账单详情">
    <div v-if="Object.keys(info).length > 0">
      <div
        class="item-section img-list"
        v-if="Array.isArray(info.billDetailUrlList) && info.billDetailUrlList.length > 0"
      >
        <p v-for="item in info.billDetailUrlList">
          <img :src="item">
        </p>
      </div>
      <div
        class="sign"
        v-if="info.receiveStatus == 0"
      >
        <p
          v-if="!signImage"
          class="sign-button-warp"
        >
          <a
            class="sign-button"
            @click="toSign"
          >签名</a>
        </p>
        <p
          class="sign-img"
          v-else
        >
          <img :src="signImage">
        </p>

        <!-- 暂时不做 -->
        <!-- <a class="applay-button" @click="isShowSign = true">申请查看账单明细</a> -->
      </div>

      <p
        class="item-section"
        v-if="info.receiveStatus == 1"
      >账单状态：已归档</p>

      <div class="sure-button">
        <p @click="sure">
          <a>确定</a>
        </p>
      </div>
    </div>
    <!-- <Sign :isShow="isShowSign" /> -->
  </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import CommPage from "../../components/CommPage.vue";
// import ImgReview from '../../components/ImgReview.vue'
// import picUpload from '../../components/picUpload.vue'
// import Sign from '../../components/Sign.vue'

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {
    CommPage
    // ImgReview,
    // picUpload,
    // Sign
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  signImage: number | string = "";
  info: any = {};
  id: string | number = ''
  isChanged: boolean = false
  mounted() {
    let {
      id
    } = this.$route.query
    if (typeof id === 'undefined') {
      this.$tip('数据异常，请稍后重试！')
      return false
    }

    let signImage = sessionStorage.getItem('__signImage__')
    if (signImage) {
      this.signImage = signImage
      this.isChanged = true
    }

    this.id = (id as string)
    this.getDetail()
  }

  getDetail() {
    let {
      id
    } = this
    this.$post('app/billCheck/queryDetail', {
      id
    }).then((res: any) => {
      let { data } = res
      this.info = { ...data }
    })
  }

  toSign() {
    // sessionStorage.removeItem('__signImage__')
    this.$router.push("/sign");
  }

  sure() {
    let { signImage, id, isChanged } = this;
    if (signImage) {
      this.$post("app/billCheck/saveSign", {
        id,
        signImageUrl: signImage
      }).then((res: any) => {
        this.$tip("提交成功").then(() => {
          this.$router.push("list");
        });
      });
    } else {
      this.$router.push("list");
    }
  }

  beforeRouteLeave(to: any, from: any, next: any) {
    sessionStorage.removeItem("__signImage__");
    next();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped>
.item-img {
  background: #fff;
  margin-top: 0.2rem;
}
.review-section {
  font-size: 0.26rem;
  color: #333333;
  padding: 0.3rem 0.36rem 0 0.3rem;
  h2 {
    font-size: 0.3rem;
    color: #333333;
    font-weight: normal;
    margin-bottom: 0.46rem;
  }
}
.review-list {
  li {
    display: flex;
    .left-item {
      width: 0.26rem;
      margin-right: 0.12rem;
      display: flex;
      flex-flow: column;
      align-items: center;
      .dot {
        width: 0.22rem;
        height: 0.22rem;
        border: solid 1px #a8a8a8;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        &::before {
          content: "";
          width: 0.08rem;
          height: 0.08rem;
          border-radius: 50%;
          background-color: #a8a8a8;
        }
      }
      .line {
        flex: 1;
        width: 100%;
        justify-content: center;
        width: 1px;
        background-color: #a8a8a8;
      }
    }
    .right-item {
      flex: 1;
      padding: 0.3rem 0 0.44rem 0;
      position: relative;
      .review-time {
        position: absolute;
        left: 0;
        top: -0.08rem;
        z-index: 3;
      }
      .review-text {
        margin-top: 0.2rem;
        min-height: 1.68rem;
        background-color: #ffffff;
        border-radius: 0.06rem;
        padding: 0.2rem;
      }
    }
    &:last-child {
      .left-item {
        .line {
          display: none;
        }
      }
    }
  }
}
.item-section {
  background: #fff;
  margin-top: 0.2rem;
  font-size: 0.3rem;
  color: #333333;
  padding: 0.3rem;
  .status {
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 0.2rem 0;
    li {
      width: 1.8rem;
      line-height: 0.82rem;
      border-radius: 0.42rem;
      font-size: 0.34rem;
      &.pass {
        border: solid 1px #29a1f7;
        color: #29a1f7;
      }
      &.no-pass {
        color: #ff6600;
        border: solid 1px #ff6600;
      }
      &:first-child {
        margin-right: 0.5rem;
      }
    }
  }
  .user {
    display: flex;
    justify-content: space-between;
    a {
      background: url(../../assets/arrow.png) right center no-repeat;
      background-size: 0.17rem auto;
      padding-right: 0.3rem;
    }
  }
}
.sure-button {
  padding: 0.6rem 0.94rem;
  p {
    background-color: #29a1f7;
    border-radius: 0.1rem;
    font-size: 0.36rem;
    color: #ffffff;
    line-height: 0.83rem;
    text-align: center;
    a {
      color: #ffffff;
    }
  }
}
.sign-button-warp {
  display: flex;
  .sign-button {
    line-height: 0.64rem;
    background-color: #29a1f7;
    border-radius: 0.32rem;
    color: #ffffff;
    font-size: 0.28rem;
    text-align: center;
    padding: 0 0.5rem;
  }
}

.sign {
  padding: 0.36rem 0 0.22rem 0.8rem;
  display: flex;

  .applay-button {
    line-height: 0.64rem;
    background-color: #4f5d73;
    border-radius: 0.32rem;
    color: #ffffff;
    font-size: 0.28rem;
    text-align: center;
    padding: 0 0.3rem;
    margin-left: 0.44rem;
  }
}
.upload-list {
  display: flex;
  background: #fff;
  margin-top: 0.2rem;
  padding: 0.4rem;
  li {
    flex: 1;
  }
}
.img-list {
  img {
    vertical-align: top;
  }
}
.sign-img {
  width: 50%;
  max-height: 2rem;
  overflow: hidden;
}
</style>
