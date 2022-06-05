<script>
import "chart.js/auto";
import { Pie } from "vue-chartjs/legacy";

export default {
	extends: Pie,
	props: {
		label: {
			type: String,
		},
		chartData: {
			type: Array,
		},
		options: {
			type: Object,
		},
		chartColors: {
			type: Object,
		},
	},
	mounted() {
		//const dates = this.chartData.map((data) => data.date).reverse();
		const mUser = this.chartData.map((data) => data.mUser);
		const fUser = this.chartData.map((data) => data.fUser);

		console.log(mUser);
		console.log(fUser);

		this.renderChart(
			{
				labels: ["남성", "여성"],
				datasets: [
					{
						type: "pie",
						label: "회원 성비",
						data: [mUser, fUser],
						backgroundColor: ["	#4682B4", "#B0C4DE"],
						borderWidth: 0,
					},
				],
			},
			this.options
		);
	},
};
</script>
