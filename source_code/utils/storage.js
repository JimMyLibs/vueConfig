// projectConfig中的当前项目路径（如activities/CreditMonthExam）
const PROJECT_DIR_NAME = process.env.PROJECT_DIR_NAME.replace('/', '_')

// sessionStorage存储
export function setSession(key, value) {
  sessionStorage.setItem(getMixKey(key), getStringValue(value))
}

// sessionStorage获取
export function getSession(key) {
  return getObjectValue(sessionStorage.getItem(getMixKey(key)))
}

// localStorage获取
export function removeSession(key) {
  sessionStorage.removeItem(getMixKey(key))
}

// localStorage存储
export function setLocal(key, value) {
  localStorage.setItem(getMixKey(key), getStringValue(value))
}

// localStorage获取
export function getLocal(key) {
  return getObjectValue(localStorage.getItem(getMixKey(key)))
}

// localStorage获取
export function removeLocal(key) {
  localStorage.removeItem(getMixKey(key))
}

// 获取混合后key名
export function getMixKey(key) {
  return `${PROJECT_DIR_NAME}__${key}`
}

// 获取string类型的value
// valueType 0:字符类型，1:json类型
export function getStringValue(value) {
  let valueType = 0
  let realValue = value
  if (typeof value === 'object') {
    valueType = 1
  }
  return JSON.stringify({valueType, realValue})
}

// 返回正确格式数据（若存储的时候为json，则直接返回json对象，否则为字符串）
// valueType 0字符类型，1json类型
export function getObjectValue(value) {
  // 防止value为null的出错情况
  let {valueType, realValue} = JSON.parse(value) || {}
  return realValue
}
