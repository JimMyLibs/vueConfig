// vue.config.js
const path = require('path');
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = ()=>{
    return {
        devServer: {
            // host: 'localhost',
            port: '8080',
            https: false,
            open: false,// 自动打开浏览器
            proxy:{// 代理
                '/api':{
                    target:'http://api.example.com/',// 目标主机
                    ws: false,// 代理webSocket
                    changeOrigin: false,// 需要虚拟主机站点
                },
                '/api2':{
                    target:'http://api.example.com/',// 目标主机
                }
            } 
        },
    }
}