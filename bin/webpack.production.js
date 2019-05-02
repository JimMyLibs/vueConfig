/**
 * webpack production config
 */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const baseConfig = require('./webpack.base.js')

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const {
  distPath,
  ...other
} = require('./getProjectInfo')

const currentConfig = {
  mode: 'production',
  output: {
    filename: 'chunk/[name].[chunkhash:8].js',
    chunkFilename: 'chunk/[id].[chunkhash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: distPath,
    publicPath: './' // 可配置cdn
  },
  resolve: {
    // 配置别名
    alias: {
      'devApiInfo': resolve('code/config/empty'),
      'toMock': resolve('code/config/empty')
    }
  },
  devtool: false,
  plugins: [
    // 首先清除release目录内容
    new CleanWebpackPlugin([distPath], {
      root: resolve('/')
    }),

    // css文件压缩
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: {
          remove: false
        }
      }
    }),

    new webpack.DefinePlugin({
      'process.env.ISDEV': JSON.stringify(false),
      'process.env.PROJECT_INFO': JSON.stringify({
        ...other
      })
    })
  ]
}

module.exports = webpackMerge(baseConfig, currentConfig)
