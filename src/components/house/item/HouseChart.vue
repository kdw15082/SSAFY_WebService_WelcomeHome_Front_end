<script>
import "chart.js/auto";
import { Line } from "vue-chartjs/legacy";

export default {
	extends: Line,
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
		const dates = this.chartData.map((data) => data.date).reverse();
		const mprices = this.chartData.map((data) => data.mprice).reverse();
		const jprices = this.chartData.map((data) => data.jprice).reverse();

		console.log(dates);
		console.log(mprices);
		console.log(jprices);

		const {
			mBorderColor,
			jBorderColor,
			mPointBorderColor,
			mPointBackgroundColor,
			jPointBorderColor,
			jPointBackgroundColor,
			mBackgroundColor,
			jBackgroundColor,
		} = this.chartColors;
		// this.renderChart(
		// 	{
		// 		labels: dates,
		// 		datasets: [
		// 			{
		// 				type: "line",
		// 				label: this.label,
		// 				data: prices,
		// 			},
		// 		],
		// 	},
		// 	this.options
		// );
		this.renderChart(
			{
				labels: dates,
				datasets: [
					{
						type: "line",
						label: "매매",
						data: mprices,
						spanGaps: true,
						borderColor: mBorderColor,
						pointBorderColor: mPointBorderColor,
						pointBackgroundColor: mPointBackgroundColor,
						backgroundColor: mBackgroundColor,
					},
					{
						type: "line",
						label: "전세",
						data: jprices,
						spanGaps: true,
						borderColor: jBorderColor,
						pointBorderColor: jPointBorderColor,
						pointBackgroundColor: jPointBackgroundColor,
						backgroundColor: jBackgroundColor,
					},
				],
			},
			this.options
		);
	},
};
</script>
