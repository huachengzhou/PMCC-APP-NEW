<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="instalmentInterest" label="分期支付利息" label-align="right">
					<uni-easyinput  type="text" v-model="formData.instalmentInterest"
						placeholder="分期支付利息" />
				</uni-forms-item>
				
				
				<!--<uni-forms-item required name="datetimeRange" label="分期支付时间范围" label-align="right">-->
					<!--<uni-datetime-picker ref="datetimeRange" type="daterange" v-model="formData.datetimeRange">-->
					<!--</uni-datetime-picker>-->
				<!--</uni-forms-item>-->

				<uni-forms-item name="instalmentPeriodStart" label="分期支付时间起" label-align="right">
					<uni-datetime-picker type="date" :value="formData.instalmentPeriodStart"
										 v-on:change="setFormValue('instalmentPeriodStart',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item name="instalmentPeriodEnd" label="分期支付时间止" label-align="right">
					<uni-datetime-picker type="date" :value="formData.instalmentPeriodEnd"
										 v-on:change="setFormValue('instalmentPeriodEnd',$event)"></uni-datetime-picker>
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
				tradingId: 0,
				houseId: 0,
				formData: {
					id: '',
					instalmentPeriodStart: "",
					instalmentPeriodEnd: "",
					instalmentInterest: "",
					datetimeRange: '',
				},
				rules: {
					instalmentPeriodStart: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					instalmentPeriodEnd: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					instalmentInterest: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					datetimeRange: {
						rules: [{
							required: true,
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
			let id = 0;
			let houseId = 0;
			let tradingId = 0;
			if (utils.isNotEmptyString(option.houseId)) {
				houseId = option.houseId;
			}
			if (utils.isNotEmptyString(option.tradingId)) {
				tradingId = option.tradingId;
			}
			if (utils.isNotEmptyString(option.id)) {
				id = option.id;
			}
			this.cardObj = cardObj;
			this.id = id;
			this.houseId = houseId;
			this.tradingId = tradingId;
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
						houseId: _this.houseId,
						tradingType: AssessDicKey.examineHouseTransactionTypeSell,
						tradingId: _this.tradingId,
						// instalmentPeriodStart: res.datetimeRange[0],
						// instalmentPeriodEnd: res.datetimeRange[1],
						bisDelete: 'false'
					});
					delete data["datetimeRange"];
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
						let datetimeRange = [];
						if (resultData.instalmentPeriodStart && resultData.instalmentPeriodEnd) {
							datetimeRange = [resultData.instalmentPeriodStart,
								resultData.instalmentPeriodEnd
							];
						}
						resultData.datetimeRange = datetimeRange;
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
				uni.showToast({
					title: '加载完成',
					success() {
						uni.hideLoading();
					}
				});
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
			}
		}
	}
</script>

<style>

</style>
