
	//JS与原生APP交互代码
	/**
	 * 检测是否Android平台
	 * @returns {boolean}
	 */
	let isAndroid = function() {
	    return /Android/i.test(navigator.userAgent);
	}
	/**
	 * 检测是否iOS平台
	 * @returns {boolean}
	 */
	let isiOS = function() {
	    return /iPhone OS/i.test(navigator.userAgent);
	}

	let setupWebViewJavascriptBridge = function(callback) {
	    if(isiOS()) {
	        if(window.WebViewJavascriptBridge) {
	            return callback(WebViewJavascriptBridge);
	        }
	        if(window.WVJBCallbacks) {
	            return window.WVJBCallbacks.push(callback);
	        }
	        window.WVJBCallbacks = [callback];
	        let WVJBIframe = document.createElement('iframe');
	        WVJBIframe.style.display = 'none';
	        WVJBIframe.src = 'https://__bridge_loaded__';
	        document.documentElement.appendChild(WVJBIframe);
	        setTimeout(function() {
	            document.documentElement.removeChild(WVJBIframe)
	        }, 0)
	    }
	}
	let setWebView = function(e) {
	    !!e&&e.preventDefault()
	    if(isiOS()) {
	        setupWebViewJavascriptBridge(function(bridge) {
	            bridge.callHandler('setWebView', {
	                'status': 1,
	                'url': ''
	            }, function(response) {})
	        })
	    } else {
	        window.WebViewJavascriptBridge.callHandler('setWebView', '{"status": 1, "url": ""}', function(response) {})
	    }
	    console.log('关闭webView');
	}
	let goToPage = {
		qianXiaoEr:function(e) {
		    !!e&&e.preventDefault()
		    if(isiOS()) {
		        setupWebViewJavascriptBridge(function(bridge) {
		            bridge.callHandler('goToPage', {
						"isNeedRefresh": true,
						"pageName": "qianXiaoEr",
					}, function(response) {})
		        })
		    } else {
		        window.WebViewJavascriptBridge.callHandler('goToPage', '{"isNeedRefresh": true, "pageName": "qianXiaoEr"}', function(response) {})
		    }
		    console.log('联系钱小二');
		}
	}

module.exports = {
	setWebView,goToPage,
}