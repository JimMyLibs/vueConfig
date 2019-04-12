
/**
 * [dateFormat 时间格式化]
 * @param  {[Number,String]} [timestamp=Date.now()] [需转化的时间戳或一个能格式化的时间字符串]
 * @param  {[String]} [format='yyyy-M-d'] [需转化的时间格式]
 * yyyy年，月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)，两个字符表示按2位字符输入
 * 举例：
 * dateFormat(Date.now(), "yyyy-MM-dd hh:mm:ss") ==> 2017-04-25 16:06:06
 * dateFormat(Date.now(), "yyyy-M-d h:m:s q")    ==> 2017-4-25 16:6:6 2
 * @return {[String]}                       [格式化时间字符串]
 */
export default function dateFormat(timestamp = Date.now(), format = 'yyyy-M-d') {
  return getFormatDate(getJsonDate(timestamp), format)
}

// 生成时间对象
export function getJsonDate(timestamp) {
  let time = new Date(getCorrectTime(timestamp))
  let jsonDate = {
    y: time.getFullYear(), //年
    M: time.getMonth() + 1, //月
    d: time.getDate(), //日
    h: time.getHours(), //时
    m: time.getMinutes(), //分
    s: time.getSeconds(), //秒
    q: Math.floor((time.getMonth() + 3) / 3) //季度
  }
  return jsonDate
}

// 生成格式化时间字符串
export function getFormatDate(jsonDate, format) {
  let dateStr = format.replace(/yyyy/g, jsonDate.y)
  Object.keys(jsonDate).forEach(e => {
    // 时间格式化操作
    let double = e.repeat(2)
    let num = jsonDate[e]
    if (format.includes(double)) {
      // 如果需要两位的格式化数据，则转换为两位数
      dateStr = dateStr.replace(double, getTwoDigit(num))
    } else {
      dateStr = dateStr.replace(e, num)
    }
  })
  return dateStr
}

/*
* 获取两个时间之间相差多少天及时分秒
* 举例：
* 2017-12-1 23:20与2017-4-19 9:55相差时间
* getDiffDay('2017-12-1 23:24','2017-4-19 9:55')
* 226天13时29分
 */
export function getDiffDay(original, minuend = Date.now()) {

  // 获得时间差值
  let diffTime = new Date(getCorrectTime(original)).getTime() - new Date(getCorrectTime(minuend)).getTime()

  // 一天的毫秒数
  let daySeconds = 24 * 3600 * 1000

  // 相差天数
  let diffDay = parseInt(diffTime / 1000 / 3600 / 24)

  // 剩余相差小时
  let diffHours = parseInt((diffTime - diffDay * daySeconds) / 1000 / 3600)

  // 剩余相差分钟
  let diffMinutes = parseInt((diffTime - diffDay * daySeconds - diffHours * 3600 * 1000) / 1000 / 60)

  // 剩余相差秒
  let diffSeconds = parseInt((diffTime - diffDay * daySeconds - diffHours * 3600 * 1000 - diffMinutes * 60 * 1000) / 1000)

  let diffDayStr = `${concatTime(diffDay, '天')}${concatTime(diffHours, '时')}${concatTime(diffMinutes, '分')}${concatTime(diffSeconds, '秒')}`

  return diffTime >= 0
    ? diffDayStr
    : `-${diffDayStr}`

  function concatTime(num, type) {
    return `${Math.abs(num)}${type}`
  }
}


/**
 * [getMoveDay 获取当前日期的前几天或者后几天的日期]
 * @param  {[Number]}  AddDayCount       [前几天或者后几天，AddDayCount为负数时为前几天的日期，AddDayCount为正数时为后几天的日期]
 * @param  {Boolean} [isTwoDigit=true] [日期是否强制2位输出]
 * @return {[String]}                    [计算后的日志，以yyyy-M-d或者yyyy-MM-dd的形式输出]
 */
export function getMoveDay(AddDayCount, isTwoDigit = true) {
  let dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount)
  if (isTwoDigit) {
    //  强制以2位数输出
    return `${getTwoDigit(dd.getFullYear())}-${getTwoDigit(dd.getMonth() + 1)}-${getTwoDigit(dd.getDate())}`
  } else {
    return `${dd.getFullYear()}-${dd.getMonth() + 1}-${dd.getDate()}`
  }
}

// 数字如果为一位数，前面加0
function getTwoDigit(num) {
  return Number(num) < 10
    ? `0${num}`
    : num
}

// 对于传入时间数据的转换
function getCorrectTime(timestamp) {
  if (isNaN(timestamp)) {
    // ios日期格式兼容处理
    timestamp = timestamp.toString().includes('-')
      ? timestamp.replace(/-/g, '/')
      : timestamp
  } else {
    timestamp = Number(timestamp)
  }
  return timestamp
}
