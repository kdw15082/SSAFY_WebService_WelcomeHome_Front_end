import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import BoardView from "@/views/BoardView.vue";
import BookmarkView from "@/views/BookmarkView.vue";
import AptSearch from "@/views/AptSearch.vue";
import AptDetail from "@/components/house/HouseDetail.vue";
import HouseList from "@/components/house/HouseList.vue";
import BoardList from "@/components/Board/BoardList.vue";
import NoticeList from "@/components/Board/NoticeList.vue";
import QnaList from "@/components/Board/QnaList.vue";
import BoardRegister from "@/components/Board/BoardRegister.vue";
import BoardDetail from "@/components/Board/BoardDetail.vue";
import BoardModify from "@/components/Board/BoardModify.vue";

import tempView from "@/components/tempView.vue";

import store from "@/store/index.js";

Vue.use(VueRouter);

// https://router.vuejs.org/kr/guide/advanced/navigation-guards.html
const onlyAuthUser = async (to, from, next) => {
	// console.log(store);
	const checkUserInfo = store.getters["memberStore/checkUserInfo"];
	const getUserInfo = store._actions["memberStore/getUserInfo"];
	let token = sessionStorage.getItem("access-token");
	if (checkUserInfo == null && token) {
		await getUserInfo(token);
	}
	if (checkUserInfo === null) {
		alert("로그인이 필요한 페이지입니다..");
		next({ name: "signIn" });
		// router.push({ name: "signIn" });
	} else {
		// console.log("로그인 했다.");
		next();
	}
};

const routes = [
	{
		path: "/temp",
		name: "temp",
		component: tempView,
	},
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/user",
		name: "user",
		component: () => import("@/views/MemberView.vue"),
		children: [
			{
				path: "singin",
				name: "signIn",
				component: () => import("@/components/user/MemberLogin.vue"),
			},
			{
				path: "singup",
				name: "signUp",
				component: () => import("@/components/user/MemberRegister.vue"),
			},
			{
				path: "mypage",
				name: "mypage",
				beforeEnter: onlyAuthUser,
				component: () => import("@/components/user/MemberMyPage.vue"),
			},
			{
				path: "update",
				name: "update",
				beforeEnter: onlyAuthUser,
				component: () => import("@/components/user/MemberUpdatePage.vue"),
			},
			{
				path: "manage",
				name: "manage",
				beforeEnter: onlyAuthUser,
				component: () => import("@/views/ManageView.vue"),
			},
		],
	},
	{
		path: "/manage",
		name: "manage",
		beforeEnter: onlyAuthUser,
		component: () => import("@/views/ManageView.vue"),
	},
	{
		path: "/aptsearch",
		component: AptSearch,
	},
	{
		path: "/aptname",
		component: HouseList,
	},
	{
		path: "/aptdetail",
		name: "aptdetail",
		component: AptDetail,
	},
	{
		path: "/board",
		name: "board",
		component: BoardView,
		children: [
			{
				path: "list",
				name: "list",
				beforeEnter: onlyAuthUser,
				component: BoardList,
			},
			{
				path: "notice",
				name: "notice",
				component: NoticeList,
			},
			{
				path: "qna",
				name: "qna",
				beforeEnter: onlyAuthUser,
				component: QnaList,
			},
			{
				path: "register",
				beforeEnter: onlyAuthUser,
				component: BoardRegister,
			},
			{
				path: "detail/:bno",
				beforeEnter: onlyAuthUser,
				component: BoardDetail,
			},
			{
				path: "modify/:bno",
				beforeEnter: onlyAuthUser,
				component: BoardModify,
			},
		],
	},
	{
		path: "/detail",
		beforeEnter: onlyAuthUser,
		component: AptDetail,
	},
	{
		path: "/bookmark",
		beforeEnter: onlyAuthUser,
		component: BookmarkView,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
