<template>
    <CommPage title="合同详情">
        <div class="page_checkAgree" v-if="Object.keys(info).length > 0">
            <div
                class="item-section img-list"
                v-if="Array.isArray(info.attachmentListUrl) && info.attachmentListUrl.length > 0"
            >
                <p v-for="url in info.attachmentListUrl">
                    <img :src="url">
                </p>
            </div>
            <div
                class="item-img"
                v-if="Array.isArray(info.attachmentUrlList) && info.attachmentUrlList.length > 0"
            >
                <div class="img-list flex wrap">
                    <previewPic id="reply_previewPic" :picList="info.attachmentUrlList"/>
                </div>
            </div>
            <div class="item-section" v-if="info.showAuditBtn == 1">
                <ul class="status">
                    <li class="pass" @click="openCheckDialog(2)">通过</li>
                    <li class="no-pass" @click="openCheckDialog(3)">不通过</li>
                </ul>
                <div class="user-select">
                    <span>选择抄送的用户</span>
                    <p>
                        <select v-model="copyUserIds">
                            <option
                                v-for="({userId, realName}) in copyToUserList"
                                :value="userId"
                            >{{realName}}</option>
                        </select>
                    </p>
                </div>
            </div>
            <div
                class="review-section"
                v-if="Array.isArray(info.contractAuditResultList) && info.contractAuditResultList.length > 0"
            >
                <h2>审核记录：</h2>
                <ul class="review-list">
                    <li v-for="(item,index) in info.contractAuditResultList">
                        <div class="left-item">
                            <p class="dot"></p>
                            <p class="line"></p>
                        </div>
                        <div class="right-item">
                            <p class="review-time">{{item.createTime | dateF('yyyy-MM-dd')}}</p>
                            <div class="review-text">
                                <p>审核说明原因：{{item.reason}}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="sure-button" @click="goBack">
                <p>确定</p>
            </div>
            <dialogBox v-if="dialog.show">
                <div class="checkDialog" slot="dialog_bd">
                    <div class="check_bd">
                        <div class="check_title f30">请输入说明原因</div>
                        <div class="check_signer mg_t_20" v-if="dialog.status == 3">
                            <div class="radio_bd f_666 f28 flex wrap items-center">
                                <div
                                    class="check_radio"
                                    :class="{'checked':dialog.types.includes(item.value)}"
                                    @click="checkedType(item)"
                                    v-for="(item,index) in typeList"
                                    :key="index"
                                >{{item.name}}</div>
                            </div>
                        </div>
                        <div class="check_textarea mg_t_20">
                            <textarea
                                class="f30 noResize"
                                name="checkAdd"
                                id="checkAdd"
                                rows="3"
                                placeholder="请输入说明原因"
                                maxlength="255"
                                v-model="dialog.textarea"
                            ></textarea>
                        </div>
                        <div class="check_picUpload flex justify-between mg_t_15" v-if="dialog.status == 3">
                            <picUpload
                                id="check_picUpload1"
                                :bgPic="dialog.pic1"
                                :keyName="'pic1'"
                                @getPic="getPic"
                            />
                            <picUpload
                                id="check_picUpload2"
                                :bgPic="dialog.pic2"
                                :keyName="'pic2'"
                                @getPic="getPic"
                            />
                        </div>
                        <div class="check_signer mg_t_20" v-if="dialog.status == 3 && (types == 1 || types == 3)">
                            <div class="radio_title f_30">选择不通过签名人</div>
                            <div class="radio_bd f_666 f28 flex wrap items-center">
                                <div
                                    class="check_radio"
                                    :class="{'checked':dialog.signer.includes(item.userId)}"
                                    @click="checkedSigner(item)"
                                    v-for="(item,index) in signerList"
                                    :key="index"
                                >{{item.realName}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="check_ft text-center flex">
                        <button class="btn hb_l_c_b" :disabled="!allowSub" @click="submitCheck">确定</button>
                        <button class="btn" @click="closeCheckDialog">取消</button>
                    </div>
                </div>
            </dialogBox>
        </div>
    </CommPage>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import CommPage from "../../components/CommPage.vue";
import dialogBox from "../../components/dialogBox.vue";
import picUpload from "../../components/picUpload.vue";
import previewPic from "../../components/previewPic.vue";

@Component({
    components: {
        CommPage,
        dialogBox,
        picUpload,
        previewPic
    }
})
export default class FetchPage extends Mixins(VueMixin) {
    auditStatus: number | string = "";
    historyDetailId: number | string = "";
    id: number | string = "";
    info: any = {
        attachmentListUrl: [], // pdf图片
        contractAuditResultList: [],
        showAuditBtn: 0, // 显示审核按钮 1-显示、 0-不显示
        attachmentUrlList: [] // 审核附件
    };
    picList: string[] = [];
    signerList: any[] = [];
    typeList: any[] = [
        { name: "补充签名", value: 1 },
        { name: "补充图片", value: 2 }
    ];
    copyToUserList: any[] = [
        {
            userId: -1,
            realName: "选择用户"
        }
    ];
    copyUserIds: number | string = -1;
    dialog: any = {
        show: false,
        types: [],
        textarea: "",
        pic1: "",
        pic2: "",
        signer: [],
        status: 0
    };

    get allowSub(): boolean {
        // return this.dialog.textarea && this.dialog.signer;// 改为提示
        return true;
    }
    get types(): number {
        return this.dialog.types.reduce(
            (sum: number, item: number): number => (sum += item),
            0
        );
    }

    mounted() {
        let { auditStatus, historyDetailId, id }: any = this.$route.query;
        if (typeof id === "undefined") {
            this.$tip("数据异常，请稍后重试！");
            return false;
        }
        this.auditStatus = auditStatus;
        this.historyDetailId = historyDetailId;
        this.id = id;
        this.getDetail();
        this.getSignerList();
        this.queryCopyToUserList();
    }
    goBack(): void {
        this.$router.back();
    }
    queryCopyToUserList() {
        let { copyToUserList } = this;
        this.$post("app/contractAudit/queryCopyToUserList", {
            // useMock: "lile" // 启用mock数据
        }).then((res: any) => {
            let { data } = res;
            this.copyToUserList = [...copyToUserList, ...data];
        });
    }
    getPic(res: any, key: string): void {
        console.log("拿到图片", res, key, this.dialog[key]);
        this.dialog[key] = res;
    }
    getDetail() {
        let { auditStatus, historyDetailId, id } = this;
        this.$post("app/contractAudit/queryDetail", {
            // useMock: "lile", // 启用mock数据
            contractId: id
        }).then((res: any) => {
            let { data } = res;
            this.info = { ...data };
        });
    }
    openCheckDialog(status: number): void {
        this.dialog.show = true;
        this.dialog.status = status;
    }
    closeCheckDialog(): void {
        this.dialog = {
            show: false,
            types: [],
            textarea: "",
            pic1: "",
            pic2: "",
            signer: [],
            status: 0
        };
    }
    checkedType(item: any): void {
        if (this.dialog.types.includes(item.value)) {
            this.dialog.types.splice(this.dialog.types.indexOf(item.value), 1);
        } else {
            this.dialog.types.push(item.value);
        }
    }
    checkedSigner(item: any): void {
        if (this.dialog.signer.includes(item.userId)) {
            this.dialog.signer.splice(
                this.dialog.signer.indexOf(item.userId),
                1
            );
        } else {
            this.dialog.signer.push(item.userId);
        }
    }
    getSignerList(): void {
        let { auditStatus, historyDetailId, id } = this;
        this.$post("app/contractAudit/querySignUserList", {
            contractId: id
        }).then((res: any) => {
            this.signerList = res.data;
        });
    }
    submitCheck(): void {
        if(this.dialog.status==3){// 选择不通过
            if(this.types==0){// 【补充签名】【补充图片】都没选
                this.$tip('请选择补录类型');
            }else if(!this.dialog.textarea){
                this.$tip('请输入说明原因');
            }else if((this.types==1 || this.types==3) && !this.dialog.signer.length){// 只选择了【补充签名】或全选,缺没有选择签名人
                this.$tip('请选择签名人');
            }else{
                this.auditing();
            }
        }else if(this.dialog.status==2){// 审核通过
            this.auditing();
        }
    }
    auditing(): void {
        let { copyUserIds } = this;
        if (copyUserIds == -1) {
            copyUserIds = "";
        }
        this.$post("app/contractAudit/auditing", {
            // useMock: "lile", // 启用mock数据
            reason: this.dialog.textarea, // 说明原因	body	false	string
            attachmentUrlList: [this.dialog.pic1, this.dialog.pic2], // 上传附件	body	false	array
            reSignerUserIds: this.dialog.signer, // 重新签名人	body	false	string
            historyDetailId: this.historyDetailId, // 节点历史ID	body	false	int64
            status: this.dialog.status, // 审核状态 2-通过、3-不通过 1-撤回	body	false	byte
            copyUserIds,
            supplementType: this.types // 1-补充签名 2-补充图片 3-都补
        }).then((res: any) => {
            this.closeCheckDialog();
            this.getDetail();
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss'>
.page_checkAgree {
    .item-img {
        background: #fff;
        margin-top: 0.2rem;
    }
    .img-list {
        overflow: hidden;
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding-bottom: 0.36rem;
        #reply_previewPic {
            padding: 0;
            .weui-uploader {
                padding: 0;
            }
            .weui-uploader__file {
                width: 3.2rem;
                height: 1.9rem;
                overflow: hidden;
                border-radius: 0.1rem;
                margin: 0.36rem 0 0 0.36rem;
                border: solid 0.02rem #e9f5fe;
            }
        }
    }
    .review-section {
        font-size: 0.26rem;
        color: #333333;
        padding: 0.3rem 0.36rem 0 0.3rem;
        h2 {
            font-size: 0.3rem;
            color: #333333;
            font-weight: normal;
            margin-bottom: 0.46rem;
        }
    }
    .review-list {
        li {
            display: flex;
            .left-item {
                width: 0.26rem;
                margin-right: 0.12rem;
                display: flex;
                flex-flow: column;
                align-items: center;
                .dot {
                    width: 0.22rem;
                    height: 0.22rem;
                    border: solid 1px #a8a8a8;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &::before {
                        content: "";
                        width: 0.08rem;
                        height: 0.08rem;
                        border-radius: 50%;
                        background-color: #a8a8a8;
                    }
                }
                .line {
                    flex: 1;
                    width: 100%;
                    justify-content: center;
                    width: 1px;
                    background-color: #a8a8a8;
                }
            }
            .right-item {
                flex: 1;
                padding: 0.3rem 0 0.44rem 0;
                position: relative;
                .review-time {
                    position: absolute;
                    left: 0;
                    top: -0.08rem;
                    z-index: 3;
                }
                .review-text {
                    margin-top: 0.2rem;
                    min-height: 1.68rem;
                    background-color: #ffffff;
                    border-radius: 0.06rem;
                    padding: 0.2rem;
                }
            }
            &:last-child {
                .left-item {
                    .line {
                        display: none;
                    }
                }
            }
        }
    }
    .item-section {
        background: #fff;
        margin-top: 0.2rem;
        font-size: 0.3rem;
        color: #333333;
        padding: 0.3rem;
        .status {
            display: flex;
            justify-content: center;
            text-align: center;
            padding: 0.2rem 0;
            li {
                width: 1.8rem;
                line-height: 0.82rem;
                border-radius: 0.42rem;
                font-size: 0.34rem;
                &.pass {
                    border: solid 1px #29a1f7;
                    color: #29a1f7;
                }
                &.no-pass {
                    color: #ff6600;
                    border: solid 1px #ff6600;
                }
                &:first-child {
                    margin-right: 0.5rem;
                }
            }
        }
        .user-select {
            display: flex;
            justify-content: space-between;
            a {
                background: url(../../assets/arrow.png) right center no-repeat;
                background-size: 0.17rem auto;
                padding-right: 0.3rem;
            }
        }
    }
    .sure-button {
        padding: 0.6rem 0.94rem;
        p {
            background-color: #29a1f7;
            border-radius: 0.1rem;
            font-size: 0.36rem;
            color: #ffffff;
            line-height: 0.83rem;
            text-align: center;
        }
    }
    .dialog {
        .checkDialog {
            z-index: 1001;
            border-radius: 0.1rem;
            width: 5.9rem;
            overflow: hidden;
            .check_bd {
                padding: 0.4rem;
                background: #fff;
                .check_textarea {
                    width: 100%;
                    height: 1.6rem;
                    border: solid 0.01rem #dcdcdc;
                    border-radius: 0.1rem;
                    padding: 0.1rem;
                    textarea {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                    }
                }
                .check_signer {
                    .check_radio {
                        margin-top: 0.3rem;
                        min-width: 1rem;
                        padding-right: 0.1rem;
                        height: 0.3rem;
                        line-height: 0.3rem;
                        padding-left: 0.5rem;
                        background: url(../../resource/img/icon/check.png)
                            no-repeat left center / 0.3rem 0.3rem;
                        &.checked {
                            background: url(../../resource/img/icon/checked.png)
                                no-repeat left center / 0.3rem 0.3rem;
                        }
                    }
                }
                .check_picUpload {
                    #check_picUpload1,
                    #check_picUpload2 {
                        .weui-uploader__input-box {
                            width: 2.46rem;
                            height: 1.48rem;
                            border-radius: 0.1rem;
                            border: solid 0.02rem #e9f5fe;
                        }
                    }
                }
            }
            .check_ft {
                /* border-top: solid 1px #dedede; */
                .btn {
                    height: 1.02rem;
                    background-color: #fff;
                    border-radius: 0;
                    color: #29a1f7;
                    font-size: 0.34rem;
                    line-height: 1.02rem;
                    &:disabled {
                        color: #dedede;
                        background-color: #fff;
                    }
                }
            }
        }
    }
}
.img-list {
    img {
        vertical-align: top;
    }
}
</style>
