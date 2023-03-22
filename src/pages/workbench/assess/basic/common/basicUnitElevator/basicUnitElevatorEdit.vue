<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="maintenance" label="电梯维护情况" label-align="right">
					<assess-picker :dataInput="'maintenance'" :dataList="maintenanceList"
						:dataValue="formData.maintenance" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="type" label="电梯类型" label-align="right">
					<assess-picker :dataInput="'type'" :dataList="typeList" :dataValue="formData.type"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="brand" label="电梯品牌" label-align="right">
					<uni-easyinput type="text" v-model="formData.brand" placeholder="电梯品牌" />
				</uni-forms-item>

				<uni-forms-item name="number" label="电梯数量" label-align="right">
					<uni-easyinput type="text" v-model="formData.number" placeholder="电梯数量" />
				</uni-forms-item>

				<uni-forms-item name="quasiLoadNumber" label="准载人数" label-align="right">
					<uni-easyinput type="text" v-model="formData.quasiLoadNumber" placeholder="准载人数" />
				</uni-forms-item>

				<uni-forms-item name="quasiLoadWeight" label="准载重量kg" label-align="right">
					<uni-easyinput type="text" v-model="formData.quasiLoadWeight" placeholder="准载重量kg" />
				</uni-forms-item>

				<uni-forms-item name="runningSpeed" label="运行速度" label-align="right">
					<uni-easyinput type="text" v-model="formData.runningSpeed" placeholder="运行速度" />
				</uni-forms-item>

				<uni-forms-item name="unitElevatorFile" label="附件" label-align="right">
					<common-image-picker :dataObj="setImgFieldsName('unitElevatorFile')">
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
				maintenanceList: [],
				typeList: [],
				formData: {
					id: '',
					maintenance: "",
					type: "",
					brand: "",
					number: "",
					quasiLoadNumber: "",
					quasiLoadWeight: "",
					runningSpeed: "",
				},
				rules: {
					maintenance: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					type: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					brand: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					number: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					quasiLoadNumber: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					quasiLoadWeight: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					runningSpeed: {
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
			initListData() {
				let data = this.$data;
				let _this = this;
				uni.showLoading({
					title: '加载中',
					mask: true
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonMaintenanceSituation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.maintenanceList = resultData;
					if (!_this.formData.id) {
						resultData.forEach(item => {
							if (item.name == '正常维护') {
								_this.formData.maintenance = item.id;
							}
						})
					}
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitElevatorType, function(
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
					tableName: AssessDBKey.BasicUnitElevator,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
