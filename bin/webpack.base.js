/**
 * webpack base config
 */

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('webpack-copy-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')

const {
  projectPath,
  commPath,
  configPath,
  dllDistPath,
  distPath,
  dll_version
} = require('./getProjectInfo')

const dll_manifest = require(`${dllDistPath}/vues_manifest.${dll_version}.json`)


module.exports = {
  mode: 'development',
  entry: {
    polyfills: 'isomorphic-fetch',
    main: `${projectPath}/main.js`
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue', '.css'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      comm: commPath,
      config: configPath
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: 'vue-loader'
    }, {
    }, {
      test: /\.js$/,
      use: ['babel-loader']
    }, {
      test: /\.(css|postcss)$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    }, {
      test: /\.(scss|sass)$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.(less)$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }, {
      // 图片文件处理
      test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          // 8kb以内采用base64处理
          limit: 8000,
          name: 'assets/[name].[hash:8].[ext]'
        }
      }]
    }, {
      // 字体文件处理
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${projectPath}/index.html`
    }),
    new VueLoaderPlugin(),

    new webpack.DllReferencePlugin({
      manifest: dll_manifest
    }),

    // 拷贝static目录文件 dirs?
    new CopyWebpackPlugin({
      dirs: [{
        from: `${projectPath}/static`,
        to: `${distPath}/static`,
        toType: 'dir'
      }]
    })

  ]
}
