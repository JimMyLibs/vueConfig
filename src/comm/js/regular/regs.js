 // 常用正则表达式汇总

 // 手机号正则
 export const mobileReg = /^1[3456789]\d{9}$/

 // 邮箱正则
 export const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/

 // 身份证正则
 export const IDReg = /(^\d{15}$)|(^\d{17}(\d|X)$)/

 // 汉字正则
 export const chineseReg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/