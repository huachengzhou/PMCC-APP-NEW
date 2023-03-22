<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="switchCircuit" label="开关回路" label-align="right">
					<assess-picker :dataInput="'switchCircuit'" :dataList="switchCircuitList"
						:dataValue="formData.switchCircuit" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="grade" label="档次" label-align="right">
					<assess-picker :dataInput="'grade'" :dataList="gradeList" :dataValue="formData.grade"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="layingMethod" label="铺设方式" label-align="right">
					<assess-picker :dataInput="'layingMethod'" :dataList="layingMethodList"
						:dataValue="formData.layingMethod" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="lampsLanterns" label="灯具" label-align="right">
					<!-- <assess-picker :dataInput="'lampsLanterns'" :dataList="lampsLanternsList"
						:dataValue="formData.lampsLanterns" @dataResult="initFormPickerResult">
					</assess-picker> -->
					<uni-data-checkbox multiple v-model="formData.lampsLanterns" :localdata="lampsLanternsList" />

				</uni-forms-item>


				<!-- <uni-forms-item required name="intelligentSystem" label="智能系统" label-align="right">
					<assess-picker :dataInput="'intelligentSystem'" :dataList="intelligentSystemList"
						:dataValue="formData.intelligentSystem" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item> -->

				<uni-forms-item  name="systemDescribe" label="智能系统描述" label-align="right">
					<uni-easyinput  type="text" v-model="formData.systemDescribe"
						placeholder="智能系统描述" />
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
				switchCircuitList: [{
					name: 'K69',
					id: 19
				}, {
					name: 'zL',
					id: 76
				}],
				gradeList: [{
					name: 'DtJ',
					id: 17
				}, {
					name: 'BUbn',
					id: 49
				}],
				layingMethodList: [{
					name: 'EH',
					id: 18
				}, {
					name: 'AkI3',
					id: 79
				}],
				lampsLanternsList: [{
					name: 'CVk',
					id: 11
				}, {
					name: 'r0w',
					id: 69
				}],
				intelligentSystemList: [{
					name: 'Gyd',
					id: 12
				}, {
					name: 'dG',
					id: 31
				}],
				formData: {
					id: '',
					switchCircuit: "",
					grade: "",
					layingMethod: "",
					lampsLanterns: [],
					// intelligentSystem: "",
					systemDescribe: "",
				},
				rules: {
					switchCircuit: {
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
					layingMethod: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					lampsLanterns: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					// intelligentSystem: {
					// 	rules: [{
					// 		required: true,
					// 		errorMessage: '请输入数据'
					// 	}]
					// },
					systemDescribe: {
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
					//特殊处理一些兼容性东西
					if (utils.isArray(res.lampsLanterns)) {
						res.lampsLanterns = res.lampsLanterns.join(",");
					}
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
						if (_this.formData.lampsLanterns) {
							_this.formData.lampsLanterns = _this.formData.lampsLanterns.split(",");
						} else {
							_this.formData.lampsLanterns = [];
						}
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

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_switch_circuit, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.switchCircuitList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonGrade, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.gradeList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseLayingMethod, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.layingMethodList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_intelligent_system, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.intelligentSystemList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_lamps_lanterns, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.lampsLanternsList = estateCommonUtils.checkboxTransformBaseDic(resultData);
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
