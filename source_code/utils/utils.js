// 判断是否为生产环境
export const isProd = process.env.NODE_ENV === 'prod'

let userAgent = navigator.userAgent

// 判断当前所在环境的主机前缀
export function getHostPrefix() {
  if (isProd) {
    return location.hostname.split('.')[0]
  } else {
    return 'test'
  }
}

// 非生产环境下console才生效
export function p(...something) {
  let hostPrefix = getHostPrefix()
  if (hostPrefix.includes('test')) {
    console.log(...something)
  }
}

// 取URL参数
export function getQueryMap(queryString) {
  let paramObj = {},
    paramList,
    oneQueryMatch,
    regGlobal = /[?&][^?&]+=[^?&#]+/g,
    regOne = /[?&]([^=?]+)=([^?&#]+)/

  queryString = queryString || location.href
  paramList = queryString.match(regGlobal)

  if (!paramList) {
    return paramObj
  }

  for (var i = 0, len = paramList.length; i < len; i++) {
    oneQueryMatch = paramList[i].match(regOne)
    if (null === oneQueryMatch) {
      continue
    }
    paramObj[oneQueryMatch[1]] = oneQueryMatch[2]
  }

  return paramObj
}

// 生成不重复签名
export function createRandomId() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4()
}

// 动态创建script标签，creatScript().then(do something)
// then会成功加载后的回调
export function creatScript(url) {
  return new Promise((resolve, reject) => {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.onload = function() {
      resolve()
    }
    script.src = url
    head.appendChild(script)
  }).catch(err => {
    p(`创建${url}失败,error:${err}`)
  })
}

// 判断变量，字符串，数组，对象是否为空
export function isEmpty(obj) {
  if (typeof obj === 'undefined') {
    return true
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true
  }

  if (typeof obj === 'object') {
    if (obj === null) {
      return true
    }

    if (Array.isArray(obj) && obj.length === 0) {
      return true
    }

    let keyArr = Object.keys(obj)
    if (keyArr && keyArr.length === 0) {
      return true
    }
  }
  return false
}

// 判断是否在你我金融app中
export function isInNiiwooApp() {
  return userAgent.toLowerCase().includes('niiwoo') || userAgent.toLowerCase().includes('sweet')
}

// 判断是否在微信中
// 本地开发环境也当成微信环境处理，以方便调试
export function isWeChat() {
  return userAgent.toLowerCase().includes('micromessenger')
}

// android终端或者uc浏览器
export function isAndroid() {
  return userAgent.includes('Android') || userAgent.includes('Linux')
}

// ios终端
export function isIOS() {
  return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

// 获取你我金融app版本号
export function getNiiwooAppVersion() {
  return userAgent.match(/niiwoo\/([\d.]+)/)[1]
}

export function deepCopy(...objs) {
  let result = {}
  objs.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => {
        let value = item[key]
        if (typeof value === 'object' && item !== null) {
          if (Array.isArray(value)) {
            result[key] = JSON.parse(JSON.stringify(value))
          } else {
            result[key] = deepCopy(result[key], value)
          }
        } else {
          result[key] = value
        }
      })
    }
  })
  return result
}
