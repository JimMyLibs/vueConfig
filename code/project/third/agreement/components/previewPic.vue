<template>
    <div class="pages_previewPic">
        <div class="weui-uploader">
            <div class="weui-gallery" v-show="galleryShow">
                <span class="weui-gallery__img" @click="galleryShow=false" :style="'background-image: url('+prevPicUrl(picSrc)+')'"></span>
            </div>
            <div class="weui-uploader__bd">
                <ul class="weui-uploader__files">
                    <li class="weui-uploader__file" v-for="(item,index) in picList" @click.self="previewPic(item,index)" :key="index" :style="{backgroundImage:'url('+prevPicUrl(item)+')'}"></li>
                    <!-- <li class="weui-uploader__file weui-uploader__file_status hide" style="background-image:url(https://static.vux.li/uploader_bg.png)">
                        <div class="weui-uploader__file-content">50%</div>
                    </li> -->
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins ,Prop} from "vue-property-decorator";
import lrz from "../resource/mixins/lrz";
import previewPic from "../resource/mixins/previewPic";

@Component
export default class Pages_previewPic extends Mixins(lrz, previewPic) {
    @Prop() picList: string[];
    pageName: string = "pages_previewPic";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.pages_previewPic {
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
                bottom: 0;
                left: 0;
                background: center center no-repeat;
                background-size: contain;
            }
        }
    }

}
</style>
