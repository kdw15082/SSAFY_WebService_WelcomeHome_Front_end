<template>
	<div class="main center">
		<div class="center-div">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	name: "BoardView",
	data() {
		return {};
	},

	created() {
		window.scrollTo(0, document.body.scrollHeight);
	},

	methods: {},
};
</script>

<style scoped>
.main {
	height: 96vh;
	widows: 100vw;
	background-color: rgb(67, 67, 67);
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
}
.center-div {
	width: 80%;
	height: 90%;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 30px 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
