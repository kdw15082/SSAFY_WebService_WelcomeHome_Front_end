<template>
	<div id="main">
		<header-nav></header-nav>
		<b-carousel
			id="carousel-fade"
			style="text-shadow: 0px 0px 2px #000"
			fade
			indicators
			img-width="1024"
			img-height="480"
		>
			<b-carousel-slide
				img-src="https://picsum.photos/1024/480/?image=10"
				text-html='<div class="carousel1" style="font-size:50px;margin-bottom:100px;"><div>Find your house, Find your life</div></div>'
			></b-carousel-slide>
			<b-carousel-slide
				img-src="https://picsum.photos/1024/480/?image=12"
				text-html='<div class="carousel1" style="font-size:50px;margin-bottom:100px;"><div>Welcome</div></div>'
			></b-carousel-slide>
			<b-carousel-slide
				img-src="https://picsum.photos/1024/480/?image=22"
				text-html='<div class="carousel1" style="font-size:50px;margin-bottom:100px;"><div>HAPPY HOUSE</div></div>'
			></b-carousel-slide>
		</b-carousel>
		<router-view></router-view>
	</div>
</template>

<script>
import HeaderNav from "@/components/common/HeaderNav.vue";
import { apiInstance } from "@/api/index.js";

const api = apiInstance();

export default {
	name: "WorkspaceJsonApp",
	components: {
		HeaderNav,
	},
	data() {
		return {};
	},
	computed: {},
	watch: {
		$route(to, from) {
			let page = null;
			console.log(to.path);
			if (to.path != from.path) {
				if (to.path == "/") {
					page = "home";
				} else if (to.path == "/board/list") {
					page = "board";
				} else if (to.path == "/board/notice") {
					page = "notice";
				} else if (to.path == "/board/qna") {
					page = "qna";
				} else if (to.path == "/user/mypage") {
					page = "mypage";
				} else if (to.path == "/aptsearch") {
					page = "aptlist";
				} else if (to.path == "/bookmark") {
					page = "bookmark";
				}

				console.log(page);
				if (page != null) {
					api.put(`/stats/${page}`);
					api.put(`/stats/access`);
				} else {
					api.put(`/stats/access`);
				}
			}
		},
	},
};
</script>
<style>
#main {
	width: 100vw;
}
.carousel1 {
	background-color: rgba(255, 255, 255, 0.804);
	height: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgb(57, 56, 56);
}
</style>
