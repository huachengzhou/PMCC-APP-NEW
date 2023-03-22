<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="streetName" label="名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.streetName" placeholder="名称" />
				</uni-forms-item>

				<uni-forms-item name="bisApproachingStreet" label="是否临街" label-align="right">
					<uni-data-checkbox mode="tag" v-model="formData.bisApproachingStreet"
						:localdata="bisApproachingStreets"></uni-data-checkbox>
				</uni-forms-item>


				<uni-forms-item required name="position" label="方位" label-align="right">
					<assess-picker :dataInput="'position'" :dataList="positionList" :dataValue="formData.position"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="streetLevel" label="街道级别" label-align="right">
					<assess-picker :dataInput="'streetLevel'" :dataList="streetLevelList"
						:dataValue="formData.streetLevel" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="trafficFlow" label="交通流量" label-align="right">
					<assess-picker :dataInput="'trafficFlow'" :dataList="trafficFlowList"
						:dataValue="formData.trafficFlow" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="visitorsFlowrate" label="人流量" label-align="right">
					<assess-picker :dataInput="'visitorsFlowrate'" :dataList="visitorsFlowrateList"
						:dataValue="formData.visitorsFlowrate" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="distance" label="距离" label-align="right">
					<assess-picker :dataInput="'distance'" :dataList="distanceList" :dataValue="formData.distance"
						@dataResult="initFormPickerResult">
					</assess-picker>
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
				positionList: [{
					name: 'hc1t',
					id: 10
				}, {
					name: '3RQ',
					id: 57
				}],
				streetLevelList: [{
					name: '8ht',
					id: 15
				}, {
					name: 'ufDv',
					id: 31
				}],
				trafficFlowList: [{
					name: '4H2e',
					id: 12
				}, {
					name: 'zHZ7',
					id: 38
				}],
				visitorsFlowrateList: [{
					name: 'yh6',
					id: 10
				}, {
					name: 'lwug',
					id: 59
				}],
				distanceList: [{
					name: 'Hv',
					id: 19
				}, {
					name: 'eH',
					id: 49
				}],
				bisApproachingStreets: [{
					text: '是',
					value: 'true'
				}, {
					text: '否',
					value: 'false'
				}],
				formData: {
					id: '',
					streetName: "",
					position: "",
					streetLevel: "",
					trafficFlow: "",
					visitorsFlowrate: "",
					distance: "",
					bisApproachingStreet: "",
				},
				rules: {
					streetName: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					position: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					streetLevel: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					trafficFlow: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					visitorsFlowrate: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					distance: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					bisApproachingStreet: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
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
						houseId: _this.cardObj.masterId,
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
				if (query.id == 0 || query.id == undefined || query.id == '' || query.id == 'undefined') {
					_this.initListData();
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
							var value = resultData[key];
							if (key == 'bisApproachingStreet') {
								if (value != undefined && value != null && value != '') {
									formData[key] = "" + resultData[key] + "";
								}
							} else {
								formData[key] = resultData[key];
							}
						}
						_this.formData = formData;
						_this.initListData();
						console.log(formData , resultData);
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

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_street_level, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.streetLevelList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_traffic_flow, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.trafficFlowList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_visitors_flowrate, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.visitorsFlowrateList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_distance, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.distanceList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_position, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.positionList = resultData;
				});
				uni.showToast({
					title: '加载完成',
					success() {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>

</style>
