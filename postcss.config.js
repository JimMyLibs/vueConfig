module.exports = {
  plugins: {
    'precss': {},
    'autoprefixer': {
      browsers: 'last 7 versions' // last 2 未添加 webkit前缀，部分浏览器不支持
    }
  }
}
