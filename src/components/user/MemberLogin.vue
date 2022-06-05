<template>
	<div id="board-div" class="center-board box">
		<div id="board" class="partition">
			<div class="partition-title">로그인</div>
			<div
				style="
					background-color: #fff;
					position: absolute;
					margin: -150px 0px 0px -200px;
					top: 70%;
					left: 55%;
					width: 400px;
					height: 300px;
					border-radius: 20px;
				"
				class="center-board box"
				v-if="showModal"
			>
				<div id="board" class="partition">
					<div style="font-size: 18px; padding-bottom: 6px" class="partition-title">
						비밀번호를 잊으셨나요?
					</div>
					<div style="font-size: 12px; padding: 0px 30px">
						*이름과 이메일을 입력하시면 임시 비밀번호를 메일로 보내드립니다.
					</div>
					<b-form autocomplete="off" class="partition-form">
						<b-form-group label-for="input-name">
							<b-form-input
								id="input-name"
								class="mb-3"
								v-model="modal.name"
								placeholder="이름"
								required
							></b-form-input>
						</b-form-group>
						<b-form-group id="input-email" label-for="input-email" required>
							<b-form-input
								v-model="modal.email"
								type="email"
								placeholder="이메일"
								class="mr-3"
								required
							></b-form-input>
						</b-form-group>
						<b-button
							style="padding: 4px 8px; height: 32px; margin-top: 15px"
							class="back-btn"
							@click="cancel"
						>
							닫기
						</b-button>
						<b-button
							style="padding: 4px 8px; height: 32px; margin-top: 15px"
							class="float-right register-btn"
							id="deleteBtn"
							variant="success"
							@click="ok"
						>
							확인
						</b-button>
					</b-form>
				</div>
			</div>

			<b-form autocomplete="off" class="partition-form" @submit="confirm" @reset="goBack">
				<b-form-group id="input-email" label-for="input-email" required>
					<b-form-input
						id="input-email"
						v-model="user.email"
						type="email"
						placeholder="이메일"
						class="mr-3"
						required
					></b-form-input>
				</b-form-group>
				<b-form-group id="input-password" label-for="input-password">
					<b-form @submit.stop.prevent>
						<b-form-input
							type="password"
							id="input-password"
							v-model="user.password"
							placeholder="비밀번호"
						></b-form-input>
					</b-form>
				</b-form-group>
				<div
					@click="showModal = true"
					style="font-size: 10px; text-align: center; text-decoration: underline; cursor: pointer"
				>
					*비밀번호를 잊으셨나요?
				</div>
				<div style="margin-top: 30px"></div>
				<b-button
					:disabled="showModal"
					type="reset"
					style="padding: 4px 8px; height: 32px"
					class="back-btn"
					>이전</b-button
				>
				<b-button
					:disabled="showModal"
					type="submit"
					style="padding: 4px 8px; height: 32px"
					class="float-right register-btn"
					>로그인</b-button
				>
			</b-form>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { apiInstance } from "@/api/index.js";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "MemberLogin",
	data() {
		return {
			user: {
				email: null,
				password: null,
			},
			showModal: false,
			modal: {
				email: null,
				name: null,
			},
		};
	},
	computed: {
		...mapState(memberStore, ["isLogin", "isLoginError"]),
	},
	methods: {
		...mapActions(memberStore, ["userConfirm", "getUserInfo"]),
		async confirm() {
			console.log("로그인 컨펌");
			await this.userConfirm(this.user).then(() => {
				let token = sessionStorage.getItem("access-token");
				console.log(token);
				if (this.isLogin) {
					this.getUserInfo(token);
					this.$router.push({ name: "home" });
				}
			});
		},
		cancel() {
			console.log("취소");
			this.showModal = false;
		},
		async ok() {
			await api.get(`/user/email/${this.modal.email}`).then(({ data }) => {
				if (data.name == this.modal.name && data.email == this.modal.email) {
					api.post(`/user/sendMail/${this.modal.email}`);
					alert("가입하신 이메일로 임시 비밀번호를 보냈습니다.");
					this.showModal = false;
				} else {
					alert("입력하신 이메일과 이름이 정확한지 확인해주세요.");
					this.showModal = true;
				}
			});
		},
		movePage() {
			this.$router.push({ name: "signup" });
		},
		goBack() {
			this.$router.go(-1);
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
	margin-bottom: 4px;
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
