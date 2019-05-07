export var collectBehavior = (function() {

  // 存储用户sessionId的sessionStorage标识
  // 在用户首次进入项目的时候创建一次，会话期间使用同一个
  // 本程序自动创建管理
  var sessionIdSessionId = '__collectBehavior__sessionIdSessionId__'

  // 存储用户userId的sessionStorage标识
  // 获取到用户userId的时候，需存储到sessionStorage，即
  // sessionStorage.setItem('__userIdSessionId__', userId)
  var userIdSessionId = '__collectBehavior__userIdSessionId__'

  // 存储用户deviceId的localStorage标识
  // 该值为不重复随机字符串，一经生成则一直沿用（如果用户手动删除，则重新生成）
  var deviceIdlocalId = '__collectBehavior__deviceIdlocalId__'

  // 存储项目标识的localStorage标识
  var projectSessionId = '__collectBehavior__projectSessionId__'

  // api地址后缀
  var apiSuffix = '/analysis/collect/apptrace'

  // 接口请求方式
  var methodName = 'post'

  // 当前项目appkey
  var nwAppKey = '12345678910'

  // 优借appkey
  var ydAppKey = 'NGZjYjE3YzU4OTk5M2RmYzQ1YTcwMmY1'


  // 数据采集接口基础信息
  // var apiInfo = {
  //   url: '/analysis/collect/apptrace?appkey=12345678910&eventType=',
  //   method: 'POST'
  // }

  var ua = navigator.userAgent.toLowerCase();



  // 未初始化过，则初始化
  function startTrace(pageName){
    var sessionId = getSession_id();
    if (!sessionId) {
      setSession_id();
      // 启动的时候，是否有eventId，应该为页面别名
      sendBehavior('ApplicationStart', 'StartTrace');
    }
  }

  // startTrace()


  // data-event_id属性的元素则自动采集
  // 注意：data-event_id属性不支持冒泡，
  // 如下结构，若点击到span元素时，则不能自动触发
  // 这里可以给p及span都加上data-event_id属性，则可以触发且不会重复触发
  /*
<p data-event_id="101101">
  <span>点击我无效</span>
</p>
   */
  function autoSendClickBehavior(e) {
    var ele = e.target
    var event_id = ele.dataset.event_id
    var pageUrl = ele.dataset.page_url
    if( event_id ){
      if (pageUrl) {
        sendBehavior(event_id, {
          page: getPage(pageUrl)
        })
      }else{
        sendBehavior(event_id)
      }
    }
  }

  // 初始化操作
  function addEvent(ele, type, callback) {
    if (ele.addEventListener) {
      ele.addEventListener(type, callback, false);
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + type, callback);
    } else {
      console.log('addEvent failed!')
    }
  }

  // 如果点击有data-event_id的元素，则自动采集
  // ios设备默认document及document.body元素默认click事件无效
  // 需要添加样式cursor:pointer（使其可点击）


  function setAutoCollect(){
    var event_auto_collect = document.body.dataset.event_auto_collect
    if( typeof event_auto_collect === 'undefined' ){
      document.body.dataset.event_auto_collect = '1'
      addEvent(document.body, 'click', autoSendClickBehavior)
    }
  }


  // 获取接口信息
  function getApiInfo() {
    //  var dev = location.host.split('.')[0]

        var host = collectApiUrl;

    //  if( dev === 'm' || dev === 'www'){
    //    host = host___dev;
    //  }

        // 项目类型
    //  var projectType = sessionStorage.getItem(projectSessionId)

    //  var appkey = projectType === 'yd' ? ydAppKey : nwAppKey
    var appkey = tcAppKey

    return {
      url: host + apiSuffix + '?appkey=' + appkey + '&eventType=',
      method: methodName
    }
  }

  // 获取time字段
  function getCurrentTime() {

    // 数字如果为一位数，前面加0
    function two(num) {
      return Number(num) < 10 ?
        '0' + num :
        num
    }

    // 时间格式 2017-7-12 17:17:08
    var now = new Date()
    var d = {
      y: now.getFullYear(), //年
      M: now.getMonth() + 1, //月
      d: now.getDate(), //日
      h: now.getHours(), //时
      m: now.getMinutes(), //分
      s: now.getSeconds() // 秒
    }

    return d.y + '-' + two(d.M) + '-' + two(d.d) + ' ' + two(d.h) + ':' + two(d.m) + ':' + two(d.s)
  }

  // 获取page字段
  function getPage(url) {
    url = url || location.href
    return url.replace(location.origin, '')
  }

  // 获取referrer字段
  function getReferer() {
    return document.referrer || ''
  }

  // 获取session_id字段
  function getSession_id() {
    return sessionStorage.getItem(sessionIdSessionId) || ''
  }

  // 获取session_id字段
  function setSession_id() {
    sessionStorage.setItem(sessionIdSessionId, (new Date()).getTime())
  }

  // 设置session_id字段
  function setUser_id(userId) {
    return sessionStorage.setItem(userIdSessionId, userId)
  }

  // 获取session_id字段
  function getUser_id() {
    return sessionStorage.getItem(userIdSessionId) || ''
  }

  // 获取session_id字段
  function getDevice_id() {
    // 初始化操作
    var deviceId = localStorage.getItem(deviceIdlocalId)
    if (!deviceId) {
      deviceId = getUUID()
      localStorage.setItem(deviceIdlocalId, deviceId)
    }
    return deviceId
  }

  function getScreenSize() {
    return {
      w: window.screen.width,
      h: window.screen.height
    }
  }

  function getOs() {
    // var ua = "Mozilla/5.0 (Intel android 6.0.1) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4".toLowerCase();

    var os = '',
      os_version = '';

    // apple移动设备正则
    var appleMobileRe = /iphone|ipad|midp|ipod/

    // apple移动设备操作系统正则
    var appleOsMobileRe = /(iphone os.*?|ipad os.*?|midp os.*?|ipod os.*?)(\d+(.\d+)+)/

    // 监测是否为 apple移动设备
    var amb = ua.match(appleMobileRe)

    if (amb) {
      // 监测apple操作系统正则
      var am = ua.match(appleOsMobileRe)
      if (am) {
        os = am[1]
        os_version = am[2]
      } else {
        os = amb[0]
      }
    } else if (ua.match(/mac/)) {
      // mac
      var macRe = /(mac os.*?)(\d+(.\d+)+)/
      var mm = ua.match(macRe)
      if (mm) {
        os = mm[1]
        os_version = mm[2]
      }
      os = os || 'Mac'
    } else if (ua.match(/android/)) {
      // android
      var aRe = /(android).*?([\d.]+)/
      var andm = ua.match(aRe)
      if (andm) {
        os = andm[1]
        os_version = andm[2]
      }
      os = os || 'android'
    } else {
      // windows
      if (ua.match(/windows/)) {
        var wRe = /(windows nt).*?([\d.]+)/
        var wm = ua.match(wRe)
        if (wm) {
          os = wm[1]
          os_version = wm[2]
        }
        os = os || 'windows'
      }
    }

    os = os ? os.replace(/( os)|( nt)/i,'') : ''

    return {
      os: os || '',
      os_version: os_version || ''
    }
  }


  // 获取浏览器名称及版本号
  function getBrowserInfo() {
    var browser = '',
      version = '';
    // 浏览器匹配名称与浏览器名称转换
    var exchangeObj = {
      'msie': 'IE',
      'trident': 'Edge',
      'micromessenger': 'WeChat'
    }

    var re = /(msie|trident|firefox|opera|mqqbrowser|ucbrowser|baiduboxapp|micromessenger).*?([\d.]+)/;

    var m = ua.match(re);
    if (m) {
      browser = m[1]
      version = m[2]
    } else if (ua.match(/curProject/)) {
      // curProject
      var nm = ua.match(/(curProject).*?([\d.]+)/)
      if (nm) {
        browser = nm[1]
        version = nm[2]
      }
    } else if (ua.match(/chrome/)) {
      // chrome
      var cm = ua.match(/(chrome).*?([\d.]+)/)
      if (cm) {
        browser = cm[1]
        version = cm[2]
      }
    } else {
      // safari
      var sm = ua.match(/(version).*?([\d.]+)/)
      if (sm && ua.match(/safari/)) {
        browser = 'safari'
        version = sm[2]
      }
    }

    browser = browser ? (exchangeObj[browser] || browser) : '';
    version = version ? version : '';


    return {
      browser: browser,
      version: version
    };
  }

  // 发送用户采集行为
  // eventType:
  // StartTrace (初次启动)  -- 会话期间（打开项目到关闭浏览器）只调用一次，可根据是否有sessionId判断
  // PageTrace（页面行为）  -- 每次进入页面（或路由改变）调用一次，刷新则重新调用一次
  // ClickTrace（点击行为） -- 每次点击指定页面元素触发
  // 当eventType为json数据的时候，则为需要覆盖原始数据的json数据，此时实际eventType为ClickTrace
  // 初步方案：
  // 在进入某个路由或者页面后，自动调用StartTrace及PageTrace类型事件，需要全局路由控制，页面别名通过router的meta标签设置
  // 大部分ClickTrace事件可以autoSendClickBehavior事件自动监控，无法自动监控的情况则手动调用全局collectBehavior.sendBehavior()方法
  function sendBehavior(eventId, eventType) {

    // api信息
    var apiConf = getApiInfo();

    var event_id = eventId || '';

    // 默认事件类型
    var realType = 'ClickTrace';

    // 基础数据
    var baseData = mixJson(getBaseData(), {event_id: event_id});

    var sendData = {};

    if( typeof eventType === 'string' ){
      realType = eventType
    }

    // 启动类型则添加启动数据
    if (realType === 'StartTrace') {
      baseData = mixJson(getStartData(), baseData);
    }

    // 用传入的数据覆盖原始数据
    if( typeof eventType === 'object' ){
      baseData = mixJson(baseData, eventType);
    }

    // 去除基础数据里面的空值
    for( var key in baseData ){
      if( baseData[key] ){
        sendData[key] = baseData[key]
      }
    }
    // console.log(sendData)

    // application/json
    ajax(apiConf.url + realType, {
      method: 'POST',
      params: JSON.stringify(sendData)
    });
  }

  function mixJson(base, mixData){
    // copy json
    var resJson = JSON.parse( JSON.stringify(base) )
    for( var key in mixData ){
      resJson[key] = mixData[key]
    }
    return resJson
  }

  // options:{
  //   method:  'GET'  // POST
  //   params: jsonString,
  //   success: Fn
  // }
  function ajax(url, options) {
    var method = options.method.toUpperCase()
    var params = options.params
    var xhr = null
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xhr) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            if( typeof options.success === 'function'){
              options.success(xhr.responseText)
            }
          } else {
            console.log('ajax failed status:' + status)
          }
        }
      }

      //连接 和 发送 - 第二步
      if (method == 'GET') {
        var c = url.indexOf('?') > -1 ? '&' : '?';
        xhr.open('GET', url + c + params, true);
        xhr.send(null);
      }

      if (method == 'POST') {
        xhr.open('POST', url, true);
        //设置表单提交时的内容类型，设置则无法发送请求，不可设置
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
      }

    } else {
      console.log('xhr created failed!')
    }

  }


  // 启动需要携带的数据
  function getStartData() {
    return {
      // 用户位置
      // location: '',

      // 移动设备品牌
      // manufacturer: '',

      // 设备机型型号
      // model: '',

      // 屏幕高度
      screen_height: (getScreenSize()).h,

      // 屏幕高度
      screen_width: (getScreenSize()).w,

      // 联网方式
      // network_type: '',

      // 网络运营商代码
      // carrier: '',

      // APP版本
      // app_version: '',

      // 客户端IP地址
      // ip: '',

      // 客户端来源类型
      os: (getOs()).os,

      // 客户端操作系统版本
      os_version: (getOs()).os_version,

      // 浏览器名
      browser: (getBrowserInfo()).browser,

      // 浏览器版本
      browser_version: (getBrowserInfo()).version

    }
  }

  // 每次请求均需要携带的数据
  function getBaseData() {
    return {
      // 事件时间
      time: getCurrentTime(),

      // 当前页面URL
      page: getPage(),

      // 进入项目源
      referer: getReferer(),

      // 会话ID，时间戳：精确到毫秒
      session_id: getSession_id(),

      // 用户userId
      user_id: getUser_id(),

      // 设备ID，H5不重复随机字符串
      device_id: getDevice_id(),

      // 标记在app内的应该市场来源，H5写死”H5”
      channel: 'H5'

      // APP版本
      // app_version: ''

    }
  }

  // user_id sessionStorage

  function getUUID() {
    var d = (new Date()).getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ?
        r :
        (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  // 初始化
  function start(pageName, isAutoCollect, projectType){

    if( typeof projectType !== 'undefined'){
      sessionStorage.setItem(projectSessionId, projectType)
    }

    if( typeof isAutoCollect === 'undefined' || isAutoCollect){
      setAutoCollect(pageName)
    }

    startTrace(pageName)

    sendBehavior(pageName, 'PageTrace')
  }

  // 对外导出接口
  return {
    // 用户存储user_id事件
    setUser_id: setUser_id,

    // 初始化事件
    start: start,

    // 设置点击自动收集用户行为事件
    // setAutoCollect: setAutoCollect,

    // 首次进入项目的启动事件
    // startTrace: startTrace,

    // 页面及click事件
    sendBehavior: sendBehavior
  }
})();
