// 拷贝目录插件
const path = require('path')
const copyFolder = require('./copyFolder')

class WebpackCopyPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.plugin('done', () => {
      let outputPath = compiler.options.output.path
      let {from, to, exclude} = this.options
      copyFolder.copyFolder(from, path.join(outputPath, to), exclude)
    })
  }
}

module.exports = WebpackCopyPlugin
