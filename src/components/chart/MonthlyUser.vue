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
	watch: {},
	mounted() {
		console.log(this.chartData);
		const dates = this.chartData?.map((data) => data.date);
		const regist = this.chartData?.map((data) => data.regist);
		const quit = this.chartData?.map((data) => data.quit);
		console.log(dates);
		console.log(regist);
		console.log(quit);

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
		this.renderChart(
			{
				labels: dates,
				datasets: [
					{
						type: "line",
						label: "가입",
						data: regist,
						spanGaps: true,
						borderColor: mBorderColor,
						pointBorderColor: mPointBorderColor,
						pointBackgroundColor: mPointBackgroundColor,
						backgroundColor: mBackgroundColor,
					},
					{
						type: "line",
						label: "탈퇴",
						data: quit,
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
