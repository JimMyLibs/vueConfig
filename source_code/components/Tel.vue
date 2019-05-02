<template>
<a class="link" :href="hrefTel" :class="[className]">{{tel}}</a>
</template>
<script>
// tel: 电话号码值
// className: 附加class名
export default {
    props: {
        tel: {
            default: ''
        },
        className: String
    },
    computed: {
        hrefTel() {
            return `tel:${this.tel}`
        }
    }
}
</script>
