/*
* 如果要使用Http实例，请直接引入'utils/core/HttpBase'文件
* 本文件主要导出作用为导出HttpBase实例，后续导出Http部分代码可能会被废弃
 */

// fetch请求基类
import HttpBase from 'utils/core/HttpBase'

const defaultConf = {

  // 项目类型名称，如果是云贷项目，请设置proTypeName为'yd'
  proTypeName: '',

  // 是否自动打印日志（true：打印，false：不打印）
  // 注意：正式环境设置为true也不会打印
  isShowConsole: true,

  // 是否提示错误（true：提示，false：不提示）
  // isShowError如果为false，则返回结果统一按照正确结果返回，错误需要自行处理
  isShowError: true,

  // 是否自动显示loading（true：显示，false：不显示）
  isShowLoading: true
}

// 该部分仅仅为了兼容2017-06-05前的代码，若要扩展Http功能，请直接继承HttpBase，方法如下
// 请求基类，可根据实际需要进行扩展
export class Http extends HttpBase {
  constructor() {
    super(defaultConf)
  }
}

// 主要导出HttpBase实例
export default new HttpBase()
