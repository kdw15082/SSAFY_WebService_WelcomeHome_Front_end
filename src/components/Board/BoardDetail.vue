<template>
	<div id="detail-box">
		<div class="header">
			<div class="header-c">{{ article.category }}></div>
			<div class="header-t">
				<div>제목 : {{ article.title }}</div>
				<div style="display: flex; font-size: 15px">
					<div @click="moveModifyArticle" class="mr-2 btns">글수정</div>
					<div @click="deleteArticle" class="btns">글삭제</div>
				</div>
			</div>
			<div class="header-b">
				<div>
					<div class="header-w">{{ article.nickname }}</div>
					<div class="header-d">{{ article.date }} &nbsp;&nbsp;조회 : {{ article.hit }}</div>
				</div>
				<div>댓글 : {{ colen }}</div>
			</div>
		</div>
		<div class="content">{{ article.content }}</div>
		<div class="comment">
			<div style="height: 60%; overflow: auto">
				<div
					v-for="(comment, index) in comments"
					:key="index"
					style="padding-top: 5px; padding-bottom: 5px"
				>
					<div>
						<div style="font-weight: bold; font-size: 15px">{{ comment.nickname }}</div>
						<div style="display: flex; justify-content: space-between">
							<div v-show="modifyNo != comment.cno" style="font-size: 15px">
								{{ comment.content }}
							</div>

							<div
								v-if="modifyNo == comment.cno"
								style="width: 100%; display: flex; justify-content: space-between"
							>
								<input type="text" v-model="modifyContent" />
								<div style="display: flex">
									<div @click="modifyCancel" class="mr-2 btns">취소</div>
									<div @click="modifyComment(`${comment.cno}`)" class="mr-2 btns">수정</div>
								</div>
							</div>

							<div
								style="padding-right: 30px"
								v-if="comment.nickname == userInfo.nickname"
								class="float-right"
							>
								<div style="display: flex" v-show="modifyNo != comment.cno">
									<div @click="showModify(`${comment.cno}`)" class="mr-2 btns">수정</div>
									<div @click="deleteComment(`${comment.cno}`)" class="btns">삭제</div>
								</div>
							</div>
						</div>
						<div style="font-size: 12px; border-bottom: solid 1px">{{ comment.date }}</div>
					</div>
				</div>
			</div>
			<div class="reply">
				<b-form-textarea
					id="textarea-default"
					placeholder="댓글 입력..."
					style="width: 90%"
					v-model="text"
				></b-form-textarea>
				<b-button @click="registerComment">등록</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { apiInstance } from "@/api/index.js";

const api = apiInstance();
const memberStore = "memberStore";

export default {
	name: "BoardDetail",

	data() {
		return {
			article: {},
			comments: [],
			colen: 0,
			comment: {},
			authWriter: false,
			categoryName: "",
			showComment: true,
			modifyNo: 0,
			text: "",
			modifyContent: "",
		};
	},
	computed: {
		...mapState(memberStore, ["userInfo"]),
		message() {
			if (this.article.content) return this.article.content.split("\n").join("<br>");
			return "";
		},
	},
	created() {
		api.get(`/board/${this.$route.params.bno}`).then(({ data }) => {
			this.article = data;
			if (this.article.nickname == this.userInfo.nickname) {
				this.authWriter = true;
			} else {
				this.authWriter = false;
			}
			if (this.article.category == "자유") {
				this.categoryName = "list";
			} else if (this.article.category == "질문") {
				this.categoryName = "qna";
			} else {
				this.categoryName = "notice";
			}
		});

		api.get(`/comment/${this.$route.params.bno}`).then(({ data }) => {
			console.log(data);
			this.comments = data;
			this.colen = this.comments.length;
		});
		console.log(this.comments);
		api.put(`/board/hit/${this.$route.params.bno}`);
	},

	methods: {
		async deleteComment(cno) {
			if (confirm("정말로 삭제?")) {
				try {
					const response = await api.delete(`/comment/` + cno);
					console.log(response.data);
					let msg = "삭제 처리시 문제가 발생했습니다.";
					if (response.data === "success") {
						msg = "삭제가 완료되었습니다.";
					}
					alert(msg);
					this.$router.go();
				} catch (error) {
					alert("삭제 처리시 문제가 발생했습니다.");
				}
			}
		},
		listArticle() {
			this.$router.push({
				name: this.categoryName,
			});
		},
		moveModifyArticle() {
			this.$router.push({ path: "/board/modify/" + this.article.bno });
		},
		async deleteArticle() {
			if (confirm("정말로 삭제?")) {
				try {
					const response = await api.delete(`/board/${this.$route.params.bno}`);
					console.log(response.data);
					let msg = "삭제 처리시 문제가 발생했습니다.";
					if (response.data === "success") {
						msg = "삭제가 완료되었습니다.";
					}
					alert(msg);

					this.$router.push({
						name: this.categoryName,
					});
				} catch (error) {
					alert("삭제 처리시 문제가 발생했습니다.");
				}
			}
		},
		async registerComment() {
			this.comment.bno = this.$route.params.bno;
			this.comment.nickname = this.userInfo.nickname;
			this.comment.content = this.text;
			this.comments.push(this.comment);
			await api.post(`/comment`, JSON.stringify(this.comment)).then(({ data }) => {
				console.log(data);
			});
			this.$router.go();
		},
		showModify(cno) {
			this.showComment = false;
			this.modifyContent = this.comment.content;
			this.modifyNo = cno;
		},
		modifyCancel() {
			this.modifyContent = "";
			this.showComment = true;
			this.modifyNo = 0;
		},
		async modifyComment() {
			this.comment.cno = this.modifyNo;
			this.comment.bno = this.$route.params.bno;
			this.comment.nickname = this.userInfo.nickname;
			this.comment.content = this.modifyContent;
			await api.put(`/comment/${this.modifyNo}`, JSON.stringify(this.comment)).then(() => {
				this.modifyNo = "";
			});
			this.showComment = true;
			this.$router.go();
		},
	},
};
</script>

<style scoped>
#detail-box {
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
	height: 20%;
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
	justify-content: space-between;
}
.header-w {
	font-weight: bold;
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
.comment {
	width: 95%;
	height: 35%;
	padding: 10px;
}
.reply {
	height: 30%;
	margin-bottom: 10px;
	padding-top: 5px;
	border-top: solid 1px;
	display: flex;
	justify-content: space-between;
}
.btns:hover {
	font-weight: bold;
	text-decoration: underline;
	cursor: pointer;
}
</style>
