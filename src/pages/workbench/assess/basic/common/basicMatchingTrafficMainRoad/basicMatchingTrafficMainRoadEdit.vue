<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="name" label="名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.name" placeholder="名称" />
				</uni-forms-item>

				<uni-forms-item name="costStandard" label="收费标准" label-align="right">
					<uni-easyinput type="text" v-model="formData.costStandard" placeholder="收费标准" />
				</uni-forms-item>

				<uni-forms-item required name="flag" label="是否限行" label-align="right">
					<uni-data-checkbox mode="tag" v-model="formData.flag" :localdata="flagList"></uni-data-checkbox>
				</uni-forms-item>
				
				<uni-forms-item v-show="limit_flag" name="limitSpeed" label="限行速度" label-align="right">
					<uni-easyinput type="text" v-model="formData.limitSpeed" placeholder="限行速度" />
				</uni-forms-item>
				
				
				<uni-forms-item v-show="limit_flag" name="limitTime" label="限行时间" label-align="right">
					<uni-easyinput type="text" v-model="formData.limitTime" placeholder="限行时间" />
				</uni-forms-item>
				
				
				<uni-forms-item v-show="limit_flag"  name="limitSpeial" label="特殊限行" label-align="right">
					<assess-picker :dataInput="'limitSpeial'" :dataList="limitSpeialList" :dataValue="formData.limitSpeial"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="distance" label="距离" label-align="right">
					<assess-picker :dataInput="'distance'" :dataList="distanceList" :dataValue="formData.distance"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="streetLevel" label="街道级别" label-align="right">
					<assess-picker :dataInput="'streetLevel'" :dataList="streetLevelList"
						:dataValue="formData.streetLevel" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>



				<uni-forms-item required name="visitorsFlowrate" label="人流量" label-align="right">
					<assess-picker :dataInput="'visitorsFlowrate'" :dataList="visitorsFlowrateList"
						:dataValue="formData.visitorsFlowrate" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>




				<uni-forms-item required name="position" label="方位" label-align="right">
					<assess-picker :dataInput="'position'" :dataList="positionList" :dataValue="formData.position"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="trafficFlow" label="交通流量" label-align="right">
					<assess-picker :dataInput="'trafficFlow'" :dataList="trafficFlowList"
						:dataValue="formData.trafficFlow" @dataResult="initFormPickerResult">
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
	import * as utils from "@/common/untils.js";
	import * as estateUtils from "@/common/assess/basic/examine.estate.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as Explore from '@/common/assess/Explore.key.js';


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
				limit_flag :false,
				loading: false,
				distanceList: [],
				streetLevelList: [],
				flagList: [{
					text: '是',
					value: 'true'
				}, {
					text: '否',
					value: 'false'
				}],
				positionList: [],
				trafficFlowList: [],
				visitorsFlowrateList: [],
				limitSpeialList: [],
				formData: {
					id: '',
					name: "",
					distance: "",
					streetLevel: "",
					flag: "",
					costStandard: "",
					position: "",
					trafficFlow: "",
					visitorsFlowrate: "",
					limitSpeed: "",
					limitTime: "",
					limitSpeial: "",
				},
				rules: {
					name: {
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
					streetLevel: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					flag: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					costStandard: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					position: {
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
					limitSpeed: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					limitTime: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					limitSpeial: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
				}
			}
		},
		watch: {
			formData: {
				handler(newValue, oldValue) {
					let data = this.$data;
					var _this = this;
					if(newValue.flag == 'true'){
						this.limit_flag = true;
					}
					if(newValue.flag == 'false'){
						this.limit_flag = false;
					}
				},
				deep: true //true 深度监听
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
						bisDelete: 'false',
						type: _this.cardObj.childType,
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

				this.$refs.form.setValue(dataInput, value);
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
						let flag = resultData.flag;
						if (utils.getType(flag) == 'boolean') {
							resultData.flag = flag.toString();
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
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_mainRoad_limitSpeial, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.limitSpeialList = resultData;
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
