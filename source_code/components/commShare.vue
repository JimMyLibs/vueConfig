<template>
    <div></div>
</template>
<script>
import weChat from "utils/WeChat.js";
import native from "utils/Native.js";
import http from "utils/Http.js";
export default {
    data() {
        return {
            shareInfo: {}
        };
    },
    mounted() {
        this.setShare();
    },
    props: ['title', 'shareCode'],
    methods: {
        async setShare() {
            let { shareCode } = this;
            if (!!shareCode) {
                let shareInfo = await this.queryShareInfo();
                if (shareInfo.respCode === "0000") {
                    shareInfo = shareInfo.data;
                    let options = {
                        title: shareInfo.sharetitle,
                        desc: shareInfo.sharecontent,
                        link: `${shareInfo.jumpurl}?shareCode=${shareInfo.code}`,
                        imgUrl: shareInfo.shareimageurl,
                        type: ["0", "1", "2", "3", "4", "5", "6", "7"]
                    };
                    native.action("setNav", {
                        isShow: true,
                        title: this.title,
                        type: 1,
                        rightText: "分享",
                        rightFnName: "clickRightTop"
                    });
                    weChat.setShareInfo(options);
                    native.setAction("clickRightTop", function() {
                        native.share(options);
                    });
                }
            }
        },
        queryShareInfo() {
            //查询分享信息
            return http.post("homePage/getShareInfo", {
                apiType:"activity",
                params:{
                    shareCode: this.shareCode
                }
            });
        },
        clickShare() {
            let options = {
                title: "动态资讯",
                desc: "动态资讯fdfdg",
                link: "https://testh5.niiwoo.com/html5/project/news/#/index",
                imgUrl:
                    "https://test.niiwoo.com:5007/activity-manage/20180727/835cd118-b53d-4b85-9167-d96287298309.png",
                type: ["0", "1"]
            };
            native.share(options);
        }
    }
};
</script>
