import Vue from 'vue'
import TouchEvent from 'utils/TouchEvent'

// 支持touch事件列表
const touchs = [
  'tap',
  'longTap',
  'swipeRight',
  'swipeLeft',
  'swipeDown',
  'swipeUp'
]

// 注入touch事件指令
touchs.forEach(item=>{
  Vue.directive(item, {
    bind(el, binding) {
      let value = binding.value,
        params
      let handle = () => {}

      if (typeof value === 'function') {
        handle = value
      }
      if (typeof value === 'object') {
        handle = value.handle
        params = value.params
      }
      new TouchEvent(el, item, moveData => {
        // moveData为原始运动数据
        handle(params, moveData)
      })
    }
  })
})
