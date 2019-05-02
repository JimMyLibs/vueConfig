/**
 * 接口地址配置文件
 */

import {apiVersion} from 'config/apiInfo'


/**
 * 接口地址前缀信息，该项仅在本地开发环境有效，在各个环境的服务器上会获取对应的配置文件
 * @type {Object}
 * 服务器接口信息配置文件地址为：访问域名/h5/h5-base/json/apiSource.v1.json
 * 目前配置文件为apiSource.v1.json，后续版本号可能不同
 * 本地开发可根据实际情况来配置接口地址，以下为测试环境地址
 */
export const apiInfo = {
  // 版本类型接口前缀
  product: 'https://test-civet-api.niiwoo.com/civet/',

  // 活动类型接口前缀
  activity: 'https://test-activity-api.niiwoo.com/activity/',

  // 暖心借接口
  sweet: 'https://test-sweet-api.nuanxinjie.com/sweet/',

  // 神盾类型接口前缀
  shendun: 'https://test.niiwoo.com:5022/',

  // 埋点类型接口前缀
  collect: 'https://test.niiwoo.com:17037/analysis/collect/apptrace',

  // 埋点类型接口前缀
  utm: 'https://testh5.niiwoo.com/gmcollect/apptrace',

  // 当期所在环境，该项为前端定义，dev开发环境，test测试环境，prod生产环境
  env: 'dev',

  // 当前接口版本号，该项为前端自行定义，对应服务器配置文件名
  version: apiVersion
}


// 避免提示测试环境无apiHost的警告
export const apiHost = location.origin
