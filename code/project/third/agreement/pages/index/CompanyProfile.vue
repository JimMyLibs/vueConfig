<template>
    <div class="pages_CompanyProfile">
        <EleNav :title="'安基集团简介'" :isOpacity="scrollTop<175" :isPlaceholder="false"></EleNav>        
        <div class="profile_hd" ref="profile_hd">
            <img src="../../resource/img/index/companyProfile.png" alt="">
        </div>
        <div class="profile_bd">
            <h3>实力安基 享誉全国</h3>
            <p>安基集团，始建立于2002年，经过十多年的蓬勃发展，现已发展成为全国知名的陶瓷企业集团，荣获“中国建材企业500强”、“中国民营建材企业100强”等殊荣，拥有两个“中国驰名商标”、八个“广东省著名商标”荣誉称号。2016年，安基集团生产基地更被评选为“广东省制造业企业五百强”。安基集团的研发创新能力、专业化生产能力、供货能力、配套能力、性价比优势、产品设计与展示能力，一直为同行业界所津津乐道！</p>
            <h3>强大安基 两大建陶基地</h3>
            <p>2008年安基集团在广东恩平建立了两个大型建陶生产基地，占地总面积2000多亩，集团拥有员工2000多人，引进10多亿元的先进生产设备，14组窑炉12条抛光线不停滚动运转，确保生产稳定提升，为合作伙伴们在市场竞争中提供得心应手的利器！</p>
            <h3>创新安基 全配套产品</h3>
            <p>创业伊始，安基集团以超高性价比的抛光砖深受消费者喜爱，经过十多年的发展，现在安基集团的产品线不断丰富完善，产品涵盖了通体大理石瓷砖，金刚微晶石瓷砖、金刚晶瓷砖、微晶石瓷砖、微晶釉、超平大理石瓷砖、升级版抛光砖、喷墨精工玉石、6D喷墨瓷片以及配套，数百个系列、上千个花色品种，以一流的产品和优质的服务在市场上构建起卓越的竞争优势！</p>
            <h3>魅力安基 辉煌共赢</h3>
            <p>2014年，安基集团正式踏入品牌升级转型，以全新的品牌高度建立了专属的VI标准，数百家品牌专卖店在全国各地拔地而起。与此同时，我们积极致力于终端市场的培育与深化，集团市场部协助全国经销商展开一系列的终端培训与促销活动，获得市场高度赞颂！</p>
            <p>展望未来，在“以人为本 与时并进”的企业核心文化中，我们将更加充分地发挥企业的人才优势、产品优势、市场优势、技术优势，与经销商朋友们携手共进、再创巅峰，为成为全国最具性价比的陶瓷集团企业而不断努力奋斗！</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"
import EleNav from 'comm/components/EleNav.vue';

@Component({
    components:{
        EleNav
    }
})
export default class Pages_CompanyProfile extends Mixins(VueMixin) {
    pageName: string = "pages_CompanyProfile";
    scrollTop: number = 0;
    mounted() {
        window.addEventListener('scroll', this.scrollRun);// 监听滚动
    }
    destroyed() {
        window.removeEventListener('scroll', this.scrollRun);// 监听滚动dddd
    }
    scrollRun(): void {        
        this.$nextTick(()=>{
            const clientWidth: number = document.body.offsetWidth;
            this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            console.log(this.scrollTop)
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.pages_CompanyProfile {
    background: #fff;
    .profile_bd{
        padding: 0 0.3rem 0.5rem;
        font-size: 0.28rem;
        h3{
            color: #999999;
            margin-top:0.5rem;
        }
        p{
            color: #333333;
            margin-top:0.2rem;
        }

    }
}
</style>
