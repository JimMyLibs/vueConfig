// js与客户端交互封装
var native = (function() {

  // 环境判断
  var isAndroid = /Android/i.test(navigator.userAgent);
  var isiOS = /iPhone OS/i.test(navigator.userAgent);

  // 回调函数注册
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
    }, 0)
  }

  // ios中init处理
  if (isiOS) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler('JS Echo', function(data, responseCallback) {
        responseCallback(data);
      })
      bridge.callHandler('ObjC Echo', {
        'key': 'value'
      }, function responseCallback(responseData) {})
    });
  }

  /**
   * [setAction H5设置方法供客户端调用]
   * @param {[String]}   actionName   [方法名]
   * @param {[Json]}   data   [请求参数，无可不传]
   * @param {Function} callback [回调函数，无可不传]
   */
  return function(actionName, data, callback) {

    // 参数兼容处理
    if(typeof data === 'undefined'){
      data = {};
    }

    if(typeof data === 'function'){
      callback = data;
      data = {};
    }

    if(typeof callback === 'undefined'){
      callback = function(){};
    }

    // 生成不重复随机函数名
    var tempFnName = '_bridge_fn_' + Date.now();

    // 注册window回调事件
    window[tempFnName] = function(result) {
      window[tempFnName] = null;
      if (typeof result == 'string') {
        callback(JSON.parse(result));
      } else {
        callback(result);
      }
    }

    if (isAndroid) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(actionName, JSON.stringify(data), tempFnName);
      })
    } else {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(actionName, data, window[tempFnName]);
      })
    }
  }
})();


// 测试demo
// native('login', {
//   isNeedLogin: false
// }, function(data) {
//   alert(JSON.stringify(data))
// })
