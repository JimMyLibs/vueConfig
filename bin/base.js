// vue.config.js
const webpack = require('webpack')
const path = require('path');
const glob = require('glob-all');
const PurifyCSSPlugin = require("purifycss-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('webpack-copy-plugin')
const { projectPath, distPath, dll } = require('../src/config/project');

const dll_manifest = require(`${dll.dist}/vues_manifest.${dll.version}.json`);

// 生成目录
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = (config) => {
    // config.plugin('copy').tap(args => {
    //     args[0][0].from = `${projectPath}/public`;
    //     args[0][0].to = `${distPath}`;
    //     return args;
    // });
    // config.plugin('html').tap(args=>{
    //     args[0].template = `${projectPath}/public/index.html`;
    // });
    config.entry.app = [`${projectPath}/main.js`];
    return {
        // public: process.env.NODE_ENV === 'production' ? '/' : '/',// baseUrl,生产环境可配置子目录
        // outputDir: `${distPath}`,
        // assetsDir: '',// 静态资源目录
        resolve: {
            alias: {
                comm: resolve('./src/comm'),
                config: resolve('./src/config'),
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: `${projectPath}/public/index.html`
            }),
            new CopyWebpackPlugin({
                dirs: [{
                    from: `${projectPath}/public`,
                    to: `${distPath}`,
                    toType: 'dir'
                }]
            }),
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