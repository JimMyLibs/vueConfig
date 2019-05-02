
const path = require('path')
const copyFolder = require('./copyFolder')
const {PROJECT_DIR_NAME} = require('../projectConfig')

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const source = resolve('source_code/demo/example')
const dest = resolve(`source_code/${PROJECT_DIR_NAME}`)


copyFolder.copyFolder(source, dest)
