import Vue from 'vue'
import dateFormat from 'comm/utils/dateFns'
import {sixFixed, toDecimal, splitStr, splitNum} from 'comm/utils/numberFns'

export default(filters = {}) => {
  /**
   * dateFilter事件格式化
   * @param  {[Number,String]} [value=Date.now()] [需转化的时间戳或一个能格式化的时间字符串，默认为当前时间]
   * @param  {[String]} [format='yyyy-M-d'] [需转化的时间格式]
   * yyyy年，月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)，两个字符表示按2位字符输入
   */
  Vue.filter('dateFilter', (value, format) => {
    return dateFormat(value, format)
  })

  Object.keys(filters).forEach(item => {
    Vue.filter(item, filters[item])
  })

  /**
   * [sixFixed 使用银行要求四舍六入方法]
   * @param  {[Number, String]} num         [需转化的数字]
   * @param  {Number} [digit=2]   [需保留位数]
   * @return {[Number]}             [转换后的结果]
   */
  Vue.filter('sixFloatFilter', (num, digit) => {
    return sixFixed(num, digit)
  })
  
  
  
  /**
   * [toDecimal 转化数字为几位小数，四舍五入或者截取多于位数]
   * @param  {[Number]} num         [需转化的数字]
   * @param  {Boolean} [isRround=true]            [true四舍五入，false截取多于小数]
   * @param  {Number} [digit=2]   [需保留或截取的位数]
   * @return {[Number, String]}             [转换后的结果]
   */
  Vue.filter('floatFilter', (num, isRround, digit) => {
    return toDecimal(num, isRround, digit)
  })
  
  
  
  /**
   * [splitStr 每个多少位以某个符号分割一个字符串或者数字]
   * @param  {[Number,String]} str         [需要分割的数字或者字符串]
   * @param  {Number} [digit=4]   [每隔多少位开始分割]
   * @param  {String} [separator=' ']            [分割符]
   * @return {[String]}             [返回分割后的字符串]
   */
  Vue.filter('splitStr', (str, digit, separator) => {
    return splitStr(str, digit, separator)
  })
  
  
  
  /**
   * [splitNum 3位分割数字]
   * @param  {[Number,String]} str         [需要分割的数字]
   * @param  {Number} [digit=4]   [保留小数位数，0：舍弃小数，-1：保留原始小数](多余小数位直接舍弃)
   * @return {[String]}             [返回分割后的字符串]
   */
  Vue.filter('splitNum', (str, digit) => {
    return splitNum(str, digit)
  })
}
