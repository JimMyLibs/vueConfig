// vue.config.js
const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack')
const PurifyCSSPlugin = require("purifycss-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('webpack-copy-plugin')
const { projectPath, distPath, dll } = require('../src/config/project');

const dll_manifest = require(`${dll.dist}/vues_manifest.${dll.version}.json`);
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = ()=>{
    return {
        productionSourceMap: false,
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