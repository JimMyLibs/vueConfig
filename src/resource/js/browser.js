	let getBrowser = function(getVersion){
	    //注意关键字大小写
	    let ua_str = navigator.userAgent.toLowerCase(), ie_Tridents, trident, match_str, ie_aer_rv, browser_chi_Type;

	    //判断IE 浏览器, 
	    if("ActiveXObject" in self){
	        // ie_aer_rv:  指示IE 的版本.
	        // It can be affected by the current document mode of IE.
	        ie_aer_rv= (match_str = ua_str.match(/msie ([\d.]+)/)) ?match_str[1] :
	              (match_str = ua_str.match(/rv:([\d.]+)/)) ?match_str[1] : 0;

	        // ie: Indicate the really version of current IE browser.
	        ie_Tridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
	        //匹配 ie8, ie11, edge
	        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/)) ?match_str[1] : undefined;
	        browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
	    }else{
	        //判断 windows edge 浏览器
	        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
	        // match_str[1]: 返回版本号,如: "edge" 
	        //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
	        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/)) ? "edge" :
	                    //判断firefox 浏览器
	                      (match_str = ua_str.match(/firefox\/([\d.]+)/)) ? "firefox" : 
	                    //判断chrome 浏览器
	                      (match_str = ua_str.match(/chrome\/([\d.]+)/)) ? "chrome" : 
	                    //判断opera 浏览器
	                      (match_str = ua_str.match(/opera.([\d.]+)/)) ? "opera" : 
	                    //判断safari 浏览器
	                      (match_str = ua_str.match(/version\/([\d.]+).*safari/)) ? "safari" : undefined;
	    }

	    //返回浏览器类型和版本号
	    let verNum, verStr;
	    verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];
	    verStr = (getVersion != undefined) ? browser_chi_Type+"/"+verNum : browser_chi_Type;
	    return verStr;
	 }
    let checkFlash_1 = function(){
        function flashChecker() {
            let hasFlash = 0;　　　　 //是否安装了flash
            let flashVersion = 0;　　 //flash版本
            if (document.all) {
                let swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');// IE10报错：Automation 服务器不能创建对象
                if (swf) {
                    hasFlash = 1;
                    VSwf = swf.Getletiable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                }
            } else {
                if (navigator.plugins && navigator.plugins.length > 0) {
                    let swf = navigator.plugins["Shockwave Flash"];
                    if (swf) {
                        hasFlash = 1;
                        let words = swf.description.split(" ");
                        for (let i = 0; i < words.length; ++i) {
                            if (isNaN(parseInt(words[i]))) continue;
                            flashVersion = parseInt(words[i]);
                        }
                    }
                }
            }
            return {
                f: hasFlash,
                v: flashVersion
            };
        }
        let fls = flashChecker();
        if (fls.f){
            console.log("【flash】您安装了flash,当前flash版本为: " + fls.v + ".x")
        }else{
        	console.log("【flash】您没有安装或开启flash")
        }
        return !!fls.f;
    }
    let checkFlash = function(){
	      let flag = false;
	      if(window.ActiveXObject){
	        try{
	          let swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
	          if(swf){
	            flag = true;
	          }
	        }catch(e){
	        }
	      }else{
	        try{
	          let swf = navigator.plugins['Shockwave Flash'];
	          if(swf){
	            flag = true;
	          }
	        }catch(e){
	        }
	      }
	      if(flag){
	        console.log("【flash】 ok");
	      }else{
	        console.log("【flash】 error");
	      }
	      return !!flag;
    }

// 返回在vue模板中的调用接口
export default {
    getBrowser,// 判断浏览器类型及版本方法
    checkFlash,checkFlash_1,// 判断flash是否禁用方法
}