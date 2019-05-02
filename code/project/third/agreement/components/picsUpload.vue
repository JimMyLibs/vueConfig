<template>
    <!-- 多张图片 -->
    <div class="pages_picUpload">
        <div class="weui-uploader">
            <div class="weui-gallery" v-show="galleryShow">
                <span class="weui-gallery__img" @click="galleryShow=false" :style="'background-image: url('+prevPicUrl(picSrc)+')'"></span>
                <div class="weui-gallery__opr" @click="deletePic">
                    <a href="javascript:" class="weui-gallery__del"><!-- 删除 -->
                        <i class="cssIcon icon-delete weui-icon_gallery-delete"></i>
                    </a>
                </div>
            </div>
            <div class="weui-uploader__bd">
                <ul class="weui-uploader__files">
                    <li class="weui-uploader__file" v-for="(item,index) in picList" @click.self="previewPic(item,index)" :key="index" :style="{backgroundImage:'url('+prevPicUrl(item)+')'}">
                        <div class="delIcon" @click="deletePic(index)"></div>
                    </li>
                    <!-- <li class="weui-uploader__file weui-uploader__file_status hide" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">50%</div>
                    </li> -->
                </ul>
                <div class="weui-uploader__input-box" v-show="inputPicShow">
                    <input class="weui-uploader__input" type="file" accept="image/*" @change="inputPic($event)">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins ,Prop} from "vue-property-decorator";
import lrz from "../resource/mixins/lrz";
import previewPic from "../resource/mixins/previewPic";

@Component
export default class Pages_picUpload extends Mixins(lrz, previewPic) {
    @Prop() maxNum: number;
    pageName: string = "pages_picUpload";
    inputPicShow: boolean = true;
    picList: string[] = [];
    get getMaxNum(): number {
        return this.maxNum || 5;
    }
    picMaxNum(): void {
        // 图片最多数量
        if ((this.picList as string[]).length >= this.getMaxNum) {
            this.inputPicShow = false;
        } else {
            this.inputPicShow = true;
        }
        this.$emit('getPicLIst',this.picList);
    }
    deletePic(delIndex: number = this.picIndex): void {
        // 删除图片
        (this.picList as string[]).splice(delIndex, 1); //删除后
        this.picMaxNum(); //判断图片数量
        this.galleryShow = false;
    }
    async inputPic(e: Event): Promise < void > {
        // 添加图片
        const file: any = await this.minPic(e);
        console.log('图片',file)
        const picSrc = await this.uploadBase64(file);
        if (!!file.base64) {
            (this.picList as string[]).push(picSrc);
            this.picMaxNum(); //判断图片数量
        }
        (e.target as any).value = ""; // 清空input值，以便于change可以添加相同的图片
    }
    uploadBase64(file: any): Promise<string>{// 上传图片
        return new Promise((resolve,reject)=>{
            this.$post('file/uploadBase64',{ 
                // useMock:'hecheng',// 启用mock数据
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
        padding:0.3rem;
        .weui-uploader__bd {
            margin-bottom: -0.08rem;
            margin-right: -0.18rem;
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
                    .delIcon{
                        width: 0.41rem;
                        height: 0.41rem;
                        background: #1b7fff;
                        position: absolute;
                        top: 0.1rem;
                        right: 0.1rem;
                        border-radius: 50%;
                        &::before,&::after{
                            content: "";
                            position: absolute;
                            top:50%;
                            left:50%;
                            width:0.22rem;
                            height:1px;
                            background: #fff;
                            z-index: 1;
                        }
                        &::before{
                            transform: translate(-50%, -50%) rotate(45deg);
                        }
                        &::after{
                            transform: translate(-50%, -50%) rotate(-45deg);
                        }
                    }

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
                margin-right: 0.18rem;
                margin-bottom: 0.18rem;
                width: 1.54rem;
                height: 1.54rem;
                border: 0.02rem solid #d9d9d9;
                box-sizing: border-box;

                &:before,
                &:after {
                    content: " ";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #d9d9d9;
                }

                &:before {
                    width: 0.04rem;
                    height: 0.79rem;
                }

                &:after {
                    width: 0.79rem;
                    height: 0.04rem;
                }

                &:active {
                    border-color: #999999;

                    &:before,
                    &:after {
                        background-color: #999999;
                    }
                }

                .weui-uploader__input {
                    position: absolute;
                    z-index: 1;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
