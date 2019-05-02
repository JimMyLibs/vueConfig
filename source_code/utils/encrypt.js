// 传输数据加密处理
import CryptoJS from 'crypto-js'

// 加密秘钥
// const appKey = '00002'
// const appKeySecret = 'A0B5C2D4E7F90301'

const secrets = {
  'h5': {
    appKey: '00003',
    appKeySecret: '754DHA8DHPN976DS'
  },
  'pc': {
    appKey: '00004',
    appKeySecret: '754DHAKJKLJA6PS'
  }
}

// params加密参数，projectType项目类型（不同项目类型，加密参数不一样）
export default function encrypt(params, projectType) {
  projectType = projectType.toLocaleLowerCase()

  if( !(projectType in secrets) ){
    throw new Error(`项目类型 ${projectType} 不存在，请正确配置`)
  }
  let {userToken} = params
  let {appKey, appKeySecret} = secrets[projectType]

  let jsonString = aesEncrypt(JSON.stringify(params), appKeySecret, appKeySecret)
  let userTokenStr = userToken
    ? `userToken${userToken}`
    : ''
  let signStr = `${appKeySecret}appKey${appKey}jsonString${jsonString}${userTokenStr}v${params.version}${appKeySecret}`
  let sign = CryptoJS.SHA1(signStr).toString().toUpperCase()
  let query = `appKey=${appKey}&v=${params.version}&sign=${sign}`
  if (userToken) {
    query = `${query}&userToken=${userToken}`
  }
  return {query, jsonString}
}

// 数据加密
function aesEncrypt(data, keyStr, ivStr) {
  let sendData = CryptoJS.enc.Utf8.parse(data)
  let key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  let encrypted = CryptoJS.AES.encrypt(sendData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
