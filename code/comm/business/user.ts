import simpleNative from "comm/utils/simpleNative";
import Http from "comm/utils/Http";
const http = new Http({});

// 用户信息标识
const userInfoId = '__userInfo__'


const userAgent = navigator.userAgent
const isAndroid = userAgent.includes('Android') || userAgent.includes('Linux')


// info: 
// {
//   token: '',
//   userId: '',
//   ...
// }


const uploadPushInfo = () => {
  let userAgent = navigator.userAgent
  let isAndroid = userAgent.includes('Android') || userAgent.includes('Linux')
  if (isAndroid) {
    if( (window as any).App && (window as any).App.getDeviceId()) {
      const { deviceId, os } = JSON.parse((window as any).App.getDeviceId());
      if (deviceId) {
        http.$fetch("app/user/uploadPushInfo", {
          deviceId,
          deviceType: os
        }, "post")
      }
    }
  } else if ((window as any).webkit && (window as any).webkit.getDeviceId()) {
    console.log('2-1')
    const { deviceId, os } = JSON.parse((window as any).webkit.getDeviceId());
    console.log('deviceId2-3', deviceId, os)
    if (deviceId) {
      http.$fetch("app/user/uploadPushInfo", {
        deviceId,
        deviceType: os
      }, "post").then((res: any) => {
        console.log('deviceId success', deviceId, os)
      })
    }
  } else {    
    console.log('other system',userAgent)
  }
}

export function user(info?: any): any {
  if (typeof info === 'undefined') {
    let currentInfo = JSON.parse(localStorage.getItem(userInfoId)) || {}
    if (Object.keys(currentInfo).length > 0) {
      return currentInfo
    }
    if (isAndroid) {
      let result = simpleNative('getToken') || {}
      user(result)
      return result
    } else {
      let result = JSON.parse(window.prompt('getToken')) || {}
      user(result)
      return result
    }
  } else {
    if (typeof info === 'object' && Object.keys(info).length > 0) {
      let currentInfo = JSON.parse(localStorage.getItem(userInfoId)) || {}
      localStorage.setItem(userInfoId, JSON.stringify(Object.assign({}, currentInfo, info)))
      simpleNative('saveToken', info)
      console.log('1-1')
      uploadPushInfo();
    }
  }
}

export function clearUser(): any {
  localStorage.removeItem(userInfoId)
}
