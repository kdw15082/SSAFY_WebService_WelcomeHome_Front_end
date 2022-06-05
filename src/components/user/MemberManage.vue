<template>
	<!-- <b-container class="bv-example-row mt-3">
		<div id="box">
			<div id="wrap">
				<div>1. 최근 30일 가입자, 탈퇴자 추이</div>
				<div>2. 전체 회원 성비 및 연령대 비율</div>
				<div>3. 페이지 별 방문자 수 추이(바 차트)</div>
				<div>4. 검색창(전체,이름 검색), 회원 전체 목록 테이블</div>
			</div>
		</div>
	</b-container> -->
	<div></div>
</template>

<script>
export default {
	name: "HappyhouseFinalSeoul11FrontKdwPyhMemberManage",

	data() {
		return {};
	},

	mounted() {},

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

.cart-board {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
#cart {
	height: 100%;
	width: 80%;
	justify-content: space-between;
}
#cart-div {
	width: 90%;
	height: 90%;
	padding-top: 2%;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 30px 10px;
	justify-content: space-between;
}
</style>
