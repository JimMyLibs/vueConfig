<template>
  <CommPage title="合同详情">
    <div v-if="Object.keys(info).length > 0">
      <div
        class="item-section img-list"
        v-if="Array.isArray(info.attachmentListUrl) && info.attachmentListUrl.length > 0"
      >
        <p v-for="url in info.attachmentListUrl"><img :src="url" /></p>
      </div>

      <div
        class="sign"
        v-if="info.contractType != 2"
      >
        <p v-if="!signImage">
          <a
            class="sign-button"
            @click="toSign"
            v-if="info.contractType == 1"
          >签名</a>
          <a
            class="sign-button"
            @click="toSign"
            v-if="info.contractType == 3 && (info.supplementType == 1 || info.supplementType == 3)"
          >补签名</a>
        </p>
        <p
          class="sign-img"
          v-else
        >
          <img :src="signImage" />
        </p>
      </div>

      <div
        class="item-img"
        v-if="Array.isArray(info.urls) && info.urls.length > 0"
      >
        <ImgReview :picList="info.urls" />
      </div>

      <ul
        class="upload-list"
        v-if="info.needUploadPhoto == 1 || (info.contractType == 3 && (info.supplementType == 2 || info.supplementType == 3))"
      >
        <li>
          <picUpload @getPic="getPicLIst1" />
        </li>
        <li>
          <picUpload @getPic="getPicLIst2" />
        </li>
      </ul>
      <div
        class="item-section"
        v-if="info.contractType == 2 && Array.isArray(info.approvalRecord) && info.approvalRecord.length > 0"
      >
        <p>审核说明原因</p>
        <p v-for="text in info.approvalRecord">{{text}}</p>
      </div>

      <div class="sure-button">
        <p>
          <a @click="sure">确定</a>
        </p>
      </div>
    </div>
    <!-- <Sign :isShow="isShowSign" /> -->
  </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import CommPage from "../../components/CommPage.vue"
import ImgReview from '../../components/ImgReview.vue'
import picUpload from '../../components/picUpload.vue'
// import Sign from '../../components/Sign.vue'

Component.registerHooks([
  'beforeRouteLeave'
])

@Component({
  components: {
    CommPage,
    ImgReview,
    picUpload,
    // Sign
  }
})
export default class FetchPage extends Mixins(VueMixin) {
  contractFiterType: number | string = ''
  historyDetailId: number | string = ''
  id: number | string = ''
  info: any = {}
  signImage: number | string = ''
  uploadImg1: any = ''
  uploadImg2: any = ''
  isChanged: boolean = false
  // isShowSign: boolean = false

  mounted() {
    let {
      contractFiterType,
      historyDetailId,
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

    this.contractFiterType = (contractFiterType as string)
    this.historyDetailId = (historyDetailId as string)
    this.id = (id as string)
    this.getDetail()
  }

  getDetail() {
    let {
      contractFiterType,
      historyDetailId,
      id
    } = this
    this.$post('app/contract/queryContractDetail', {
      contractFiterType,
      historyDetailId,
      id
    }).then((res: any) => {
      let { data } = res
      this.info = { ...data }
    })
  }

  getPicLIst1(res: any): void {
    this.uploadImg1 = res;
    this.isChanged = true
  }

  getPicLIst2(res: any): void {
    this.uploadImg2 = res;
    this.isChanged = true
  }

  toSign() {
    this.$router.push('/sign')
  }

  sure() {
    let { signImage, info, uploadImg1, uploadImg2, isChanged } = this
    let { id, contractType, historyDetailId, needUploadPhoto, supplementType } = info
    let sendData: any = {
      contractId: id,
      contractType,
      historyDetailId
    }
    let imgPictureList = []
    if (signImage) {
      sendData.signImage = signImage
    }
    if (uploadImg1) {
      imgPictureList.push(uploadImg1)
    }
    if (uploadImg2) {
      imgPictureList.push(uploadImg2)
    }

    if((needUploadPhoto == 1 || (contractType == 3 && (supplementType == 2 || info.supplementType == 3))) && imgPictureList.length === 0){
      this.$tip('请至少上传一张图片！')
      return false
    }

    if( contractType == 1 || (contractType == 3 && (supplementType == 1 || supplementType == 3)) ){
      if(!signImage){
        this.$tip('请先签名！')
        return false
      }
    }
    
    if (imgPictureList.length > 0) {
      sendData.imgPictureList = imgPictureList
    }

    if (isChanged) {
      this.$post('app/contract/uploadImage', sendData).then((res: any) => {
        this.$tip('提交成功').then(() => {
          this.$router.push('list')
        })
      })
    } else {
      this.$router.push('list')
    }
  }

  beforeRouteLeave(to: any, from: any, next: any) {
    sessionStorage.removeItem('__signImage__')
    next()
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
      display: block;
    }
  }
}

.sign {
  padding: 0.36rem 0 0.22rem 0.8rem;
  .sign-button {
    display: block;
    width: 1.5rem;
    line-height: 0.64rem;
    background-color: #29a1f7;
    border-radius: 0.32rem;
    color: #ffffff;
    font-size: 0.28rem;
    text-align: center;
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
