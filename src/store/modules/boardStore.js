import {
	listArticle,
	getArticle,
	// writeArticle,
	// modifyArticle,
	// deleteArticle,
	// getCategory,
	modifyHit,
	// getCategory,
	// getArticleByNickName,
	// getArticleByTitle,
} from "@/api/board";

const boardStore = {
	namespaced: true,
	state: {
		articles: [],
		article: null,
	},
	getters: {},
	mutations: {
		SET_BOARD_LIST: (state, articles) => {
			state.articles = articles;
		},
		SET_BOARD: (state, article) => {
			state.article = article;
		},
		SET_ANSWER_LIST: (state, answers) => {
			state.answers = answers;
		},
	},
	actions: {
		getArticles: ({ commit }) => {
			listArticle(
				(response) => {
					console.log(response);
					commit("SET_BOARD_LIST", response.data);
				},
				(error) => {
					console.log(error);
					alert("게시판을 불러오는데 실패했습니다.");
				}
			);
		},
		getArticle: ({ commit }, bno) => {
			modifyHit(
				bno,
				(response) => {
					console.log(response);
				},
				(error) => {
					console.log(error);
					alert("조회수 조회를 실패했습니다.");
				}
			);
			getArticle(
				bno,
				(response) => {
					console.log(response);
					commit("SET_BOARD", response.data);
				},
				(error) => {
					console.log(error);
					alert("게시글 조회를 실패했습니다.");
				}
			);
		},
	},
};

export default boardStore;
