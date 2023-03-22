<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">

				<uni-forms-item required name="tenementType" label="物业类型" label-align="right">
					<select-input :dataValue="formData.tenementType" :dataInput="'tenementType'"
						:selectDatas="tenementTypeList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item required name="name" label="户型名称" label-align="right">
					<assess_basic_huxing_edit_name ref="huxingName" :huxingData="formData.huxingData"
						:dataValue="formData.name" :dataInput="'name'" :tenementType="formData.tenementType"
						@dataResult="huxingAutoResult">
					</assess_basic_huxing_edit_name>
				</uni-forms-item>

				<uni-forms-item  name="namexxxxx" label="住宅户型" label-align="right">
					<button  class="mini-btn" type="primary" size="mini"
						@click.stop="createHouseHuxingData()">住宅户型编辑</button>
					<assess_basic_huxing_edit_name ref="huxingNameOld" :huxingData="JSON.stringify(houseHuxingList)"
						:showInput="false" :dataInput="'name'" :tenementType="'住宅'"
						@dataResult="huxingAutoResult">
					</assess_basic_huxing_edit_name>
				</uni-forms-item>

				<uni-forms-item required name="area" label="面积(m²)" label-align="right">
					<uni-easyinput type="text" v-model="formData.area" placeholder="面积(m²)" />
				</uni-forms-item>


				<uni-forms-item required name="reference" label="朝向 " label-align="right">
					<select-input :dataValue="formData.reference" :dataInput="'reference'" :selectDatas="referenceList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item required name="orientation" label="朝向 方向" label-align="right">
					<assess-picker :dataInput="'orientation'" :dataList="orientationList"
						:dataValue="formData.orientation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>



				<uni-forms-item required name="quantity" label="户数" label-align="right">
					<uni-easyinput type="text" v-model="formData.quantity" placeholder="户数" />
				</uni-forms-item>


				<uni-forms-item name="utilitiesMeasure" label="水电费标准" label-align="right">
					<assess-picker :dataInput="'utilitiesMeasure'" :dataList="utilitiesMeasureList"
						:dataValue="formData.utilitiesMeasure" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="utilitiesMeasureName == '非标准'" name="utilitiesType" label="水电费类型"
					label-align="right">
					<assess-picker :dataInput="'utilitiesType'" :dataList="utilitiesTypeList"
						:dataValue="formData.utilitiesType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="huxingCalculateMethod" label="户数计算方式" label-align="right">
					<assess-picker :dataInput="'huxingCalculateMethod'" :dataList="huxingCalculateMethodList"
						:dataValue="formData.huxingCalculateMethod" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="spatialDistribution" label="空间布局" label-align="right">
					<assess-picker :dataInput="'spatialDistribution'" :dataList="spatialDistributionList"
						:dataValue="formData.spatialDistribution" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="spatialDistributionRemark" label="空间布局说明" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.spatialDistributionRemark"
						placeholder="空间布局说明">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="housingBreakdown" label="房屋细分" label-align="right">
					<assess-picker :dataInput="'housingBreakdown'" :dataList="housingBreakdownList"
						:dataValue="formData.housingBreakdown" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				
				
				<view v-for="(fieldData,index_f) in tableFields">
					<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
						<common-image-picker 
							:dataObj="setImgFieldsName(fieldData.fieldName)">
						</common-image-picker>
					</uni-forms-item>
				</view>

			</uni-group>
		</uni-forms>

		<uni-group title="其它信息" mode="card">
		</uni-group>


		<view v-if="!commitFlag">
			<view class="uni-flex uni-row " style="width: 100%;">
				<view style="-webkit-flex: 1;flex: 1;" class="assessbtnLeft">
					<button @click.stop="submitForm()">
						提交
					</button>
				</view>
				<view style="-webkit-flex: 1;flex: 1;" class="assessbtnRight">
					<button @click.stop="submitTempForm()">
						临时保存
					</button>
				</view>
			</view>
		</view>
		<assess-submit-button v-show="commitFlag">
			{{commitTitle}}
		</assess-submit-button>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as Explore from '@/common/assess/Explore.key.js';

	import assessBasicHuxingEditName from '@/components/assess/assess-basic-huxing-edit-name/assess-basic-huxing-edit-name.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;
	let houseHuxingList = [];
	
	houseHuxingList.push({
		key: "卧室",
		explain: "室",
		value: ""
	});
	houseHuxingList.push({
		key: "客厅",
		explain: "厅",
		value: ""
	});
	
	houseHuxingList.push({
		key: "厨房",
		explain: "厨",
		value: ""
	});
	houseHuxingList.push({
		key: "卫生间",
		explain: "卫生间",
		value: ""
	});
	
	// houseHuxingList.push({
	// 	key: "阳台",
	// 	explain: "阳台",
	// 	value: ""
	// });
	
	// houseHuxingList.push({
	// 	key: "花园",
	// 	explain: "花园",
	// 	value: ""
	// });

	// 多选框 必须包含 text和value
	let thisViewData = {
		transferId: '',
		cardObj: null,
		homeParam: {},
		tableFields: [],
		commitFlag: false,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		batchDetail: {},
		referenceList: ['入户门', '客厅'],
		tenementTypeList: [],
		utilitiesTypeList: [],
		orientationList: [],
		spatialDistributionList: [],
		utilitiesMeasureList: [],
		huxingCalculateMethodList: [{
			name: '按单元',
			id: '按单元'
		}, {
			name: '按层',
			id: '按层'
		}],
		houseHuxingList:houseHuxingList,
		housingBreakdownList: [],
		formData: {
			id: '0',
			tenementType: "",
			name: "",
			utilitiesType: "",
			area: "",
			reference: "",
			orientation: "",
			spatialDistribution: "",
			quantity: "",
			utilitiesMeasure: "",
			huxingCalculateMethod: "",
			housingBreakdown: "",
			spatialDistributionRemark: "",
			huxingData: ""
		},
		loading: false,
		firstIndex: 0,
		rules: {
			tenementType: {
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
			area: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			reference: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			orientation: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			spatialDistribution: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			quantity: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			utilitiesType: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			utilitiesMeasure: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			huxingCalculateMethod: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			housingBreakdown: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
		}
	};

	export default {
		data() {
			return thisViewData;
		},
		computed: {
			utilitiesMeasureName: function() {
				let text = "";
				let utilitiesMeasure = this.formData.utilitiesMeasure;
				let arr = this.utilitiesMeasureList;
				if (utilitiesMeasure) {
					arr.forEach(function(item) {
						if (item.id == utilitiesMeasure) {
							text = item.name;
						}
					});
				}
				return text;
			}
		},
		watch: {
			formData: {
				handler(newValue, oldValue) {
					let data = this.$data;
					var _this = this;
				},
				deep: true //true 深度监听
			}
		},
		onLoad(option) {
			if (option.batchDetailJson) {
				let batchDetail = JSON.parse(option.batchDetailJson);
				this.batchDetail = batchDetail;
				console.log(batchDetail);
			}
			if (option.cardJson) {
				let cardObj = JSON.parse(option.cardJson);
				this.cardObj = cardObj;
				if (cardObj.getMasterUrl) {
					this.setServerData(cardObj.getMasterUrl);
				}
			}
			if (option.homeParam) {
				this.homeParam = JSON.parse(option.homeParam);
			}
			//提交按钮控制
			estateCommonUtils.runBasicCheckWriteContent(this.homeParam.applyBatchId, this.$helper.fetchLocalUser(), this
				.$data);
			console.log(this.homeParam);
		},
		onShow() {

		},
		onReady() {
			// 需要在onReady中设置规则
			// this.$refs.form.setRules(this.rules);
		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker,
			"select-input": selectInput,
			"assess_basic_huxing_edit_name": assessBasicHuxingEditName,
			"common-file-picker": commonFilePicker
		},
		methods: {
			submit(data, commitFlag) {
				var _this = this;
				let option = {
					url: _this.cardObj.saveAndUpdateUrl,
					showLoading: true,
					query: data,
					successCallback: function(resultData) {
						uni.showToast({
							title: '保存成功',
							success() {
								let query = _this.homeParam;
								query.transferId = _this.batchDetail.id;
								let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
								if (commitFlag) {
									uni.redirectTo({
										url: url
									});
								}
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitTempForm() {
				var _this = this;
				let batchDetail = this.batchDetail;
				let res = this.formData;
				let userInfo = _this.$helper.fetchLocalUser();
				let data = utils.assignObj(res, {
					creator: userInfo.userAccount,
					id: _this.formData.id,
					huxingData: _this.formData.huxingData,
					houseId: _this.batchDetail.tableId,
				});
				console.log('表单返回得值：', data);
				_this.submit(data, false);
			},
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				let batchDetail = this.batchDetail;
				this.$refs.form.validate().then((res) => {
					//特殊处理一些兼容性东西
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						id: _this.formData.id,
						huxingData: _this.formData.huxingData,
						houseId: _this.batchDetail.tableId,
					});
					console.log('表单返回得值：', data);
					_this.submit(data, true);
				});
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineCommonOrientation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.orientationList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseSpatialDistribution, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.spatialDistributionList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseUtilitiesMeasure, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.utilitiesMeasureList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseUtilitiesType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.utilitiesTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseSpatialDistribution, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.spatialDistributionList = resultData;
					_this.changeLoadData("spatialDistribution");
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseTenementType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.push(item.name);
					});
					data.tenementTypeList = arr;
				});
				assessCommonUtils.loadAllChildDataDicList('houseHuxingFilePart', function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.tableFields = resultData;
				});
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					case "spatialDistribution": {
						let value = formData.spatialDistribution;
						let arrTemp = _this.spatialDistributionList;
						let text = "";
						arrTemp.forEach(function(item) {
							if (value) {
								if (value == item.id) {
									text = item.name;
								}
							}
						});
						if (text) {
							var arr = [];
							if ("多层" == text) {
								arr.push({
									name: "独栋",
									id: "独栋"
								});
								arr.push({
									name: "双拼",
									id: "双拼"
								});
								arr.push({
									name: "叠拼",
									id: "叠拼"
								});
								arr.push({
									name: "联排",
									id: "联排"
								});
								arr.push({
									name: "跃层",
									id: "跃层"
								});
							} else if ("平层" == text) {
								arr.push({
									name: "洋房",
									id: "洋房"
								});
								arr.push({
									name: "空中别墅",
									id: "空中别墅"
								});
								arr.push({
									name: "普通住宅",
									id: "普通住宅"
								});
							} else {
								arr.push({
									name: "其它",
									id: "其它"
								});
							}
							_this.housingBreakdownList = arr;
						}
						break;
					}

					default: {
						break;
					}
				}
			},
			setServerData: function(url) {
				let _this = this;
				let batchDetail = this.batchDetail;
				let formData = this.formData;
				let query = {
					id: batchDetail.tableId
				};
				if (!batchDetail.tableId) {
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
						_this.$nextTick(() => {
							_this.$refs.huxingName.initFun();
						});
						_this.initListData();
					}
				};
				console.log(option);
				utils.requestDefault(option);
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
				console.log(result);
				this.$refs.form.setValue(dataInput, value);
			},
			huxingAutoResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
				let jsonArray = result.huxingData;
				this.formData.huxingData = JSON.stringify(jsonArray);
				this.$nextTick(() => {
					this.$refs.form.setValue(dataInput, value);
					this.$refs.huxingName.initFun();
				});
				this.submitTempForm();
			},
			createHouseHuxingData(){
				this.$refs.huxingNameOld.openModelFunction();
			},
			setImgFieldsName(fieldsName) {
				let batchDetail = this.batchDetail;
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let obj = {
					fieldsName: fieldsName,
					tableId: batchDetail.tableId,
					tableName: AssessDBKey.BasicHouse,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
