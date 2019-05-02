import {getUserInfo} from 'business/userInfo'
import {setSession, getSession} from 'utils/storage'
import dateFormat from 'utils/dateFormat'
import HttpBase from 'utils/core/HttpBase'
import {p} from 'utils/utils'

let http = new HttpBase()

// 项目类型session标识
const projectTypeSessionId = '__collectBehavior__projectTypeSessionId__'

// 当前用户会话session标识
const userSessionSessionId = '__collectBehavior__userSessionSessionId__'


// 兼容老项目的处理，新项目不用管这个
// 存储用户userId的sessionStorage标识
// 获取到用户userId的时候，需存储到sessionStorage，即
// sessionStorage.setItem('__userIdSessionId__', userId)
const userIdSessionId = '__collectBehavior__userIdSessionId__'

// 存储用户deviceId的localStorage标识
// 该值为不重复随机字符串，一经生成则一直沿用（如果用户手动删除，则重新生成）
const deviceIdlocalId = '__collectBehavior__deviceIdlocalId__'

const ua = navigator.userAgent.toLowerCase()

// 项目appkey
const appKeys = {
  'nw': '12345678910',
  'yd': 'NGZjYjE3YzU4OTk5M2RmYzQ1YTcwMmY1'
}

// 采集用户行为类
export class CollectBehavior {

  constructor() {
    // do something
  }

  start(pageName, isAutoCollect, projectType) {
    
    // 异常处理
    if (typeof pageName === 'undefined') {
      throw new Error('pageName is not defined')
    }

    // 自动埋点设置
    if (typeof isAutoCollect === 'undefined' || isAutoCollect) {
      this.setAutoCollect()
    }

    // 存储项目类型
    if (typeof projectType !== 'undefined') {
      this.projectType(projectType)
    }

    // 埋点start事件处理
    this.startTrace().then(()=>{
      // 页面埋点
      this.sendBehavior(pageName, 'PageTrace')
    }).catch(reson=>{
      p(reson)
    })
  }

  // 未初始化过，则初始化
  startTrace() {
    return new Promise((resolve, reject) => {
      let sessionId = this.userSession()
      if( sessionId ){
        resolve()
      }else{
        this.userSession(false)
        // 启动的时候，是否有eventId，应该为页面别名
        this.sendBehavior('ApplicationStart', 'StartTrace').then(res=>{
          resolve(res)
        }).catch(reson=>{
          reject(reson)
        })
      }
    })
  }

  // 创建或返回用户会话id
  userSession(isGet = true) {
    let now = Date.now()
    if (isGet) {
      return getSession(userSessionSessionId)
    } else {
      setSession(userSessionSessionId, now.toString())
    }
  }

  // 创建或设置项目类型
  projectType(type) {
    if (typeof type === 'undefined') {
      return getSession(projectTypeSessionId)
    } else {
      setSession(projectTypeSessionId, type)
    }
  }

  // 设置是否使用元素属性埋点
  setAutoCollect() {
    let event_auto_collect = this.dataSet(document.body, 'event_auto_collect')
    if (typeof event_auto_collect === 'undefined') {
      this.dataSet(document.body, 'event_auto_collect', '1')
      this.addEvent(document.body, 'click', this.autoSendClickBehavior.bind(this))
    }
  }

  // 使用元素属性埋点
  autoSendClickBehavior(e) {
    let ele = e.target
    let event_id = this.dataSet(ele, 'event_id')
    let pageUrl = this.dataSet(ele, 'page_url')
    if (typeof event_id !== 'undefined') {
      if (pageUrl) {
        this.sendBehavior(event_id, {page: this.getPage(pageUrl)})
      } else {
        this.sendBehavior(event_id)
      }
    }
  }

  dataSet(ele, name, value){
    if(typeof value === 'undefined'){  // get
      if( 'dataset' in ele ){
        return ele.dataset[name]
      }else{
        return ele.getAttribute(`data-${name}`) || undefined
      }
    }else{ // set
      if( 'dataset' in ele ){
        ele.dataset[name] = value
      }else{
        ele.setAttribute(`data-${name}`, value)
      }
    }
  }

  // 给元素添加事件
  addEvent(ele, type, callback) {
    if (ele.addEventListener) {
      ele.addEventListener(type, callback, false)
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + type, callback)
    } else {
      throw new Error('addEvent failed!')
    }
  }

  // 发送采集数据
  // 发送用户采集行为
  // eventType:
  // StartTrace	(初次启动)  -- 会话期间（打开项目到关闭浏览器）只调用一次，可根据是否有sessionId判断
  // PageTrace（页面行为）  -- 每次进入页面（或路由改变）调用一次，刷新则重新调用一次
  // ClickTrace（点击行为） -- 每次点击指定页面元素触发
  // 当eventType为json数据的时候，则为需要覆盖原始数据的json数据，此时实际eventType为ClickTrace
  sendBehavior(eventId = '', eventType = 'ClickTrace') {
    let baseData = Object.assign({}, this.getBaseData(), {event_id: eventId})
    let sendData = {}
    let appKeyQuery = this.getAppKeyQuery()

    // 启动类型则添加启动数据
    if (eventType === 'StartTrace') {
      baseData = Object.assign({}, this.getStartData(), baseData)
    }

    // 用传入的数据覆盖原始数据
    if (typeof eventType === 'object') {
      baseData = Object.assign({}, baseData, eventType)
      eventType = 'ClickTrace'
    }

    // 去除基础数据里面的空值
    for (let key in baseData) {
      if (baseData[key]) {
        sendData[key] = baseData[key]
      }
    }

    // 埋点请求
    return http.getApiPromise.then(() => {
      // 获取api配置信息后，得到collect类型api地址
      let apiUrl = http.getReqUrl(`${appKeyQuery}&eventType=${eventType}`, {
        apiType: 'collect'
      })
      http.toFetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(sendData)
      }).then(res => {
        if (res.code != 200) {
          p(`${eventId} sendBehavior failed. ${res.msg}`)
        }
      }).catch(reson => {
        let msg = typeof reson === 'string'
          ? reson
          : ''
        p(`${eventId} sendBehavior failed. ${msg}`)
      })
    })
  }

  // 每次请求均需要携带的数据
  getBaseData() {
    let {userId} = getUserInfo()

    // 兼容老项目处理
    userId = userId ? userId : sessionStorage.getItem(userIdSessionId)
    return {
      // 事件时间
      time: dateFormat(Date.now(), 'yyyy-MM-dd hh:mm:ss'),

      // 当前页面URL
      page: this.getPage(),

      // 进入项目源
      referer: document.referrer || '',

      // 会话ID，时间戳：精确到毫秒
      session_id: this.userSession(),

      // 用户userId
      user_id: userId,

      // 设备ID，H5不重复随机字符串
      device_id: this.getDeviceId(),

      // 标记在app内的应该市场来源，H5写死”H5”
      channel: 'H5'

    }
  }

  // 生成随机字符串，模拟app的设备id
  getDeviceId() {
    let deviceId = localStorage.getItem(deviceIdlocalId)
    if (!deviceId) {
      deviceId = this.getUUID()
      localStorage.setItem(deviceIdlocalId, deviceId)
    }
    return deviceId
  }

  // 获取page字段
  getPage(url = location.href) {
    return url.replace(location.origin, '')
  }

  getUUID() {
    let d = Date.now()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x'
        ? r
        : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }

  // 项目启动参数
  getStartData() {
    let {os, os_version} = this.getOs()
    let {browser, browser_version} = this.getBrowserInfo()

    return {

      // 屏幕高度
      screen_height: window.screen.height,

      // 屏幕高度
      screen_width: window.screen.width,

      // 客户端来源类型
      os,

      // 客户端操作系统版本
      os_version,

      // 浏览器名
      browser,

      // 浏览器版本
      browser_version
    }
  }

  getOs() {
    // var ua = "Mozilla/5.0 (Intel android 6.0.1) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4".toLowerCase()

    let os = ''
    let os_version = ''

    // apple移动设备正则
    let appleMobileRe = /iphone|ipad|midp|ipod/

    // apple移动设备操作系统正则
    let appleOsMobileRe = /(iphone os.*?|ipad os.*?|midp os.*?|ipod os.*?)(\d+(.\d+)+)/

    // 监测是否为 apple移动设备
    let amb = ua.match(appleMobileRe)

    if (amb) {
      // 监测apple操作系统正则
      let am = ua.match(appleOsMobileRe)
      if (am) {
        os = am[1]
        os_version = am[2]
      } else {
        os = amb[0]
      }
    } else if (ua.match(/mac/)) {
      // mac
      let macRe = /(mac os.*?)(\d+(.\d+)+)/
      let mm = ua.match(macRe)
      if (mm) {
        os = mm[1]
        os_version = mm[2]
      }
      os = os || 'Mac'
    } else if (ua.match(/android/)) {
      // android
      let aRe = /(android).*?([\d.]+)/
      let andm = ua.match(aRe)
      if (andm) {
        os = andm[1]
        os_version = andm[2]
      }
      os = os || 'android'
    } else {
      // windows
      if (ua.match(/windows/)) {
        let wRe = /(windows nt).*?([\d.]+)/
        let wm = ua.match(wRe)
        if (wm) {
          os = wm[1]
          os_version = wm[2]
        }
        os = os || 'windows'
      }
    }

    os = os
      ? os.replace(/( os)|( nt)/i, '')
      : ''

    return {
      os: os || '',
      os_version: os_version || ''
    }
  }

  // 获取浏览器名称及版本号
  getBrowserInfo() {
    let browser = ''
    let version = ''
    // 浏览器匹配名称与浏览器名称转换
    let exchangeObj = {
      'msie': 'IE',
      'trident': 'Edge',
      'micromessenger': 'WeChat'
    }

    let re = /(msie|trident|firefox|opera|mqqbrowser|ucbrowser|baiduboxapp|micromessenger).*?([\d.]+)/

    let m = ua.match(re)
    if (m) {
      browser = m[1]
      version = m[2]
    } else if (ua.match(/niiwoo/)) {
      // niiwoo
      let nm = ua.match(/(niiwoo).*?([\d.]+)/)
      if (nm) {
        browser = nm[1]
        version = nm[2]
      }
    } else if (ua.match(/chrome/)) {
      // chrome
      let cm = ua.match(/(chrome).*?([\d.]+)/)
      if (cm) {
        browser = cm[1]
        version = cm[2]
      }
    } else {
      // safari
      let sm = ua.match(/(version).*?([\d.]+)/)
      if (sm && ua.match(/safari/)) {
        browser = 'safari'
        version = sm[2]
      }
    }

    browser = browser
      ? (exchangeObj[browser] || browser)
      : ''
    version = version
      ? version
      : ''

    return {browser: browser, browser_version: version}
  }

  // 获取api地址
  getAppKeyQuery() {
    // 项目类型
    let projectType = this.projectType()

    // 默认appkey
    let appkey = appKeys['nw']
    if (projectType && projectType in appKeys) {
      appkey = appKeys[projectType]
    }

    return `?appkey=${appkey}`
  }

}

export default new CollectBehavior()
