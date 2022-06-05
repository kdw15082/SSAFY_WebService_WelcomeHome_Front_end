<template>
	<div id="apt-container">
		<div class="map-container" v-show="show">
			<div class="map_wrap">
				<div id="map" style="width: 100%; height: 100%; position: relative; overflow: hidden"></div>
				<ul id="category">
					<li id="BK9" data-order="0">
						<span class="category_bg bank"></span>
						은행
					</li>
					<li id="MT1" data-order="1">
						<span class="category_bg mart"></span>
						마트
					</li>
					<li id="PM9" data-order="2">
						<span class="category_bg pharmacy"></span>
						약국
					</li>
					<li id="OL7" data-order="3">
						<span class="category_bg oil"></span>
						주유소
					</li>
					<li id="CE7" data-order="4">
						<span class="category_bg cafe"></span>
						카페
					</li>
					<li id="CS2" data-order="5">
						<span class="category_bg store"></span>
						편의점
					</li>
				</ul>
			</div>
			<div id="selector-container">
				<div id="home">
					<house-search-bar @aptChanged="aptChanged"></house-search-bar>
				</div>
				<div id="selector">
					<div id="btns">
						<div class="select-category" @click="tradingBtn">매매</div>
						<div class="select-category" @click="yearBtn">입주년차</div>
						<div class="select-category" @click="priceBtn">매매 실거래가</div>
					</div>
				</div>
				<div id="bottom">
					<div id="divs">
						<div v-show="trading">
							<b-form-radio-group
								id="radio-group-1"
								v-model="dealType"
								:options="dealTypes"
							></b-form-radio-group>
						</div>
						<div v-show="price" style="display: flex; justify-content: space-between">
							<MultiRangeSlider
								:min="0"
								:max="500000"
								:step="10000"
								:ruler="true"
								:label="true"
								:minValue="minValue"
								:maxValue="maxValue"
								@input="UpdateValues"
							/>
							<div>(단위:만원)</div>
						</div>
						<div v-show="year" style="display: flex; justify-content: space-between">
							<MultiRangeSlider
								:min="2"
								:max="100"
								:step="2"
								:ruler="true"
								:label="true"
								:minValue="minYear"
								:maxValue="maxYear"
								@input="UpdateValues2"
							/>
							<div>(단위:년)</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="loading" v-show="indi">
			<b-spinner style="width: 3rem; height: 3rem" label="Large Spinner"></b-spinner>
			<div>화면을 로딩 중입니다!</div>
		</div>
	</div>
</template>

<script>
import { apiInstance } from "@/api/index";
import HouseSearchBar from "@/components/house/HouseSearchBar.vue";
import { mapActions } from "vuex";
import MultiRangeSlider from "multi-range-slider-vue";

const houseStore = "houseStore";

const api = apiInstance();
export default {
	name: "KaKaoMap",
	components: {
		HouseSearchBar,
		MultiRangeSlider,
	},
	data() {
		return {
			houses: [],
			markers: [],
			overlays: [],
			titles: [],
			condition: {},
			selected: [],
			clusterer: null,
			lat: 37.50815744978059,
			lng: 127.03277693782628,
			trading: false,
			year: false,
			price: false,
			isRent: false,
			show: false,
			indi: false,
			minValue: 0,
			maxValue: 500000,
			min: 0,
			max: 500000,
			minYear: 0,
			maxYear: 100,
			rentDeposit: 10000,
			//비동기로 받아올 아파트 목록
			// -------------- 카카오카테고리------------------->
			placeOverlay: null,
			contentNode: null,
			cmarkers: [],
			currCategory: "",
			ps: null,
			// -------------- 카카오카테고리------------------->
			apts: [],
			dealType: "매매", // Must be an array reference!
			dealTypes: [
				{ text: "매매", value: "매매" },
				{ text: "전세", value: "전세" },
				{ text: "월세", value: "월세" },
			],
		};
	},
	watch: {
		dealType: function (nv) {
			if (nv === "월세") {
				this.isRent = true;
			} else {
				this.isRent = false;
			}
			this.condition.dealType = nv;
			this.removeClusterer(this.markers);
			this.retriev();
		},
		lat: function (nv) {
			this.storelat(nv);
			console.log("lat 변경");
		},
		lng: function (nv) {
			this.storelng(nv);
			console.log("lng 변경");
		},
	},
	created() {
		this.houses = this.$store.state.houseStore.houses;
		this.condition.dealType = "매매";
		this.condition.minValue = 0;
		this.condition.maxValue = 1000000;
		this.condition.minYear = 0;
		this.condition.maxYear = 100;
		let startlat = this.$store.state.houseStore.lat;
		let startlng = this.$store.state.houseStore.lng;

		if (startlat != null && startlng != null) {
			this.lat = startlat;
			this.lng = startlng;
		}
		//ai 에 대해서 interceptor를 설정해보자.
		api.interceptors.request.use(
			(config) => {
				console.log("요청: ", config);
				this.show = false;
				this.indi = true;
				//요청을 다시 리턴해줘야 흐름이 이어진다.
				return config;
			},
			(error) => {
				this.show = false;
				this.indi = false;

				console.log("요청 실패: ", error);
			}
		);
		api.interceptors.response.use(
			(response) => {
				console.log("응답: ", response);
				this.show = true;
				this.indi = false;
				//응답을 다시 리턴해줘야 흐름이 이어진다.
				return response;
			},
			(error) => {
				this.show = false;
				this.indi = false;
				console.log("응답 실패: ", error);
			}
		);
	},
	async mounted() {
		console.log(this.houses);
		if (this.houses === undefined) {
			const response = await api.get(`/map/apt`);
			this.houses = response.data;
		}
		if (window.kakao && window.kakao.maps) {
			this.initMap();
		} else {
			const script = document.createElement("script");
			/* global kakao */
			script.onload = () => kakao.maps.load(this.initMap);
			script.src =
				"//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=473fb4177344fae196f3127d02f56734&libraries=services,clusterer,drawing";
			document.head.appendChild(script);
		}
	},
	methods: {
		...mapActions(houseStore, ["storelat", "storelng", "detailHouse"]),
		UpdateValues(e) {
			this.minValue = e.minValue;
			this.maxValue = e.maxValue;
			this.submit();
		},
		UpdateValues2(e) {
			this.minYear = e.minValue;
			this.maxYear = e.maxValue;
			this.submit();
		},
		initMap() {
			const container = document.getElementById("map");
			const options = {
				center: new kakao.maps.LatLng(this.lat, this.lng),
				level: 2,
			};

			//지도 객체를 등록합니다.
			//지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
			this.map = new kakao.maps.Map(container, options);
			this.map.setMaxLevel(5);

			this.clusterer = this.makeClusterer();
			// 지도가 이동, 확대, 축소로 인해 지도영역이 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다

			kakao.maps.event.addListener(this.map, "tilesloaded", () => {
				if (this.map.getLevel() > 2) {
					console.log(this.map.getLevel());
					if (this.overlays.length > 0) {
						this.overlays.forEach((item) => {
							item.setMap(null);
						});
					}
				}
				// 지도 영역정보를 얻어옵니다
				var bounds = this.map.getBounds();

				// 영역정보의 남서쪽 정보를 얻어옵니다
				var swLatlng = bounds.getSouthWest();

				// 영역정보의 북동쪽 정보를 얻어옵니다
				var neLatlng = bounds.getNorthEast();
				this.selected = [];
				for (let index = 0; index < this.houses.length; index++) {
					if (
						this.houses[index].lat >= swLatlng.Ma &&
						this.houses[index].lat <= neLatlng.Ma &&
						this.houses[index].lng >= swLatlng.La &&
						this.houses[index].lng <= neLatlng.La
					) {
						this.conditionCheck(index);
						// selected.push(this.houses[index]);
					}
				}
				console.log(this.selected);
				this.displayOverlay(this.selected);
				this.displayMarker(this.selected);
				let center = this.map.getCenter();
				this.lat = center.Ma;
				this.lng = center.La;

				// 장소 검색 객체를 생성합니다
				this.ps = new kakao.maps.services.Places(this.map);
				// 지도에 idle 이벤트를 등록합니다
				kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
				// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
				this.contentNode = document.createElement("div");
				this.contentNode.className = "placeinfo_wrap";
				// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
				// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
				this.addEventHandle(this.contentNode, "mousedown", kakao.maps.event.preventMap);
				this.addEventHandle(this.contentNode, "touchstart", kakao.maps.event.preventMap);
				// 커스텀 오버레이 컨텐츠를 설정합니다
				this.placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
				this.placeOverlay.setContent(this.contentNode);
				// 각 카테고리에 클릭 이벤트를 등록합니다
				this.addCategoryClickEvent();
			});
		},
		displayOverlay(markerPositions) {
			if (this.overlays.length > 0) {
				this.overlays.forEach((item) => {
					item.setMap(null);
				});
			}
			let regex = /[^0-9]/g;

			for (var i = 0; i < markerPositions.length; i++) {
				if (this.map.getLevel() <= 2) {
					// 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
					let price = "";
					let img = "";
					if (this.dealType === "매매") {
						let p = (
							parseFloat(Number(markerPositions[i].recentDeal.replace(regex, ""))) / 10000
						).toFixed(1);
						price = p + "억";
						if (p < 5) {
							img = "img-one";
						} else if (p < 10) {
							img = "img-two";
						} else {
							img = "img-three";
						}
					} else if (this.dealType === "전세") {
						let p = (
							parseFloat(Number(markerPositions[i].recentLease.replace(regex, ""))) / 10000
						).toFixed(1);
						price = p + "억";
						if (p < 5) {
							img = "img-one";
						} else if (p < 10) {
							img = "img-two";
						} else {
							img = "img-three";
						}
						price = p + "억";
					} else if (this.dealType === "월세") {
						let p = (
							parseFloat(Number(markerPositions[i].recentRent.replace(regex, ""))) / 10000
						).toFixed(2);
						if (p < 0.01) {
							img = "img-one";
							price = Number(markerPositions[i].recentRent.replace(regex, "")) + "만원";
						} else if (p < 0.05) {
							img = "img-two";
							price = Number(markerPositions[i].recentRent.replace(regex, "")) + "만원";
						} else {
							img = "img-three";
							price = p + "억";
						}
					}

					// let content = '<div class="overlay">' + "<div>" + price + "</div>" + "</div>";
					let content =
						'<div id="overlay-c" >' +
						'<div id="overlay"' +
						' class="' +
						img +
						'" >' +
						"<div>" +
						price +
						"</div>" +
						"</div>" +
						'<div id="overlay-bottom">' +
						markerPositions[i].aptName +
						"</div>" +
						"</div>" +
						"</div>";
					// 커스텀 오버레이를 생성합니다
					let overlay = new kakao.maps.CustomOverlay({
						map: this.map,
						position: new kakao.maps.LatLng(markerPositions[i].lat, markerPositions[i].lng),
						content: content,
						yAnchor: 0.85,
					});

					this.overlays.push(overlay);
				}
			}
		},
		displayMarker(markerPositions) {
			let imageSrc = require("@/assets/img/icon/aptMarker.png"), // 마커이미지의 주소입니다
				imageSize = new kakao.maps.Size(58, 61), // 마커이미지의 크기입니다
				imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
			// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
			let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

			for (var i = 0; i < markerPositions.length; i++) {
				if (!this.titles.includes(markerPositions[i].aptName)) {
					this.titles.push(markerPositions[i].aptName);
				} else {
					continue;
				}
				let latlng = new kakao.maps.LatLng(markerPositions[i].lat, markerPositions[i].lng);
				// 마커를 생성합니다
				var marker = new kakao.maps.Marker({
					map: this.map, // 마커를 표시할 지도
					position: latlng, // 마커를 표시할 위치
					title: markerPositions[i].aptName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
					image: markerImage,
					zIndex: 4,
				});

				this.markers.push(marker);

				// 마커에 이벤트를 등록하는 함수 만들고 즉시 호출하여 클로저를 만듭니다
				// 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
				const router = this.$router;
				((marker, house) => {
					// 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
					kakao.maps.event.addListener(marker, "click", () => {
						this.detailHouse(house);
						router.push({ name: "aptdetail", params: { aptName: marker.getTitle() } });
					});
				})(marker, markerPositions[i]);
			}

			// 클러스터러에 마커들을 추가합니다
			this.clusterer.addMarkers(this.markers);
		},
		tradingBtn() {
			this.trading = !this.trading;
			this.year = false;
			this.price = false;
			this.jprice = false;
		},
		yearBtn() {
			this.year = !this.year;
			this.trading = false;
			this.price = false;
			this.jprice = false;
		},
		priceBtn() {
			this.price = !this.price;
			this.year = false;
			this.trading = false;
			this.jprice = false;
		},
		aptChanged(dongCode) {
			console.log(dongCode);
			let positions = [];
			for (let house of this.houses) {
				if (house.dongCode === dongCode) {
					positions.push(house);
				}
			}

			// 4. 지도를 이동시켜주기
			// 배열.reduce( (누적값, 현재값, 인덱스, 요소)=>{ return 결과값}, 초기값);
			const bounds = positions.reduce(
				(bounds, position) => bounds.extend(new kakao.maps.LatLng(position.lat, position.lng)),
				new kakao.maps.LatLngBounds()
			);
			console.log(bounds);
			this.map.setBounds(bounds);
			this.map.setLevel(3);
			let center = this.map.getCenter();
			this.lat = center.Ma;
			this.lng = center.La;
		},
		makeClusterer() {
			return new kakao.maps.MarkerClusterer({
				map: this.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
				averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
				minLevel: 2, // 클러스터 할 최소 지도 레벨
				gridSize: 50,
			});
		},
		removeClusterer(markers) {
			// 1. 현재 표시되어있는 marker들이 있다면 marker에 등록된 map을 없애준다.
			if (markers.length > 0) {
				markers.forEach((item) => {
					item.setMap(null);
				});
			}
			if (this.overlays.length > 0) {
				this.overlays.forEach((item) => {
					item.setMap(null);
				});
			}
			this.clusterer.removeMarkers(markers);
		},
		conditionCheck(index) {
			let year = 2022;
			let regex = /[^0-9]/g;
			if (
				this.condition.dealType === "매매" &&
				this.houses[index].recentDeal != null &&
				Number(this.houses[index].recentDeal.replace(regex, "")) >= this.condition.minValue &&
				Number(this.houses[index].recentDeal.replace(regex, "")) <= this.condition.maxValue &&
				year - this.houses[index].buildYear >= this.condition.minYear &&
				year - this.houses[index].buildYear <= this.condition.maxYear
			) {
				this.selected.push(this.houses[index]);
			} else if (
				this.condition.dealType === "전세" &&
				this.houses[index].recentLease != null &&
				Number(this.houses[index].recentLease.replace(regex, "")) >= this.condition.minValue &&
				Number(this.houses[index].recentLease.replace(regex, "")) <= this.condition.maxValue &&
				year - this.houses[index].buildYear >= this.condition.minYear &&
				year - this.houses[index].buildYear <= this.condition.maxYear
			) {
				this.selected.push(this.houses[index]);
			} else if (
				this.condition.dealType === "월세" &&
				this.houses[index].recentRent != null &&
				Number(this.houses[index].recentRent.replace(regex, "")) >= this.condition.minValue &&
				Number(this.houses[index].recentRent.replace(regex, "")) <= this.condition.maxValue &&
				// Number(this.houses[index].recentRentDeposit.replace(regex, "")) <=
				// 	this.condition.rentDeposit &&
				year - this.houses[index].buildYear >= this.condition.minYear &&
				year - this.houses[index].buildYear <= this.condition.maxYear
			) {
				console.log(
					Number(this.houses[index].recentRentDeposit.replace(regex, "")),
					this.condition.rentDeposit
				);
				this.selected.push(this.houses[index]);
			}
		},
		retriev() {
			this.markers = [];
			this.titles = [];
			var bounds = this.map.getBounds();

			// 영역정보의 남서쪽 정보를 얻어옵니다
			var swLatlng = bounds.getSouthWest();

			// 영역정보의 북동쪽 정보를 얻어옵니다
			var neLatlng = bounds.getNorthEast();
			this.selected = [];
			for (let index = 0; index < this.houses.length; index++) {
				if (
					this.houses[index].lat >= swLatlng.Ma &&
					this.houses[index].lat <= neLatlng.Ma &&
					this.houses[index].lng >= swLatlng.La &&
					this.houses[index].lng <= neLatlng.La
				) {
					this.conditionCheck(index);
					// selected.push(this.houses[index]);
				}
			}
			console.log(this.selected);
			this.displayMarker(this.selected);
		},
		submit() {
			if (this.minValue > this.maxValue || this.minYear > this.maxYear) {
				alert("숫자 입력이 잘못됐습니다.");
				return;
			}
			this.condition.minValue = this.minValue;
			this.condition.maxValue = this.maxValue;
			this.condition.minYear = this.minYear;
			this.condition.maxYear = this.maxYear;
			this.condition.rentDeposit = this.rentDeposit;
			this.removeClusterer(this.markers);
			this.retriev();
		},
		addEventHandle(target, type, callback) {
			console.log("addEventHandle");
			if (target.addEventListener) {
				target.addEventListener(type, callback);
			} else {
				target.attachEvent("on" + type, callback);
			}
		},
		searchPlaces() {
			console.log("searchPlaces");
			if (!this.currCategory) {
				return;
			}

			// 커스텀 오버레이를 숨깁니다
			this.placeOverlay.setMap(null);

			// 지도에 표시되고 있는 마커를 제거합니다
			this.removeMarker();

			this.ps.categorySearch(this.currCategory, this.placesSearchCB, { useMapBounds: true });
			// this.ps.categorySearch("PO3", this.placesSearchCB, { useMapBounds: true });
		},
		placesSearchCB(data, status) {
			console.log("placesSearchCB", data);
			if (status === kakao.maps.services.Status.OK) {
				// 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
				console.log("검색완료");
				this.displayPlaces(data);
			} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
				// 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
				console.log("결과없음");
			} else if (status === kakao.maps.services.Status.ERROR) {
				// 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
				console.log("에러");
			}
		},
		displayPlaces(places) {
			console.log("displayPlaces");
			// 몇번째 카테고리가 선택되어 있는지 얻어옵니다
			// 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
			var order = document.getElementById(this.currCategory).getAttribute("data-order");

			for (var i = 0; i < places.length; i++) {
				// 마커를 생성하고 지도에 표시합니다
				var marker = this.addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

				// 마커와 검색결과 항목을 클릭 했을 때
				// 장소정보를 표출하도록 클릭 이벤트를 등록합니다
				// ((marker, place) => {
				// 	kakao.maps.event.addListener(marker, "click", function () {

				// 	});
				// })(marker, places[i]);
				((marker, place) => {
					// 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
					kakao.maps.event.addListener(marker, "click", () => {
						var content =
							'<div class="placeinfo">' +
							'   <a class="title" style="color:white;" href="' +
							place.place_url +
							'" target="_blank" title="' +
							place.place_name +
							'">' +
							place.place_name +
							"</a>";

						if (place.road_address_name) {
							content +=
								'    <span title="' +
								place.road_address_name +
								'">' +
								place.road_address_name +
								"</span>" +
								'  <span class="jibun" title="' +
								place.address_name +
								'">(지번 : ' +
								place.address_name +
								")</span>";
						} else {
							content +=
								'    <span title="' + place.address_name + '">' + place.address_name + "</span>";
						}

						content +=
							'    <span class="tel">' +
							place.phone +
							"</span>" +
							"</div>" +
							'<div class="after"></div>';

						this.contentNode.innerHTML = content;
						this.placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
						this.placeOverlay.setMap(this.map);
					});
				})(marker, places[i]);
			}
		},
		addMarker(position, order) {
			console.log("addMarker");
			var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
				imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
				imgOptions = {
					spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
					spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
					offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
				},
				markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
				marker = new kakao.maps.Marker({
					position: position, // 마커의 위치
					image: markerImage,
				});

			marker.setMap(this.map); // 지도 위에 마커를 표출합니다
			this.cmarkers.push(marker); // 배열에 생성된 마커를 추가합니다

			return marker;
		},
		removeMarker() {
			console.log("removeMarker");
			for (var i = 0; i < this.cmarkers.length; i++) {
				this.cmarkers[i].setMap(null);
			}
			this.cmarkers = [];
		},
		displayPlaceInfo(place) {
			console.log("displayPlaceInfo");
			var content =
				'<div class="placeinfo">' +
				'   <a class="title""href="' +
				place.place_url +
				'" target="_blank" title="' +
				place.place_name +
				'">' +
				place.place_name +
				"</a>";

			if (place.road_address_name) {
				content +=
					'    <span title="' +
					place.road_address_name +
					'">' +
					place.road_address_name +
					"</span>" +
					'  <span class="jibun" title="' +
					place.address_name +
					'">(지번 : ' +
					place.address_name +
					")</span>";
			} else {
				content += '    <span title="' + place.address_name + '">' + place.address_name + "</span>";
			}

			content +=
				'    <span class="tel">' + place.phone + "</span>" + "</div>" + '<div class="after"></div>';

			this.contentNode.innerHTML = content;
			this.placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
			this.placeOverlay.setMap(this.map);
		},
		addCategoryClickEvent() {
			console.log("addCategoryClickEvent");
			var category = document.getElementById("category"),
				children = category.children;

			for (var i = 0; i < children.length; i++) {
				children[i].addEventListener("click", (e) => {
					console.log("클릭", e);
					var id = e.target.id,
						className = e.target.className;
					this.placeOverlay.setMap(null);

					if (className === "on") {
						this.currCategory = "";
						this.changeCategoryClass();
						this.removeMarker();
					} else {
						this.currCategory = id;
						this.changeCategoryClass(this);
						this.searchPlaces();
					}
				});
			}
		},
		onClickCategory(children) {
			console.log("onClickCategory");
			var id = children.id,
				className = children.className;
			this.placeOverlay.setMap(null);

			console.log(this.id);
			if (className === "on") {
				console.log(className);
				this.currCategory = "";
				this.changeCategoryClass();
				this.removeMarker();
			} else {
				console.log(this.id);
				this.currCategory = id;
				this.changeCategoryClass(this);
				this.searchPlaces();
			}
		},
		changeCategoryClass(el) {
			console.log("changeCategoryClass");
			var category = document.getElementById("category"),
				children = category.children,
				i;

			for (i = 0; i < children.length; i++) {
				children[i].className = "";
			}

			if (el) {
				el.className = "on";
			}
		},
	},
};
</script>

<style>
.select-category {
	font-size: 20px;
}

.select-category:hover {
	font-size: 20px;
	font-weight: bold;
	cursor: pointer;
}
.select-category:active {
	font-size: 19px;
	font-weight: bold;
	cursor: pointer;
}
#input-price {
	flex: 0.1;
}
.loading {
	width: 30%;
	height: 20%;
	background-color: white;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	flex-direction: column;
	border-radius: 30px;
}
.input-group {
	display: flex;
	width: 800px;
	align-items: center;
}
#apt-container {
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}
#map {
	width: 100%;
	height: 100%;
}

#selector-container {
	width: 30%;
	height: 10%;
	display: flex;
	flex-direction: column;
	background-color: rgba(255, 255, 255, 0.95);
	border-radius: 30px;
	padding-top: 10px;
	position: absolute;
	z-index: 5;
	margin-top: 50px;
}
.map-container {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
}
#selector {
	height: 40%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	padding-left: 50px;
}
#home {
	height: 20%;
}
#apt-list {
	position: relative;
	left: 100px;
}

#slider {
	width: 60%;
}

#btns {
	width: 100%;
	display: flex;
	justify-content: space-evenly;
	height: 40px;
}
#bottom {
	height: 30%;
	display: flex;
	justify-content: space-around;
}
#divs {
	width: 80%;
}

#overlay {
	width: 100px;
	height: 80px;
	margin-bottom: 45px;
	padding-bottom: 20px;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: black;
	font-weight: bold;
	pointer-events: none;
}
.img-one {
	background-image: url("@/assets/img/aptOverlayOne1.png");
}
.img-two {
	background-image: url("@/assets/img/aptOverlayTwo.png");
}
.img-three {
	background-image: url("@/assets/img/aptOverlayThree.png");
}
#overlay-bottom {
	width: auto;
	height: 30px;
	padding: 5px;
	text-align: center;
	vertical-align: center;
	color: white;
	background-color: rgba(0, 0, 0, 0.6);
}
#overlay-c {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.map_wrap,
.map_wrap * {
	margin: 0;
	padding: 0;
	font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
	font-size: 12px;
}
.map_wrap {
	position: relative;
	width: 100%;
	height: 100%;
}
#category {
	position: absolute;
	top: 10px;
	left: 10px;
	border-radius: 5px;
	border: 1px solid #909090;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
	background: #fff;
	overflow: hidden;
	z-index: 2;
}
#category li {
	float: left;
	list-style: none;
	width: 50px;
	border-right: 1px solid #acacac;
	padding: 6px 0;
	text-align: center;
	cursor: pointer;
}
#category li.on {
	background: #eee;
}
#category li:hover {
	background: #ffe6e6;
	border-left: 1px solid #acacac;
	margin-left: -1px;
}
#category li:last-child {
	margin-right: 0;
	border-right: 0;
}
#category li span {
	display: block;
	margin: 0 auto 3px;
	width: 27px;
	height: 28px;
}
#category li .category_bg {
	background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png)
		no-repeat;
}
#category li .bank {
	background-position: -10px 0;
}
#category li .mart {
	background-position: -10px -36px;
}
#category li .pharmacy {
	background-position: -10px -72px;
}
#category li .oil {
	background-position: -10px -108px;
}
#category li .cafe {
	background-position: -10px -144px;
}
#category li .store {
	background-position: -10px -180px;
}
#category li.on .category_bg {
	background-position-x: -46px;
}
.placeinfo_wrap {
	position: absolute;
	bottom: 28px;
	left: -150px;
	width: 300px;
}
.placeinfo {
	position: relative;
	width: 100%;
	border-radius: 6px;
	border: 1px solid #ccc;
	border-bottom: 2px solid #ddd;
	padding-bottom: 10px;
	background: #fff;
}
.placeinfo:nth-of-type(n) {
	border: 0;
	box-shadow: 0px 1px 2px #888;
}
.placeinfo_wrap .after {
	content: "";
	position: relative;
	margin-left: -12px;
	left: 50%;
	width: 22px;
	height: 12px;
	background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
.placeinfo a,
.placeinfo a:hover,
.placeinfo a:active {
	color: #fff;
	text-decoration: none;
}
.placeinfo a,
.placeinfo span {
	display: block;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.placeinfo span {
	margin: 5px 5px 0 5px;
	cursor: default;
	font-size: 13px;
}
.placeinfo .title {
	font-weight: bold;
	font-size: 14px;
	border-radius: 6px 6px 0 0;
	margin: -1px -1px 0 -1px;
	padding: 10px;
	color: #fff;
	background: #d95050;
	background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
		no-repeat right 14px center;
}
.placeinfo .tel {
	color: #0f7833;
}
.placeinfo .jibun {
	color: #999;
	font-size: 11px;
	margin-top: 0;
}
a {
	color: white;
}
</style>
