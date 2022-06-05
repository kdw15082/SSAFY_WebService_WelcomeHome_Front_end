<template>
	<div id="board-div" class="center-board box">
		<div id="board" class="partition">
			<div class="partition-title">내 정보</div>
			<div
				style="
					background-color: #fff;
					position: absolute;
					margin: -150px 0px 0px -200px;
					top: 70%;
					left: 55%;
					width: 400px;
					height: 170px;
					border-radius: 20px;
				"
				class="center-board box"
				v-if="modal"
			>
				<div id="board" class="partition">
					<div style="font-size: 16px" class="partition-title">정말로 탈퇴하시겠습니까?</div>
					<div style="margin-top: 20px"></div>
					<b-button style="padding: 4px 8px; height: 32px" class="back-btn" @click="cancel">
						취소
					</b-button>
					<b-button
						style="padding: 4px 8px; height: 32px"
						class="float-right register-btn"
						id="deleteBtn"
						variant="success"
						@click="ok"
					>
						탈퇴
					</b-button>
				</div>
			</div>

			<b-container class="partition-form">
				<form autocomplete="false">
					<div class="bfg">
						<input id="n-email" disabled type="text" placeholder="이름" />
						<input id="n-email" disabled type="text" :placeholder="userInfo.name" />
					</div>
					<div class="bfg">
						<input id="n-email" disabled type="text" placeholder="별명" />
						<input id="n-email" disabled type="text" :placeholder="userInfo.nickname" />
					</div>
					<div class="bfg">
						<input id="n-email" disabled type="text" placeholder="나이" />
						<input id="n-email" disabled type="text" :placeholder="userInfo.age" />
					</div>
					<div class="bfg">
						<input id="n-email" disabled type="text" placeholder="성별" />
						<input id="n-email" disabled type="text" :placeholder="userInfo.gender" />
					</div>
					<div class="bfg">
						<input id="n-email" disabled type="text" placeholder="Email" />
						<input id="n-email" disabled type="text" :placeholder="userInfo.email" />
					</div>
					<div class="bfg">
						<input id="n-username" disabled type="text" placeholder="비밀번호" />
						<input id="n-password2" disabled type="password" placeholder="********" />
					</div>
					<div class="bfg">
						<input id="n-username" disabled type="text" placeholder="가입일" />
						<input id="n-password2" disabled type="text" :placeholder="userInfo.regdate" />
					</div>
				</form>
				<div style="margin-top: 30px"></div>

				<div class="button-set">
					<div class="button-set">
						<b-button
							@click="clickUpdate"
							:disabled="modal"
							style="padding: 4px 8px; height: 32px"
							class="large-btn register-btn"
							>수정</b-button
						>
					</div>
					<b-button
						@click="goBack"
						:disabled="modal"
						style="padding: 4px 8px; height: 32px"
						class="large-btn back-btn"
						>이전</b-button
					>
				</div>
				<div class="button-set">
					<b-button
						:disabled="modal"
						@click="modal = true"
						style="padding: 4px 8px; height: 32px"
						class="large-btn delete-btn"
						>탈퇴</b-button
					>
				</div>
			</b-container>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { apiInstance } from "@/api/index.js";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "MemberMyPage",
	data() {
		return {
			modal: false,
		};
	},
	computed: {
		...mapState(memberStore, ["userInfo"]),
	},
	methods: {
		...mapMutations(memberStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
		clickUpdate() {
			this.$router.push({ name: "update" });
		},
		cancel() {
			console.log("취소");
			this.modal = false;
		},
		ok() {
			console.log("탈퇴");
			this.modal = false;
			this.clickDelete();
		},
		goBack() {
			this.$router.go(-1);
		},
		async clickDelete() {
			await api
				.delete(`/user/${this.userInfo.email}`)
				.then(() => {
					alert("탈퇴가 완료되었습니다.");
					this.SET_USER_INFO(null);
					this.SET_IS_LOGIN(false);
					api.put(`/stats/quit`);
					sessionStorage.removeItem("access-token");
					this.$router.push({ name: "home" });
				})
				.catch((error) => {
					alert("회원 탈퇴 실패");
					console.log(error);
					this.$router.go();
				});
			this.SET_USER_INFO(null);
			this.SET_IS_LOGIN(false);
			sessionStorage.removeItem("access-token");
			this.$router.push({ name: "home" });
		},
	},
};
</script>

<style scoped>
.center-board {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
#board {
	height: 100%;
	width: 75%;
	justify-content: space-between;
}
#board-div {
	width: 100%;
	height: 90%;
	padding-top: 2%;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 30px 10px;
	justify-content: space-between;
}
b-form-valid-feedback {
	z-index: 1;
}

.bfg {
	display: flex;
}

.box {
	overflow: hidden;
	width: 328px;
	height: 400px;
	border-radius: 2px;
	box-shadow: 0 0 40px #000;
	color: #8b8c8d;
	z-index: 2;
}

.box .partition {
	width: 100%;
	height: 100%;
}

.box .partition .partition-title {
	box-sizing: border-box;
	padding: 30px;
	width: 100%;
	text-align: center;
	letter-spacing: 1px;
	font-size: 35px;
	font-weight: 300;
}

.box .partition .partition-form {
	padding: 15px 30px;
	box-sizing: border-box;
}

.box button {
	background: #fff;
	border-radius: 5px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;
	min-width: 80px;
	margin-top: 2px;
	color: #8b8c8d;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 12px;
	outline: none;
}

.box button:hover {
	background: #8b8c8d;
	border-radius: 5px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;
	min-width: 80px;
	margin-top: 2px;
	color: #fff;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 12px;
	outline: none;
}

.box .button-set {
	margin-bottom: 4px;
}

.box .back-btn {
	border-color: #dba226;
	color: #dba226;
}

.box .back-btn:hover {
	background-color: #dba226;
	color: #fff;
}

.box .register-btn {
	border-color: #3880ff;
	color: #3880ff;
}

.box .register-btn:hover {
	background-color: #3880ff;
	color: #fff;
}

.box .delete-btn {
	border-color: #dc3545;
	color: #dc3545;
}

.box .delete-btn:hover {
	background-color: #dc3545;
	color: #fff;
}

.box .large-btn {
	width: 100%;
	background: #fff;
}

.box #register-btn,
.box #signin-btn {
	margin-left: 8px;
}

b-form-select {
	font-size: 12px;
}

input[type="number"],
input[type="email"],
input[type="password"],
input[type="text"] {
	display: block;
	box-sizing: border-box;
	margin-bottom: 1px;
	width: 100%;
	font-size: 12px;
	line-height: 2;
	border: 0;
	border-bottom: 1px solid #dddedf;
	padding: 4px 8px;
	font-family: inherit;
	transition: all 0.5s;
	outline: none;
}
</style>
