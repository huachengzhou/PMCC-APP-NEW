<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="serviceType" label="服务类型" label-align="right">
					<assess-picker :dataInput="'serviceType'" :dataList="serviceTypeList"
						:dataValue="formData.serviceType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="serviceContent" label="服务内容" label-align="right">
					<assess-picker :dataInput="'serviceContent'" :dataList="serviceContentList"
						:dataValue="formData.serviceContent" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="serviceTime" label="服务时间" label-align="right">
					<uni-easyinput type="text" v-model="formData.serviceTime" placeholder="服务时间" />
				</uni-forms-item>
				


				<uni-forms-item required name="gradeEvaluation" label="等级评价" label-align="right">
					<assess-picker :dataInput="'gradeEvaluation'" :dataList="gradeEvaluationList"
						:dataValue="formData.gradeEvaluation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				
				<uni-forms-item  name="chargesNotes" label="收费标准" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.chargesNotes" placeholder="收费标准" />
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
				serviceTypeList: [],
				serviceContentList: [],
				gradeEvaluationList: [],
				formData: {
					id: '',
					serviceType: "",
					serviceContent: "",
					serviceTime: "",
					gradeEvaluation: "",
					chargesNotes: ""
				},
				rules: {
					serviceType: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					serviceContent: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					serviceTime: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					gradeEvaluation: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					chargesNotes: {
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
					showLoading: true,
					url: _this.cardObj.saveAndUpdateUrl,
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
						buildingId: _this.cardObj.masterId,
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

				this.$refs.form.setValue(dataInput, value);
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					case "serviceType": {
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.serviceContentList = resultData;
						});
						break;
					}
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
				var _this = this;
				let cardObj = this.cardObj;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.changeLoadData("serviceType");
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.data_company_reputation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.gradeEvaluationList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.DATA_SERVICE_CONTENT, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.serviceTypeList = resultData;
				});
				var pageQuery = {
					pageNum: 1,
					pageSize: 3,
					masterId: cardObj.masterId
				};
				if (pageQuery.masterId) {
					let formData = _this.formData;
					let option = {
						url: _this.cardObj.pageUrl,
						query: pageQuery,
						successCallback: function(resultData) {
							let rows = resultData.rows;
							if (rows && rows.length != 0) {
								let row = rows[0];
								row.id = '' ;
								var keys = Object.keys(formData);
								for (var i = 0; i < keys.length; i++) {
									var key = keys[i];
									var value = formData[key];
									formData[key] = row[key];
								}
								_this.formData = formData;
								_this.changeLoadData("serviceType");
								uni.showToast({
									title: '新增自动带入上一条数据,未提交',
									 duration: 2000
								});
							}
						}
					};
					utils.requestDefault(option);
				}
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
