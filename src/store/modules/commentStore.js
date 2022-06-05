import {
	listComment,
	// writeComment,
	// modifyComment,
	// deleteComment,
} from "@/api/comment";

const commentStore = {
	namespaced: true,
	state: {
		answers: [],
		answer: null,
	},
	getters: {},
	mutations: {
		SET_ANSWER_LIST: (state, answers) => {
			state.answers = answers;
		},
		SET_ANSWER: (state, answer) => {
			state.answer = answer;
		},
	},
	actions: {
		getAnswers: ({ commit }, bno) => {
			listComment(
				bno,
				(response) => {
					console.log(response);
					commit("SET_ANSWER_LIST", response.data);
				},
				(error) => {
					console.log(error);
					alert("답변 목록을 불러오는데 실패했습니다.");
				}
			);
		},
	},
};

export default commentStore;
