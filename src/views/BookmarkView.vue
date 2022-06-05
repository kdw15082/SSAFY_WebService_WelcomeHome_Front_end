<template>
	<div class="main center">
		<div class="center-div">
			<div id="bookmark">
				<div style="border: solid; width: 45%; border-radius: 10px">
					<div class="window">
						<div class="card-title">나의 관심 단지</div>
						<div v-for="(apt, index) in aptList" :key="index" class="mb-2 apt-card">
							<div
								class="card-top"
								style="font-weight: bold; font-size: 16px"
								@click="goDetail(`${apt.aptCode}`)"
							>
								<div>{{ apt.aptName }}</div>
								<div style="font-weight: lighter; font-size: 16px">
									<div v-if="apt.dealType === '월세'" style="color: green; font-weight: bold">
										{{ apt.dealType }}
									</div>
									<div v-if="apt.dealType === '전세'" style="color: blue; font-weight: bold">
										{{ apt.dealType }}
									</div>
									<div v-if="apt.dealType === '매매'" style="color: orange; font-weight: bold">
										{{ apt.dealType }}
									</div>
								</div>
							</div>
							<div class="card-top" @click="goDetail(`${apt.aptCode}`)">
								<div style="font-size: 12px">{{ apt.wholeAddress }}</div>
								<div class="card-top">
									<div>{{ apt.floor }}층 {{ apt.area }}평&nbsp;&nbsp;</div>
									<div class="card-right" v-if="apt.dealType === '월세'">
										{{ apt.deposit }}만원/{{ apt.rent }}만원
									</div>
									<div class="card-right" v-if="apt.dealType === '전세'">{{ apt.deposit }}만원</div>
									<div class="card-right" v-if="apt.dealType === '매매'">{{ apt.deal }}만원</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<hr />
				<div style="border: solid; width: 45%; border-radius: 10px">
					<div class="window">
						<div class="card-title">최근 조회 아파트</div>
						<div v-for="(apt, index) in recentList" :key="index" class="mb-2 apt-card">
							<div
								class="card-top"
								style="font-weight: bold; font-size: 16px"
								@click="goDetail(`${apt.aptCode}`)"
							>
								<div>{{ apt.aptName }}</div>
								<div style="font-weight: lighter; font-size: 16px">
									<div v-if="apt.dealType === '월세'" style="color: green; font-weight: bold">
										{{ apt.dealType }}
									</div>
									<div v-if="apt.dealType === '전세'" style="color: blue; font-weight: bold">
										{{ apt.dealType }}
									</div>
									<div v-if="apt.dealType === '매매'" style="color: orange; font-weight: bold">
										{{ apt.dealType }}
									</div>
								</div>
							</div>
							<div class="card-top" @click="goDetail(`${apt.aptCode}`)">
								<div style="font-size: 12px">{{ apt.wholeAddress }}</div>
								<div class="card-top">
									<div>{{ apt.floor }}층 {{ apt.area }}평&nbsp;&nbsp;</div>
									<div class="card-right" v-if="apt.dealType === '월세'">
										{{ apt.deposit }}만원/{{ apt.rent }}만원
									</div>
									<div class="card-right" v-if="apt.dealType === '전세'">{{ apt.deposit }}만원</div>
									<div class="card-right" v-if="apt.dealType === '매매'">{{ apt.deal }}만원</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { apiInstance } from "@/api/index.js";
import { mapActions } from "vuex";
const api = apiInstance();
const houseStore = "houseStore";
export default {
	name: "BookmarkView",

	data() {
		return {
			marks: [],
			aptList: [],
			recentList: [],
			totalList: [],
		};
	},

	async created() {
		let email = this.$store.state.memberStore.userInfo.email;
		this.marks = await api.get(`/bookmark/email/` + email);
		console.log(email, this.marks);

		for (let data of this.marks.data) {
			let response = await api.get(`/map/deal`, { params: { aptCode: data.aptCode } });
			let list = response.data[0];
			list.area = Math.round(list.area / 3.3);
			response = await api.get(`/map/aptCode`, { params: { aptCode: data.aptCode } });
			list.wholeAddress =
				response.data.sidoName + " " + response.data.gugunName + " " + response.data.dongName;
			this.totalList.push(response.data);
			this.aptList.push(list);
		}

		let recentCodes = this.$store.state.memberStore.recentApts;
		for (let aptCode of recentCodes) {
			let response = await api.get(`/map/deal`, { params: { aptCode: aptCode } });
			let list = response.data[0];
			list.area = Math.round(list.area / 3.3);

			response = await api.get(`/map/aptCode`, { params: { aptCode: aptCode } });
			list.wholeAddress =
				response.data.sidoName + " " + response.data.gugunName + " " + response.data.dongName;

			this.totalList.push(response.data);
			this.recentList.push(list);
		}
		this.recentList = this.recentList.reverse();
		window.scrollTo(0, document.body.scrollHeight);
	},
	methods: {
		...mapActions(houseStore, ["detailHouse"]),
		change(price) {
			let cp = "";
			let quota = Math.floor(price / 10000);
			let rest = price % 10000;
			if (quota > 0) {
				cp = quota + "억" + rest + "만원";
			} else {
				cp = rest + "만원";
			}
			return cp;
		},
		goDetail(aptCode) {
			console.log(aptCode);
			for (let house of this.totalList) {
				if (house.aptCode == aptCode) {
					console.log(house);
					this.detailHouse(house);
					this.$router.push({ name: "aptdetail", params: { aptName: house.aptName } });
				}
			}
		},
	},
};
</script>

<style scoped>
.main {
	height: 96vh;
	widows: 100vw;
	background-color: rgb(67, 67, 67);
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
}
.center-div {
	width: 80%;
	height: 90%;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 30px 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}
#bookmark {
	width: 90%;
	height: 90%;
	padding-top: 2%;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 30px 10px;
	justify-content: space-around;
	display: flex;
	padding-bottom: 2%;
}

.window {
	height: 92%;
	margin: 5%;
	border: dashed;
	border-radius: 10px;
	overflow: auto;
	padding: 3%;
	display: flex;
	flex-direction: column;
}
.apt-card {
	height: 80px;
	border: solid;
	border-radius: 10px;
	padding: 3%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.apt-card:hover {
	cursor: pointer;
	background-color: rgba(25, 25, 25, 0.201);
}

.apt-card:active {
	cursor: pointer;
	background-color: rgba(25, 25, 25, 0.433);
}

.card-top {
	display: flex;
	justify-content: space-between;
}
.card-right {
	font-weight: bold;
	font-size: 16px;
}
.card-title {
	padding: 3%;
	font-size: 20px;
	font-weight: bold;
}
</style>
