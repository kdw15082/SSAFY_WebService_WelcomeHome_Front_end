<template>
	<div id="list">
		<b-table
			id="my-table"
			:items="List"
			:per-page="perPage"
			:current-page="currentPage"
			small
		></b-table>
		<b-pagination
			v-model="currentPage"
			:total-rows="rows"
			:per-page="perPage"
			aria-controls="my-table"
		></b-pagination>
	</div>
</template>

<script>
export default {
	name: "WorkspaceJsonHouseDealList",

	data() {
		return {
			perPage: 10,
			currentPage: 1,
			List: [],
			props: {
				dealList: {
					type: Array,
				},
			},
			fields: [
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
					label: "매매",
				},
			],
		};
	},
	computed: {
		rows() {
			return this.items.length;
		},
	},
	created() {
		this.List = this.dealList;
	},

	methods: {},
};
</script>

<style scoped>
#list {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
</style>
