/**
 * 通过 /conf.js 文件配置信息，获取项目详细信息，如输入、输出绝对路径等
 */

const path = require('path')


let {
  projectPath,
  ...other
} = require('../conf')

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const codePath = 'code'

module.exports = {
  resolve,

  // 项目源码根目录绝对路径
  projectPath: resolve(`${codePath}/project/${projectPath}`),

  // 项目输出目录绝对路径
  distPath: resolve(`dist/${projectPath}`),

  // 地址简写
  shortPath: projectPath,

  // 项目源码根目录绝对路径
  commPath: resolve(`${codePath}/comm`),

  // 项目源码根目录绝对路径
  configPath: resolve(`${codePath}/config`),

  // mock目录
  mockPath: resolve(`${codePath}/mock/${projectPath}`),

  // 其他配置项不变
  ...other
}
