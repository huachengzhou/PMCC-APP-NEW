<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">

				<uni-forms-item required name="unitCommonPart" label="公共部位" label-align="right">
					<select-input :dataValue="formData.unitCommonPart" :dataInput="'unitCommonPart'"
						:selectDatas="unitCommonPartList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>



				<uni-forms-item required name="unitMonad" label="单位" label-align="right">
					<select-input :dataValue="formData.unitMonad" :dataInput="'unitMonad'" :selectDatas="unitMonadList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item required name="unitQuantity" label="数量" label-align="right">
					<select-input :dataValue="formData.unitQuantity" :dataInput="'unitQuantity'"
						:selectDatas="unitQuantityList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<view>
					<button @click="apendHtml()" class="mini-btn" type="primary" size="mini">
						<uni-icons color="'#8f8f94'" type="plusempty" size="15"></uni-icons>
						生成记录
					</button>
				</view>

				<assess-basic-unit-common-part ref="unitCommonPart" :values="unitLocationList"
					@updateResult="updateFormData" :locationDataList="locationNameDataList" @rmoveResult="removeInput">
				</assess-basic-unit-common-part>

				<uni-forms-item name="unitCommonPartFile" label="附件" label-align="right">
					<common-image-picker :dataObj="setImgFieldsName('unitCommonPartFile')">
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
	import selectInput from '@/components/select-Input/select-Input.vue';

	import assessBasicUnitCommonPart from '@/components/assess/assess-basic-unit-common-part/assess-basic-unit-common-part.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				loading: false,
				unitCommonPartList: [],
				locationNameDataList: [],
				unitCommonPartBaseList: [],
				unitMonadList: ['个', '条', '处', '根'],
				unitQuantityList: ['1', '2', '3', '4', '5'],
				unitLocationList: [],
				formData: {
					id: '',
					unitCommonPart: "",
					unitMonad: "",
					unitQuantity: "",
					unitLocation: "",
				},
				rules: {
					unitCommonPart: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					unitMonad: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					unitQuantity: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					unitLocation: {
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
			"select-input": selectInput,
			"common-image-picker": commonImagePicker,
			"assess-basic-unit-common-part": assessBasicUnitCommonPart,
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
					let formData = _this.formData;
					let data = utils.assignObj(formData, {
						creator: userInfo.userAccount,
						id: _this.formData.id,
						unitId: _this.cardObj.masterId,
						bisDelete: 'false',
						unitLocation: JSON.stringify(_this.unitLocationList)
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
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
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
						let unitLocationList = [];
						if (utils.isNotEmptyString(resultData.unitLocation)) {
							try {
								unitLocationList = JSON.parse(resultData.unitLocation);
								unitLocationList.sort(function(a, b) {
									return a.index - b.index
								});
								console.log(unitLocationList) ;
							} catch (e) {
								console.log(e);
							}
						}
						_this.unitLocationList = unitLocationList;
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
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitCommonPart, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.unitCommonPartBaseList = resultData;
					let arr = [];
					resultData.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.unitCommonPartList = arr;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineUnitLocation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.locationNameDataList = arr;
				});
				uni.showToast({
					title: '加载完成',
					success() {
						uni.hideLoading();
					}
				});
			},
			apendHtml() {
				let formData = this.formData;
				if (utils.isEmptyString(formData.unitCommonPart)) {
					uni.showToast({
						title: '部位必须填写',
						mask: true,
						duration: 1000
					});
					return false;
				}
				if (utils.isEmptyString(formData.unitMonad)) {
					uni.showToast({
						title: '单位必须填写',
						mask: true,
						duration: 1000
					});
					return false;
				}
				if (utils.isEmptyString(formData.unitQuantity)) {
					uni.showToast({
						title: '数量必须填写',
						mask: true,
						duration: 1000
					});
					return false;
				}
				let arr = this.unitLocationList;
				let unitQuantity = Number(formData.unitQuantity);
				for (let i = 1; i <= unitQuantity; i++) {
					let obj = {
						name: '' + formData.unitCommonPart + i,
						index: '',
						description: '',
						unitLocation: ''
					};
					arr.push(obj);
				}
			},
			removeInput(index) {
				let arr = this.unitLocationList;
				arr.splice(index, 1);
				this.unitLocationList = arr;
			},
			updateFormData(obj) {
				let arr = this.unitLocationList;
				let value = obj.value;
				let name = obj.name;
				let index = obj.index;
				let item = arr[index];
				item[name] = value;
				item.index = index + 1;
				this.unitLocationList = arr;
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
					tableName: AssessDBKey.BasicUnitCommonPart,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
