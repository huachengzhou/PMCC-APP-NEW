<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				
				<!-- <uni-forms-item required name="name" label="餐饮名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.name" placeholder="餐饮名称" />
				</uni-forms-item> -->
				
				<view>
					<button @click="apendHtml()" class="mini-btn" type="primary" size="mini">
						<uni-icons color="'#8f8f94'" type="plusempty" size="15"></uni-icons>
						餐饮名称
					</button>
				</view>
				
				
				<assess-multiple-input-group  :label="'餐饮名称'"  :values="nameList"
					@updateResult="updateFormData" @rmoveResult="removeInput">
				</assess-multiple-input-group>


				<uni-forms-item required name="category" label="餐饮类别" label-align="right">
					<assess-picker :dataInput="'category'" :dataList="categoryList" :dataValue="formData.category"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="grade" label="餐饮档次" label-align="right">
					<assess-picker :dataInput="'grade'" :dataList="gradeList" :dataValue="formData.grade"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="distance" label="餐饮距离" label-align="right">
					<assess-picker :dataInput="'distance'" :dataList="distanceList" :dataValue="formData.distance"
						@dataResult="initFormPickerResult">
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
	import assessMultipleInputGroup from '@/components/assess/assess-multiple-input-group/assess-multiple-input-group.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				loading: false,
				categoryList: [],
				gradeList: [],
				distanceList: [],
				nameList: [''],
				formData: {
					id: '',
					name: "",
					category: "",
					grade: "",
					distance: "",
				},
				rules: {
					name: {
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
					distance: {
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
			"assess-multiple-input-group": assessMultipleInputGroup,
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
						estateId: _this.cardObj.masterId,
						type: _this.cardObj.childType,
						bisDelete: 'false' ,
						name: _this.nameList.join(",")
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
						_this.nameList = utils.splitAssessString(formData.name);
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
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_dining_category, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.categoryList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_dining_grade, function(
				    resultData) {
				    if (!resultData) {
				        return false;
				    }
				    data.gradeList = resultData;
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
			},
			apendHtml() {
				let arr = this.nameList;
				arr.unshift("");
			},
			updateFormData(obj) {
				let arr = this.nameList;
				arr[obj.index] = obj.value;
			},
			removeInput(index) {
				let arr = this.nameList;
				arr.splice(index, 1);
				this.nameList = arr;
			}
		}
	}
</script>

<style>

</style>
