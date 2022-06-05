<template>
	<div id="container">
		<!-- <div id="main">
			<b-jumbotron id="bg" header="" lead="">
				<p id="ft">당신의 편안한 집을 위한 편안한 정보</p>
				<p>해피하우스 홈화면입니다.</p>
			</b-jumbotron>
			<b-button class="mb-3" id="btn">로그인 하기</b-button>
			<b-button id="btn" variant="light">회원 가입하기</b-button>
		</div> -->
	</div>
</template>

<script>
export default {
	name: "HomeView",

	data() {
		return {};
	},
	mounted() {},

	methods: {},
};
</script>

<style scoped>
#container {
	height: 2vh;
	/* width: 100vw; */
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	position: relative;
	background-color: rgb(67, 67, 67);
}
#bg {
	background-color: rgba(255, 255, 255, 0.9);
}
#ft {
	font-size: 30px;
}

#main {
	display: flex;
	flex-direction: column;
	align-items: center;
}

#btn {
	width: 40%;
}
</style>
