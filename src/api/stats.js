import { apiInstance } from "./index.js";

const api = apiInstance();

function listAllStats(success, fail) {
	api.get(`/stats/all`).then(success).catch(fail);
}

function listRecentStats(success, fail) {
	api.get(`/stats/recentMonth`).then(success).catch(fail);
}

function listMonthlyStats(success, fail) {
	api.get(`/stats/month`).then(success).catch(fail);
}

// function listWeeklyStats(success, fail) {
// 	api.get(`/stats/week`).then(success).catch(fail);
// }

function listDailyStats(success, fail) {
	api.get(`/stats/day`).then(success).catch(fail);
}

function updateAccessCnt(page, success, fail) {
	api.put(`/stats/{page}`).then(success).catch(fail);
}

function todayStats(success, fail) {
	api.get(`/stats/today`).then(success).catch(fail);
}

export {
	listAllStats,
	listRecentStats,
	listMonthlyStats,
	// listWeeklyStats,
	listDailyStats,
	updateAccessCnt,
	todayStats,
};
