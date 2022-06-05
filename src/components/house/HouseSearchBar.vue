<template>
	<div id="search">
		<div class="selectors">
			<b-form-select
				class="selector"
				v-model="sidoCode"
				:options="sidos"
				@change="gugunList"
			></b-form-select>
			<b-form-select
				class="selector"
				v-model="gugunCode"
				:options="guguns"
				@change="dongList"
			></b-form-select>
			<b-form-select
				class="selector"
				v-model="dongCode"
				:options="dongs"
				@change="searchApt"
			></b-form-select>
		</div>
	</div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";

const houseStore = "houseStore";

export default {
	name: "HouseSearchBar",
	data() {
		return {
			sidoCode: null,
			gugunCode: null,
			dongCode: null,
		};
	},

	computed: {
		...mapState(houseStore, ["sidos", "guguns", "houses", "dongs"]),
	},

	created() {
		this.CLEAR_SIDO_LIST();
		this.getSido();
	},
	methods: {
		...mapActions(houseStore, ["getSido", "getGugun", "getDong", "getHouseList"]),
		...mapMutations(houseStore, ["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST", "CLEAR_DONG_LIST"]),
		gugunList() {
			console.log(this.sidoCode);
			this.CLEAR_GUGUN_LIST();
			this.gugunCode = null;
			if (this.sidoCode) this.getGugun(this.sidoCode);
		},
		dongList() {
			console.log(this.gugunCode);
			this.CLEAR_DONG_LIST();
			this.dongCode = null;
			if (this.gugunCode) this.getDong(this.gugunCode);
		},
		searchApt() {
			this.$emit("aptChanged", this.dongCode);
		},
	},
};
</script>

<style scoped>
#search {
	width: 100%;
	height: 50px;
	display: flex;
}

.selector {
	width: 150px;
}

.selectors {
	width: 100%;
	display: flex;
	justify-content: space-around;
}
</style>
