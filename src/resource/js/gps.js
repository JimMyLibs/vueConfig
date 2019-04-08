
class Gps {	
	constructor() {

	}
	h5() {		
		if (navigator.geolocation){
	        navigator.geolocation.getCurrentPosition(updatePos,errorLoca);
	        function updatePos(position){
	            return {
	                latitude: position.coords.latitude,//经度坐标：十进制单位
	                longitude: position.coords.longitude,//纬度坐标：十进制单位
	                accuracy: position.coords.accuracy,//准确度：以m为单位制定纬度和经度与实际位置的差距
	                timestamp: position.timestamp,//获取位置数据的时间：时间戳                    
	            }
	        }
	        function errorLoca(error){
	            switch(error.code){
	                case 0:
	                    console.log('位置信息获取失败，失败原因'+error.message);
	                break;
	                case 1://错误编码 PERMISSION_DENIED
	                    console.log('用户拒绝共享其位置信息');
	                break;
	                case 2://错误编码 POSITION_UNAVAILABLE
	                    console.log('尝试获取用户位置数据，但失败了');
	                break;
	                case 3://错误编码 TIMEOUT
	                    console.log('尝试获取用户的位置数据超时');
	                break;
	            }
	        }
		}else{
			alert("浏览器不支持地理定位。");
		}
	}
	baiduPos(position){// 后台方法更准确
		// let latlon = position.coords.latitude+','+position.coords.longitude;
		let latlon = '22.556807,113.945553';
		//baidu
		let url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location="+latlon+"&output=json&pois=0";
		axios({ 
			method: "GET", 
			responseType: "jsonp", 
			url: url,
			debug:true,
		},res=>{
			if(json.status==0){
				console.log(json.result.formatted_address);
			}			
		},err=>{
			console.log(err,latlon+"地址位置获取失败")
		});
	}
	ggPos(position){
		var latlon = position.coords.latitude+','+position.coords.longitude;
		//google
		var url = 'http://maps.google.cn/maps/api/geocode/json?latlng='+latlon+'&language=CN';
		$.ajax({ 
			type: "GET",
			url: url, 
			beforeSend: function(){
				$("#google_geo").html('正在定位...');
			},
			success: function (json) { 
				if(json.status=='OK'){
					var results = json.results;
					$.each(results,function(index,array){
						if(index==0){
						$("#google_geo").html(array['formatted_address']);
						}
					});
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				$("#google_geo").html(latlon+"地址位置获取失败"); 
			} 
		});
	}
}

export default new Gps()