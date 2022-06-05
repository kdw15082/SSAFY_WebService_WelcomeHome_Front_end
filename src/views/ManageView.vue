<template>
	<div class="main center">
		<div class="center-div">
			<div id="chart-div" class="chart-board">
				<div class="line">
					<div class="chart">
						<monthly-user
							:chartData="arrMonthly"
							:options="chartOptions1"
							lable="MonthlyChart"
							:chartColors="chartColors"
							v-if="arrMonthly.length > 0"
						/>
					</div>
					<div class="chart">
						<user-pie-chart
							:chartData="arrGenderRatio"
							:options="chartOptions2"
							lable="userChart"
							:chartColors="chartColors"
							v-if="arrGenderRatio.length > 0"
						/>
					</div>
				</div>
				<div class="line">
					<div class="chart">
						<today-chart
							:chartData="arrTodayRatio"
							:options="chartOptions1"
							lable="todayChart"
							:chartColors="chartColors"
							v-if="arrTodayRatio.length > 0"
						/>
					</div>
					<div class="chart" style="display: flex; justify-content: center; align-items: center">
						<div class="list">
							<b-input-group class="mt-3 mb-3">
								<b-form-input
									class="col col-lg-2"
									v-model.lazy="name"
									@change="search"
								></b-form-input>
								<b-button variant="info">검색</b-button>
							</b-input-group>
							<b-table
								id="my-table"
								:items="users"
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
							<b-pagination
								v-model="currentPage"
								:total-rows="rows"
								:per-page="perPage"
								pills
								aria-controls="my-table"
							></b-pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MonthlyUser from "@/components/chart/MonthlyUser.vue";
import UserPieChart from "@/components/chart/UserPieChart.vue";
import TodayChart from "@/components/chart/TodayChart.vue";
import { apiInstance } from "@/api/index";
const api = apiInstance();
export default {
	name: "ManageView",
	components: {
		MonthlyUser,
		UserPieChart,
		TodayChart,
	},
	data() {
		return {
			arrMonthly: [],
			arrGenderRatio: [],
			arrTodayRatio: [],
			todayList: [],
			monthlyData: [],
			userList: [],
			users: [],
			name: "",
			chartOptions1: {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: 50,
				},
			},
			chartOptions2: {
				responsive: true,
				legend: false,
				maintainAspectRatio: false,
				animation: false,
				pieceLabel: {
					mode: "label",
					position: "outside",
					fontSize: 11,
					fontStyle: "bold",
				},
			},
			chartOptions3: {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: 50,
				},
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

			perPage: 5,
			currentPage: 1,
			fields: [
				{
					key: "email",
					label: "이메일",
				},
				{
					key: "name",
					label: "이름",
				},
				{
					key: "age",
					label: "나이",
				},
				{
					key: "gender",
					label: "성별",
				},
				{
					key: "regdate",
					label: "가입일자",
				},
			],
		};
	},

	async created() {
		this.init();
		let response = await api.get("/user");
		this.users = response.data;
		console.log(this.users);
	},
	computed: {
		rows() {
			return this.users.length;
		},
	},
	methods: {
		async search() {
			let response = await api.get(`/user/name/${this.name}`);
			console.log(response);
			this.users = response.data;
		},
		async init() {
			let response = await api.get(`/stats/recentMonth`);
			console.log(response);

			this.monthlyData = response.data;
			let temp = [];
			this.monthlyData.forEach((day) => {
				if (day.regist === 0) {
					day.regist = null;
				}
				if (day.quit === 0) {
					day.quit = null;
				}
				temp.push({
					date: day.date,
					regist: day.regist,
					quit: day.quit,
				});
				this.arrMonthly = temp;
			});

			response = await api.get(`/user`);
			this.userList = response.data;
			console.log("유저리스트", this.userList);
			let mUser = 0;
			let fUser = 0;
			temp = [];
			for (let user of this.userList) {
				if (user.gender == "남성") {
					mUser++;
				} else {
					fUser++;
				}
			}

			temp.push({
				mUser: mUser,
				fUser: fUser,
			});
			this.arrGenderRatio = temp;
			temp = [];
			response = await api.get(`/stats/today`);
			this.todayList = response.data;
			console.log("투데이리스트", this.todayList);
			temp.push(this.todayList);
			this.arrTodayRatio = temp;
		},
		onRowSelected(items) {
			console.log(items);
			// this.detailHouse(items[0]);
			// this.$router.push({ name: "aptdetail", params: { aptName: items[0].aptName } });
		},
	},
};
</script>

<style scoped>
.main {
	height: 150vh;
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
.chart-board {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
#chart {
	height: 100%;
	width: 80%;
	justify-content: space-between;
}
#chart-div {
	width: 90%;
	height: 90%;
	padding-top: 2%;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 30px 10px;
	display: flex;
	flex-direction: column;
}
.line {
	display: flex;
	justify-content: space-between;
	width: 90%;
	height: 90%;
}
.chart {
	border: solid;
	width: 49%;
	height: 89%;
}
.list {
	width: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
