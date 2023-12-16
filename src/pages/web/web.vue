<template>
    <web-view :src="src" />
</template>

<script setup>
    import {ref} from "vue";
	import { onLoad} from "@dcloudio/uni-app";
    const src = ref("");
    onLoad( (options)=>{
        src.value = options.url?options.url:"https://tuwang.taihela.com/payterms.html"
	})
    
</script>

<style>
</style>