import {
	getQuestion,
	listQuestion,
	// writeQuestion,
	// questionById,
	// questionByTitle,
	// getAnswer,
	// modifyAnswer,
	// deleteAnswer,
} from "@/api/qna.js";

const qnaStore = {
	namespaced: true,
	state: {
		qnas: [],
		qna: null,
	},
	getters: {},
	mutations: {
		SET_QNA_LIST: (state, qnas) => {
			state.qnas = qnas;
		},
		SET_QNA: (state, qna) => {
			state.qna = qna;
		},
	},
	actions: {
		getQuestionList: ({ commit }) => {
			listQuestion(
				(response) => {
					console.log(response);
					commit("SET_QNA_LIST", response.data);
				},
				(error) => {
					console.log(error);
					alert("게시판을 불러오는데 실패했습니다.");
				}
			);
		},
		getQuestion: ({ commit }, qno) => {
			getQuestion(
				qno,
				(response) => {
					console.log(response);
					commit("SET_QNA", response.data);
				},
				(error) => {
					console.log(error);
					alert("게시글 조회를 실패했습니다.");
				}
			);
		},
	},
};

export default qnaStore;
