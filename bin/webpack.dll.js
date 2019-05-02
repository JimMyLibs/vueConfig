// const path = require('path')
const webpack = require('webpack')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')
const {
  resolve,
  module: baseModule
} = require('./webpack.base.js')
const {
  dll_version,
  dllDistPath
} = require('./getProjectInfo')

module.exports = {
  mode: 'production',
  entry: {
    vues: ['vue', 'vue-router', 'vuex'],
    // commjs: ['./src/utils/commjs.js'],
    // components: ['./src/components/Loading']
    // 'element_libs': ['element-ui']
  },
  output: {
    filename: `[name].${dll_version}.js`,
    path: dllDistPath,
    library: '[name]_[chunkhash:8]'
    // publicPath: 'https://www.niiwoo.com/'
  },
  resolve,
  module: baseModule,
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DllPlugin({
      path: `${dllDistPath}/[name]_manifest.${dll_version}.json`,
      name: '[name]_[chunkhash:8]'
    })
  ]
}
