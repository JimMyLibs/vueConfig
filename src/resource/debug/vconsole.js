// 创建标签
function debug_createEle(tag,attrs){
    var debug_Ele = document.createElement(tag);
    attrs.map(function(item) {
        debug_Ele[item.name] = item.value;
    })
    document.body.append(debug_Ele)
}

// 动态插入vconsole
if(location.href.indexOf('debug=Jim') > -1){
    setTimeout(function(){
        debug_createEle('script',[{
            name:'src',
            value:'https://cdn.bootcss.com/vConsole/2.5.2/vconsole.min.js'
        }])
    },5000)
}

// 捕捉js错误
window.debug_errText = '';
window.onerror = function(msg, url, l, c, err) {
    window.debug_errText = 'msg:'+msg+';\n\n'
                +'url:'+url+', l: '+l+', c: '+c+';\n\n'
                +'err:'+err+';\n\n';
    console.log('onerror___错误信息',errText);    
    debug_createEle('div',[
        {name:'id',value:'debug_errText'},
        {name:'style',value:'position:fixed;top:0;left:0;width:80%;background:rgba(255,255,255,0.75);color: #333;padding:5px;'},
    ])
}
// 输出错误方法
function debug_print(msg){
    document.getElementById('debug_errText').innerText = msg; 
}  
window.onload = function(){
    debug_errText&&debug_print(debug_errText);
}