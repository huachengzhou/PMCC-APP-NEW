<template>
	<view>
		<view>

		</view>
		<view>
			<common-map :polygonList="polygonList" :lat="lat" :longitude="longitude" :latitude="latitude" :lng="lng"
				:findMap="bisFind" :addMarker="addMarker" :drawPolygon="drawPolygon" ref="mapCpn"
				@getLngLatResult="getLngLatResult" @getPolygonResult="getPolygonResult"></common-map>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import common_map_cpn from '@/components/common-map/map-cpn.vue';

	export default {
		components: {
			"common-map": common_map_cpn
		},
		computed: {
			addMarker() {
				let bisMarker = this.bisMarker;
				if (bisMarker == 'y') {
					return "y";
				} else {
					return "n";
				}
			},
			drawPolygon() {
				let bisMarker = this.bisMarker;
				if (bisMarker == 'y') {
					return "n";
				} else {
					return "y";
				}
			}
		},
		data() {
			return {
				eventChannel: null,
				bisMarker: 'y', //默认地图可以操作
				bisFind: 'n', //默认标记
				mapData: {}, //临时数据
				longitude: '',
				latitude: '',
				lng: '',
				lat: '',
				polygonList: '',
				redirectTo: '',
				sourceData:{}
			}
		},
		// onBackPress() {
		//     console.log("拦截");
		//     return false;
		// },
		onNavigationBarButtonTap(btn) {
			let redirectTo = this.redirectTo;
			if (btn.index = 0) {
				//放弃
				uni.navigateBack({
					delta: 1
				});
			}
			if (btn.index = 1) {
				//完成
				let mapData = this.mapData;
				let eventChannel = this.eventChannel;
				if (this.sourceData) {
					mapData.sourceData = this.sourceData;
				}
				eventChannel.emit('emitParentData', mapData);
				if (redirectTo) {
					uni.redirectTo({
						url: redirectTo
					});
				} else {
					uni.navigateBack({
						delta: 1
					});
				}
			}
		},
		onLoad: function(option) {
			let eventChannel = null;
			// #ifdef APP-NVUE
			eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			eventChannel = this.getOpenerEventChannel();
			// #endif
			this.eventChannel = eventChannel;

			// 监听emitChildData事件，获取上一页面通过eventChannel传送到当前页面的数据
			let that = this;
			eventChannel.on('emitChildData', function(data) {
				if (data.bisMarker) {
					that.bisMarker = data.bisMarker;
				}
				if (data.bisFind) {
					that.bisFind = data.bisFind;
				}
				if (data.longitude) {
					that.longitude = data.longitude;
				}
				if (data.latitude) {
					that.latitude = data.latitude;
				}
				if (data.lng) {
					that.lng = data.lng;
				}
				if (data.lat) {
					that.lat = data.lat;
				}
				if (data.redirectTo) {
					that.redirectTo = data.redirectTo;
				}
				if (data.sourceData) {
					that.sourceData = data.sourceData;
				}
				console.log(data)
			});
		},
		methods: {
			getLngLatResult(objLngLat) {
				this.emitParentData(objLngLat);
			},
			getPolygonResult(result) {
				let list = result.list;
				var objLngLat = {
					lat: result.latitude,
					latitude: result.latitude,
					longitude: result.longitude,
					lng: result.longitude
				};
				this.emitParentData(list);
			},
			emitParentData(data) {
				this.mapData = data;
			}
		},
		mounted() {
			// var a = document.getElementsByClassName('uni-page-head-hd')[0];
			// a.style.display = 'none';
			try {
				var abc = document.getElementsByClassName('uni-page-head-btn')[0];
				abc.style.display = 'none';
			} catch (e) {}
		}
	}
</script>

<style>

</style>
