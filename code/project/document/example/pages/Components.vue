<template>
  <div class="demo">
    <h1>部分常用组件案例</h1>
    <ul class="buttons-list">
      <li>
        <label>FixedBox：</label>
        <span class="small-button" @click="setPosition('top')">{{isShowFixedBox ? '关闭' : 'top'}}</span>
        <span class="small-button" @click="setPosition('center')">{{isShowFixedBox ? '关闭' : 'center'}}</span>
        <span class="small-button" @click="setPosition('bottom')">{{isShowFixedBox ? '关闭' : 'bottom'}}</span>
      </li>
      <li><p @click="showTip">Tip：{{isTipDone ? '完成' : ''}}</p></li>
      <li><p @click="showPopup">Popup：{{isTipDone ? '完成' : ''}}</p></li>
    </ul>
    <FixedBox :isShow="isShowFixedBox" :position="fixedBoxPosition">
      <div class="demo-box">
        <h2>FixedBox弹窗组件</h2>
        <p>1、position属性用来控制显示位置，及相应动画效果</p>
        <p>2、若无须动画效果，请设置isTransition属性值为false</p>
      </div>
    </FixedBox>
    <Popup :isShow="isShowPopup" mask="black" @clickMask="isShowPopup = false">
      <div class="demo-popup">
        <h2>Popup弹窗组件</h2>
        <p>1、mask: hide 隐藏遮罩，opacity 透明遮罩，black 黑色半透明遮罩</p>
        <p>1、mask: hide 隐藏遮罩，opacity 透明遮罩，black 黑色半透明遮罩</p>
        <p>2、若无须动画效果，请设置isTransition属性值为false</p>
      </div>
    </Popup>
  </div>
</template>
<script>

import FixedBox from 'comm/components/FixedBox'
import Popup from 'comm/components/Popup'


export default {
  components: {
    FixedBox,
    Popup
  },
  data() {
    return {
      isShowFixedBox: false,
      fixedBoxPosition: '',
      isTipDone: false,
      isShowPopup: false
    }
  },
  methods: {
    setPosition(type) {
      let {isShowFixedBox} = this
      this.isShowFixedBox = !isShowFixedBox
      this.fixedBoxPosition = type
    },
    showTip(){
      this.isTipDone = false
      this.$tip('tip提示语，全局函数', 3).then(()=>{
        this.isTipDone = true
      })
    },
    showPopup(){
      let {isShowPopup} = this
      this.isShowPopup = !isShowPopup
    }
  },

}
</script>
<style scoped>
.demo-box {
  text-align: center;
  box-shadow: 0 0 .1rem #ccc;
  background: #fff;
  padding:.2rem;
}
.demo-popup{
  width:80%;
  background: #fff;
}
</style>
