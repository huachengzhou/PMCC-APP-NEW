<template>

	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<!-- <uni-forms-item required name="province" label="省" label-align="right">
				<assess-picker :dataInput="'province'" :dataList="provinceList" :dataValue="formData.province"
					@dataResult="initFormPickerResult">
				</assess-picker>
			</uni-forms-item> -->


			<!-- <uni-forms-item required name="city" label="市" label-align="right">
				<assess-picker :dataInput="'city'" :dataList="cityList" :dataValue="formData.city"
					@dataResult="initFormPickerResult">
				</assess-picker>
			</uni-forms-item> -->


			<!-- <uni-forms-item name="district" label="区县" label-align="right">
				<assess-picker :dataInput="'district'" :dataList="districtList" :dataValue="formData.district"
					@dataResult="initFormPickerResult">
				</assess-picker>
			</uni-forms-item> -->






			<my-pick-regions :defaultRegions="regionArrs" ref="myPickRegions" @getRegion="handleGetRegion">

				<view>
					<uni-forms-item name="regionName" label="区域选择" label-align="right">
						<view v-show="bisPostion">
							<uni-easyinput type="text" :clearable="false" disabled :value="regionName?regionName:'区域选择'"
								placeholder="区域选择" />
						</view>
						<view v-show="!bisPostion">
							<uni-easyinput type="text" :clearable="false" disabled :value="'定位中'"
								placeholder="定位中" />
						</view>
					</uni-forms-item>
				</view>

				<!-- <uni-row>
					<uni-col :span="5">
						<h5>区域选择</h5>
					</uni-col>
					<uni-col :span="19">
						<view>
							<view class="custom-form-show is-input-border">
								{{regionName?regionName:'未选择'}}
							</view>
						</view>
					</uni-col>
				</uni-row> -->
			</my-pick-regions>
		</uni-forms>

		<common-map-poi-search ref="mapTool" v-show="mapFlag">
		</common-map-poi-search>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import commonMapPoiSearch from '@/components/common-map/common-map-poi-search.vue';
	import myPickRegions from '@/components/pick-regions/pick-regions.vue';
	let ruleField = [
		'province',
		'city',
		'district'
	];
	let rules = utils.getRules(ruleField);
	let formDataFields = utils.getFormDataField(ruleField);
	Object.assign(formDataFields, {});

	export default {
		props: {
			provinceValue: {
				type: [Number, String],
				default: ""
			},
			cityValue: {
				type: [Number, String],
				default: ""
			},
			districtValue: {
				type: [Number, String],
				default: ""
			},
		},
		data() {
			// 多选框 必须包含 text和value
			return {
				mapFlag: false,
				provinceList: [],
				cityList: [],
				districtList: [],
				bisPostion:true,
				formData: {
					province: "",
					city: "",
					district: ""
				},
				rules: rules
			};
		},
		computed: {
			regionName: function() {
				return this.regionArrs.join("-");
			},
			regionArrs: function() {
				let arr = [];
				let formData = this.formData;
				let provinceList = this.provinceList;
				let cityList = this.cityList;
				let districtList = this.districtList;
				if (formData.province && provinceList) {
					provinceList.forEach(item => {
						if (Number(item.id) == Number(formData.province)) {
							arr.push(item.name);
						}
					});
				}
				if (formData.city && cityList) {
					cityList.forEach(item => {
						if (Number(item.id) == Number(formData.city)) {
							arr.push(item.name);
						}
					});
				}
				if (formData.district && districtList) {
					districtList.forEach(item => {
						if (Number(item.id) == Number(formData.district)) {
							arr.push(item.name);
						}
					});
				}
				return arr;
			}
		},
		watch: {
			formData: {
				handler(newValue, oldValue) {
					let data = this.$data;
					var _this = this;
					this.$emit("getRegion", _this.formData);
				},
				deep: true //true 深度监听
			}
		},
		components: {

			"assess-picker": assessPicker,
			"common-map-poi-search": commonMapPoiSearch,
			"my-pick-regions": myPickRegions
		},
		methods: {
			init: function() {
				let data = this.$data;
				var _this = this;
				this.formData.province = this.provinceValue;
				this.formData.city = this.cityValue;
				this.formData.district = this.districtValue;
				_this.changeLoadData("province");
				_this.changeLoadData("city");
				estateCommonUtils.setProvinceListCommon(data, "provinceList", function() {
					_this.$nextTick(() => {
						_this.mapCenterLocation();
						_this.$refs.myPickRegions.init();
					});
				});
				_this.$refs.myPickRegions.init();

			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					case "province": {
						estateCommonUtils.setAreaListCommon(formData[name], null, null, function(resultData) {
							let cityList = [];
							resultData.forEach((item) => {
								cityList.unshift({
									name: item.name,
									id: item.areaId,
									parentName: item.parentName,
									parentId: item.parentId
								});
							});
							_this.cityList = cityList;
						});
						break;
					}
					case "city": {
						estateCommonUtils.setAreaListCommon(formData[name], data, "districtList", function(
							resultData) {
							let districtList = [];
							resultData.forEach((item) => {
								districtList.unshift({
									name: item.name,
									id: item.areaId,
									parentName: item.parentName,
									parentId: item.parentId
								});
							});
							_this.districtList = districtList;
						});
						break;
					}
					default: {
						break;
					}
				}


			},
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput);
				this.$refs.form.setValue(dataInput, value);
			},
			handleGetRegion(regions) {
				if (regions) {
					if (regions.length >= 1) {
						let region = regions[0];
						if (region) {
							this.formData.province = region.areaId;
						}
					}
					if (regions.length >= 2) {
						let region = regions[1];
						if (region) {
							this.formData.city = region.areaId;
						}
					}
					if (regions.length >= 3) {
						let region = regions[2];
						if (region) {
							this.formData.district = region.areaId;
						}
					}
					this.changeLoadData("province", false);
					this.changeLoadData("city", false);
					this.bisPostion = true;
				}
			},
			//地图定位
			mapCenterLocation() {
				let _this = this;
				if (!this.formData.province) {
					console.log("调用定位 ==>");
					this.bisPostion = false ;
					this.$refs.mapTool.getCenterLocation(function(result) {
						let province = result.province;
						let city = result.city;
						let district = result.district;
						if (province) {
							_this.formData.province = province;
						}
						if (city) {
							_this.formData.city = city;
						}
						if (district) {
							_this.formData.district = district;
							_this.$refs.myPickRegions.init();
						}
						_this.changeLoadData("province", false);
						_this.changeLoadData("city", false);
						_this.bisPostion = true ;
					});
				}
			}
		}
	}
</script>

<style>
	.custom-form-show {
		padding: 0 30rpx;
		background-color: #fff;
		font-size: 28rpx;
		color: #333;
		text-align: center;
		width: 100%;
		box-sizing: border-box;
		height: 80rpx;
		margin-bottom: 35rpx;
		margin-left: 0px;
	}

	.is-input-border {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
	}
</style>
