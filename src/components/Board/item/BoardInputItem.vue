<template>
	<div id="input-box">
		<div class="header">
			<div class="header-c">
				<b-form-select v-model="selected" :options="options"></b-form-select>
			</div>
			<div class="header-t">
				<div style="width: 100px">제목 :</div>
				<b-form-input
					id="title"
					:disabled="isTitle"
					v-model="article.title"
					type="text"
					required
					placeholder="제목 입력..."
				></b-form-input>
			</div>
			<div class="header-b">
				<div class="header-w">
					<div style="width: 100px; height: 50px; font-size: 15px; padding: 10px">작성자 :</div>
					<b-form-input
						id="userid"
						disabled
						v-model="article.nickname"
						type="text"
						required
						placeholder="작성자 입력..."
					></b-form-input>
				</div>
			</div>
		</div>
		<div class="content">
			<b-form-textarea
				id="content"
				v-model="article.content"
				placeholder="내용 입력..."
				rows="10"
				max-rows="15"
			></b-form-textarea>
		</div>
		<b-button
			type="submit"
			variant="outline-info"
			class="m-1"
			v-if="this.type === 'register'"
			@click="onSubmit"
			>글 작성</b-button
		>
		<b-button
			type="submit"
			variant="outline-info"
			class="m-1"
			v-else-if="this.type === 'modify'"
			@click="onSubmit"
			>글 수정</b-button
		>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { apiInstance } from "@/api/index";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "BoardInputItem",

	data() {
		return {
			article: {},
			isTitle: false,
			selected: "자유",
			options: [
				{ value: "자유", text: "자유" },
				{ value: "질문", text: "질문" },
				{ value: "공지", text: "공지" },
			],
		};
	},
	props: {
		type: { type: String },
		cno: { type: String },
	},
	computed: {
		...mapState(memberStore, ["userInfo"]),
	},
	async created() {
		console.log(this.type);
		if (this.type === "modify") {
			api.get(`/board/${this.$route.params.bno}`).then(({ data }) => {
				this.article = data;
				this.selected = data.category;
			});
		}
		this.article.nickname = this.userInfo.nickname;
	},
	methods: {
		onSubmit() {
			let err = true;
			let msg = "";
			!this.article.nickname && ((msg = "작성자 입력해주세요"), (err = false));
			err && !this.article.title && ((msg = "제목 입력해주세요"), (err = false));
			err && !this.article.content && ((msg = "내용 입력해주세요"), (err = false));

			if (!err) alert(msg);
			else if (this.type === "register") {
				console.log("왔다");
				this.registArticle();
			} else if (this.type === "modify") {
				this.modifyArticle();
			} else if (this.type === "registAnswer") {
				this.registComment();
			} else {
				this.modifyComment();
			}
		},
		onReset(event) {
			event.preventDefault();
			this.article.bno = 0;
			this.article.title = "";
			this.article.content = "";
			this.$router.push({ path: "/board" });
		},
		modifyComment() {},
		registComment() {},
		registArticle() {
			this.article.category = this.selected;
			api
				.post(`/board`, JSON.stringify(this.article))
				.then(({ data }) => {
					let msg = "등록 처리시 문제가 발생했습니다.";
					if (data === "success") {
						msg = "등록이 완료되었습니다.";
					}
					alert(msg);
					this.moveBoard();
				})
				.catch((error) => {
					console.log(error);
					let msg = "등록 처리시 문제가 발생했습니다.";
					alert(msg);
				});
		},
		modifyArticle() {
			this.article.category = this.selected;
			api
				.put(`/board/${this.article.bno}`, JSON.stringify(this.article))
				.then(({ data }) => {
					let msg = "수정 처리시 문제가 발생했습니다.";
					if (data === "success") {
						msg = "수정이 완료되었습니다.";
					}
					alert(msg);
					this.moveBoard();
				})
				.catch((error) => {
					console.log(error);
					let msg = "수정 처리시 문제가 발생했습니다.";
					alert(msg);
				});
		},
		moveBoard() {
			this.$router.push({ name: "list", params: { category: "board" } });
		},
	},
};
</script>

<style scoped>
#input-box {
	height: 90%;
	width: 90%;
	background-color: white;
	border-radius: 30px 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.header {
	width: 95%;
	height: 25%;
	border-bottom: solid 1px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: 10px;
	margin-bottom: 10px;
}
.header-b {
	display: flex;
	justify-content: space-between;
	padding-left: 10px;
	padding-right: 10px;
}
.header-c {
	font-size: 15px;
	color: rgb(99, 229, 99);
	padding-top: 10px;
	padding-left: 10px;
}
.header-t {
	font-size: 25px;
	padding: 10px;
	display: flex;
}
.header-w {
	display: flex;
	font-weight: bold;
	width: 100%;
}
.header-d {
	font-size: 13px;
}

.content {
	height: 50%;
	border-bottom: solid 1px;
	width: 95%;
	padding-left: 10px;
	font-size: 15px;
}

.btns:hover {
	font-weight: bold;
	text-decoration: underline;
	cursor: pointer;
}
</style>
