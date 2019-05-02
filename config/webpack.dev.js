// const fs = require('fs')
const webpack = require('webpack')
const utils = require('./utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackCopyPlugin = require('./WebpackCopyPlugin')

// 获取项目详细信息
let {resolve, releasePath, PROJECT_DIR_NAME, isRandPort} = utils.projectPathInfo

// 根据配置判断是否启用mock
let {isUseMock} = require('../projectConfig')

let port = 8888
let rand = Math.floor(Math.random() * 3) // 0-3
let ports = [8888, 8880, 8080, 8088, 8800, 8808, 8008, 8008]
let mockActionFile = 'source_code/utils/emptyMock'

if (isRandPort) {
  port = ports[rand]
}

if( isUseMock ){
  mockActionFile = 'source_code/utils/mockAction'
}

let devConfig = {
  output: {
    filename: 'chunk/[name].[hash:8].js',
    chunkFilename: 'chunk/[id].[hash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: releasePath,
    publicPath: '/' //webpack-dev-server访问的路径
  },
  resolve: {
    // 配置别名
    alias: {
      'mockAction': resolve(mockActionFile),
      'apiConf': resolve('source_code/config/apiConf')
    }
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    // 拷贝project_static目录文件
    new WebpackCopyPlugin({
      from: resolve('source_code/project_static'),
      to: 'project_static',
      exclude: /back\.api\.json$|\.(less|sass|scss)$/
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'), // 定义全局环境变量
      // 'process.env.isUseMock': JSON.stringify(isNeedMock), // 定义全局mock标识
      'process.env.PROJECT_DIR_NAME': JSON.stringify(PROJECT_DIR_NAME) // 定义全局目录名，作为项目目录用
    }),

    // 提取css文件
    new ExtractTextPlugin({filename: 'style/[name].css'})
  ],
  devServer: {
    contentBase: releasePath,
    // 获取本地ip地址，默认值  0.0.0.0
    host: utils.getLocalIp(),
    port: port,
    publicPath: '/',
    inline: true,
    noInfo: true,
    historyApiFallback: true
  }
}

module.exports = devConfig
