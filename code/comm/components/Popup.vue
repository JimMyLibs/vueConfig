<template>
  <div
    v-if="isShow"
    class="popup"
  >
    <div class="popup_bg"></div>
    <div class="center_fixed popup_comm">
      <div class="popup_content">
        <slot></slot>
        <ul class="popup_buttons" v-if="(typeof buttons === 'string' && buttons.trim() !== '') || (Array.isArray(buttons) && buttons.length > 0)">
          <li v-if="typeof buttons === 'string'" @click="$emit('callback', 0)">{{buttons}}</li>
          <li v-else v-for="({text, isGray}, index) in buttons" :class="{gray: isGray}" @click="$emit('callback', index)">{{text}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Emit } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

/**
 * text 按钮名称
 * isGray 是否置灰
 */
interface Buttons{
  text: string,
  isGray?: boolean
}

@Component
export default class Counter extends Mixins(VueMixin) {
  @Prop({ default: false }) isShow?: boolean
  @Prop({ default: '确定' }) buttons?: Buttons | string
}
</script>
<style lang="postcss" scoped>
.popup,
.popup_bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.popup {
  z-index: 9991;
}

.popup_bg {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9998;
}

.popup_comm {
  background: #ffffff;
  border-radius: 0.1rem;
  width: 5.9rem;
  z-index: 9999;
}

.popup_content {
  position: relative;
  color: #615850;
  font-size: 0.24rem;
}
.popup_buttons{
  font-size: .34rem;
	color: #29a1f7;
  border-top: solid .02rem #dedede;
  text-align: center;
  display: flex;
  line-height:1rem;
  li{
    flex:1;
    border-right: solid .02rem #dedede;
    &:last-child{
      border:none;
    }
    &.gray{
      color: #a1a1a1;
    }
  }
}
</style>
