<template>
    <div class="home">
        <div id="nav">
            <router-link to="/">Home</router-link>|
            <router-link to="/about">About</router-link>
        </div>
        <HelloWorld msg="HelloWorld"/>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "..//components/HelloWorld.vue";

export default {
    name: "home",
    components: {
        HelloWorld
    }
};
</script>
