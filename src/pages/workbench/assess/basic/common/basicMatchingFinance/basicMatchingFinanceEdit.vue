<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="name" label="金融名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.name" placeholder="金融名称" />
				</uni-forms-item>


				<uni-forms-item required name="distance" label="与金融机构的距离" label-align="right">
					<assess-picker :dataInput="'distance'" :dataList="distanceList" :dataValue="formData.distance"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="nature" label="金融类别" label-align="right">
					<assess-picker :dataInput="'nature'" :dataList="natureList" :dataValue="formData.nature"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="category" label="金融机构性质" label-align="right">
					<assess-picker :dataInput="'category'" :dataList="categoryList" :dataValue="formData.category"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="serviceContent" label="服务类别" label-align="right">
					<assess-picker :dataInput="'serviceContent'" :dataList="serviceContentList"
						:dataValue="formData.serviceContent" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="autoServiceContent" label="服务内容" label-align="right">
					<uni-easyinput  type="text" v-model="formData.autoServiceContent"
						placeholder="服务内容" />
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
				distanceList: [],
				natureList: [],
				categoryList: [],
				serviceContentList: [],
				formData: {
					id: '',
					name: "",
					distance: "",
					nature: "",
					category: "",
					serviceContent: "",
					autoServiceContent: "",
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
					nature: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					category: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					serviceContent: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					autoServiceContent: {
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
						estateId: _this.cardObj.masterId,
						type: _this.cardObj.childType,
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
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_finance_service_content, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.serviceContentList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_finance_nature, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.natureList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_finance_category, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.categoryList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_distance, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.distanceList = resultData;
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
