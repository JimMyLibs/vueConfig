const path = require('path');
// 生成目录
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    /* 必填 */
    projectType: 'h5',  // 项目类型标识，默认为项目父级目录名，如 h5, activity, document, manage
    projectName: 'demo',// 项目名称，即为埋点的项目id 
    projectTitle: '项目标题',
    appName: '',// 所在APP名称

    /* 选填 */
    prot: 8808,
    isUtm: true,// 是否启用埋点(独立系统)
    isErr: true,// 是否启用异常上报(独立系统:待集成)
    isPerf: true,// 是否启用性能监控(独立系统:待集成)
    isConsole: true,// 是否答应日志（如请求日志）
    isTip: true,// 网络请求出错时，是否提示错误
    loginUrl: '',// 登录失效后的跳转地址，默认为公共登录页
    version: '1.0.0',// 项目版本，埋点时使用
    author: 'jim',// 项目主要开发人员
    mock:{
        // 启用mock方式：
        // 0. 拿来即用，用完即走。http://mockapi.91525.net
        // 1. node为本地node服务，该形式需启用node服务（npm run mock）
        // 2. json为读取本地json文件方式
        // 3. ''为不启用mock功能
        type: 'http',// http, node, json, ''
        port: 3000,// mock服务端口号(仅node有效)
        dir: resolve(`code/mock/${this.projectDir}`),// mock目录
    },
    dll:{
        version: '3.0.0',// dll版本
        dist: resolve(`dist/dll`),// webpack dll文件输出目录
    },

    /* 不填 */
    projectTag: `${this.type}_${this.name}`,// 项目标识（如：h5_demo）
    projectDir: `${this.type}/${this.name}`,
    projectPath: resolve(`code/project/${this.projectDir}`),// 项目源码根目录绝对路径:[项目类型/项目名称]
    distPath: resolve(`dist/${this.projectDir}`),// 项目输出目录绝对路径
    comm: resolve(`code/comm`),// 公共目录
    config: resolve(`config`),// 配置文件目录

}