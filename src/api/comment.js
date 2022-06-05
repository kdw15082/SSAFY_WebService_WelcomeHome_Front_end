import { apiInstance } from "./index.js";
const api = apiInstance();

function listComment(bno, success, fail) {
	api.get(`/comment/${bno}`).then(success).catch(fail);
}
function writeComment(comment, success, fail) {
	api.post(`/comment`, JSON.stringify(comment)).then(success).catch(fail);
}
function modifyComment(comment, success, fail) {
	api.put(`/comment/${comment.cno}`, JSON.stringify(comment)).then(success).catch(fail);
}
function deleteComment(comment, success, fail) {
	api.delete(`/comment/${comment.cno}`).then(success).catch(fail);
}
export { listComment, writeComment, modifyComment, deleteComment };
