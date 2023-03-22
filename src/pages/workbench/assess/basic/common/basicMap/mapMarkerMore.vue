<template>
	<view>
		<view class="uni-flex uni-row">
			<view class="text" style="-webkit-flex: 1;flex: 1;">
				{{title}}
			</view>
			<view class="text" style="-webkit-flex: 1;flex: 1;">
				<view>
					<button size="mini" type="primary" @tap="chooseLocation">
						<uni-icons color="'#8f8f94'" type="map" size="15"></uni-icons>
						标记位置
					</button>
				</view>
			</view>
		</view>


		<view class="uni-common-mt">
			<view>
				<map style="width: 100%; height: 550px;" @callouttap="markerFun"  @poitap="onpoitap" @markertap="onmarkertap" @tap="maptap"
				:latitude="latitude" :longitude="longitude" :markers="markers">
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "../../../../../../common/untils.js";
	import * as estateUtils from "../../../../../../common/assess/basic/examine.estate.js";
	import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";
	import * as Explore from '../../../../../../common/assess/Explore.key.js';
	import gcoord from '../../../../../../common/assess/gcoord.js';

	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';



	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: '未标记',
				latitude: 30.595975,
				longitude: 104.079432,
				markers: [],
				loading: false,
				batchDetail: {},
				resultTableName: '',
				num: '',
				formData: {
					id: '',
					tableId: '',
					lng: 104.079432,
					lat: 30.595975,
					name: '',
					type: '',
					creator: ''
				},
			}
		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker,

		},
		onLoad(option) {
			let batchDetail = {};
			if (option.num) {
				this.num = option.num;
			}
			if (option.resultTableName) {
				this.resultTableName = option.resultTableName;
			}
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.batchDetail = batchDetail;
			this.setServerData();
		},
		onShow() {

		},
		methods: {
			getPrevNodeCenter() {
				let _this = this;
				if (!_this.num) {
					return false;
				}
				let batchDetail = this.batchDetail;
				estateCommonUtils.getPrevMapCenter(batchDetail.tableId, _this.num, function(resultData) {
					if (!resultData) {
						return false;
					}
					if (utils.isArrayEmpty(resultData)) {
						return false;
					}
					let tempData = resultData[0];
					if (utils.isNotEmptyString(tempData.lat)) {
						let lat = parseFloat(tempData.lat);
						lat = lat.toFixed(5);
						lat = parseFloat(lat);
						tempData.lat = lat;
					}
					if (utils.isNotEmptyString(tempData.lng)) {
						let lng = parseFloat(tempData.lng);
						lng = lng.toFixed(5);
						lng = parseFloat(lng);
						tempData.lng = lng;
					}
					_this.latitude = tempData.lat;
					_this.longitude = tempData.lng;
					_this.title = "未标记(定位上个节点位置)";
				});
			},

			setServerData() {
				let url = "/app.assess/basicEstateTagging/getBasicEstateTaggingDtoListByWhere";
				let batchDetail = this.batchDetail;
				let _this = this;
				let formData = this.formData;
				let query = {
					tableId: batchDetail.tableId,
					type: batchDetail.type
				};
				formData.tableId = batchDetail.tableId;
				formData.type = batchDetail.type;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let option = {
					query: query,
					url: url + "?" + utils.parseParam(query),
					successCallback: function(resultData) {
						uni.showToast({
							title: '加载完成',
							success() {
								uni.hideLoading();
							}
						});
						if (!resultData) {
							_this.getPrevNodeCenter();
							return false;
						}
						if (utils.isArrayEmpty(resultData)) {
							_this.getPrevNodeCenter();
							return false;
						}
						let tempData = resultData[0];
						if (utils.isNotEmptyString(tempData.lat)) {
							let lat = parseFloat(tempData.lat);
							lat = lat.toFixed(5);
							lat = parseFloat(lat);
							tempData.lat = lat;
						}
						if (utils.isNotEmptyString(tempData.lng)) {
							let lng = parseFloat(tempData.lng);
							lng = lng.toFixed(5);
							lng = parseFloat(lng);
							tempData.lng = lng;
						}

						var keys = Object.keys(formData);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var value = formData[key];
							formData[key] = tempData[key];
						}

						_this.formData = formData;
						_this.latitude = tempData.lat;
						_this.longitude = tempData.lng;
						_this.title = tempData.name;
						_this.setMarkers();
					}
				};
				utils.requestDefault(option);
			},
			chooseLocation() {
				let _this = this;
				let formData = this.formData;
				uni.chooseLocation({
					success: (res) => {
						console.log(res);

						let callout = {
							content: '方恒国际 阜通东大街6号',
							color: '#00BFFF',
							fontSize: 10,
							borderRadius: 4,
							borderWidth: 1,
							borderColor: '#333300',
							bgColor: '#CCFF99',
							padding: '5',
							display: 'ALWAYS'
						};
						let obj = {
							latitude: res.latitude,
							longitude: res.longitude,
							title: res.name ,
							label: {content:res.name,bgColor:"blue"},
							iconPath: '../../../../../../static/mark_bs.png',
							callout:callout
						};
						_this.markers.push(obj);
						_this.longitude = res.longitude;
						_this.latitude = res.latitude;
						// _this.title = res.address;
						// _this.updateMarker();
						// _this.setMarkers();
					}
				});
			},
			setMarkers() {
				let _this = this;
				let markers = [{
					latitude: _this.latitude,
					longitude: _this.longitude,
					iconPath: '../../../../../../static/mark_bs.png'
				}];
				_this.markers = markers;
			},
			updateMarker() {
				let formData = this.formData;
				let url = "/app.assess/basicEstateTagging/saveAndUpdate";
				var userInfo = this.$helper.fetchLocalUser();
				formData.creator = userInfo.userAccount;
				let query = utils.filterEmptyData(formData);
				let option = {
					url: url,
					query: query,
					successCallback: function(resultData) {
						uni.showToast({
							title: '标记成功'
						});
						console.log(resultData);
					}
				};
				utils.requestDefault(option);
				console.log("updateMarker", formData);
			},
			markerFun(e){
				uni.showToast({
					title: '标注被点击了'
				});
				uni.showModal({
				    content: JSON.stringify(e)
				});
				console.log(e) ;
			},
			maptap(e) {
			    uni.showModal({
			        content:"maptap"+ JSON.stringify(e)
			    })
			},
			onmarkertap(e) {
			    uni.showModal({
			        content:"onmarkertap"+ JSON.stringify(e)
			    })
			},
			oncontroltap(e) {
			    uni.showModal({
			        content:"oncontroltap"+ JSON.stringify(e)
			    })
			},
			oncallouttap(e) {
			    uni.showModal({
			        content:"oncallouttap "+ JSON.stringify(e)
			    })
			},
			onpoitap(e) {
			    uni.showModal({
			        content: "onpoitap "+JSON.stringify(e)
			    })
			}
		}
	}
</script>

<style>
	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		/* background-color: #ebebeb; */
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}
</style>
