import { apiInstance } from "./index.js";

const api = apiInstance();

function listArticle(success, fail) {
	api.get(`/board`).then(success).catch(fail);
}

function writeArticle(article, success, fail) {
	api.post(`/board`, JSON.stringify(article)).then(success).catch(fail);
}

function getArticle(bno, success, fail) {
	api.get(`/board/${bno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
	api.put(`/board/${article.no}`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticle(bno, success, fail) {
	api.delete(`/board/${bno}`).then(success).catch(fail);
}

function getCategory(category, success, fail) {
	api.get(`/board/category/${category}`).then(success).catch(fail);
}

function modifyHit(bno, success, fail) {
	api.put(`/board/hit/${bno}`).then(success).catch(fail);
}
function getArticleByNickName(nickname, success, fail) {
	api.get(`/board/nickname/${nickname}`).then(success).catch(fail);
}
function getArticleByTitle(title, success, fail) {
	api.get(`/board/title/${title}`).then(success).catch(fail);
}

export {
	listArticle,
	writeArticle,
	getArticle,
	modifyArticle,
	deleteArticle,
	getCategory,
	modifyHit,
	getArticleByNickName,
	getArticleByTitle,
};
