/**
 * [各url地址汇总]
 * @type {Object}
 */



// import {getProjectInfo} from 'comm/business/projectInfo'

// const {dll_version} = getProjectInfo()
const origin = location.origin

// 公共url地址
export const publicUrls = {
    // aip文件对应服务器地址
    apiHost: `${origin}/h5/h5-base/json/apiSource.v1.json`,

    // 微信授权页面地址
    about: `${origin}/h5/app/weixinAuth.html`,

    // 项目公共登录页面
    login: `${origin}/html5/public_login/#/login`,

    // 注册页面
    register: `${origin}/html5/public_login/#/register`

}
