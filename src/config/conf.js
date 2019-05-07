export default {

  // 项目类型标识，默认为项目父级目录名，如 app, sweet
  // projectType: 'niiwoo',  // activity, app, document, manage, sweet

  // 项目名称，语法【项目类型_项目名称】，英文
  projectName: 'normal_invest',
  
  // 项目标识，即为埋点/异常监控/的项目id
  projectTag: '投资全流程',

  // 是否需要埋点
  isUtm: true,

  // 是否答应日志（如请求日志）
  isConsole: true,

  // 网络请求出错时，是否提示错误
  isTip: true,

  // 登录失效后的跳转地址，默认为公共登录页
  loginUrl: '',

  // 项目版本，埋点时使用
  version: '1.0',

  // 活动编码（活动类项目需要）
  activityCode: '',

  // 项目主要开发人员
  author: 'jim'
}
