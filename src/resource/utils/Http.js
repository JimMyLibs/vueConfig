/**
 * [fetch 请求封装]
 */

import FetchBase from 'comm/utils/core/FetchBase'
import devApiInfo from 'config/devApiInfo'

import { fetchApiInfo } from 'comm/business/commApi'
// import {fetchMock} from './toMock'
import { user } from 'comm/business/user'
import { deepAssign, isEmpty, p } from 'comm/utils/utils'
import { getProjectInfo } from 'comm/business/projectInfo'


// ios error
// const {
//   ISDEV,
//   mockType,
//   mockPort,
//   projectType,
//   activityCode,
//   isConsole
// } = getProjectInfo()


// 特殊接口参数
const specialKeys = ['apiType', 'headers', 'body', 'apiInfo', 'method', 'timeout']

/**
 * [options 请求全局配置]
 * @example
 * {
 *  apiInfo: {},
 *  apiType: 'product',
 *  body: {},
 *  headers: {}
 * }
 * @type {Object}
 */
export default class Http extends FetchBase {
    constructor(options = {}) {
        super(options)

        let {
            apiInfo = {},
            ...other
        } = options

        // 全局接口信息
        this.publicApiInfo = apiInfo

        let publicOptions = {}

        // 公共配置信息
        if (typeof other === 'object') {
            publicOptions = this.formatOptions(other)
        }

        this.publicOptions = publicOptions

        this.init()

    }

    /**
     * 初始化 获取apiInfo信息
     */
    init() {
        const {
            ISDEV,
            mockType
        } = getProjectInfo()
        if (ISDEV) {
            if (mockType === 'json') {
                p('mock功能已启用，埋点请求会自动忽略')
            }
        }
    }

    /**
     *
     * @param {string} url  接口地址
     * @param {object} options  配置信息
     * @param  {Boolean} [isMixHeaders=true] [是否需要混合默认headers]
     */
    $get(url, options, isMixHeaders = true) {
        return this.$fetch(url, options, 'toGet', isMixHeaders)
    }

    $post(url, options, isMixHeaders = true) {
        return this.$fetch(url, options, 'toPost', isMixHeaders)
    }

    $upload(url, options, isMixHeaders = false) {
        return this.$fetch(url, options, 'toUpload', isMixHeaders)
    }

    /**
     * [$fetch 请求统一入口]
     * @param  {string}  url                 [接口地址]
     * @param  {object}  options             [请求配置]
     * @param  {string}  fnName              [请求函数名]
     * @param  {Boolean} [isMixHeaders=true] [是否需要混合默认headers]
     * @return {function}                    [请求promise]
     */
    $fetch(url, options, method, isMixHeaders = true) {
        let { apiInfo, headers, body, apiType } = this.getFetchOptions(options, isMixHeaders)
        let reqUrl = ''
        const {
            ISDEV,
            mockType,
            mockPort,
            // devServerPort
        } = getProjectInfo()
        if (ISDEV) {
            if (mockType === 'node') {
                url = url.replace(/^\/+/, '')
                reqUrl = `${location.protocol}//${location.hostname}:${mockPort}/${url}`
            } /* else if (mockType === 'json' && typeof fetchMock === 'function') {
                url = url.replace(/^\/+/, '')
                return fetchMock(url, { headers, body })
            } */ else { // not use mock
                if (isEmpty(apiInfo)) {
                    reqUrl = this.getUrl(url, devApiInfo, apiType)
                }
            }
            return this[method](reqUrl, { headers, body })
        } else {
            return fetchApiInfo().then(res => {
                reqUrl = this.getUrl(url, res, apiType)
                return this[method](reqUrl, { headers, body })
            })
        }
    }

    /**
     * [getFetchOptions 获得请求配置信息]
     * @param  {object}  options             [请求配置]
     * @param  {Boolean} [isMixHeaders=true] [是否需要混合默认headers]
     * @return {object}                      [请求配置信息]
     */
    getFetchOptions(options, isMixHeaders = true) {
        let { publicApiInfo, publicOptions } = this
        let {
            apiInfo = {},
            ...currentOptions
        } = this.formatOptions(options)

        let mixApiInfo = deepAssign(publicApiInfo, apiInfo)
        let mixOptions = deepAssign(publicOptions, currentOptions)

        let {
            headers = {},
            apiType,
            body
        } = mixOptions

        return {
            apiType,
            apiInfo: {
                ...mixApiInfo
            },
            headers: isMixHeaders
                ? this.mixHeaders(headers)
                : headers,
            body: this.mixBody(body)
        }
    }

    /**
     * [getUrl description]
     * @param  {string}  url       [接口地址]
     * @param  {string} mixApiInfo [混合后的接口信息]
     * @param  {string} apiType    [接口类型]
     * @return {string}            [完整接口地址]
     */
    getUrl(url, mixApiInfo, apiType) {
        let { apiInfo } = this
        const {
            projectType
        } = getProjectInfo()
        if (url.search(/^https?/) > -1) {
            return url
        }
        apiType = apiType || projectType
        url = url.replace(/^\/+/, '')
        mixApiInfo = mixApiInfo || apiInfo
        let typeUrl = mixApiInfo[apiType]
        if (typeof typeUrl === 'undefined') {
            throw new Error('type is not in apiInfo')
        }
        typeUrl = `${typeUrl.replace(/\/+$/, '')}`
        return url
            ? `${typeUrl}/${url}`
            : typeUrl
    }

    // 格式化options
    formatOptions(options = {}) {
        if (typeof options === 'string') {
            return { body: options }
        }
        let isFindSpecial = Object.keys(options).some(key => specialKeys.includes(key))
        if (isFindSpecial) {
            return {
                ...options
            }
        }
        return {
            body: {
                ...options
            }
        }
    }

    // 合并默认参数
    mixBody(body = {}) {
        const {
            activityCode
        } = getProjectInfo()
        if (typeof body === 'string') {
            return body
        }
        let { openid } = user()

        if (openid) {
            body = deepAssign({
                openid
            }, body)
        }

        if (activityCode) {
            body = deepAssign({
                activityCode
            }, body)
        }

        return body
    }

    // 未设置Content-type， 则设置默认Content-type
    // 默认为： 'Content-type': 'application/json; charset=UTF-8'
    mixHeaders(headers = {}) {
        let { token } = user()
        let isHadContentType = Object.keys(headers).some(item => item.toLocaleLowerCase() === 'content-type')
        if (!isHadContentType) {
            headers = {
                ...headers,
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        if (token) {
            headers = {
                token,
                ...headers
            }
        }
        return {
            ...headers
        }
    }

}
