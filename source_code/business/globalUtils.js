import {isInNiiwooApp, isEmpty, p, isWeChat, deepCopy} from 'utils/utils'
import {getQueryString, jsonToParams, getChangeUrl, getUrlDir} from 'utils/url'

// 作用： 常用功能方法汇总
// 使用示例:
export default {
  p, // 非正式环境打印console
  isEmpty, // 判断变量是否为 undefined，字符串是否为空，数组是否为空，对象是否为空，是否为null
  deepCopy, // json对象深拷贝，参数为一个或多个json数据
  isApp: isInNiiwooApp(), // 是否为你我金融app环境
  isWeChat: isWeChat(), // 是否为微信环境
  getQueryString, // 获取url字段值 getQueryString(name)
  jsonToParams, // json对象转换为 & 连接的字符串
  getUrlDir,  // 获取url到某一目录的路径
  getChangeUrl // 改变某个url的参数，输出转换为标准url
}
