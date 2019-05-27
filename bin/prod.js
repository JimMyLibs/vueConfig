// vue.config.js
const path = require('path');
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

export default ()=>{
    return {
        productionSourceMap: false,
    }
}