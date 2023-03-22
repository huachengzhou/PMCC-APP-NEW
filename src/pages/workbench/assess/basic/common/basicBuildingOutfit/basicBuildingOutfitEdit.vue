<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="decoratingMaterial" label="装修材料" label-align="right">
					<assess-picker :dataInput="'decoratingMaterial'" :dataList="decoratingMaterialList"
						:dataValue="formData.decoratingMaterial" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="materialGrade" label="材料档次" label-align="right">
					<assess-picker :dataInput="'materialGrade'" :dataList="materialGradeList"
						:dataValue="formData.materialGrade" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="constructionTechnology" label="施工工艺" label-align="right">
					<assess-picker :dataInput="'constructionTechnology'" :dataList="constructionTechnologyList"
						:dataValue="formData.constructionTechnology" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="materialPrice" label="材料价格区间" label-align="right">
					<assess-picker :dataInput="'materialPrice'" :dataList="materialPriceList"
						:dataValue="formData.materialPrice" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="decorationPart" label="装修部位" label-align="right">
					<uni-easyinput  type="text" v-model="formData.decorationPart"
						placeholder="装修部位" />
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
				decoratingMaterialList: [],
				materialGradeList: [],
				constructionTechnologyList: [],
				materialPriceList: [],
				formData: {
					id: '',
					decoratingMaterial: "",
					materialGrade: "",
					constructionTechnology: "",
					materialPrice: "",
					decorationPart: "",
				},
				rules: {
					decoratingMaterial: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					materialGrade: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					constructionTechnology: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					materialPrice: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					decorationPart: {
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
				
				this.$refs.form.setValue(dataInput,value) ;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					case "decoratingMaterial": {
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.constructionTechnologyList = resultData;
						});
						break;
					}
					case "constructionTechnology": {
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.materialPriceList = resultData;
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
				this.changeLoadData("decoratingMaterial");
				this.changeLoadData("constructionTechnology");
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_decorating_material, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.decoratingMaterialList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonMaterialGrade, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.materialGradeList = resultData;
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
