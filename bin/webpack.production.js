const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseConfig = require('./webpack.base.js')
const CopyWebpackPlugin = require('webpack-copy-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  resolve,
  projectPath,
  distPath,
  shortPath,
  activityCode,
  projectName
} = require('./getConfInfo.js')

const currentConfig = {
  mode: 'production',
  output: {
    filename: 'chunk/[name].[chunkhash:8].js',
    chunkFilename: 'chunk/[id].[chunkhash:8].js',
    path: distPath,
    publicPath: './' // 可配置cdn
  },
  plugins: [
    new CleanWebpackPlugin([distPath], {
      root: resolve('/')
    }),
    new webpack.DefinePlugin({
      'process.env.ISDEV': JSON.stringify(false),
      'process.env.PROJECT_INFO': JSON.stringify({
        shortPath,
        activityCode,
        projectName
      })
    }),
    new CopyWebpackPlugin({
      dirs: [{
        from: `${projectPath}/static`,
        to: `${distPath}/static`,
        toType: 'dir'
      }]
    })
    // new MiniCssExtractPlugin({
    //   filename: 'style/[name].[contenthash:8].css'
    // })
  ]
}

module.exports = webpackMerge(baseConfig, currentConfig)