<template>
	<div id="container">
		<VueSidebarMenuAkahon
			:isMenuOpen="isMenuOpen"
			:menuTitle="menuTitle"
			:menuIcon="menuIcon"
			:menuItems="menuItems1"
			:isExitButton="isLogin"
			v-if="userInfo && userInfo.nickname == `운영자`"
		/>
		<VueSidebarMenuAkahon
			:isMenuOpen="isMenuOpen"
			:menuTitle="menuTitle"
			:menuIcon="menuIcon"
			:menuItems="menuItems2"
			v-else
		/>
		<b-navbar id="navbar" toggleable="lg" type="dark" variant="info">
			<!-- Right aligned nav items -->
			<router-link class="mr-3 nav" style="color: white" to="/">Home</router-link>
			<router-link class="mr-3 nav" style="color: white" :to="{ name: 'notice' }"
				>Notice</router-link
			>
			<router-link class="mr-3 nav" style="color: white" :to="{ name: 'list' }">Board</router-link>
			<router-link class="mr-3 nav" style="color: white" :to="{ name: 'qna' }">QnA</router-link>
			<router-link class="mr-3 nav" style="color: white" to="/aptsearch">Map</router-link>

			<b-navbar-nav class="ml-auto" v-if="userInfo">
				<b-nav-item class="align-self-center"
					><b-avatar
						size="2em"
						v-text="userInfo ? userInfo.email.charAt(0).toUpperCase() : ''"
					></b-avatar
					>{{ userInfo.username }} {{ userInfo.nickname }}님 환영합니다.</b-nav-item
				>
				<b-nav-item class="align-self-center"
					><router-link :to="{ name: 'mypage' }" class="link align-self-center"
						>내정보보기</router-link
					></b-nav-item
				>
				<b-nav-item class="link align-self-center" @click.prevent="onClickLogout"
					>로그아웃</b-nav-item
				>
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto" v-else>
				<b-nav-item-dropdown right>
					<template #button-content>
						<b-icon icon="people" font-scale="2"></b-icon>
					</template>
					<b-dropdown-item href="#"
						><router-link :to="{ name: 'signUp' }" class="link"
							><b-icon icon="person-circle"></b-icon> 회원가입</router-link
						></b-dropdown-item
					>
					<b-dropdown-item href="#"
						><router-link :to="{ name: 'signIn' }" class="link"
							><b-icon icon="key"></b-icon> 로그인</router-link
						></b-dropdown-item
					>
				</b-nav-item-dropdown>
			</b-navbar-nav>
		</b-navbar>
	</div>
</template>

<script>
import VueSidebarMenuAkahon from "vue-sidebar-menu-akahon";
import { mapState, mapMutations } from "vuex";
// import ms from "@/store/modules/memberStore";

const memberStore = "memberStore";

export default {
	name: "HeaderNav",
	components: { VueSidebarMenuAkahon },
	computed: {
		...mapState(memberStore, ["isLogin", "userInfo"]),
	},
	methods: {
		...mapMutations(memberStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
		onClickLogout() {
			// console.log("memberStore : ", ms);
			console.log("로그아웃 호출");
			this.SET_USER_INFO(null);
			this.SET_IS_LOGIN(false);
			sessionStorage.removeItem("access-token");
			if (this.$route.path != "/") this.$router.push({ name: "home" });
		},
		onClickLogin() {
			// console.log("memberStore : ", ms);
			this.$router.push({ name: "signIn" });
		},
		onClickProfile() {
			// console.log("memberStore : ", ms);
			this.$router.push({ name: "mypage" });
		},
	},
	data() {
		return {
			isMenuOpen: true,
			menuTitle: "happyhouse",
			menuIcon: "bx bx-building-house",
			isAdmin: false,
			// menuItems: [
			// 	{
			// 		link: "/bookmark",
			// 		name: "관심지역",
			// 		tooltip: "my",
			// 		icon: "bx bx-star",
			// 	},
			// 	{
			// 		link: "/aptname",
			// 		name: "아파트 이름 검색",
			// 		tooltip: "my",
			// 		icon: "bx bx-bar-chart-alt-2",
			// 	},
			// 	{
			// 		link: "/aptSearch",
			// 		name: "학군 비교",
			// 		tooltip: "my",
			// 		icon: "bx bxs-graduation",
			// 	},
			// ],
			menuItems1: [
				{
					link: "/bookmark",
					name: "관심지역",
					tooltip: "my",
					icon: "bx bx-star",
				},
				{
					link: "/aptname",
					name: "아파트 이름 검색",
					tooltip: "my",
					icon: "bx bx-bar-chart-alt-2",
				},
				{
					link: "/manage",
					name: "관리 페이지",
					tooltip: "my",
					icon: "bx bx-bar-chart-alt-2",
				},
			],
			menuItems2: [
				{
					link: "/bookmark",
					name: "관심지역",
					tooltip: "my",
					icon: "bx bx-star",
				},
				{
					link: "/aptname",
					name: "아파트 이름 검색",
					tooltip: "my",
					icon: "bx bx-bar-chart-alt-2",
				},
			],
			isExitButton: false,
		};
	},

	mounted() {},
};
</script>

<style scoped>
#container {
	width: 100vw;
}
#navbar {
	width: 100%;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-right: 400px;
	position: fixed;
	z-index: 10;
}
.nav {
	font-size: 20px;
}
.bg-info {
	background-color: #151515 !important;
}
</style>
