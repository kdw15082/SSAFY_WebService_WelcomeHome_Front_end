import { sidoList, gugunList, dongList } from "@/api/house.js";

const houseStore = {
	namespaced: true,
	state: {
		sidos: [{ value: null, text: "선택하세요" }],
		guguns: [{ value: null, text: "선택하세요" }],
		dongs: [{ value: null, text: "선택하세요" }],
		house: null,
		lat: null,
		lng: null,
	},

	getters: {},

	mutations: {
		SET_LAT: (state, lat) => {
			state.lat = lat;
		},
		SET_LNG: (state, lng) => {
			state.lng = lng;
		},
		SET_SIDO_LIST: (state, sidos) => {
			sidos.forEach((sido) => {
				state.sidos.push({ value: sido.sidoCode, text: sido.sidoName });
			});
		},
		SET_GUGUN_LIST: (state, guguns) => {
			guguns.forEach((gugun) => {
				state.guguns.push({ value: gugun.gugunCode, text: gugun.gugunName });
			});
		},
		SET_DONG_LIST: (state, dongs) => {
			dongs.forEach((dong) => {
				state.dongs.push({ value: dong.dongCode, text: dong.dongName });
			});
		},
		CLEAR_SIDO_LIST: (state) => {
			state.sidos = [{ value: null, text: "선택하세요" }];
		},
		CLEAR_GUGUN_LIST: (state) => {
			state.guguns = [{ value: null, text: "선택하세요" }];
		},
		CLEAR_DONG_LIST: (state) => {
			state.dongs = [{ value: null, text: "선택하세요" }];
		},
		SET_HOUSE_LIST: (state, houses) => {
			//   console.log(houses);
			state.houses = houses;
		},
		SET_DETAIL_HOUSE: (state, house) => {
			state.house = house;
		},
	},

	actions: {
		getSido: ({ commit }) => {
			sidoList(
				({ data }) => {
					// console.log(data);
					commit("SET_SIDO_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getGugun: ({ commit }, sidoCode) => {
			const params = {
				sido: sidoCode,
			};
			gugunList(
				params,
				({ data }) => {
					// console.log(commit, response);
					commit("SET_GUGUN_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		//내가 만든거
		getDong: ({ commit }, gugunCode) => {
			const params = {
				gugun: gugunCode,
			};
			dongList(
				params,
				({ data }) => {
					// console.log(commit, response);
					commit("SET_DONG_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		detailHouse: ({ commit }, house) => {
			// 나중에 house.일련번호를 이용하여 API 호출
			commit("SET_DETAIL_HOUSE", house);
		},
		storelat: ({ commit }, lat) => {
			commit("SET_LAT", lat);
		},
		storelng: ({ commit }, lng) => {
			commit("SET_LNG", lng);
		},
	},
};

export default houseStore;
