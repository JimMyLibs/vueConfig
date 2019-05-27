// vue.config.js
const path = require('path');
const webpack = require('webpack')
const projectConf = require('../src/config/project');

// 生成目录
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.PROJECT_INFO': JSON.stringify({
                ...projectConf,
            })
        })
    ],
    resolve: {
        alias: {
            comm: resolve('./src/comm'),
            config: resolve('./src/config'),
        }
    },
}