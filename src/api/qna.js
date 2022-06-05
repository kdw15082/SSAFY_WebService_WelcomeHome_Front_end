import { apiInstance } from "./index.js";

const api = apiInstance();

function listQuestion(success, fail) {
	api.get(`/question`).then(success).catch(fail);
}
function writeQuestion(question, success, fail) {
	api.post(`/question`, JSON.stringify(question)).then(success).catch(fail);
}

function questionById(userId, success, fail) {
	api.get(`/question/id/${userId}`).then(success).catch(fail);
}
function questionByTitle(title, success, fail) {
	api.get(`/question/title/${title}`).then(success).catch(fail);
}

function getQuestion(qno, success, fail) {
	api.get(`/question/${qno}`).then(success).catch(fail);
}

function modifyQuestion(article, success, fail) {
	api.put(`/question`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteQuestion(qno, success, fail) {
	api.delete(`/question/${qno}`).then(success).catch(fail);
}

export {
	listQuestion,
	writeQuestion,
	questionById,
	questionByTitle,
	getQuestion,
	modifyQuestion,
	deleteQuestion,
};
