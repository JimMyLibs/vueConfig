/**
 * webpack development config
 */
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const getIp = require('os-ip')
const baseConfig = require('./webpack.base.js')
const CopyWebpackPlugin = require('webpack-copy-plugin')

const IP = getIp()

const {
  devServerPort,
  distPath,
  mockPath,
  mockType,
  mockPort = '3000',
  ...other
} = require('./getProjectInfo')

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const port = devServerPort || 8888

let plugins = [
  new webpack.DefinePlugin({
    'process.env.ISDEV': JSON.stringify(true),
    'process.env.PROJECT_INFO': JSON.stringify({
      distPath,
      mockType,
      mockPort,
      devServerPort: port,
      ...other
    })
  })
]

let toMock = 'code/config/empty'

if (mockType === 'json') {
  plugins.push(new CopyWebpackPlugin({
    dirs: [
      {
        from: mockPath,
        to: `${distPath}/mock`,
        toType: 'dir'
      }
    ]
  }))
  toMock = 'code/comm/utils/toMock'
}

const currentConfig = {
  mode: 'development',
  output: {
    filename: 'chunk/[name].[hash:8].js',
    chunkFilename: 'chunk/[id].[hash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: distPath,
    publicPath: '/' //webpack-dev-server访问的路径
  },
  resolve: {
    // 配置别名
    alias: {
      'devApiInfo': resolve('code/config/devApiInfo'),
      'toMock': resolve(toMock),
      'mockPath': mockPath
    }
  },
  devtool: 'cheap-module-eval-source-map',
  plugins,
  devServer: {
    contentBase: distPath,
    // 获取本地ip地址，默认值  0.0.0.0
    host: IP,
    port,
    publicPath: '/',
    inline: true,
    noInfo: true,
    historyApiFallback: true
  }
}

module.exports = webpackMerge(baseConfig, currentConfig)
