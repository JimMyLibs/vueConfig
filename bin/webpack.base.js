const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
  projectPath,
  commPath,
  configPath
} = require('./getConfInfo.js')

const {
  VueLoaderPlugin
} = require('vue-loader')

module.exports = {
  entry: {
    main: `${projectPath}/main.ts`,
    vues: ['vue', 'vue-router', 'vuex']
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
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }],
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        use: ['babel-loader']
      }, {
        test: /\.(css|postcss)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }, {
        // css配置，暂不使用less及sass文件，采用precss语法
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        // css配置，暂不使用less及sass文件，采用precss语法
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
      },
      {
        // 字体文件处理
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'fonts/[name].[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `${projectPath}/index.html`
    }),

    new VueLoaderPlugin()
  ]
}