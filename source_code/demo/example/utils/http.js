import HttpBase from 'utils/core/HttpBase'

export let httpConf = {

  // 项目类型，该字段跟接口类型形成映射（默认为activity）
  // product产品类型，activity活动类型，shendun神盾类型，mvcApi新api类型项目
  // update 2017-11-07（后续可能扩展）
  apiType: 'product',

  // 是否自动打印日志（true：打印，false：不打印）
  // 注意：正式环境设置为true也不会打印
  isShowConsole: true,

  // 是否提示错误（true：提示，false：不提示）
  // isShowError如果为false，则返回结果统一按照正确结果返回，错误需要自行处理
  isShowError: true,

  // 是否自动显示loading（true：显示，false：不显示）
  isShowLoading: true,

}


let http = new HttpBase(httpConf)

export default http
