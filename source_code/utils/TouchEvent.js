import {isAndroid} from 'utils/utils'

// 请求基类，可根据实际需要进行扩展
export default class TouchEvent {

  constructor(element, eventName, callback = () => {}) {

    // 绑定事件元素
    this.ele = element

    // 事件名称
    // eventName为字符串或者数组，统一存储为数组
    this.eventName = typeof eventName === 'string'
      ? [eventName]
      : [...eventName]

    // 回调函数

    this.callback = callback

    // 获取当前环境支持的事件
    this.supportEvents = this.getSupportEvent()

    // 事件开始事件是否已经执行
    this.isEventStart = false

    // 事件绑定
    this.bindEvent()

  }

  // 获取当前环境支持的事件
  getSupportEvent() {
    let supportEvents = {}
    if (typeof window.ontouchstart !== 'undefined') {
      supportEvents = {
        startEvent: 'touchstart',
        moveEvent: 'touchmove',
        endEvent: 'touchend'
      }
    } else if (typeof window.onmspointerdown !== 'undefined') { // for IE
      supportEvents = {
        startEvent: 'MSPointerDown',
        moveEvent: 'MSPointerMove',
        endEvent: 'MSPointerUp'
      }
    } else {
      supportEvents = {
        startEvent: 'mousedown',
        moveEvent: 'mousemove',
        endEvent: 'mouseup'
      }
    }
    return supportEvents
  }

  // touch事件绑定
  bindEvent() {
    let {eventName, ele, callback, supportEvents} = this
    let {startEvent, moveEvent, endEvent} = supportEvents

    // 当不支持touch事件的时候，则转换tap事件为click事件
    if (eventName.includes('tap') && this.isNotNeedTap()) {
      ele.addEventListener('click', callback.bind(this), false)
    } else {
      // 标记该元素已经绑定过touch事件，可供外部判断该元素是否已经绑定touch事件
      // 绑定开始，移动及结束事件
      // ele.setAttribute('isAddTouchEvent', 'true')
      ele.addEventListener(startEvent, this.eventStart.bind(this), false)
      ele.addEventListener(moveEvent, this.eventMove.bind(this), false)
      ele.addEventListener(endEvent, this.eventEnd.bind(this), false)
    }
  }

  // 事件开始时的处理
  eventStart(e) {
    this.isEventStart = true
    this.eventData = {}
    let {x, y} = this.getOrdinate(e)
    let now = Date.now()

    this.eventData = {
      // 记录开始时间
      startTime: now,

      // 结束时间
      endTime: now,

      // 运动时长
      eventTime: 0,

      // 记录起点坐标
      startX: x,
      startY: y,

      // 运动过程中的最大偏移量
      maxMoveX: 0,
      maxMoveY: 0,

      // 最后一段距离的坐标，每隔300毫秒更新一次
      lastTimeX: x,
      lastTimeY: y,
      lastTime: now,

      // 运动结束时候的坐标
      endX: x,
      endY: y
    }
    e.preventDefault();
  }

  // 事件移动中的处理
  eventMove(e) {

    if (this.isEventStart) {
      let now = Date.now()
      let {eventData} = this
      let {startX, startY, maxMoveX, maxMoveY, lastTime} = eventData

      // 获取当前坐标
      let {x, y} = this.getOrdinate(e)

      // 记录终点坐标
      this.eventData.endX = x
      this.eventData.endY = y
      this.eventData.endTime = now

      if (now - lastTime > 300) {
        // 记录最后300毫秒内的坐标，用作统计最后一段距离的速度
        this.eventData.lastTimeX = x
        this.eventData.lastTimeY = y
        this.eventData.lastTime = now
      }

      // 记录距离起点的最大偏移量
      let moveX = Math.abs(startX - x)
      let moveY = Math.abs(startY - y)

      // 记录移动距离
      this.eventData.moveX = moveX
      this.eventData.moveY = moveY

      // 记录运动过程中的最大偏移量
      this.eventData.maxMoveX = moveX > maxMoveX
        ? moveX
        : maxMoveX
      this.eventData.maxMoveY = moveY > maxMoveY
        ? moveY
        : maxMoveY

    }
    e.preventDefault();
  }

  // 事件结束时的处理
  eventEnd(e) {

    this.isEventStart = false

    // 记录运动时长
    this.eventData.eventTime = Date.now() - this.eventData.startTime

    // 判断并执行事件
    this.getEventData();
    e.preventDefault();
  }

  // 获取运动数据
  getEventData() {
    // 运动类型
    let eventType,
      // 运动最大偏移量，10以内为tap事件，否则为swipe事件
      tapLimit = 10,
      // 最后一段距离的运动速度
      moveSpeed

    let {eventData, eventName} = this
    let {
      startX,
      startY,
      maxMoveX,
      maxMoveY,
      endX,
      endY,
      moveX,
      moveY,
      lastTimeX,
      lastTimeY,
      eventTime,
      lastTime,
      endTime
    } = eventData

    // 最后一段距离的时间间隔
    let speedTime = endTime - lastTime
    // tap事件
    if (maxMoveX < tapLimit && maxMoveY < tapLimit) {
      moveSpeed = 0
      if (eventTime < 500) {
        eventType = 'tap'
      } else {
        eventType = 'longTap'
      }
    } else {
      // 水平滑动
      if (moveX > moveY) {
        moveSpeed = Math.abs(endX - lastTimeX) / speedTime
        if (endX - startX > 0) {
          eventType = 'swipeRight'
        } else {
          eventType = 'swipeLeft'
        }
      } else {
        moveSpeed = Math.abs(endY - lastTimeY) / speedTime
        // 垂直滑动
        if (endY - startY > 0) {
          eventType = 'swipeDown'
        } else {
          eventType = 'swipeUp'
        }
      }
    }

    this.eventData = Object.assign({}, eventData, {eventType, moveSpeed})

    // 执行符合的回调函数
    if (eventName.includes(eventType)) {
      this.doCallback()
    }

  }

  // 执行回调函数，可供后续扩展
  doCallback() {
    this.callback(this.eventData)
  }

  // 以下情况不需要tap
  // 1、浏览器不支持ontouchstart
  // 2、安卓中meta中有user-scalable="no"属性
  isNotNeedTap() {
    let isNotNeed = false
    let startEvent = this.supportEvents.startEvent

    // 浏览器不支持ontouchstart
    if (startEvent === 'mousedown') {
      isNotNeed = true
    } else {
      // 安卓中meta中有user-scalable="no"属性
      if (isAndroid()) {
        let metaViewport = document.querySelector('meta[name=viewport]')
        let content = metaViewport
          ? metaViewport.content
          : null
        if (content && content.includes('user-scalable=no')) {
          isNotNeed = true
        }
      }
    }
    return isNotNeed
  }

  // 获取事件对象坐标
  getOrdinate(e) {
    if (e.touches) {
      return {x: e.touches[0].pageX, y: e.touches[0].pageY}
    } else {
      return {x: e.clientX, y: e.clientY}
    }
  }

}
