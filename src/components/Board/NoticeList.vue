<template>
	<div id="board-div" class="center-board">
		<div id="board" class="center-board">
			<h1>공지사항</h1>
			<div class="board-in">
				<img
					v-if="authWriter"
					src="@/assets/img/icon/write.png"
					class="mb-3 write-img"
					@click="moveWrite"
				/>
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
const memberStore = "memberStore";
export default {
	name: "NoticeList",

	data() {
		return {
			articles: [],
			perPage: 8,
			currentPage: 1,
			authWriter: false,
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
		...mapState(memberStore, ["userInfo"]),
		rows() {
			return this.articles.length;
		},
		...mapState(boardStore, ["boards"]),
	},
	async created() {
		window.scrollTo(0, document.body.scrollHeight);
		let response = await api.get(`/board`);
		const data = response.data;
		let temp = [];
		for (let article of data) {
			response = await api.get(`/comment/` + article.bno);
			article.title = `${article.title} [${response.data.length}]`;
			article.date = moment(new Date(article.date)).format("YY.MM.DD");

			if (article.category === "공지") {
				temp.push(article);
			}
		}
		this.articles = temp;
		if ("운영자" == this.userInfo.nickname) {
			this.authWriter = true;
		} else {
			this.authWriter = false;
		}
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

<style></style>
