<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="unitCommonPart" label="公共部位" label-align="right">
						<assess-basic-unit-port-select-and-input ref="unitCommonPart" @dataResult="unitPortSelectResult" :dataInput="'unitCommonPart'"
							:masterId="cardObj.masterId" :dataValue="formData.unitCommonPart" >
						</assess-basic-unit-port-select-and-input>
				</uni-forms-item>


				<uni-forms-item required name="decorationPart" label="装修部位" label-align="right">
					<assess-picker :dataInput="'decorationPart'" :dataList="decorationPartList"
						:dataValue="formData.decorationPart" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


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
				
				
				
				<uni-forms-item required name="materialPriceRange" label="材料价格区间" label-align="right">
					<assess-picker :dataInput="'materialPriceRange'" :dataList="materialPriceRangeList"
						:dataValue="formData.materialPriceRange" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				
				
				<uni-forms-item name="unitDecorateFile" label="附件" label-align="right">
					<common-image-picker  :dataObj="setImgFieldsName('unitDecorateFile')">
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
	
	import assessBasicUnitPortSelectAndInput from '@/components/assess/assess-basic-unit-port-select-and-input/assess-basic-unit-port-select-and-input-mul.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				loading: false,
				decorationPartList: [],
				decoratingMaterialList: [],
				materialGradeList: [],
				constructionTechnologyList: [],
				materialPriceRangeList: [],
				formData: {
					id: '',
					unitCommonPart: "",
					decorationPart: "",
					decoratingMaterial: "",
					materialGrade: "",
					constructionTechnology: "",
					materialPriceRange: "",
				},
				rules: {
					unitCommonPart: {
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
					materialPriceRange: {
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
			"common-image-picker": commonImagePicker ,
			"assess-basic-unit-port-select-and-input": assessBasicUnitPortSelectAndInput ,
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
				
				this.$refs.form.setValue(dataInput,value) ;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					case "decoratingMaterial" :{
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.constructionTechnologyList = resultData;
						});
						break;
					}
					case "constructionTechnology" :{
						estateCommonUtils.getDataDicListByPid(formData[name], function(resultData) {
							if (!resultData) {
								return false;
							}
							data.materialPriceRangeList = resultData;
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
				this.changeLoadData("decoratingMaterial") ;
				this.changeLoadData("constructionTechnology") ;
				this.$nextTick(() => {
					this.$refs.unitCommonPart.initFun() ;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitInteriorDecorationPart, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.decorationPartList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitInteriorDecorationMaterial, function(
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
			},
			unitPortSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.$refs.form.setValue(dataInput, value);
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
					tableName: AssessDBKey.BasicUnitDecorate,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
