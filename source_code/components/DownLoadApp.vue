<template>
    <div @click="applink">
        <slot>
            下载App
        </slot>
    </div>
</template>
<script>
import http from "utils/Http";
const queryUtmIdSessionId = "__UtmCollect__queryUtmIdSessionId__";
import UtmCollect from 'utils/UtmCollect'

export default {
    props: {
        fn: Function,
        projectId: {
            default: "下载APP"
        },
        version: {
            default: "5.5.5"
        }
    },
    data() {
        return {
            utm: ""
        };
    },
    mounted() {
        this.utm =  new UtmCollect(
            this.projectId,
            this.version
        )
    },
    methods: {
        versions() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
                iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1 //是否iPad
            };
        },
        applink() {
            let _that = this;
            let versions = _that.versions();
            let utmString = sessionStorage.getItem(queryUtmIdSessionId);
              this.utm.trace(`${this.projectId}-立即下载`)
            if (versions.iPhone || versions.iPad || versions.ios) {
                if (navigator.userAgent.indexOf("AliApp") > -1) {
                    _that.getDownLoadUrl();
                } else {
                    this.utm.trace(`${this.projectId}-唤起IOS(Niiwoo_App)`,[],'10')
                    window.location.href = `niiwoo://${utmString}`;
                }
            } else {
                this.utm.trace(`${this.projectId}-唤起安卓(Niiwoo_App)`,[],'10')
                location.href = `niiwoofinance://open?${utmString}`;
            }

            if (_that.fn) {
                _that.fn();
            }
            let clickedAt = new Date();
            window.setTimeout(function() {
                if (new Date() - clickedAt < 2000) {
                    _that.getDownLoadUrl();
                }
            }, 500);
        },
        getDownLoadUrl() {
            http.post("homePage/appDownloadUrl", {
                apiType: "product",
                params: {}
            }).then(res => {
                let versions = this.versions();
                if (res.respCode == "0000") {
                    if (versions.iPhone || versions.iPad || versions.ios) {
                        this.utm.trace(`${this.projectId}-点击下载按钮跳转到IOS下载地址`)
                        location.href = res.data.iosUrl
                    } else {
                        this.utm.trace(`${this.projectId}-点击下载按钮跳转到安卓下载地址`)
                        location.href = res.data.androidUrl
                    }
                }
            })
        }
    }
};
</script>
