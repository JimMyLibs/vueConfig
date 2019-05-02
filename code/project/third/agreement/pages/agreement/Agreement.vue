<template>
    <div class="agreement-page">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

// 合同管理

@Component
export default class FetchPage extends Mixins(VueMixin) {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='postcss' scoped></style>
