<template>
    <!-- 单张图片 -->
    <div class="pages_picUpload">
        <div class="weui-uploader">
            <div class="weui-gallery" v-show="galleryShow">
                <span class="weui-gallery__img" :class="{'bottom0':onlyRead}" @click="galleryShow=false" :style="'background-image: url('+prevPicUrl(picSrc)+')'"></span>
                <div class="weui-gallery__opr" @click="deletePic" v-if="!onlyRead">
                    <a href="javascript:" class="weui-gallery__del"><!-- 删除 -->
                        <i class="cssIcon icon-delete weui-icon_gallery-delete"></i>
                    </a>
                </div>
            </div>
            <div class="weui-uploader__bd">
                <div class="weui-uploader__input-box noAfter" :class="{'noBefore':onlyRead}" @click.self="openPreview" :style="{backgroundImage:'url('+prevPicUrl(inputBg)+')'}">
                    <input ref="inputPicDom" v-if="!onlyRead" class="weui-uploader__input" :class="{'allowPreview':allowPreview}" type="file" accept="image/*" @change="inputPic($event)">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins ,Prop} from "vue-property-decorator";
import lrz from "../resource/mixins/lrz";
import previewPic from "../resource/mixins/previewPic";
const img = {
    idCard1: require('../resource/img/user/idCard1.png'),
    idCard2: require('../resource/img/user/idCard2.png'),
}

@Component
export default class Pages_picUpload extends Mixins(lrz, previewPic) {
    @Prop() bgPic: string;// 默认图片样式，为空则背景为空白
    @Prop() keyName: string;// 默认图片样式，为空则背景为空白
    @Prop({default: false}) allowPreview: boolean;// 开启预览功能，预览赠送删除功能
    @Prop({default: false}) onlyRead: boolean;// 开启预览功能，预览赠送删除功能
    pageName: string = "pages_picUpload";
    img = {
        idCard1: img.idCard1,
        idCard2: img.idCard2,
    };
    inputSrc: string = '';
    get inputBg(): string {
        let bg = '';
        if(this.inputSrc){
            return bg = this.inputSrc;
        }else{
            switch(this.bgPic) {
                case 'idCard1':// 身份证正面
                    return bg = this.img[this.bgPic];
                case 'idCard2': // 身份证背面
                    return bg = this.img[this.bgPic];
                default:// 自定义图片
                    return bg = this.bgPic;
            }
        }
    }
    openPreview(): void {
        if(this.allowPreview){// 开启图片预览
            if(this.inputSrc || this.bgPic.startsWith('http')){// 图片有值 || 初始值是图片
                this.previewPic(this.inputBg,0);    
            }else{
                console.log('没有图片，不能预览');
                (this.$refs.inputPicDom as any).focus();
            }
        }
    }
    deletePic(): void {
        // 删除图片
        this.inputSrc = '';
        this.galleryShow = false;
    }
    async inputPic(e: Event): Promise < void > {
        // 添加图片
        const file: any = await this.minPic(e);
        const picSrc : string = await this.uploadBase64(file);
        if (!!file.base64) {
            this.inputSrc = picSrc;
            console.log('图片',file,this.inputSrc,this.keyName)
            this.$emit('getPic',this.inputSrc,this.keyName);
        }
        (e.target as any).value = ""; // 清空input值，以便于change可以添加相同的图片
    }
    uploadBase64(file: any): Promise<string>{// 上传图片
        return new Promise((resolve,reject)=>{
            this.$post('file/uploadBase64',{ 
                // useMock:'lile',// 启用mock数据   
                base64Data: file.base64,// base64文件	body	false	string	
                originalFilename: file.name,// 原始文件名	body	false	string
            }).then((res:any)=>{
                resolve(res.data.url);
            })
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.pages_picUpload {
    .weui-uploader {
        .weui-uploader__bd {
            overflow: hidden;

            .weui-uploader__files {
                list-style: none;

                .weui-uploader__file {
                    float: left;
                    margin-right: 0.18rem;
                    margin-bottom: 0.18rem;
                    width: 1.58rem;
                    height: 1.58rem;
                    background: no-repeat center center;
                    background-size: cover;
                    position: relative;

                    .weui-uploader__file-content {
                        display: none;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: #ffffff;
                        font-size:0.34rem;

                        .weui-icon-warn {
                            display: inline-block;
                        }
                    }

                    &.weui-uploader__file_status {
                        position: relative;

                        &:before {
                            content: " ";
                            position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            background-color: rgba(0, 0, 0, 0.5);
                        }

                        .weui-uploader__file-content {
                            display: block;
                        }
                    }
                }
            }

            .weui-uploader__input-box {
                float: left;
                position: relative;
                width: 3.19rem;
                height: 1.91rem;
                border-radius: 0.1rem;
                border: solid 1px #e9f5fe;
                box-sizing: border-box;
                background-color: #fff;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center center;
                &::before{
                    content: '';
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    width: 0.66rem;
                    height: 0.66rem;
                    transform: translate(-50%,-50%);
                    background: url(../assets/camera.png) no-repeat center center / 100%;
                }

                .weui-uploader__input {
                    position: absolute;
                    z-index: 10;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    &.allowPreview{/* 开启预览功能 */                        
                        top: 50%;
                        left: 50%;
                        width: 0.66rem;
                        height: 0.66rem;
                        transform: translate(-50%,-50%);
                        overflow: hidden;
                    }
                }
            }
        }

        .weui-gallery {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: #000000;
            z-index: 1000;

            .weui-gallery__img {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 1.2rem;
                left: 0;
                background: center center no-repeat;
                background-size: contain;
                &.bottom0{
                    bottom:0;
                }
            }

            .weui-gallery__opr {
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: #0D0D0D;
                color: #FFFFFF;
                line-height: 1.2rem;
                text-align: center;
            }

            .weui-gallery__del {
                display: block;                            
                .weui-icon_gallery-delete{
                    color:#FFFFFF;
                    font-size:0.22rem;
                    transform: scale(0.8);
                    vertical-align: middle;
                }
            }
        }
    }

}
</style>
