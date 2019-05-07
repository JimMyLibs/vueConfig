/*
* H5与客户端交互封装类
* 使用方法：
* 1、import Native form 'utils/Native'
* 2、const native = new Native()
* 3、native.action(code, data = {}).then(res=>{
*     console.log(res)
* })
* code为事件代码
* data为实际json参数（没有可以不传该参数）
* res为客户回传参数（如果该事件对应有返回结果）
* 没有返回结果的时候，可以省略.then部分
 */

// import getAppIdInfo from 'business/getAppInfo'
// import {getRedirectUri} from 'config/weChatApi'

import { getAuthUrl } from 'comm/business/wechatApi'
import { isEmpty } from 'comm/utils/utils'

// 基于基类NativeBridge进行扩展
import NativeBridge from './core/NativeBridge'

// js与app交互基类，可根据实际需要进行扩展
// 常用action方法即继承自基类NativeBridge
export default class Native extends NativeBridge {

    constructor() {
        super()
    }

    // 客户端登录功能的封装
    // isNeedLogin为是否需要拉取客户端登录功能，默认为不拉取
    login(isNeedLogin = false) {
        return this.action('login', { isNeedLogin })
    }

    // 调用该方法可使客户端完成退出登录操作
    logout() {
        return this.action('logout')
    }

    // 提交登录信息到客户端，及客户端通过该方法可完成登录操作
    setLogin(info) {
        if (typeof info !== 'object' || isEmpty(info)) {
            throw new Error('登录信息不能为空')
        }
        return this.action('sendLoginData', info)
    }

    // 跳转到客户端某个页面
    toPage(info) {
        return this.action('goToPage', info)
    }

    // H5设置客户单导航条状态
    setNav(info) {
        return this.action('setNav', info)
    }

    // 客户端返回上一级
    goBack() {
        this.action('goBack')
    }

    // 关闭当前webview
    close() {
        this.action('setNav', { status: 1 })
    }

    // 新打开一个webview，url为打开页面地址
    open(url) {
        this.action('setNav', { status: 2, url })
    }

    // 获取app详细信息
    getDetail() {
        return this.action('getSystemInfo')
    }

    // 调用客户端分享功能
    setShare(info) {
        return this.action('setShare', info)
    }

    /**
     * tel 调用客户端拨打电话功能
     * @param {string} num 电话号码
     */
    tel(num) {
        return this.action('setShare', num)
    }

    /**
     * copy 调用客户端复制到剪切板功能
     * @param {string} text 拷贝文本类容
     * @param {boolean} isShow 是否显示复制提示
     */
    copy(text, isShow = true) {
        return this.action('setShare', { text, isShow })
    }

    /**
     *
     * @param {string} source 数据源标识，根据不同标识返回不同数据
     * @example 获取还款服务委托书信息
     * {source: 'repaymentEngagement'}
     */
    getData(source) {
        return this.action('getAppData', { source })
    }

    // H5中显示客户端交互弹窗，如银行存管开户弹窗
    popup(info) {
        return this.action('showPopop', info)
    }


    /**
     * getPosition 获取用户定位信息
     * @param {boolean} isNeedPopup 为true时，若无用户定位信息，需弹窗提醒重新定位
     */
    getPosition(isNeedPopup = false) {
        return this.action('getPosition', { isNeedPopup })
    }

    // 客户端分享功能的封装
    // options:
    /*
    {
      title: "分享标题",
      desc: "分享描述",
      imgUrl: "分享icon地址",
      link: "分享回跳地址",
      success: 成功回调函数,
      cancel: 取消分享回调函数
      type: ["0","1"]  // 调用app分享时使用，0: 微信好友, 1：朋友圈, 2：微博, 3：短信,4：你我好友,5：你我圈,6：QQ,7：QQ空间
    }
     */
    share(options, isAuth = false) {
        let {
            link,
            isShow,
            type
        } = options

        // 如果是hash值路径，则转换为对应绝对路径
        // let realLink = getRealLink(link)

        options.type = Array.isArray(type) && type.length > 0 ? type : [0, 1]
        options.isShow = typeof isShow === 'undefined' ? true : isShow
        options.link = isAuth ? getAuthUrl(link) : link

        return this.action('setShare', options)
    }
}
