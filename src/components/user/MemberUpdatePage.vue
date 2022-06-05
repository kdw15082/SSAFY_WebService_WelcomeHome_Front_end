<template>
	<div id="board-div" class="center-board box">
		<div id="board" class="partition">
			<div class="partition-title">정보 수정</div>

			<b-form
				autocomplete="off"
				class="partition-form"
				@submit="onSubmit"
				@reset="onReset"
				v-if="show"
			>
				<b-form-group label-for="input-name">
					<b-form-input
						id="input-name"
						class="mb-3"
						v-model="form.name"
						placeholder="이름"
						required
					></b-form-input>
				</b-form-group>
				<b-form-group id="input-info" label-for="input-info">
					<div class="bfg">
						<b-form-select
							style="padding: 4px 8px; height: 32px; color: #8b8c8d"
							class="mr-2"
							size="sm"
							v-model="form.gender"
							:options="options"
							disabled
						></b-form-select>
						<b-form-inputupdate
							id="input-age"
							class="ml-2"
							type="number"
							v-model="form.age"
							:state="validAge"
							placeholder="나이"
							required
						></b-form-inputupdate>
					</div>

					<div class="bfg">
						<b-form-input style="height: 20px; visibility: hidden"></b-form-input>
						<b-form-invalid-feedback style="height: 20px" class="ml-2" :state="validAge"
							>15세 이상부터 가입 가능합니다.
						</b-form-invalid-feedback>
					</div>
				</b-form-group>
				<b-form-group label-for="input-nickname">
					<div class="bfg">
						<b-form-input
							id="input-nickname"
							v-model="form.nickname"
							:state="validNickName"
							placeholder="별명"
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
							type="email"
							placeholder="이메일"
							disabled
						></b-form-input>
					</div>
				</b-form-group>

				<b-form-group id="input-password" label-for="input-password">
					<b-form @submit.stop.prevent>
						<b-form-input
							type="password"
							id="input-password"
							v-model="form.password"
							:state="validPassword"
							placeholder="비밀번호"
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
							placeholder="비밀번호 확인"
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
					>수정</b-button
				>
			</b-form>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { apiInstance } from "@/api/index.js";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "WorkspaceJsonUpdateMemberInfo",

	data() {
		return {
			form: {
				name: "",
				nickname: "",
				email: "",
				password: "",
				password2: "",
				age: 0,
				gender: "",
			},
			user: {
				name: "",
				nickname: "",
				email: "",
				password: "",
				age: 0,
				gender: "",
				regdate: "",
			},
			options: [
				{ value: null, text: "성별", notEnabled: true },
				{ value: "남성", text: "남성" },
				{ value: "여성", text: "여성" },
			],
			show: true,
			noDupNickName: false,
		};
	},
	computed: {
		...mapState(memberStore, ["userInfo"]),
		validNickName() {
			return /^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|]).{1,}/.test(this.form.nickname);
		},
		validPassword() {
			return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
				this.form.password
			);
		},
		validAge() {
			return this.form.age >= 15;
		},
		confirmPassword() {
			return this.form.password2.length >= 8 && this.form.password == this.form.password2;
		},
	},
	async created() {
		console.log(this.userInfo.email);
		await api
			.get(`/user/email/${this.userInfo.email}`)
			.then(({ data }) => {
				console.log(data);
				this.form.email = data.email;
				this.form.name = data.name;
				this.form.nickname = data.nickname;
				this.form.age = data.age;
				this.form.gender = data.gender;
				this.user.regdate = data.regdate;
				console.log(this.form);
			})
			.catch((error) => {
				console.log(error);
			});
		console.log(this.form);
	},
	methods: {
		...mapActions(memberStore, ["getNickName", "signup"]),
		...mapMutations(memberStore, ["SET_USER_INFO"]),
		async onSubmit(event) {
			event.preventDefault();
			if (this.noDupNickName) {
				console.log("왔니");
				this.update();
				console.log(this.user);
			}
		},
		onReset(event) {
			event.preventDefault();
			this.$router.go(-1);
		},
		async checkNickName() {
			// axios로 중복 체크
			await api.get(`/user/nickname/${this.form.nickname}`).then(({ data }) => {
				if (
					!/^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|]).{1,}/.test(this.form.nickname) ||
					(data.nickname == this.form.nickname && !(data.nickname == this.userInfo.nickname))
				) {
					alert("사용할 수 없는 별명 입니다.");
					this.noDupNickName = false;
				} else {
					alert("사용 가능한 별명 입니다.");
					this.noDupNickName = true;
				}
			});
		},
		async update() {
			this.user.name = this.form.name;
			this.user.nickname = this.form.nickname;
			this.user.email = this.form.email;
			this.user.password = this.form.password;
			this.user.age = this.form.age;
			this.user.gender = this.form.gender;
			console.log(this.user);

			if (!this.noDupNickName) {
				alert("별명 중복 확인을 해주세요.");
			}

			if (
				/^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|]).{1,}/.test(this.user.nickname) &&
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(this.user.password) &&
				this.user.age >= 15
			) {
				await api
					.put(`/user/${this.user.email}`, JSON.stringify(this.user))
					.then(() => {
						alert("정보 수정이 완료되었습니다.");
						this.SET_USER_INFO(this.user);
						this.$router.push({ name: "mypage" });
					})
					.catch((error) => {
						alert("정보 수정 실패");
						console.log(error);
						this.$router.go();
					});
			} else {
				alert("입력된 정보가 맞는지 다시 확인해주세요.");
			}
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
