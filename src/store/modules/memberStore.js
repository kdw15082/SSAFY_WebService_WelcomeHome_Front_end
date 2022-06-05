import jwt_decode from "jwt-decode";
import { login } from "@/api/member.js";
import { findById, findByEmail, findByNickName, register } from "../../api/member";

const memberStore = {
	namespaced: true,
	state: {
		isLogin: false,
		isLoginError: false,
		userInfo: null,
		recentApts: [],
		//const loginUser = JSON.parse(sessionStorage.getItem("vuex")).memberStore.userInfo
	},
	getters: {
		checkUserInfo: function (state) {
			return state.userInfo;
		},
	},
	mutations: {
		SET_IS_LOGIN: (state, isLogin) => {
			state.isLogin = isLogin;
		},
		SET_IS_LOGIN_ERROR: (state, isLoginError) => {
			state.isLoginError = isLoginError;
		},
		SET_USER_INFO: (state, userInfo) => {
			//state.isLogin = true;
			state.userInfo = userInfo;
		},
		ADD_APT: (state, aptCode) => {
			//state.isLogin = true;
			state.recentApts.push(aptCode);
		},
	},
	actions: {
		addAptCode({ state, commit }, aptCode) {
			if (state.recentApts === undefined) {
				commit("ADD_APT", aptCode);
			}
			if (!state.recentApts.includes(aptCode)) {
				commit("ADD_APT", aptCode);
			}
		},
		async userConfirm({ commit }, user) {
			await login(
				user,
				(response) => {
					if (response.data.message === "success") {
						let token = response.data["access-token"];
						commit("SET_IS_LOGIN", true);
						commit("SET_IS_LOGIN_ERROR", false);
						sessionStorage.setItem("access-token", token);
					} else {
						commit("SET_IS_LOGIN", false);
						commit("SET_IS_LOGIN_ERROR", true);
					}
				},
				() => {}
			);
		},
		getUserInfo({ commit }, token) {
			let decode_token = jwt_decode(token);
			findById(
				decode_token.email,
				(response) => {
					if (response.data.message === "success") {
						commit("SET_USER_INFO", response.data.userInfo);
					} else {
						console.log("유저 정보 없음!!");
					}
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getEmail: ({ commit }, email) => {
			findByEmail(
				email,
				(response) => {
					if (response.data != "") {
						commit("SET_USER_INFO", response.data);
					} else {
						this.SET_USER_INFO(null);
					}
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getNickName: ({ commit }, nickname) => {
			findByNickName(
				nickname,
				(response) => {
					if (response.data != "") {
						commit("SET_USER_INFO", response.data);
					} else {
						this.SET_USER_INFO(null);
					}
				},
				(error) => {
					console.log(error);
				}
			);
		},
		signup: ({ commit }, user) => {
			register(
				user,
				(response) => {
					console.log(response);
					if (response.data.message === "success") {
						commit("SET_IS_REGIST_SUCCEESS", true);
						console.log("성공");
					} else {
						commit("SET_IS_REGIST_SUCCEESS", false);
					}
				},
				(error) => {
					console.log(error);
				}
			);
		},
	},
};

export default memberStore;
