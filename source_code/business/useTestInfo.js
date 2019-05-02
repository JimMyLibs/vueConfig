// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'dev'

// 测试环境下，启用用户相关测试数据
if( isDev ){
  import('business/getTestUserInfo').then(module=>{
    console.log('test data isReady')
  })
}
