/*
* 开发及测试环境下，开启vconsole功能（其他环境无效）
* 使用方法：
* 连续快速点击任意页面10下以上
 */

/*
* 关于npm中vconsole的使用问题
* vconsole中依赖babel-plugin-add-module-exports，而其package.json文件中却未配置该项
* 目前在工程中已经安装，修复了该问题
 */

import {getHostPrefix} from 'utils/utils'

// 判断是否为生产环境
export const isProd = process.env.NODE_ENV === 'prod'

// 标识是否已经加载过vconsole文件
let isReady = false

// 记录上一次点击时间
let preTime = 0

// 记录快速点击次数
let fastClickTimes = 0

// 触发加载vconsole文件的快速点击次数
let triggerTimes = 10

// 没有给document绑定而是给document.body绑定，是为了去除点击屏幕的阴影
document.body.addEventListener('touchend', () => {
  let now = Date.now()
  if( !isReady ){ // 只有在没有加载过的情况下，才加载
    if( now - preTime < 500 ){
      // 记录快速连续点击次数
      fastClickTimes++;
      preTime = now
    }else{
      // 时间间隔超过500毫秒，则清零
      preTime = now
      fastClickTimes = 0
    }
    
    let prefix = getHostPrefix()
    // 判断为测试环境，才载入vconsole
    if( prefix.includes('test') && fastClickTimes > triggerTimes ){
      import('vconsole').then(module=>{
        // console.log('vconsole is isReady')
        // isReady = module.true
        isReady = true
      })
    }
  }

}, false)
