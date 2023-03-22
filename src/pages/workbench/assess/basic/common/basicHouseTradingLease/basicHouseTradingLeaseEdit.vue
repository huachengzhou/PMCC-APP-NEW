<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">

				<uni-forms-item required name="rentGrowthRate" label="租金增长比率" label-align="right">
					<uni-easyinput  type="text" v-model="formData.rentGrowthRate"
								   placeholder="租金增长比率" />
				</uni-forms-item>


				<!--<uni-forms-item required name="datetimeRange" label="租金支付时间范围" label-align="right">-->
					<!--<uni-datetime-picker ref="datetimeRange" type="daterange" v-model="formData.datetimeRange">-->
					<!--</uni-datetime-picker>-->
				<!--</uni-forms-item>-->

				<uni-forms-item name="rentPaymentTimeStart" label="租金支付时间起" label-align="right">
					<uni-datetime-picker type="date" :value="formData.rentPaymentTimeStart"
										 v-on:change="setFormValue('rentPaymentTimeStart',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item name="rentPaymentTimeEnd" label="租金支付时间止" label-align="right">
					<uni-datetime-picker type="date" :value="formData.rentPaymentTimeEnd"
										 v-on:change="setFormValue('rentPaymentTimeEnd',$event)"></uni-datetime-picker>
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
				tradingId: 0,
				houseId: 0,
				loading: false,
				formData: {
					id: '',
					rentGrowthRate: "",
					rentPaymentTimeStart: "",
					rentPaymentTimeEnd: "",
					datetimeRange: '',
				},
				rules: {
					rentGrowthRate: {
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
		async onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let id = 0;
			let houseId = 0;
			let tradingId = 0;
			if (utils.isNotEmptyString(option.id)) {
				id = option.id;
			}
			if (utils.isNotEmptyString(option.houseId)) {
				houseId = option.houseId;
			}
			if (utils.isNotEmptyString(option.tradingId)) {
				tradingId = option.tradingId;
			}
			this.cardObj = cardObj;
			this.id = id;
			this.houseId = houseId;
			this.tradingId = tradingId;
			let _this = this;
			await this.setServerData(cardObj.getUrl);
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
			async setServerData(url) {
				let _this = this;
				let formData = this.formData;
				let query = {
					id: _this.id
				};
				if (query.id == 0 || query.id == undefined || query.id == '' || query.id == 'undefined') {
					_this.initListData();
					return false;
				}
				let res = await _this.$myRequest.pmccRequest({
					url:  url + "?" + utils.parseParam(query),
					method: 'POST',
					data: query,
				});
				console.log(res) ;
				if (res.data.ret) {
					let resultData = res.data.data;
					console.log(resultData);
					let datetimeRange = [];
					if (resultData.rentPaymentTimeStart && resultData.rentPaymentTimeEnd) {
						datetimeRange = [resultData.rentPaymentTimeStart,
							resultData.rentPaymentTimeEnd
						];
						_this.formData.rentPaymentTimeStart = resultData.rentPaymentTimeStart ;
						_this.formData.rentPaymentTimeEnd = resultData.rentPaymentTimeEnd ;
					}
					resultData.datetimeRange = datetimeRange;
					_this.formData.rentGrowthRate = resultData.rentGrowthRate;
					_this.formData.id = resultData.id;
					_this.formData.datetimeRange = datetimeRange;
					_this.initListData();
				}
			},
			submit(data) {
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
						houseId: _this.houseId,
						tradingId: _this.tradingId,
						bisDelete: 'false',
						tradingType: AssessDicKey.examineHouseTransactionTypeLease,
						// rentPaymentTimeStart: res.datetimeRange[0],
						// rentPaymentTimeEnd: res.datetimeRange[1],
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

				this.$refs.form.setValue(dataInput, value);
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
