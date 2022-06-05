import { apiInstance } from "./index.js";

const api = apiInstance();

async function login(user, success, fail) {
	console.log(user);
	await api.post(`/user/login`, JSON.stringify(user)).then(success).catch(fail);
}

async function findById(email, success, fail) {
	api.defaults.headers["access-token"] = sessionStorage.getItem("access-token");
	await api.get(`/user/info/${email}`).then(success).catch(fail);
}

async function findByEmail(email, success, fail) {
	await api.get(`/user/email/${email}`).then(success).catch(fail);
}

async function findByNickName(nickname, success, fail) {
	await api.get(`/user/nickname/${nickname}`).then(success).catch(fail);
}

async function register(user, success, fail) {
	console.log(user);
	await api.post(`/user`, JSON.stringify(user)).then(success).catch(fail);
}

// function logout(success, fail)

export { login, findById, findByEmail, findByNickName, register };
