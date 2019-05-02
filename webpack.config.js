const webpackMerge = require('webpack-merge')
const baseConfig = require('./config/webpack.base.js')
const currentConfig = require(`./config/webpack.${process.env.NODE_ENV}.js`)
module.exports = webpackMerge(baseConfig, currentConfig)
