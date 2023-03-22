<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item name="name" label="停车场名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.name" placeholder="停车场名称" />
				</uni-forms-item>


				<uni-forms-item required name="location" label="车位位置" label-align="right">
					<assess-picker :dataInput="'location'" :dataList="locationList" :dataValue="formData.location"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="parkingType" label="车位类型" label-align="right">
					<assess-picker :dataInput="'parkingType'" :dataList="parkingTypeList"
						:dataValue="formData.parkingType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="parkingEstate" label="停车场类别" label-align="right">
					<assess-picker :dataInput="'parkingEstate'" :dataList="parkingEstateList"
						:dataValue="formData.parkingEstate" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="number" label="车位数量" label-align="right">
					<uni-easyinput  type="text" v-model="formData.number" placeholder="车位数量" />
				</uni-forms-item>
				
				<uni-forms-item name="house_estateParking" label="车位图片" label-align="right">
					<common-image-picker :dataObj="setImgFieldsName('house_estateParking')">
					</common-image-picker>
				</uni-forms-item>
			</uni-group>
		</uni-forms>

		<assess-submit-button @submit="submitForm" :loading="loading">
			提交
		</assess-submit-button>
	</view>
</template>

<script>
	import * as utils from "../../../../../../common/untils.js";
	import * as estateUtils from "../../../../../../common/assess/basic/examine.estate.js";
	import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";
	import * as Explore from '../../../../../../common/assess/Explore.key.js';


	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				loading: false,
				locationList: [],
				parkingTypeList: [],
				parkingEstateList: [],
				formData: {
					id: '',
					name: "",
					location: "",
					parkingType: "",
					parkingEstate: "",
					number: "",
				},
				rules: {
					name: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					location: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					parkingType: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					parkingEstate: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					number: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
				}
			}
		},
		onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let batchDetail = {};
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.batchDetail = batchDetail;
			let id = 0;
			if (utils.isNotEmptyString(option.id)) {
				id = option.id;
			}
			this.cardObj = cardObj;
			this.id = id;
			this.setServerData(cardObj.getUrl);
			console.log(id, cardObj);
		},
		onShow() {

		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker
		},
		methods: {
			submit(data) {
				console.log('处理值：', data);
				var _this = this;
				let option = {
					query: data,
					url: _this.cardObj.saveAndUpdateUrl,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '保存成功',
							success() {
								uni.setStorageSync("isDoRefresh", 1);
								uni.navigateBack({
									delta: 1
								});
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitForm() {
				// 手动提交表单
				var _this = this;
				//特殊处理一些兼容性东西

				let userInfo = _this.$helper.fetchLocalUser();
				this.$refs.form.validate().then((res) => {
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						id: _this.formData.id,
						estateId: _this.cardObj.masterId,
						bisDelete: 'false'
					});
					console.log('表单返回得值：', data);
					_this.submit(utils.filterEmptyData(data));
				});
			},
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput);
				
				this.$refs.form.setValue(dataInput,value) ;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					default: {
						break;
					}
				}
			},
			setServerData(url) {
				let _this = this;
				let formData = this.formData;
				let query = {
					id: _this.id
				};
				let batchDetail = this.batchDetail;
				if (query.id == 0 || query.id == undefined || query.id == '' || query.id == 'undefined') {
					_this.initListData();
					if(batchDetail.name) {
						formData.name = batchDetail.name + "停车场" ;
					}
					return false;
				}
				let option = {
					query: query,
					notParam: true,
					url: url + "?" + utils.parseParam(query),
					successCallback: function(resultData) {
						if (!resultData) {
							return false;
						}
						var keys = Object.keys(formData);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var value = formData[key];
							formData[key] = resultData[key];
						}
						_this.formData = formData;
						_this.initListData();
						console.log(formData);
						console.log(resultData);
					}
				};
				utils.requestDefault(option);
			},
			initListData() {
				let data = this.$data;
				uni.showLoading({
					title: '加载中',
					mask: true
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_car_location, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.locationList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_car_type, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.parkingTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_car_parkingEstate, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.parkingEstateList = resultData;
				});
				uni.showToast({
					title: '加载完成',
					success() {
						uni.hideLoading();
					}
				});
			},
			setImgFieldsName(fieldsName) {
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let _this = this;
				let id = _this.id;
				if (!id) {
					id = 0;
				}
				let obj = {
					fieldsName: fieldsName,
					tableId: id,
					tableName: AssessDBKey.BasicEstateParking,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
