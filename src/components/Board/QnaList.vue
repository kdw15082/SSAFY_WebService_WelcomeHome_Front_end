<template>
	<div id="board-div" class="center-board">
		<div id="board" class="center-board">
			<h1>Q&A</h1>
			<div class="board-in">
				<img src="@/assets/img/icon/write.png" class="mb-3 write-img" @click="moveWrite" />
				<b-table
					id="my-table"
					:items="articles"
					:fields="fields"
					:per-page="perPage"
					:current-page="currentPage"
					striped
					hover
					select-mode="single"
					selectable
					@row-selected="onRowSelected"
					tbody-class="table"
				></b-table>
			</div>

			<b-pagination
				v-model="currentPage"
				:total-rows="rows"
				:per-page="perPage"
				pills
				aria-controls="my-table"
			></b-pagination>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { apiInstance } from "@/api/index.js";
import moment from "moment";
const api = apiInstance();

const boardStore = "boardStore";
const commentStore = "commentStore";
export default {
	name: "QnaList",

	data() {
		return {
			articles: [],
			perPage: 8,
			currentPage: 1,
			fields: [
				{
					key: "bno",
					label: "번호",
				},
				{
					key: "category",
					label: "말머리",
				},
				{
					key: "title",
					label: "제목",
				},
				{
					key: "date",
					label: "작성일",
				},
				{
					key: "nickname",
					label: "작성자",
				},

				{
					key: "hit",
					label: "조회수",
				},
			],
		};
	},
	computed: {
		rows() {
			return this.articles.length;
		},
		...mapState(boardStore, ["boards"]),
	},
	async created() {
		window.scrollTo(0, document.body.scrollHeight);

		let response = await api.get(`/board`);
		const data = response.data;
		let cnt = 0;
		let temp = [];
		for (let article of data) {
			response = await api.get(`/comment/` + article.bno);
			article.title = `${article.title} [${response.data.length}]`;
			article.date = moment(new Date(article.date)).format("YY.MM.DD");

			if (article.category === "공지" && cnt < 3) {
				temp.push(article);
				cnt++;
			}
		}
		for (let article of data) {
			if (article.category === "질문") {
				temp.push(article);
			}
		}
		this.articles = temp;
	},
	methods: {
		...mapActions(boardStore, ["getArticles", "getArticle"]),
		...mapActions(commentStore, ["getAnswers"]),
		onRowSelected(items) {
			this.$router.push({ path: "/board/detail/" + items[0].bno });
			api.put(`/board/hit/` + items[0].bno);
		},
		moveWrite() {
			this.$router.push({ path: "/board/register" });
		},
	},
};
</script>

<style>
.center-board {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
#board {
	height: 100%;
	width: 80%;
	justify-content: space-between;
}
#board-div {
	width: 90%;
	height: 90%;
	padding-top: 2%;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 30px 10px;
	justify-content: space-between;
}
.table tr[aria-rowindex="1"] {
	font-weight: bold;
}
.table tr[aria-rowindex="2"] {
	font-weight: bold;
}
.table tr[aria-rowindex="3"] {
	font-weight: bold;
}
.board-in {
	width: 80%;
	align-items: flex-end;
	display: flex;
	flex-direction: column;
}
.write-img {
	width: 50px;
	height: 50px;
	padding: 5px;
}
.write-img:hover {
	background-color: rgba(4, 4, 4, 0.235);
	border-radius: 10px;
}
.write-img:active {
	background-color: rgba(4, 4, 4, 0.235);
	width: 45px;
	height: 45px;
	border-radius: 10px;
}
.page-item.active .page-link {
	color: white;
	background-color: rgba(47, 47, 47, 0.761) !important;
	border-color: rgba(47, 47, 47, 0.761) !important;
}

.page-link:hover {
	color: black !important;
}
.page-link {
	color: black !important;
}
</style>
