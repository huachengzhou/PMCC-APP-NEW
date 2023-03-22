<template>
	<view>

		<view class="advertisement" style="width: 100%;">
			<web-view :src="viewerUrl" @message="message"></web-view>
		</view>
		
		<view v-show="false">
			<common-map-poi-search  ref="mapPoi">
			</common-map-poi-search>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import commonMapPoiSearch from '@/components/common-map/common-map-poi-search.vue';

	export default {
		name: 'map',
		components: {
			'common-map-poi-search':commonMapPoiSearch
		},
		computed: {
			viewerUrl() {
				let url = "/static/map/html/index.html?";
				let center = this.center;
				let lng = this.lng;
				let lat = this.lat;
				let findMap = this.findMap;
				let addMarker = this.addMarker;
				let drawPolygon = this.drawPolygon;
				if (this.longitude) {
					lng = this.longitude;
				}
				if (this.latitude) {
					lat = this.latitude;
				}
				let query = {
					center: center,
					lng: lng,
					lat: lat,
					longitude: lng,
					latitude: lat,
					addMarker: addMarker,
					drawPolygon: drawPolygon,
					findMap: findMap
				};
				return url + utils.parseParam(query);
			}
		},
		props: {
			center: {
				type: [String,Array],
				default: ''
			},
			longitude: {
				type: [String, Number],
				default: '' //117.000923
			},
			latitude: {
				type: [String, Number],
				default: '' //36.675807
			},
			lng: {
				type: [String, Number],
				default: '' //117.000923
			},
			lat: {
				type: [String, Number],
				default: '' //36.675807
			},
			polygonList: {
				type: [String],
				default: '' //[{"path": [[104.084895, 30.589345], [104.084895, 30.589345], [104.084895, 30.589345], [104.084895, 30.589345]], "extData": {}, "fillColor": "#00b0ff"}]
			},
			findMap: {
				type: [String],
				default: 'y' //是否查看地图   查看 y  可以操作 n(确定具体是否可以操作)
			},
			addMarker: {
				type: [String], //是否是标记
				default: 'n'
			},
			drawPolygon: {
				type: [String], //是否是绘制区块
				default: 'n'
			}
		},
		data() {
			return {
				//可滑动区域起始位置
				scrollTop: 0,
				//可滑动区域高度
				scrollHeight: '',
				//抽屉弹窗宽度
				drawerWidth: ''
			}
		},
		methods: {
			sureFunction() {

			},
			message(event) {
				var data = event.detail.data;
				//处理数组或者单个情况
				if (utils.isArray(data)) {
					data = data[0];
				}
				var mapData = data.data;
				if (data.action == 'mapMessageLngLat') {
					this.$emit("getLngLatResult", mapData);
				} else if (data.action == 'mapMessagePolygon') {
					this.$emit("getPolygonResult", mapData);
				}
				// console.log(mapData);
			}
		},
		mounted: function() {
			let count = 0;
			let that = this;
			let center = that.center;
			let lng = that.lng;
			let lat = that.lat;
			if (that.longitude) {
				lng = that.longitude;
			}
			if (that.latitude) {
				lat = that.latitude;
			}
			if(lng && lat){
				count++;
			}
			if(count == 0){
				this.$nextTick(() => {
					that.$refs.mapPoi.getCenterLocation(function(result,key){
						if(result.longitude && result.latitude){
							var map_center = [result.longitude,result.latitude] ;
							that.center = JSON.stringify(map_center) ;
						}
					});
				});
			}
		}
	}
</script>

<style>
</style>
