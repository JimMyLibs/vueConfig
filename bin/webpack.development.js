const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const getIp = require('os-ip')
const baseConfig = require('./webpack.base.js')
const CopyWebpackPlugin = require('webpack-copy-plugin')

const {
  distPath,
  devServerPort,
  mockPath,
  ...other
} = require('./getConfInfo.js')

const port = devServerPort || 8800

const currentConfig = {
  mode: 'development',
  output: {
    path: distPath,
    filename: 'chunk/[name].[hash:8].js',
    chunkFilename: 'chunk/[id].[hash:8].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ISDEV': JSON.stringify(true),
      'process.env.PROJECT_INFO': JSON.stringify(other)
    }),
    new CopyWebpackPlugin({
      dirs: [{
        from: mockPath,
        to: `${distPath}/mock`,
        toType: 'dir'
      }]
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: getIp(),
    port,
    contentBase: distPath,
    publicPath: '/',
    inline: true,
    noInfo: true,
    historyApiFallback: true
  }
}


module.exports = webpackMerge(baseConfig, currentConfig)