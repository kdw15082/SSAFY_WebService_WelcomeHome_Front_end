<template>
	<div id="container">
		<div id="info-container">
			<div id="info-list">
				<b-container v-if="house" class="bv-example-row">
					<b-row>
						<b-col>
							<b-alert show variant="secondary">일련번호 : {{ house.aptCode }}</b-alert>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-alert show variant="primary">이름 : {{ house.aptName }} </b-alert>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-alert show variant="primary">주소 : {{ house.address }} </b-alert>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<b-alert show variant="info">주거형태 : {{ house.type }} </b-alert>
						</b-col> </b-row
					><b-row>
						<b-col>
							<b-alert show variant="info">평균 매매 거래 금액 : {{ avgMPrice }} </b-alert>
						</b-col> </b-row
					><b-row>
						<b-col>
							<b-alert show variant="info">평균 전세 거래 금액 : {{ avgJPrice }} </b-alert>
						</b-col>
					</b-row>
					<b-row>
						<b-col>
							<div id="bookmarkB" v-show="!bookmark" @click="addBookmark"></div>
							<div id="bookmarkA" v-show="bookmark" @click="removeBookmark"></div>
						</b-col>
					</b-row>
				</b-container>
			</div>
			<div id="info-chart">
				<div class="row mt-5" v-if="arrDealPrice.length > 0">
					<div class="col">
						<h2>거래 추이</h2>
						<house-chart
							:chartData="arrDealPrice"
							:options="chartOptions"
							lable="DealChart"
							:chartColors="chartColors"
						/>
					</div>
				</div>
			</div>
		</div>
		<div id="deal-list">
			<div id="list">
				<b-table
					id="my-table"
					:items="dealList"
					:per-page="perPage"
					:current-page="currentPage"
					:fields="fields"
					small
				></b-table>
			</div>
		</div>
	</div>
</template>

<script>
import HouseChart from "@/components/house/item/HouseChart.vue";
import { mapActions } from "vuex";

import { apiInstance } from "@/api/index";
const api = apiInstance();
const memberStore = "memberStore";
export default {
	name: "HouseDetail",
	components: {
		HouseChart,
	},
	data() {
		return {
			house: {},
			dealList: [],
			perPage: 10,
			currentPage: 1,
			bookmark: false,
			email: "",
			fields: [
				{
					key: "dealYear",
					label: "계약",
				},
				{
					key: "dealMonth",
					label: "월",
				},
				{
					key: "dealDay",
					label: "일",
				},
				{
					key: "dealType",
					label: "타입",
				},
				{
					key: "deal",
					label: "체결 가격",
				},
				{
					key: "deposit",
					label: "전세금(보증금)",
				},
				{
					key: "rent",
					label: "월세",
				},
				{
					key: "floor",
					label: "거래 층",
				},
				{
					key: "area",
					label: "면적",
				},
			],
			arrDealPrice: [],
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			},
			chartColors: {
				mBorderColor: "#ff4500",
				jBorderColor: "#1e90ff",
				mPointBorderColor: "#ff0000",
				mPointBackgroundColor: "#ff0000",
				jPointBorderColor: "#4169e1",
				jPointBackgroundColor: "#4169e1",
				mBackgroundColor: "#ff0000",
				jBackgroundColor: "#4169e1",
			},
			avgMPrice: "",
			avgJPrice: "",
		};
	},
	async created() {
		this.house = this.$store.state.houseStore.house;
		console.log(this.house);
		this.house.address =
			this.house.sidoName +
			" " +
			this.house.gugunName +
			" " +
			this.house.dongName +
			" " +
			this.house.addr;

		this.email = this.$store.state.memberStore.userInfo.email;

		this.init();
	},
	computed: {
		rows() {
			return this.dealList.length;
		},
	},
	filters: {
		price(value) {
			if (!value) return value;
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
	},
	methods: {
		...mapActions(memberStore, ["addAptCode"]),
		async init() {
			this.addAptCode(this.house.aptCode);
			let response = await api.get(`/map/deal`, { params: { aptCode: this.house.aptCode } });
			this.dealList = response.data;
			for (let deal of this.dealList) {
				let pyeong = Math.round(deal.area / 3.3);
				deal.area = pyeong + "평 (" + deal.area + ")";
			}

			this.perPage = this.dealList.length;
			let regex = /[^0-9]/g;

			let mcnt = 0;
			let jcnt = 0;
			let mavg = 0;
			let javg = 0;

			this.dealList.forEach((deal) => {
				if (deal.dealType === "매매") {
					const date = deal.dealYear + "/" + deal.dealMonth + "/" + deal.dealDay;
					this.arrDealPrice.push({
						date,
						mprice: Number(deal.deal.replace(regex, "")),
						jprice: null,
					});
					mavg += Number(deal.deal.replace(regex, ""));
					mcnt++;
				} else if (deal.dealType === "전세") {
					const date = deal.dealYear + "/" + deal.dealMonth + "/" + deal.dealDay;
					this.arrDealPrice.push({
						date,
						jprice: Number(deal.deposit.replace(regex, "")),
						mprice: null,
					});
					javg += Number(deal.deposit.replace(regex, ""));
					jcnt++;
				}
			});
			console.log(mavg);
			if (mavg === 0) {
				this.avgMPrice = "정보 없음";
			} else if (javg === 0) {
				this.avgJPrice = "정보 없음";
			}

			if (mavg > 0) {
				mavg /= mcnt;
				console.log(mavg);
				let quota = Math.floor(mavg / 10000);
				let rest = mavg % 10000;
				if (quota > 0) {
					this.avgMPrice = quota + "억" + rest + "만원";
				} else {
					this.avgMPrice = rest + "만원";
				}
			} else if (javg > 0) {
				javg /= jcnt;
				let quota = Math.floor(javg / 10000);
				let rest = javg % 10000;
				if (quota > 0) {
					this.avgJPrice = quota + "억" + rest + "만원";
				} else {
					this.avgJPrice = rest + "만원";
				}
			}
			let bookmarks = await api.get(`/bookmark/email/${this.email}`);
			bookmarks.data.forEach((mark) => {
				console.log(mark);
				if (mark.aptCode === this.house.aptCode) {
					this.bookmark = true;
				}
			});
		},
		addBookmark() {
			this.bookmark = true;
			const bm = {
				aptCode: this.house.aptCode,
				email: this.email,
			};
			api.post("/bookmark", JSON.stringify(bm));
		},
		async removeBookmark() {
			this.bookmark = false;
			let no = 0;
			let marks = await api.get(`/bookmark/email/${this.email}`);
			marks.data.forEach((mark) => {
				if (mark.aptCode === this.house.aptCode) {
					no = mark.no;
				}
			});
			api.delete("/bookmark/" + no);
		},
	},
};
</script>

<style scoped>
#container {
	width: 100vw;
	height: 150vh;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	background-image: url("@/assets/img/mainBackground.jpg");
}
#info-container {
	width: 100%;
	height: 40%;
	display: flex;
	justify-content: space-around;
}

#info-list {
	width: 40%;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 30px 10px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
}
#info-chart {
	width: 40%;
	position: relative;
	right: 100px;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 30px 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}
#deal-list {
	width: 85%;
	position: relative;
	right: 45px;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 30px 10px;
	height: 30%;
	overflow: auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
#list {
	width: 60%;
	height: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 30px;
}
#school-info {
	width: 85%;
	height: 20%;
	position: relative;
	right: 45px;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 30px 10px;
}

#bookmarkB {
	background-size: contain;
	background-repeat: no-repeat;
	justify-content: center;
	background-image: url("@/assets/img/icon/bookmarkB.png");
	height: 50px;
	width: 50px;
}
#bookmarkB:hover {
	background-size: contain;
	background-repeat: no-repeat;
	justify-content: center;
	background-image: url("@/assets/img/icon/bookmarkA.png");
	width: 50px;
	height: 50px;
}
#bookmarkA {
	background-size: contain;
	background-repeat: no-repeat;
	justify-content: center;
	background-image: url("@/assets/img/icon/bookmarkA.png");
	width: 50px;
	height: 50px;
}
</style>
