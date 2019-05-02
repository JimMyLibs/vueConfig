<template>
    <div class="pages_notice">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import VueMixin from "comm/vues/VueMixin"

@Component
export default class Pages_notice extends Mixins(VueMixin) {
    pageName: string = "pages_notice";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'></style>
