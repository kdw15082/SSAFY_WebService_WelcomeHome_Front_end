<template>
	<div id="r-container" class="partition pt-5">
		<div class="title">회원 가입</div>
		<b-form class="form" @submit="onSubmit" @reset="onReset" v-if="show">
			<div class="mt-4">
				<b-form-input v-model="form.name" placeholder="이름" required></b-form-input>
			</div>
			<div class="mt-3 nickname">
				<b-form-input
					v-model="form.nickname"
					:state="validNickName"
					placeholder="별명 - validation(DB)"
					required
					class="col col-lg-7"
				></b-form-input
				><b-button @click="checkNickName">중복 확인</b-button>
			</div>
			<b-form-valid-feedback :state="validNickName"
				>올바른 형식의 별명 입니다.
			</b-form-valid-feedback>
			<b-form-invalid-feedback :state="validNickName"
				>특수문자를 제외한 2글자 이상 10글자 이하여야 합니다.
			</b-form-invalid-feedback>
			<b-form-group id="input-email" label-for="input-email" required>
				<div class="mt-3 nickname">
					<b-form-input
						id="input-email"
						v-model="form.email"
						:state="validEmail"
						type="email"
						placeholder="이메일 - validation(DB)"
						required
						class="col col-lg-7"
					></b-form-input>
					<b-button class="p-1 float-right" @click="checkEmail">이메일 인증</b-button>
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
			<div class="btns">
				<b-button type="reset" class="large-btn github-btn">Reset</b-button>
				<b-button type="submit" class="large-btn facebook-btn">Submit</b-button>
			</div>
		</b-form>
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
			},
			user: {
				name: "",
				nickname: "",
				email: "",
				password: "",
				profile: "",
			},
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
			if (this.userInfo != null && this.userInfo.nickname == this.form.nickname) {
				alert("이미 사용중인 별명 입니다.");
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
			if (this.userInfo != null && this.userInfo.email == this.form.email) {
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
			this.user.password = this.form.password;
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
#r-container {
	width: 30%;
	height: 700px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #8b8c8d7d;
}
.title {
	font-size: 30px;
}
.form {
	width: 70%;
}
.nickname {
	display: flex;
	justify-content: space-between;
}

.btns {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: auto;
	height: 100px;
}

.v--modal-overlay {
	cursor: default;
	-webkit-font-smoothing: antialiased;
	color: #6b7c93;
	font-family: Montserrat;
	position: fixed;
	box-sizing: border-box;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, 0.2);
	z-index: 999;
	opacity: 1;
}
.v--modal-top-right {
	display: block;
	position: absolute;
	right: 0;
	top: 0;
}
.v--modal-overlay .v--modal-box {
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
}
.v--modal {
	background-color: white;
	text-align: left;
	border-radius: 3px;
	box-shadow: 0 20px 60px -2px rgb(27 33 58 / 40%);
	padding: 0;
}
.v--modal-overlay .v--modal-background-click {
	min-height: 100%;
	width: 100%;
	padding-bottom: 10px;
}
.box,
.box .box-part {
	box-sizing: border-box;
}
.box .box-part {
	display: inline-block;
	position: relative;
	vertical-align: top;
	height: 100%;
	width: 50%;
}
.box .box-part#bp-right {
	background: url(/src/assets/img/panorama.jpg) no-repeat 0 0;
	border-left: 1px solid #eee;
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
	font-size: 20px;
	font-weight: 300;
}
.box .partition .partition-form {
	padding: 0 20px;
	box-sizing: border-box;
}
.box .button-set {
	margin-bottom: 2px;
}
.box button {
	background: #fff;
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;

	margin-top: 8px;
	color: #8b8c8d;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 10px;
	outline: none;
}
.box button:hover {
	background: #8b8c8d;
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;
	margin-top: 8px;
	color: #fff;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 10px;
	outline: none;
}
.box .github-btn {
	border-color: #dba226;
	color: #dba226;
}
.box .github-btn:hover {
	background-color: #dba226;
	color: #fff;
}
.box .facebook-btn {
	border-color: #3880ff;
	color: #3880ff;
}
.box .facebook-btn:hover {
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
.box .box-messages {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
}
.box .autocomplete-fix {
	position: absolute;
	visibility: hidden;
	overflow: hidden;
	opacity: 0;
	width: 0;
	height: 0;
	left: 0;
	top: 0;
}
form {
	display: block;
	margin-top: 0em;
}
.box input[type="password"],
.box input[type="email"],
.box input[type="text"] {
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
b-form-invalid-feedback {
	font-size: 12px;
	color: #8b8c8d;
	font-family: inherit;
}
.box {
	background: #fff;
	overflow: hidden;
	width: 500px;
	height: 700px;
	border-radius: 2px;
	box-shadow: 0 0 40px #000;
	color: #8b8c8d;
	font-size: 0;
}
div {
	display: block;
}
</style>
