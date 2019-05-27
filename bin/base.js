// vue.config.js
const webpack = require('webpack')
const path = require('path');
const glob = require('glob-all');
const PurifyCSSPlugin = require("purifycss-webpack");
const { projectPath, distPath, dll } = require('../src/config/project');

const dll_manifest = require(`${dll.dist}/vues_manifest.${dll.version}.json`);

// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = (config) => {
    // config.plugin('copy').tap(args => {
    //     args[0][0].from = `${projectPath}/public`;
    //     args[0][0].to = `${distPath}`;
    //     return args;
    // });
    config.plugin('html').tap(args=>{
        console.log('args',args)
        args[0].template = `${projectPath}/public/index.html`;
    });
    return {
        publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',// baseUrl,生产环境可配置子目录
        outputDir: resolve('./dist'),
        assetsDir: '',// 静态资源目录
        entryDir: {// 待测
            app: [
                `${projectPath}/main.js`,
            ]
        },
        // pages: {// 单页面||多页面
        //     index: {
        //         entry: `${projectPath}/main.js`,
        //         template: `${projectPath}/public/index.html`,
        //     },
        // },
        resolve: {
            alias: {
                comm: resolve('/src/comm'),
                config: resolve('/src/config'),
            }
        },
        plugins: [
            // 删除CSS冗余
            new PurifyCSSPlugin({
                paths: glob.sync([
                    resolve(`${projectPath}/public/*.html`),
                    resolve('./src/*.vue'),
                    resolve('./src/*.js'),
                    resolve('./src/*.scss'),
                    resolve('./src/*.css'),
                ]),
            }),
            new webpack.DllReferencePlugin({
              manifest: dll_manifest
            }),
        ]
    }
}