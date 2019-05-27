// vue.config.js
const path = require('path');
const styleVar = require('./src/resource/style/base/var');
const bin = {
    base: require("./bin/base"),
    dev: require("./bin/dev"),
    prod: require("./bin/prod"),
}
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                ...bin.base(config),
                ...bin.prod(config),
            }
        } else {
            return {
                ...bin.base(config),
                ...bin.dev(config),
            }
        }
    },
    // scss共享js变量：https://zhuanlan.zhihu.com/p/55357377
    // 配置参考：https://cli.vuejs.org/zh/guide/css.html#向预处理器-loader-传递选项
    css: {
        sourceMap: process.env.NODE_ENV !== 'production',
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                data: Object.keys(styleVar)
                    .map(key => `\$${key}: ${styleVar[key]};`)
                    .join('\n'),
                sourceMap: true,
                sourceMapContents: true
            }
        }
    }
}