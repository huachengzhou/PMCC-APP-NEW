<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="type" label="楼梯类型" label-align="right">
					<select-input :dataValue="formData.type" :dataInput="'type'" :selectDatas="typeList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="purpose" label="用途" label-align="right">
					<select-input :dataValue="formData.purpose" :dataInput="'purpose'" :selectDatas="purposeList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item required name="staircase" label="楼梯间" label-align="right">
					<!-- <assess-basic-unit-port-select-and-input ref="staircase" @dataResult="unitPortSelectResult"
						:dataInput="'staircase'" :masterId="cardObj.masterId" :dataValue="formData.staircase"
						:filterName="filterName">
					</assess-basic-unit-port-select-and-input> -->
					
					<assess-basic-unit-port-select-and-input-mul ref="staircase" @dataResult="unitPortSelectResult"
						:dataInput="'staircase'" :masterId="cardObj.masterId" :dataValue="formData.staircase"
						:filterName="filterName">
					</assess-basic-unit-port-select-and-input-mul>
				</uni-forms-item>

				<uni-forms-item name="unitStairsFile" label="附件" label-align="right">
					<common-image-picker :dataObj="setImgFieldsName('unitStairsFile')">
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
	import assessBasicUnitPortSelectAndInput from '@/components/assess/assess-basic-unit-port-select-and-input/assess-basic-unit-port-select-and-input.vue';
	import assessBasicUnitPortSelectAndInputMul from '@/components/assess/assess-basic-unit-port-select-and-input/assess-basic-unit-port-select-and-input-mul';
	import selectInput from '@/components/select-Input/select-Input.vue';
	

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				loading: false,
				filterName: '楼梯间',
				purposeList: [],
				typeList: [],
				formData: {
					id: '',
					type: "",
					purpose: "",
					staircase: "",
				},
				rules: {
					type: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					purpose: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					staircase: {
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
			"common-image-picker": commonImagePicker,
			"assess-basic-unit-port-select-and-input": assessBasicUnitPortSelectAndInput,
			"assess-basic-unit-port-select-and-input-mul": assessBasicUnitPortSelectAndInputMul,
			"select-input": selectInput
			
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
						unitId: _this.cardObj.masterId,
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
			unitPortSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.$refs.form.setValue(dataInput, value);
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
				this.$refs.form.setValue(dataInput, value);
			},
			initListData() {
				let data = this.$data;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitStairs_type, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.typeList = arr;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitStairs_use, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.purposeList = arr;
				});
				this.$nextTick(() => {
					this.$refs.staircase.initFun();
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
					tableName: AssessDBKey.BasicUnitStairs,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
