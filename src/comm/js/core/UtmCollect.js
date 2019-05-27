import { user } from 'comm/business/user'
import Http from 'comm/js/http/Http'
import { getBrowserInfo, getOs } from 'comm/js/env/env'
import { getUUID } from 'comm/js/utils/utils'
import { fetchApiInfo } from 'comm/business/commApi'
import { getProjectInfo } from 'comm/business/projectInfo'

const { projectType } = getProjectInfo()

const http = new Http({ apiType: 'utm' })

// 当前用户会话session标识
const userSessionSessionId = '__UtmCollect__userSessionSessionId__'

// 存储用户deviceId的localStorage标识
// 该值为不重复随机字符串，一经生成则一直沿用（如果用户手动删除，则重新生成）
const deviceIdlocalId = '__UtmCollect__deviceIdlocalId__'

// url字符串中包含utm来源的sessionStorage表示
const queryUtmIdSessionId = '__UtmCollect__queryUtmIdSessionId__'

// url字符串中包含utm来源的sessionStorage表示
const projectInfoSessionId = '__UtmCollect__projectInfoSessionId__'

// 是否已经发送过device事件标识
const isSendDeviceSessionId = '__UtmCollect__isSendDeviceSessionId__'

const utmKeys = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign']

const inputEleArr = ['input', 'textarea', 'select', 'button']

// 项目appkey
const appKeys = {
    [projectType]: { // 当前项目不同环境对应appkey
        dev: 'dd147d7eccbb4623e4f0e13174062f92',
        test: 'dd147d7eccbb4623e4f0e13174062f92',
        prod: '64a74538133a79f9e83d38660fabc7ae'
    },
    sweet: { // 暖心借不同环境对应appkey
        dev: 'a7e028b1dc3ef9c0202a2d312f6bb17d',
        test: 'a7e028b1dc3ef9c0202a2d312f6bb17d',
        prod: '97477e78a4a066df552834af35ddbdb2'
    }
}

// 采集用户行为类
export default class UtmCollect {
    /**
     * [constructor 初始化实例]
     * @param {String} [projectTag='']     [项目名称标识，用于区分不同项目，如H5：投资全流程]
     * @param {String} [app_version] [项目版本号，如：5.4.0]
     * @param {String} [isAutoCollect = true] [是否启用页面元素添加event_id的data项来埋点]
     * @param {String} [keyType=projectType] [项目key类型，对应appKeys中项，方便后续扩展]
     */
    constructor(projectTag = '', app_version = '', isAutoCollect = true, keyType = projectType) {
        this.projectTag = projectTag
        this.appVersion = app_version
        this.isAutoCollect = isAutoCollect
        this.keyType = keyType
        this.isSetAutoEvent = false
        this.isSetClipboard = false
        this.saveProjectInfo()
        this.setQueryInfo()
        this.setAutoCollect()
        this.clipboard()
    }

    // 存储项目信息（sessionStorage）
    saveProjectInfo() {
        let { projectTag, appVersion } = this
        if (!projectTag) {
            throw new Error('projectTag 不能为空！')
        }
        sessionStorage.setItem(projectInfoSessionId, JSON.stringify({ projectTag, version: appVersion }))
    }

    /**
     * [trace 事件埋点]
     * @param  {String} event_id          [事件名称，可以中英文，若客户端有相同事件，名称需保持一致]
     * @param  {Array}  [attributes=[]]   [埋点附加数据，需为{n:v}格式]
     * @param  {String} [url = location.href] [当前页面url地址，该项用来修改单页应用中，页面切换时的url修正]
     * @param  {String} [event_entry='2'] [1.页面加载 ，2.按钮点击，3.banner横幅点击，4.会话结束 ，0、未知]
     * @return {Promise}                   [请求promise]
     */
    trace(event_id, attributes = [], event_entry = '2', url = location.href) {
        if (typeof event_id !== 'string') {
            console.log('埋点event_id必须为非空字符串')
        }
        if (typeof event_entry === 'number') {
            event_entry = `${event_entry}`
        }
        attributes = this.getAndCheckAttr(attributes)
        let session_id = this.userSession()
        let { projectTag, appVersion, queryInfo } = this
        let { os, version: os_version } = getOs()
        let { browser, version: browser_version } = getBrowserInfo()
        let { ref, referer_domain } = this.getRefererInfo()
        if (!(event_id.startsWith(projectTag))) {
            event_id = `${projectTag}-${event_id}`
        }
        return this.send({
            type: 'trace',
            event_id,
            event_entry,
            session_id,
            app_version: appVersion,
            channel: 'H5',
            project_id: projectTag,
            os,
            os_version,
            browser_brand: browser,
            browser_version,
            referer_domain,
            url, // 当前url
            ref,
            ...queryInfo,
            attributes
        })
    }

    /**
     * [device 采集设备信息，项目启动后上报一次即可, 对应文档device事件]
     * @return {Promise} [请求promise]
     */
    device() {
        return new Promise((resolve, reject) => {
            let isSendDevice = sessionStorage.getItem(isSendDeviceSessionId)
            if (isSendDevice == 1) {
                resolve()
            } else {
                let { os, os_version } = getOs()
                // cookie_id上报
                this.sendCookieId()
                // 启动的时候，是否有eventId，应该为页面别名
                this.send({ type: 'device', brand: os, model: `${os} ${os_version}`, screen: `${window.screen.width}*${window.screen.height}` }).then(res => {
                    sessionStorage.setItem(isSendDeviceSessionId, 1)
                    resolve(res)
                }).catch(reson => {
                    reject(reson)
                })
            }
        })
    }

    /**
     * [trace 页面埋点]
     * @param  {String} event_id          [事件名称，可以中英文，若客户端有相同事件，名称需保持一致]
     * @param  {Array}  [attributes=[]]   [埋点附加数据，需为{n:v}格式]
     * @param  {String} [url = location.href] [当前页面url地址，该项用来修改单页应用中，页面切换时的url修正]
     * @return {Promise}                   [请求promise]
     */
    page(event_id, attributes = [], url = location.href) {
        let { projectTag } = this
        if (!(event_id.startsWith(projectTag))) {
            event_id = `${projectTag}-${event_id}`
        }
        this.trace(event_id, attributes, '1', url)
    }

    // cookie_id上报
    sendCookieId() {
        let deviceId = this.getDeviceId()
        let { queryInfo } = this
        if (Object.keys(queryInfo).length > 0) {
            this.trace('流量着陆', [
                {
                    n: 'cookie_id',
                    v: deviceId
                }, {
                    n: 'ua',
                    v: navigator.userAgent
                }
            ], '13')
        }
    }

    /**
     * [user 用户信息埋点事件，对应文档user事件]
     * @param  {Array}  [attributes=[]] [为改装成n, v结构的json数据]
     * @return {Promise}                 [请求promise]
     */
    user(attributes = []) {
        attributes = this.getAndCheckAttr(attributes)
        return this.send({ type: 'user', attributes })
    }

    /**
     * [getAndCheckAttr 检测attributes结构是否正确，并返回数组形式数据]
     * @param  {Array}  [attr=[]] [埋点附加数据]
     * @return {Array}           [数组形式数据]
     */
    getAndCheckAttr(attr = []) {
        if (!(Array.isArray(attr))) {
            attr = [attr]
        }
        if (attr.length > 0) {
            let { n, v } = attr[0]
            if (typeof n === 'undefined' || typeof v === 'undefined') {
                console.log('埋点属性必须转换为{n: v}形式的json')
            }
        }
        return [...attr]
    }

    /**
     * [getRefererInfo 解析document.referrer]
     * @return {[object]} [返回referrer及referrer的domain部分]
     */
    getRefererInfo() {
        let ref = document.referrer || ''
        let referer_domain = ref.match(/https?:\/\/[^/]+/)
        referer_domain = referer_domain
            ? referer_domain[0]
            : ''
        return { ref, referer_domain }
    }

    // 存储url上携带的utm信息及cookie_id处理
    setQueryInfo() {
        let { isSetClipboard } = this
        if (!isSetClipboard) {
            let href = location.href
            let queryInfo = {}
            let search = href.match(/\?[^#/]+/)
            let device_id = this.getDeviceId()
            let clipboardStr = [`cookie_id=${device_id}`]
            search = search
                ? search[0].replace('?', '')
                : ''
            if (search) {
                let queryArr = search.split('&')
                queryArr.forEach(item => {
                    let eachQuery = item.split('=')
                    if (utmKeys.includes(eachQuery[0])) {
                        queryInfo[eachQuery[0]] = eachQuery[1]
                        clipboardStr.push(item)
                    }
                })
            }
            sessionStorage.setItem(queryUtmIdSessionId, clipboardStr.join('&'))
            this.queryInfo = queryInfo
        }
    }

    /**
     * [send 上报埋点数据]
     * @param  {Object} info [埋点数据]
     * @return {Promise}      [请求promise]
     */
    send(info) {
        return fetchApiInfo().then(res => {
            let { env } = res
            let { keyType } = this
            let keyObj = appKeys[keyType] || appKeys[projectType]
            let key = keyObj[env] || keyObj['prod']
            let baseData = this.getBaseData()
            let sendData = { // 整合基础数据
                ...baseData,
                appkey: key,
                ...info
            }
            return http.$post('', JSON.stringify([sendData]), false).then(res => { }).catch(e => {
                this.showError(e, sendData)
            })
        })
    }

    showError(e, sendData = {}) {
        let msg = typeof e === 'string'
            ? `失败原因：${e}`
            : ''
        let { type, event_id } = sendData
        event_id = event_id
            ? `, event_id: ${event_id}`
            : ''
        if (window.console) {
            console.log(`埋点出错: type: ${type}${event_id}。${msg}`)
            console.log(e)
        }
    }

    // 判断是否绑定剪切板事件，若为绑定则绑定
    clipboard() {
        let { isSetClipboard } = this
        if (!isSetClipboard) {
            this.toClipboard()
            this.addEvent(document.body, 'click', this.toClipboard.bind(this))
        }
    }

    // 复制内容到剪切板
    toClipboard(e) {
        let { isSetClipboard } = this
        if (!isSetClipboard) {
            let flg = true
            // 解决表单元素无法获取焦点的问题
            if (e && e.target && e.target.tagName) {
                let tagName = e.target.tagName.toLocaleLowerCase()
                if (inputEleArr.some(item => item === tagName)) {
                    flg = false
                }
            }

            if (flg) {
                const id = 'clipboard_textarea'
                let msg = sessionStorage.getItem(queryUtmIdSessionId)
                let ele = document.querySelector(`#${id}`)
                if (!msg) {
                    return false
                }
                if (!ele) {
                    ele = document.createElement('textarea')
                    ele.id = id
                    ele.style.position = 'absolute'
                    ele.style.left = '-9999px'
                    ele.style.top = '-9999px'
                    ele.setAttribute('readonly', '')
                    document.body.appendChild(ele)
                }
                ele.value = `${projectType}://${msg}`
                this.isSetClipboard = true
                try {
                    ele.select()
                    ele.setSelectionRange(0, ele.value.length)
                    document.execCommand('copy')
                } catch (e) {
                    this.showError(e)
                }
            }
        }
    }

    // 设置是否使用元素属性埋点
    setAutoCollect() {
        let { isAutoCollect, isSetAutoEvent } = this
        if (isAutoCollect && !isSetAutoEvent) {
            this.isSetAutoEvent = true
            this.addEvent(document.body, 'click', this.autoSendClickBehavior.bind(this))
        }
    }

    // 使用元素属性埋点
    autoSendClickBehavior(e) {
        let ele = e.target
        let event_id = this.dataSet(ele, 'event_id')
        let pageUrl = this.dataSet(ele, 'page_url')
        let attr = this.dataSet(ele, 'attr')
        if (typeof event_id !== 'undefined') {
            this.trace(event_id, attr, '2', pageUrl)
        }
    }

    dataSet(ele, name, value) {
        if (typeof value === 'undefined') { // get
            if ('dataset' in ele) {
                return ele.dataset[name]
            } else {
                return ele.getAttribute(`data-${name}`) || undefined
            }
        } else { // set
            if ('dataset' in ele) {
                ele.dataset[name] = value
            } else {
                ele.setAttribute(`data-${name}`, value)
            }
        }
    }

    // 给元素添加事件
    addEvent(ele, type, callback) {
        if (ele.addEventListener) {
            ele.addEventListener(type, callback, false)
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + type, callback)
        } else {
            console.log('addEvent failed!')
        }
    }

    // 每次请求均需要携带的数据
    getBaseData() {
        let { userId } = user()

        // 兼容老项目处理
        userId = userId ? userId : ''
        return {

            // 用户userId
            user_id: userId,

            // 设备ID，H5不重复随机字符串
            device_id: this.getDeviceId(),

            platform: 'js',

            // 事件时间
            time: Date.now()
        }

    }

    // 创建或返回用户会话id
    userSession() {
        let now = Date.now()
        let sessionId = sessionStorage.getItem(userSessionSessionId)
        if (!sessionId) {
            sessionId = now.toString()
            sessionStorage.setItem(userSessionSessionId, sessionId)
        }
        return sessionId
    }

    // 生成随机字符串，模拟app的设备id
    getDeviceId() {
        let deviceId = localStorage.getItem(deviceIdlocalId)
        if (!deviceId) {
            deviceId = getUUID()
            localStorage.setItem(deviceIdlocalId, deviceId)
        }
        return deviceId
    }

}
