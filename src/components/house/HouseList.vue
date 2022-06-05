<template>
	<div id="house-list">
		<div class="list">
			<b-input-group prepend="건물명" class="mt-3 mb-3">
				<b-form-input class="col col-lg-2" v-model.lazy="aptName" @change="search"></b-form-input>
				<b-input-group-append class="col col-lg-2">
					<b-button variant="info">검색</b-button>
				</b-input-group-append>
			</b-input-group>
			<b-table
				id="my-table"
				:items="houses"
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
</template>

<script>
import { apiInstance } from "@/api/index";
import { mapActions } from "vuex";
const api = apiInstance();
const houseStore = "houseStore";
export default {
	name: "HouseList",
	data() {
		return {
			aptName: "",
			houses: [],
			perPage: 10,
			currentPage: 1,
			fields: [
				{
					key: "aptCode",
					label: "일련번호",
				},
				{
					key: "aptName",
					label: "건물명",
				},
				{
					key: "type",
					label: "타입",
				},
				{
					key: "recentDeal",
					label: "최근 매매 금액",
				},
				{
					key: "addres",
					label: "지역",
				},
				{
					key: "recentRentDeposit",
					label: "최근 전세 금액(보증금)",
				},
				{
					key: "recentRent",
					label: "월세",
				},
			],
		};
	},
	computed: {
		rows() {
			return this.houses.length;
		},
	},
	updated() {
		window.scrollTo(0, document.body.scrollHeight);
	},
	methods: {
		...mapActions(houseStore, ["detailHouse"]),
		async search() {
			let response = await api.get(`/map/aptName`, { params: { aptName: this.aptName } });
			console.log(response);
			this.houses = response.data;
			for (let house of this.houses) {
				house.addres = house.gugunName + " " + house.dongName;
			}
		},
		onRowSelected(items) {
			console.log(items[0]);

			this.detailHouse(items[0]);
			this.$router.push({ name: "aptdetail", params: { aptName: items[0].aptName } });
		},
	},
};
</script>

<style scoped>
#house-list {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.list {
	width: 1000px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
