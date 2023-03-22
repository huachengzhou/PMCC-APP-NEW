<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				
				<uni-forms-item required name="name" label="名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.name" placeholder="名称" />
				</uni-forms-item>
				
				
				<uni-forms-item required name="equipmentUse" label="用途" label-align="right">
					<assess-picker :dataInput="'equipmentUse'" :dataList="equipmentUseList"
						:dataValue="formData.equipmentUse" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="type" label="类型" label-align="right">
					<assess-picker :dataInput="'type'" :dataList="typeList" :dataValue="formData.type"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="category" label="类别" label-align="right">
					<assess-picker :dataInput="'category'" :dataList="categoryList" :dataValue="formData.category"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				
			


				<uni-forms-item required name="maintenanceStatus" label="维护状况" label-align="right">
					<assess-picker :dataInput="'maintenanceStatus'" :dataList="maintenanceStatusList"
						:dataValue="formData.maintenanceStatus" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				
				<uni-forms-item required name="parameterIndex" label="参数指标" label-align="right">
					<uni-easyinput  type="text" v-model="formData.parameterIndex"
						placeholder="参数指标" />
				</uni-forms-item>
				
				<uni-forms-item required name="price" label="价格" label-align="right">
					<uni-easyinput  type="text" v-model="formData.price" placeholder="价格" />
				</uni-forms-item>
				
				<uni-forms-item required name="location" label="位置" label-align="right">
					<uni-easyinput  type="text" v-model="formData.location" placeholder="位置" />
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
				typeList: [{
					name: 'vNW',
					id: 10
				}, {
					name: 'bDvw',
					id: 51
				}],
				categoryList: [{
					name: 'ZA',
					id: 14
				}, {
					name: 'DATI',
					id: 78
				}],
				equipmentUseList: [{
					name: 'J4Z',
					id: 17
				}, {
					name: 'X0',
					id: 75
				}],
				maintenanceStatusList: [{
					name: 'Ieq',
					id: 10
				}, {
					name: 'Z3He',
					id: 51
				}],
				formData: {
					id: '',
					type: "",
					category: "",
					name: "",
					equipmentUse: "",
					maintenanceStatus: "",
					parameterIndex: "",
					price: "",
					location: "",
				},
				rules: {
					type: {
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
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					equipmentUse: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					maintenanceStatus: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					parameterIndex: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					price: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					location: {
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
					case "type": {
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.categoryList = resultData;
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
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				
				this.changeLoadData("type") ;
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_corollary_equipment_use, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.equipmentUseList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonMaintenanceSituation, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.maintenanceStatusList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_corollary_equipment_type, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.typeList = resultData;
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
