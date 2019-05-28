// vue.config.js
const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack')
const PurifyCSSPlugin = require("purifycss-webpack");
const CopyWebpackPlugin = require('webpack-copy-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { projectPath, distPath, dll } = require('../src/config/project');

const dll_manifest = require(`${dll.dist}/vues_manifest.${dll.version}.json`);
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = (config) => {
    return {
        plugins: [
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
                    resolve('./src/**/*.vue'),
                    resolve('./src/**/*.js'),
                    resolve('./src/**/*.scss'),
                    resolve('./src/**/*.css'),
                ]),
            }),
            // 压缩JS
            new UglifyJsPlugin({
                uglifyOptions: {// https://github.com/webpack-contrib/uglifyjs-webpack-plugin#uglifyoptions
                    warnings: false,
                    compress: {// https://github.com/mishoo/UglifyJS2#compress-options
                        drop_console: true,// 移除 console
                        drop_debugger: true,//  移除 debugger
                        booleans: true,// 优化布尔运算
                    },
                    output: {// https://github.com/webpack-contrib/uglifyjs-webpack-plugin#remove-comments                        
                        comments: false,// 去掉注释内容
                    }
                },
                sourceMap: false,
                parallel: true,
            }),
            new webpack.DllReferencePlugin({
                manifest: dll_manifest
            }),
        ]
    }
}