<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="equipment" label="设备品牌" label-align="right">
					<uni-easyinput  type="text" v-model="formData.equipment" placeholder="设备品牌" />
				</uni-forms-item>


				<uni-forms-item required name="category" label="类别" label-align="right">
					<assess-picker :dataInput="'category'" :dataList="categoryList" :dataValue="formData.category"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="grade" label="档次" label-align="right">
					<assess-picker :dataInput="'grade'" :dataList="gradeList" :dataValue="formData.grade"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="supplyMode" label="供应方式" label-align="right">
					<assess-picker :dataInput="'supplyMode'" :dataList="supplyModeList" :dataValue="formData.supplyMode"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="equipmentPrice" label="设备价格区间" label-align="right">
					<assess-picker :dataInput="'equipmentPrice'" :dataList="equipmentPriceList"
						:dataValue="formData.equipmentPrice" @dataResult="initFormPickerResult">
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
				categoryList: [{
					name: 'W9',
					id: 15
				}, {
					name: 'mx',
					id: 40
				}],
				gradeList: [{
					name: 'DcR',
					id: 19
				}, {
					name: 'iQi',
					id: 36
				}],
				supplyModeList: [{
					name: 'rPrg',
					id: 13
				}, {
					name: 'mm',
					id: 58
				}],
				equipmentPriceList: [{
					name: 'Q61',
					id: 16
				}, {
					name: 'ukTw',
					id: 79
				}],
				formData: {
					id: '',
					equipment: "",
					category: "",
					grade: "",
					supplyMode: "",
					equipmentPrice: "",
				},
				rules: {
					equipment: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					category: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					grade: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					supplyMode: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					equipmentPrice: {
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
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_heating_equipment_price_range, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.equipmentPriceList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_heating_method, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.categoryList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonSupplyMode, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.supplyModeList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonGrade, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.gradeList = resultData;
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
