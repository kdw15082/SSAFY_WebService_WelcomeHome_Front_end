<template>
	<div id="container">
		<div id="main">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	name: "MemberView",
};
</script>

<style scoped>
#container {
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: rgb(67, 67, 67);
}
#bg {
	background-color: rgba(255, 255, 255, 0.9);
}
#main {
	height: 70%;
	width: 35%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
