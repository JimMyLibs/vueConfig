<template>
  <CommPage
    :isShowNav="false"
    title="合同管理列表"
  >
    <div class="sign-container">
      <div
        id="canvasBox"
        :style="getHorizontalStyle"
        v-show="!showBox"
      >
        <div class="control">
          <p>{{title}}</p>
          <p class="buttons">
            <span @click="clear">清屏</span>
            <span @click="goBack">取消</span>
            <span @click="savePNG">确定</span>
          </p>
        </div>
        <canvas></canvas>
      </div>
    </div>
  </CommPage>
</template>

<script lang="ts">
import Draw from '../../utils/draw';
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import CommPage from "../../components/CommPage.vue"
import Scroll from '../../components/Scroll.vue'

@Component({
  components: {
    CommPage
  }
})
export default class FetchPage extends Mixins(VueMixin) {

  @Prop({ default: true }) isShow?: boolean
  @Prop({ default: 90 }) degree?: number
  @Prop({ default: '请在下方空白处签名' }) title?: string
  @Prop({ default: '确定' }) buttonText?: string

  // signImage: any = null
  showBox: boolean = false
  canvasBox: any = null
  canvas: any = null
  draw: any = null
  mounted() {
    this.canvasBox = document.getElementById('canvasBox');
    this.initCanvas();
  }


  get getHorizontalStyle() {
    const d = document;
    const w = window.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
    const h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
    let length = (h - w) / 2;
    let width = w;
    let height = h;

    switch (this.degree) {
      case -90:
        length = -length;
      case 90:
        width = h;
        height = w;
        break;
      default:
        length = 0;
    }
    if (this.canvasBox) {
      this.canvasBox.removeChild(document.querySelector('canvas'));
      this.canvasBox.appendChild(document.createElement('canvas'));
      setTimeout(() => {
        this.initCanvas();
      }, 200);
    }
    return {
      transform: `rotate(${this.degree}deg) translate(${length}px,${length}px)`,
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: 'center center',
    };
  }


  initCanvas() {
    const canvas = document.querySelector('canvas');
    this.draw = new Draw(canvas, -this.degree);
  }

  clear() {
    this.draw.clear();
  }

  download() {
    this.draw.downloadPNGImage(this.draw.getPNGImage());
  }

  savePNG() {
    let signImage = this.draw.getPNGImage();
    sessionStorage.setItem('__signImage__', signImage)
    this.goBack()
  }

  goBack(){
    this.$router.go(-1)
  }

}



</script>

<style lang='postcss'>
/* 不能使用scope */
.sign-container {
  width: 100%;
  height: 100%;
  #canvasBox {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .control {
    padding: 0.2rem;
    font-size: 0.3rem;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .buttons {
      display: flex;
      span {
        width: 1.5rem;
        border-radius: 0.32rem;
        background-color: #29a1f7;
        text-align: center;
        color: #fff;
        font-size: 0.28rem;
        line-height: 0.64rem;
        height: 0.64rem;
        margin-left:.3rem;
      }
    }
  }
  canvas {
    flex: 1;
    cursor: crosshair;
    border: 2px dashed lightgray;
  }
  .image-box {
    width: 100%;
    height: 100%;
  }
  .image-box header {
    font-size: 18px;
  }
  .image-box img {
    max-width: 80%;
    max-height: 80%;
    margin-top: 50px;
    border: 1px solid gray;
  }
}
</style>
