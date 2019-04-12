// vue.config.js
const path = require('path');
const glob = require('glob');
const styleVar = require('./src/resource/style/base/var');
const PurifyCSSPlugin = require("purifycss-webpack");
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
  }

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                comm: resolve(`/src/resource`),
                config: resolve(`/src/config`),
            }
        },
        plugins: [
            // 删除CSS冗余
            new PurifyCSSPlugin({
                paths: glob.sync(path.join(__dirname, 'public/*.html')),
            })
        ]
    },
    // scss共享js变量：https://zhuanlan.zhihu.com/p/55357377
    // 配置参考：https://cli.vuejs.org/zh/guide/css.html#向预处理器-loader-传递选项
    css: {
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