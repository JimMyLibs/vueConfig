const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackCopyPlugin = require('./WebpackCopyPlugin')


// 获取项目相关信息
let {resolve, releasePath, PROJECT_DIR_NAME} = require('./utils')['projectPathInfo']

module.exports = {
  output: {
    filename: 'chunk/[name].[chunkhash:8].js',
    chunkFilename: 'chunk/[id].[chunkhash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: releasePath,
    publicPath: './' // 可配置cdn
  },
  resolve: {
    // 配置别名
    alias: {
      'mockAction': resolve('source_code/utils/emptyMock'),
      'apiConf': resolve('source_code/config/apiInfo')
    }
  },
  devtool: false,
  plugins: [

    // 首先清除release目录内容
    new CleanWebpackPlugin([releasePath], {root: resolve('/')}),

    // js文件压缩
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑输出
      beautify: false,

      // 删除所有注释
      comments: false,

      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,

        // 删除所有的 `console` 语句
        // drop_console: true
      }
    }),

    // 提取公共文件，添加manifest为避免vendors编译文件名改变问题
    // 'isomorphic-fetch', 'babel-polyfill' 会影响CommonsChunkPlugin编译文件名改变，待完善
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest']
    }),

    // 拷贝project_static目录文件
    new WebpackCopyPlugin({
      from: resolve(path.join('source_code', 'project_static')),
      to: 'project_static',
      exclude: /apiSource\.(\w+\.)*json$|back\.api\.json$|\.(less|sass|scss)$/
    }),

    // 定义全局变量process.env.NODE_ENV
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('prod'), // 定义全局环境变量
      'process.env.PROJECT_DIR_NAME': JSON.stringify(PROJECT_DIR_NAME) // 定义全局目录名，作为项目目录用
    }),

    // 提取css文件
    new ExtractTextPlugin({filename: 'style/[name].[contenthash:8].css'}),

    // css文件压缩
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { remove: false }
      }
    })
  ]
}
