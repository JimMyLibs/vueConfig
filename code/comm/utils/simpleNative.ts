
let userAgent = navigator.userAgent

export default (type: string, body = {}): any => {
  let isAndroid = userAgent.includes('Android') || userAgent.includes('Linux')
  try {
    if (isAndroid) {
      if ((window as any).App && typeof (window as any).App[type] === 'function') {
        if (Object.keys(body).length > 0) {
          console.log(body)
          return JSON.parse((window as any).App[type](JSON.stringify(body)))
        } else {
          return JSON.parse((window as any).App[type]())
        }
      }
    } else {
      if ((window as any).webkit && (window as any).webkit.messageHandlers) {
        (window as any).webkit.messageHandlers[type].postMessage(body);
      }
    }
  } catch (err) {
    console.log(err)
  }
}



