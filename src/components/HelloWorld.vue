<template>
    <div class="hello pd_20">
        <h1 class="hb_a_c_b">{{ msg }}</h1>
        <h1 class="hb_l_c_b">{{ msg }}</h1>
        <h1 class="bd_b_1">{{ msg }}</h1>
        <button>123</button>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: {
        msg: String
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
