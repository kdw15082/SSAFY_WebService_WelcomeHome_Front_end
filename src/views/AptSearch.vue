<template>
	<div id="container"><kakao-map></kakao-map></div>
</template>

<script>
import kakaoMap from "@/components/KaKaoMap.vue";
export default {
	name: "AptSearch",
	components: {
		kakaoMap,
	},
	data() {
		return {};
	},
	methods: {},
};
</script>

<style scoped>
#container {
	width: 100vw;
	height: 100vh;
	background-repeat: repeat;
}
</style>
