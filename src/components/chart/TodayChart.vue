<script>
import "chart.js/auto";
import { Bar } from "vue-chartjs/legacy";

export default {
	extends: Bar,
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
		console.log("왔니");
		const labels = [
			"",
			"가입자수",
			"탈퇴자수",
			// "접속자수",
			"메인",
			"게시판",
			"질문",
			"공지",
			"마이페이지",
			"아파트목록",
			"관심매물",
			"",
		];

		const data = [];
		console.log(this.chartData[0].regist);
		data.push(0);
		data.push(this.chartData[0].regist);
		data.push(this.chartData[0].quit);
		// data.push(this.chartData[0].access);
		data.push(this.chartData[0].home);
		data.push(this.chartData[0].board);
		data.push(this.chartData[0].qna);
		data.push(this.chartData[0].notice);
		data.push(this.chartData[0].mypage);
		data.push(this.chartData[0].aptlist);
		data.push(this.chartData[0].bookmark);
		data.push(0);

		this.renderChart(
			{
				labels: labels,
				datasets: [
					{
						type: "bar",
						label: "오늘의 통계",
						data: data,
						backgroundColor: [
							"#ff0000",
							"#D2B48C",
							"#FFEBCD",
							"#DAA520",
							"#FFD700",
							"#F0E68C",
							"#BDB76B",
							"#EEE8AA",
							"#DEB887	",
							"#F5DEB3",
							"#4169e1",
						],
						borderWidth: 0,
					},
				],
			},
			this.options
		);
	},
};
</script>
