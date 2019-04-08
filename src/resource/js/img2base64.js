/**  参考：https://www.cnblogs.com/tanghaiweb/p/6677944.html
/**
     * 获得base64
     * @param {Object} obj
     * @param {Number} [obj.width] 图片需要压缩的宽度，高度会跟随调整
     * @param {Number} [obj.quality=0.8] 压缩质量，不压缩为1
     * @param {Function} [obj.before(that, blob, file)] 处理前函数,that指向的是input:file
     * @param {Function} obj.success(obj) 处理后函数
     * @example
     *
     */
    let localResizeIMG = function(obj,that) {
        console.log(1)
        //批量预览压缩
        var file,blob;
        var _self=that;
        if(that.files.length>1){
            for(var i = 0, len=_self.files.length;i<len;i++){
                file=_self.files[i];
                if (window.createObjectURL!=undefined) { // basic
                    blob = window.createObjectURL(file) ;
                } else if (window.URL!=undefined) { // mozilla(firefox)
                    blob = window.URL.createObjectURL(file) ;
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    blob = window.webkitURL.createObjectURL(file) ;
                }          
                // if (typeof(obj.before) == 'function') {
                //     obj.before(_self, blob, file)
                // };
                if(file.size/1024>300){
                    obj.quality=300/(file.size/1024)
                }else{
                    obj.quality=1
                }
                _create(blob,obj.quality, file);
            }
        }else{
        console.log(2)
            //单张预览压缩图片
            file = that.files[0];
            if (window.createObjectURL!=undefined) { // basic
                blob = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) { // mozilla(firefox)
                blob = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                blob = window.webkitURL.createObjectURL(file) ;
            }
            // 执行前函数
            // if (typeof(obj.before) == 'function') {
            //     obj.before(that, blob, file)
            // };
            if(file.size/1024>300){
                obj.quality=300/(file.size/1024)
            }else{
                obj.quality=1
            }
        console.log(3)
            _create(blob,obj.quality, file);
        }
        that.value = ''; // 清空临时数据
        

        /**
         * 生成base64
         * @param blob 通过file获得的二进制
         */
        function _create(blob,quality) {
            console.log('quality',quality);
            var img = new Image();
            img.src = blob;
            img.onload = function() {
                //生成比例
                var w = that.width,
                    h = that.height,
                    quality = w / h;
                w = obj.width || w;
                h = w / quality;

                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.style.width = w;
                canvas.style.height = h;
                ctx.drawImage(this, 0, 0, w, h);

                /**
                 * 生成base64
                 * 兼容修复移动设备需要引入mobileBUGFix.js
                 */
                var base64 = canvas.toDataURL('image/png', quality || 0.8);

                // 修复IOS
                if (navigator.userAgent.match(/iphone/i)) {
                    var mpImg = new MegaPixImage(img);
                    mpImg.render(canvas, {
                        maxWidth: w,
                        maxHeight: h,
                        quality: quality || 0.8
                    });
                    base64 = canvas.toDataURL('image/png', quality || 0.8);
                }

                // 修复android
                if (navigator.userAgent.match(/Android/i)) {
                    var encoder = new JPEGEncoder();
                    base64 = encoder.encode(ctx.getImageData(0, 0, w, h), parseFloat(quality).toFixed(1) * 100 || 80);
                }

                // 生成结果
                var result = {
                    all: base64,
                    type: base64.split(';base64,')[0].split('data:image/')[1],
                    base64: base64.substr(base64.indexOf(',') + 1),
                };

                // 执行后函数
                obj.success(result);
            };
        }
    };


    // 例子
    /*
    $('input:file').localResizeIMG({
        width: 100,
        quality: 0.1,
        //before: function (that, blob) {},
        success: function (result) {
            var img = new Image();
            img.src = result.base64;

            $('body').append(img);
            console.log(result);
        }
    });
*/
export {
    localResizeIMG,
}