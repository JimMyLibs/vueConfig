<template>
  <div
    class="container"
    v-if="isShow"
  >
    <div
      id="canvasBox"
      :style="getHorizontalStyle"
      v-show="!showBox"
    >
      <div class="greet">
        <span>{{title}}</span>
        <input
          type="button"
          value="清屏"
          @touchstart="clear"
          @mousedown="clear"
        />
        <input
          type="button"
          value="生成png图片"
          @touchstart="savePNG"
          @mousedown="savePNG"
        />
      </div>
      <div id="canvas_box">
        <!-- <canvas></canvas> -->
      </div>

    </div>
    <div
      class="image-box"
      v-show="showBox"
    >
      <header>
        请长按图片并保存至本地后发送好友
        <input
          type="button"
          value="返回"
          @click="showBox = false"
        />
      </header>
      <img :src="signImage">
    </div>
  </div>
</template>

<script lang="ts">
import Draw from '../utils/draw'
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class FetchPage extends Mixins(VueMixin) {
  @Prop({ default: true }) isShow?: boolean
  @Prop({ default: 90 }) degree?: number
  @Prop({ default: '请在下方空白处签名' }) title?: string
  @Prop({ default: '确定' }) buttonText?: string

  signImage: any = null
  showBox: boolean = false
  // canvasBox: any = null
  canvas: any = null
  draw: any = null



  mounted() {
    let { isShow } = this
    // this.canvasBox = document.getElementById('canvasBox');
    // this.initCanvas();
  }

  @Watch('isShow')
  changeShow() {
    let { isShow } = this
    if (isShow) {
      this.init()
    }
  }

  init() {
    let { isShow } = this
    if (isShow) {
      this.$nextTick(() => {
        let canvasBox = document.querySelector('#canvas_box')
        let canvas = document.querySelector('#canvas')
        if (canvas) {
          canvas.remove()
        }
        let newCanvas = document.createElement('canvas')
        newCanvas.id = 'canvas'
        canvasBox.appendChild(newCanvas)
        this.canvas = newCanvas
        this.initCanvas()
      })
    }
  }



  get getHorizontalStyle() {
    let { degree } = this
    const d = document;
    const w = window.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
    const h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
    let length = (h - w) / 2;
    let width = w;
    let height = h;

    switch (degree) {
      case -90:
        length = -length;
        break;
      case 90:
        width = h;
        height = w;
        break;
      default:
        length = 0;
    }
    // if (canvasBox) {
    //   this.canvasBox.removeChild(document.querySelector('canvas'));
    //   this.canvasBox.appendChild(document.createElement('canvas'));
    //   setTimeout(() => {
    //     this.initCanvas();
    //   }, 200);
    // }

    return {
      transform: `rotate(${this.degree}deg) translate(${length}px,${length}px)`,
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: 'center center',
    };
  }

  initCanvas() {
    let { canvas, degree } = this
    this.draw = new Draw(canvas, -degree);
  }

  clear() {
    this.draw.clear();
  }

  download() {
    this.draw.downloadPNGImage(this.draw.getPNGImage());
  }

  savePNG() {
    this.signImage = this.draw.getPNGImage();
    this.showBox = true;
  }

};


</script>

<style lang='postcss' scoped>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 30000;
  background: #ccc;
}
#canvasBox {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.greet {
  padding: 20px;
  font-size: 20px;
  user-select: none;
}
input {
  font-size: 20px;
}
.greet select {
  font-size: 18px;
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
</style>
