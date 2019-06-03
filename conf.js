module.exports = {

  // 项目简写路径（忽略 code/project 部分）
  projectPath: 'document/example', // activity, app, document, manage

  // devServer运行端口号（同时运行多个项目时，可修改该项为不同值，避免互相冲突）
  devServerPort: 8808,

  // 启用mock方式：
  // 1. json为读取本地json文件方式
  // 2. node为本地node服务，该形式需启用node服务（npm run mock）
  // 3. ''为不启用mock功能
  mockType: '', // node, json, ''

  // mock服务端口号
  mockPort: '3000',

  // dll版本
  dll_version: '3.0.0'

}
