const webpack = require('webpack');
const { dll } = require('../src/config/project')

module.exports = {
    mode: 'production',
    entry: {
        vues: ['vue', 'vue-router', 'vuex'],
    },
    output: {
        filename: `[name].${dll.version}.js`,
        path: dll.dist,
        library: '[name]_[chunkhash:8]'
        // publicPath: 'https://www.example.com/'
    },
    plugins: [
        new webpack.DllPlugin({
            path: `${dll.dist}/[name]_manifest.${dll.version}.json`,
            name: '[name]_[chunkhash:8]'
        })
    ]
}