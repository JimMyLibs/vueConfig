// 测试环境下，使用模拟数据
import {setUserInfo, getUserInfo} from 'business/userInfo'

// openid信息
const openids = [
  "oz6VLw18rw_tQFFDU6dbJNUnm3rc",
  "oz6VLw6pSo9anVrtdgro0ddRBoGc",
  "oz6VLwzsLtAJRZKJT-ShLdtwfMlQ",
  "oz6VLw-ahb4Hw8mj-nXEPzooWQfI",
  "oz6VLw7XzLsfiV2nCBNdJqfNfkrs",
  "oz6VLw8kJSntCAOnL9xlpJtlLkRE",
  "oz6VLw0U5tiQHrJCXB8c_TbeehlI",
  "oz6VLwxgo7NnmmOdcUn8LgT8CnJs",
  "oz6VLw6T2sfUA18tIYj-4ffwJZ0w",
  "oz6VLwxNl3wu_1Obvm5wzQ-TglEo"
]

// userid信息
const userIds = [
  {
    UserId: 'b82e79df-adf4-47aa-ac59-9fdb46b9bcf7',
    UserMobile: '13000000001'
  }, {
    UserId: '4b6a67e7-7079-44da-ac5d-35b785031ea7',
    UserMobile: '13000000002'
  }, {
    UserId: 'a752ec7f-5234-4eda-95f4-d44798226acb',
    UserMobile: '13000000003'
  }, {
    UserId: '9a2a9f0b-0be9-4dfd-8760-0ac87b9db36b',
    UserMobile: '13000000004'
  }, {
    UserId: '78630269-3d52-4075-af85-fd3212b015d0',
    UserMobile: '13000000005'
  }, {
    UserId: '57d534c1-b5bc-4af9-aab4-c9ea2128a03e',
    UserMobile: '13000000111'
  }, {
    UserId: '9d76c59b-c119-4986-afcd-8ff8397c0205',
    UserMobile: '13000000962'
  }, {
    UserId: 'b6e74282-7e74-4e27-ab03-0b99caf481a0',
    UserMobile: '13000000963'
  }, {
    UserId: '9350f494-4057-43a3-b7d7-039eb5ad0137',
    UserMobile: '13000001001'
  }, {
    UserId: '1dcf8c42-b288-427a-b04e-a0c78bf8f5f4',
    UserMobile: '13000004512'
  }
]

let info = getUserInfo()
function getRandNum(){
  return parseInt(Math.random() * 10)
}

let randNum = getRandNum()

// 存储微信openid
if( typeof info.openid === 'undefined' ){
  setUserInfo({
    openid: openids[randNum]
  })
}

// 存储UserId
if( typeof info.UserId === 'undefined' ){
  setUserInfo({
    UserId: userIds[randNum].UserId
  })
}

// 存储inviterUserId
if( typeof info.inviterUserId === 'undefined' ){
  setUserInfo({
    inviterUserId: userIds[getRandNum()].UserId
  })
}

// 存储UserMobile
if( typeof info.UserMobile === 'undefined' ){
  setUserInfo({
    UserMobile: userIds[randNum].UserMobile
  })
}
