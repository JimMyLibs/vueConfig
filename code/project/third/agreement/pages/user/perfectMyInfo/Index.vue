<template>
    <div class="pages_perfectMyInfo">
        <EleNav title="完善个人信息"></EleNav>
        <div class="perfect_hd mg_t_20">
            <!-- 20190222-修改需求：来自：蓝忆枫烁：合同项目测试20190221(1).docx 第3条 -->
            <!-- <div class="hd_userType">
                <select name="sex" id="sex" v-model.number="perfect.userType">
                    <option value="0">请选择角色</option>
                    <option value="2">供应商</option>
                    <option value="3">经销商</option>
                </select>
            </div> -->
            <div class="hd_realName">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.realName"
                    placeholder="请输入您的姓名"
                >
            </div>
            <div class="hd_departmentName">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.departmentName"
                    placeholder="请输入所属品牌"
                >
            </div>
            <div class="hd_mobile">
                <input
                    type="text"
                    :disabled="true"
                    :value="mobile"
                    placeholder="请输入您的手机"
                    :class="{'f_red':!isPhone}"
                    @blur="checkPhone"
                >
            </div>
            <div class="hd_idCard">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.idCard"
                    placeholder="请输入您的身份证号"
                    :class="{'f_red':!isIdCard}"
                    @blur="checkIdCard"
                >
            </div>
            <div class="hd_company">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.companyName"
                    placeholder="请输入您的单位名称"
                >
            </div>
            <div class="hd_address">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.address"
                    placeholder="请输入您的地址"
                >
            </div>
            <div class="hd_area">
                <input
                    type="text"
                    :disabled="true"
                    v-model="perfect.area"
                    placeholder="请输入您的区域"
                >
            </div>
        </div>
        <div class="perfect_bd mg_t_20 bg_fff">
            <div class="bd_title f28 f_333">请上传您的身份证</div>
            <div class="bd_idcard flex justify-between">
                <picUpload
                    :bgPic="idCard1"
                    :onlyRead="!(typeEdit || typeFail)"
                    :allowPreview="!(typeEdit || typeFail)"
                    :keyName="'idCard1'"
                    @getPic="getPic"
                />
                <picUpload
                    :bgPic="idCard2"
                    :onlyRead="!(typeEdit || typeFail)"
                    :allowPreview="!(typeEdit || typeFail)"
                    :keyName="'idCard2'"
                    @getPic="getPic"
                />
            </div>
        </div>
        <div class="perfect_bd mg_t_20 bg_fff">
            <div class="bd_title f28 f_333">请上传您公司的营业执照</div>
            <div class="bd_idcard flex">
                <picUpload
                    :bgPic="perfect.businessLicenseUrls"
                    :onlyRead="!(typeEdit || typeFail)"
                    :allowPreview="!(typeEdit || typeFail)"
                    :keyName="'businessLicenseUrls'"
                    @getPic="getPic"
                />
            </div>
        </div>
        <div class="perfect_bd mg_t_20 bg_fff">
            <div class="bd_title f28 f_333">请上传您手持身份证照片</div>
            <div class="bd_idcard flex">
                <picUpload
                    :bgPic="perfect.handIdCardUrls"
                    :onlyRead="!(typeEdit || typeFail)"
                    :allowPreview="!(typeEdit || typeFail)"
                    :keyName="'handIdCardUrls'"
                    @getPic="getPic"
                />
            </div>
        </div>
        <div class="perfect_ft pd_20 text-center" v-if="$route.query.type !== 'read'">
            <button
                class="btn"
                @click="submitInfo"
            >{{$route.query.type === 'fail'?'重新提交审核':'提交审核'}}</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin";
import EleNav from "comm/components/EleNav.vue";
import picUpload from "../../../components/picUpload.vue";
import { reg } from "../../../resource/js/regular";

@Component({
    components: {
        EleNav,
        picUpload
    }
})
export default class Pages_perfectMyInfo extends Mixins(VueMixin) {
    pageName: string = "pages_perfectMyInfo";
    perfect: any = {
        // userType: 0,
        realName: "",
        departmentName: "",
        // mobile: "",
        idCard: "",
        companyName: "",
        address: "",
        area: "",
        idCard1: "",
        idCard2: "",
        businessLicenseUrls: "",
        handIdCardUrls: ""
    };
    placeholder: any = {
        // userType: "请选择角色",
        realName: "请输入您的姓名",
        departmentName: "请输入所属品牌",
        idCard: "请输入您的身份证号",
        companyName: "请输入您的单位名称",
        address: "请输入您的地址",
        area: "请输入您的区域",
        idCard1: "请上传您的身份证",
        idCard2: "请上传您的身份证",
        businessLicenseUrls: "请上传您公司的营业执照",
        handIdCardUrls: "请上传您手持身份证照片"
    };
    lock: boolean = true;
    isPhone: boolean = true;
    isIdCard: boolean = true;
    get idCard1(): string {
        return this.perfect.idCard1 || "idCard1";
    }
    get idCard2(): string {
        return this.perfect.idCard2 || "idCard2";
    }
    get idCardUrls(): string {
        return this.perfect.idCard1 + "," + this.perfect.idCard2;
    }
    get typeEdit(): boolean {
        return (this as any).$route.query.type === "edit";
    }
    get typeFail(): boolean {
        return (this as any).$route.query.type === "fail";
    }
    get allowSub(): boolean {
        
        Object.keys(this.perfect).filter(item=>item!='idCard1'&&item!='idCard2'&&item!='businessLicenseUrls'&&item!='handIdCardUrls').map(item => {
            if(this.lock){
                if(item == 'idCard' && (this.perfect as any)[item] && !reg.idCard.test(this.perfect.idCard)){
                    this.$tip('身份证号码错误')
                    this.lock = false;
                }else{
                    if(!(this.perfect as any)[item] || (this.perfect as any)[item] == "0"){
                        this.$tip(this.placeholder[item])
                        this.lock = false;
                    }
                }                
            }
        });
        const allFull: boolean = Object.keys(this.perfect).every(item => {
            return (
                (this.perfect as any)[item] &&
                (this.perfect as any)[item] != "0"
            );
        });
        return allFull;
    }
    get mobile(): string {
        return this.$user().mobile;
    }
    mounted() {
        this.getMyInfo();
    }
    checkPhone(): void {
        this.isPhone = reg.phone.test(this.perfect.mobile);
    }
    checkIdCard(): boolean {
        return this.isIdCard = reg.idCard.test(this.perfect.idCard);
    }
    getPic(res: any, key: string): void {
        this.perfect[key] = res;
    }
    getFullSrc(src: string): string {
        if(src){
            if (src.startsWith("http")) {
                return src;
            } else {
                return this.$getApiUrl() + src;
            }
        }else{
            console.log('没有得到图片')
        }
    }
    getMyInfo(): void {
        this.$post("app/company/queryDetail", {
            // useMock:'hecheng',// 启用mock数据
        }).then((res: any) => {
            this.perfect.realName = res.data.realName;
            this.perfect.departmentName = res.data.departmentName;
            this.perfect.idCard = res.data.idCard;
            this.perfect.companyName = res.data.companyName;
            this.perfect.address = res.data.address;
            this.perfect.area = res.data.area;
            // this.perfect.userType = res.data.userType;
            this.perfect.idCard1 = this.getFullSrc(
                res.data.idCardUrls.split(",")[0]
            );
            this.perfect.idCard2 = this.getFullSrc(
                res.data.idCardUrls.split(",")[1]
            );
            this.perfect.businessLicenseUrls = this.getFullSrc(
                res.data.businessLicenseUrls
            );
            this.perfect.handIdCardUrls = this.getFullSrc(
                res.data.handIdCardUrls
            );
        });
    }
    submitInfo(): void {
        this.lock = true;
        // if(!reg.phone.test(this.perfect.mobile)&&false){// 手机号默认填写，不做验证
        //     this.$tip('手机号有误')
        // }else if(!reg.idCard.test(this.perfect.idCard)){
        //     this.$tip('身份证号码有误')
        // }else{
        this.allowSub&&this.$post("app/company/updateDetail", {
            // useMock:'lile',// 启用mock数据
            realName: this.perfect.realName, // 用户姓名	body	false	string
            // departmentId: this.perfect.departmentName,// 部门ID	body	false	int64
            departmentName: this.perfect.departmentName, // 部门名称	body	false	string
            mobile: this.perfect.mobile, // 注册手机号	body	false	string
            idCard: this.perfect.idCard, // 身份证号	body	false	string
            companyName: this.perfect.companyName, // 单位名称	body	false	string
            address: this.perfect.address, // 地址	body	false	string
            area: this.perfect.area, // 区域	body	false	string
            userType: this.$user().userType, // 用户类型 2-供应商  3-经销商
            idCardUrls: this.idCardUrls, // 证件照	body	false	string
            businessLicenseUrls: this.perfect.businessLicenseUrls, // 公司营业执照	body	false	string
            handIdCardUrls: this.perfect.handIdCardUrls // 手持身份证照	body	false	string
        }).then((res: any) => {
            this.$router.replace("/user/checkState");
        });
        // }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_perfectMyInfo {
    .perfect_hd {
        & > div {
            position: relative;
            &:not(:last-child) {
                &::before {
                    content: "";
                    position: absolute;
                    display: block;
                    bottom: 0;
                    left: 0.38rem;
                    right: 0;
                    height: 1px;
                    transform: scaleY(0.5);
                    background: #dedede;
                }
            }
            input {
                width: 100%;
                height: 0.85rem;
                line-height: 0.85rem;
                border: 0;
                background: #fff;
                box-shadow: none;
                font-size: 0.28rem;
                padding: 0 0.38rem;
                color: #333333;
                box-sizing: border-box;
                &.f_red {
                    color: #ff7a6f;
                }
                &:disabled {
                    color: #333333;
                }
            }
            select {
                padding: 0 0.38rem;
                direction: ltr;
            }
            .hd_userType {
                select {
                    color: #dedede;
                }
            }
        }
    }
    .perfect_bd {
        padding: 0.3rem 0.36rem;
        .bd_idcard {
            margin-top: 0.36rem;
        }
    }
}
.hd_userType {
    background: #fff;
    select {
        font-size: 0.28rem;
    }
}
</style>
