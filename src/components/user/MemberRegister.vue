<template>
	<div id="board-div" class="center-board box">
		<div id="board" class="partition">
			<div class="partition-title">회원 가입</div>

			<b-form class="partition-form" @submit="onSubmit" @reset="onReset" v-if="show">
				<b-form-group label-for="input-name">
					<b-form-input
						id="input-name"
						class="mb-3"
						v-model="form.name"
						placeholder="이름"
						required
					></b-form-input>
				</b-form-group>
				<b-form-group class="input-set" id="input-info" label-for="input-info">
					<div class="bfg">
						<b-form-select
							style="padding: 4px 8px; height: 32px; color: #8b8c8d"
							class="mr-2"
							size="sm"
							v-model="form.gender"
							:options="options"
							disabled-field="notEnabled"
							required
						></b-form-select>
						<b-form-input
							id="input-name"
							class="ml-2"
							type="number"
							v-model="form.age"
							placeholder="나이"
							required
						></b-form-input>
					</div>
				</b-form-group>
				<b-form-group label-for="input-nickname">
					<div class="bfg">
						<b-form-input
							id="input-nickname"
							v-model="form.nickname"
							:state="validNickName"
							placeholder="별명 - validation(DB)"
							required
							class="mr-3"
						></b-form-input>
						<b-button
							style="padding: 4px 8px; height: 32px; margin-left: auto"
							@click="checkNickName"
						>
							중복 확인
						</b-button>
					</div>
					<b-form-valid-feedback :state="validNickName"
						>올바른 형식의 별명 입니다.
					</b-form-valid-feedback>
					<b-form-invalid-feedback :state="validNickName"
						>특수문자를 제외한 2글자 이상 10글자 이하여야 합니다.
					</b-form-invalid-feedback>
				</b-form-group>

				<b-form-group id="input-email" label-for="input-email" required>
					<div class="bfg">
						<b-form-input
							id="input-email"
							v-model="form.email"
							:state="validEmail"
							type="email"
							placeholder="이메일 - validation(DB)"
							class="mr-3"
							required
						></b-form-input>
						<b-button style="padding: 4px 8px; height: 32px; margin-left: auto" @click="checkEmail">
							메일 확인
						</b-button>
					</div>
					<b-form-invalid-feedback :state="validEmail">
						올바르지 않은 이메일 형식 입니다.
					</b-form-invalid-feedback>
					<b-form-valid-feedback :state="validEmail">
						유효한 이메일 형식 입니다.
					</b-form-valid-feedback>
				</b-form-group>

				<b-form-group id="input-password" label-for="input-password">
					<b-form @submit.stop.prevent>
						<b-form-input
							type="password"
							id="input-password"
							v-model="form.password"
							:state="validPassword"
							placeholder="비밀번호 - validation(Vue)"
						></b-form-input>
						<b-form-invalid-feedback :state="validPassword">
							비밀번호는 특수문자, 대문자, 소문자, 숫자를 포함한 8자 이상이어야 합니다.
						</b-form-invalid-feedback>
						<b-form-valid-feedback :state="validPassword">
							안전한 비밀번호 입니다.
						</b-form-valid-feedback>
					</b-form>
				</b-form-group>

				<b-form-group id="input-password-2" label-for="input-password-2">
					<b-form @submit.stop.prevent>
						<b-form-input
							type="password"
							id="input-password-2"
							v-model="form.password2"
							:state="confirmPassword"
							placeholder="비밀번호 확인 - validation(Vue)"
						></b-form-input>
						<b-form-invalid-feedback :state="confirmPassword">
							비밀번호가 일치하지 않습니다.
						</b-form-invalid-feedback>
						<b-form-valid-feedback :state="confirmPassword">
							비밀번호가 일치합니다.
						</b-form-valid-feedback>
					</b-form>
				</b-form-group>

				<b-button type="reset" style="padding: 4px 8px; height: 32px" class="back-btn"
					>이전</b-button
				>
				<b-button
					type="submit"
					style="padding: 4px 8px; height: 32px"
					class="float-right register-btn"
					>가입</b-button
				>
			</b-form>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { apiInstance } from "@/api/index";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "MemberRegister",

	data() {
		return {
			form: {
				name: "",
				nickname: "",
				email: "",
				password: "",
				password2: "",
				profile: "",
				gender: null,
			},
			user: {
				name: "",
				nickname: "",
				email: "",
				password: "",
				profile: "",
				gender: null,
			},
			options: [
				{ value: null, text: "성별", notEnabled: true },
				{ value: "남성", text: "남성" },
				{ value: "여성", text: "여성" },
			],
			show: true,
			noDupNickName: false,
			noDupEmail: false,
		};
	},
	computed: {
		...mapState(memberStore, ["userInfo", "isRegistSuccess"]),
		validNickName() {
			return /^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|]).{1,}/.test(this.form.nickname);
		},
		validEmail() {
			return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
				this.form.email
			);
		},
		validPassword() {
			return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
				this.form.password
			);
		},
		confirmPassword() {
			return this.form.password2.length >= 8 && this.form.password == this.form.password2;
		},
		validFile() {
			return (
				/(.*?)\.(JPG|PNG|JPEG|jpg|jpeg|png)$/.test(this.form.profile) ||
				this.form.profile.length == 0
			);
		},
	},
	methods: {
		...mapActions(memberStore, ["getEmail", "getNickName", "register"]),
		...mapMutations(memberStore, ["SET_USER_INFO"]),
		async onSubmit(event) {
			event.preventDefault();
			console.log("여기 왔다");
			if (this.noDupNickName && this.noDupEmail) {
				this.regist();
				console.log(this.user);
			}
			this.SET_USER_INFO(null);
		},
		onReset(event) {
			event.preventDefault();
			// Reset our form values
			this.form.email = "";
			this.form.name = "";
			this.form.password = "";
			this.form.food = null;
			this.form.checked = [];
			// Trick to reset/clear native browser form validation state
			this.show = false;
			this.SET_USER_INFO(null);
			this.$nextTick(() => {
				this.show = true;
			});
		},
		async checkNickName() {
			// axios로 중복 체크
			await this.getNickName(this.form.nickname);
			console.log(this.userInfo);
			if (
				!/^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|]).{1,}/.test(this.form.nickname) ||
				(this.userInfo != null && this.userInfo.nickname == this.form.nickname)
			) {
				alert("사용할 수 없는 별명 입니다.");
				this.noDupNickName = false;
			} else {
				alert("사용 가능한 별명 입니다.");
				this.noDupNickName = true;
			}
		},
		async checkEmail() {
			// 1. axios로 중복 확인
			await this.getEmail(this.form.email);
			console.log(this.userInfo);
			if (
				!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
					this.form.email
				)
			) {
				alert("사용할 수 없는 이메일 입니다.");
			} else if (this.userInfo != null && this.userInfo.email == this.form.email) {
				alert("이미 가입한 이메일 입니다.");
				this.noDupEmail = false;
			} else {
				alert("사용 가능한 이메일 입니다.");
				this.noDupEmail = true;
			}
		},
		async regist() {
			this.user.name = this.form.name;
			this.user.nickname = this.form.nickname;
			this.user.email = this.form.email;
			this.user.age = this.form.age;
			this.user.password = this.form.password;
			this.user.gender = this.form.gender;
			if (this.form.profile != "" && this.form.profile != null) {
				this.user.profile = this.form.profile;
			} else {
				this.user.profile = null;
			}
			await api
				.post(`/user`, JSON.stringify(this.user))
				.then(() => {
					alert("회원 가입이 완료되었습니다.");
					this.$router.push({ name: "signIn" });
				})
				.catch((error) => {
					alert("회원 가입에 실패했습니다.");
					console.log(error);
					this.$router.go();
				});
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
