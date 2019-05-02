/**
 * [toDecimal 转化数字为几位小数，四舍五入或者截取多于位数]
 * @param  {[Number]} num         [需转化的数字]
 * @param  {Number} [digit=2]   [需保留或截取的位数]
 * @param  {Boolean} [isRround=true]            [true四舍五入，false截取多于小数]
 * @return {[Number, String]}             [转换后的结果]
 */
export function toDecimal(num, isRround = true, digit = 2) {
  num = num.toString()
  let numArr = num.split('.')
  if (numArr.length > 1) {
    // 有小数时的处理
    if (numArr[1].length <= digit) {
      // 小数位数少于需保留位数的时候
      return Number(num).toFixed(digit)
    } else {
      // 小数位数多于需保留位数的时候
      if (isRround) {
        // 四舍五入处理
        num = numArr[1][digit] >= 5
          ? parseInt(num * Math.pow(10, digit)) + 1
          : parseInt(num * Math.pow(10, digit))
        return (num / Math.pow(10, digit)).toFixed(digit)
      } else {
        // 去除多于小数
        return `${numArr[0]}.${numArr[1].substring(0, digit)}`
      }
    }
  } else {
    // 无小数时的处理
    return Number(num).toFixed(digit)
  }
}

// 当舍去位的数值大于等于6时，在舍去该位的同时向前位进一；
// 当舍去位的数值等于5时，
// 五后非零就进一
// 如果前位数值为奇，则在舍去该位的同时向前位进一，
// 如果前位数值为偶，则直接舍去该位。
// 当舍去位的数值小于5时，直接舍去该位；
/**
 * [sixFixed 使用银行要求四舍六入方法]
 * @param  {[Number，String]} num         [需转化的数字]
 * @param  {Number} [digit=2]   [保留位数]
 * @return {[Number]}             [转换后的结果]
 */
export function sixFixed(num, digit = 2) {
  let pow = Math.pow(10, digit)
  let powNum = Math.floor(num * pow)
  let addNum = ((powNum + 1) / pow).toFixed(digit)
  let floorNum = (powNum / pow).toFixed(digit)
  let arr = num.toString().split('.')

  if (arr.length === 1 || arr[1].length <= digit) {
    // 无小数位，或小数位数小于等于digit位
    return floorNum
  } else {
    let decimal = arr[1]
    // 舍弃位数字
    let abandonNum = decimal[digit]
    if (abandonNum >= 6) {
      // 进一
      return addNum
    } else if (abandonNum == 5) {
      // 当5后有数时，舍5入1
      if (Number(decimal) > 0) {
        // 进一
        return addNum
      } else {
        // 有前一位小数
        let fontNum = decimal[digit - 1]
        if (fontNum % 2 === 0) {
          // 舍弃
          return floorNum
        } else {
          // 进一
          return addNum
        }
      }
    } else {
      // 舍弃
      return floorNum
    }
  }
}

/**
 * [splitStr 每个多少位以某个符号分割一个字符串或者数字]
 * @param  {[Number,String]} str         [需要分割的数字或者字符串]
 * @param  {Number} [digit=4]   [每隔多少位开始分割]
 * @param  {String} [splitStr=' ']            [分割符]
 * @return {[String]}             [返回分割后的字符串]
 */
export function splitStr(str, digit = 4, separator = ' ') {
  str = str.toString()
  if (str.length > digit) {
    let reg = new RegExp(`\\w{0,${digit}}`, 'g')
    let endReg = new RegExp(`${separator}$`)
    let arr = str.match(reg)
    if (arr) {
      str = arr.join(separator).replace(endReg, '')
    }
  }
  return str
}

/**
 * [splitNum 3位分割数字]
 * @param  {[Number,String]} num         [需要分割的数字或者字符串]
 * @param  {Number} [digit=2]   [保留小数位数，0：舍弃小数，-1：保留原始小数](多余小数位直接舍弃)
 * @return {[String]}             [返回分割后的字符串]
 */
export function splitNum(num, digit = 2) {
  let str = num.toString()
  let numArr = str.split('.')
  let intNum = numArr[0]
  let digNum = numArr[1]

  if (intNum.length % 3 !== 0) { // 整数部分位数不为3的倍数则前补0
    intNum = `${ '0'.repeat(3 - intNum.length % 3)}${intNum}`
  }

  let threeArr = intNum.match(/\d{3}/g)
  let intResult = threeArr.join(',').replace(/^0+/, '')
  intResult = intResult
    ? intResult
    : '0'

  if (digit === -1) {
    return digNum
      ? `${intResult}.${digNum}`
      : intResult
  } else if (digit === 0) {
    return intResult
  } else {
    digNum = digNum || '0'
    if (digNum.length < digit) {
      return `${intResult}.${digNum}${ '0'.repeat(digit - digNum.length)}`
    } else {
      return `${intResult}.${digNum.substring(0, digit)}`
    }
  }
}
