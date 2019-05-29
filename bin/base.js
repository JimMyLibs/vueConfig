// vue.config.js
const { projectPath, distPath } = require('../src/config/project');
const styleVar = require(`${projectPath}/resource/style/theme/var`);

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',// baseUrl,生产环境可配置子目录
    outputDir: `${distPath}`,
    productionSourceMap: false,
    pwa: {
        name: 'vue001',
        manifestPath: './manifest.json',
    },
    devServer: {
        // host: 'localhost',
        port: '3001',
        https: false,
        open: false,// 自动打开浏览器
        proxy: {// 代理
            '/api': {
                target: 'http://api.example.com/',// 目标主机
                ws: false,// 代理webSocket
                changeOrigin: false,// 需要虚拟主机站点
            },
            '/api2': {
                target: 'http://api.example.com/',// 目标主机
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