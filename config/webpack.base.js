const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCopyPlugin = require('./WebpackCopyPlugin')

// 获取项目相关信息
const utils = require('./utils')

// 获取项目详细信息
let {resolve, projectPath, codePath} = utils.projectPathInfo

const config = {
  // 入口文件及公共库文件
  entry: {
    app: `${projectPath}/main.js`,
    vendors: ['vue', 'vuex', 'vue-router', 'isomorphic-fetch', 'babel-polyfill']
  },
  resolve: {
    // 免写后缀名配置
    extensions: [
      '.js', '.vue', '.css'
    ],
    // modules源
    modules: [
      projectPath, resolve('node_modules')
    ],
    // 配置别名
    alias: {
      'projectPath': projectPath,
      'vue$': resolve('node_modules/vue/dist/vue.common.js'),
      'public': resolve('source_code/public'),
      'store': resolve('source_code/store'),
      'assets': resolve('source_code/assets'),
      'components': resolve('source_code/components'),
      'config': resolve('source_code/config'),
      'project_static': resolve('source_code/project_static'),
      'utils': resolve('source_code/utils'),
      'business': resolve('source_code/business')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/, // babel采用babelrc文件规则
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: utils.getCssLoaders('vue-style-loader')
          }
        }
      }, {
        // css配置，暂不使用less及sass文件，采用precss语法
        test: /\.css$/,
        use: utils.getCssLoaders('style-loader')
      }, {
        // css配置，暂不使用less及sass文件，采用precss语法
        test: /\.less$/,
        use: utils.getCssLoaders('style-loader', 'less-loader')
      }, {
        // css配置，暂不使用less及sass文件，采用precss语法
        test: /\.(sass|scss)$/,
        use: utils.getCssLoaders('style-loader', 'sass-loader')
      }, {
        // 图片文件处理
        test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
        // exclude: /(static)|(project_static)\/.?/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 8kb以内采用base64处理
              limit: 8000,
              name: 'assets/[name].[hash:8].[ext]'
            }
          }
        ]
      }, {
        // 字体文件处理
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'fonts/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [

    // html模板配置
    new HtmlWebpackPlugin({template: `${projectPath}/index.html`, favicon: `${codePath}/project_static/favicon.ico`}),

    // postcss配置，precss语法，autoprefixer
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function() {
          return [require('precss'), require('autoprefixer')({
            browsers: 'last 7 versions' // last 2 未添加 webkit前缀，部分浏览器不支持
          })]
        }
      }
    }),

    // 拷贝static目录文件
    new WebpackCopyPlugin({
      from: `${projectPath}/static`,
      to: 'static',
      exclude: /project_static[\\/](apiSource|back\.api)+(\.\w+)?\.(less|sass|scss)$/
    })

  ]
}

module.exports = config
