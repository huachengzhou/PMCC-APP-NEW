<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="houseNumber" label="房号" label-align="right">
					<uni-easyinput type="text" v-model="formData.houseNumber" placeholder="房号" />
				</uni-forms-item>
				<uni-forms-item required name="floor" label="所在楼层" label-align="right">
					<uni-easyinput type="text" v-model="formData.floor" placeholder="所在楼层" />
				</uni-forms-item>
				<uni-forms-item required name="area" label="面积(m²)" label-align="right">
					<uni-easyinput type="text" v-model="formData.area" placeholder="面积(m²)" />
				</uni-forms-item>


				<uni-forms-item required name="researchType" label="调查方式" label-align="right">
					<assess-picker :dataInput="'researchType'" :dataList="researchTypeList"
						:dataValue="formData.researchType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="certUse" label="证载用途" label-align="right">
					<select-input :dataValue="formData.certUse" :dataInput="'certUse'" :selectDatas="certUseNameList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item required name="practicalUse" label="实际用途" label-align="right">
					<select-input :dataValue="formData.practicalUse" :dataInput="'practicalUse'"
						:selectDatas="practicalUseNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item required name="decorateSituation" label="装修情况" label-align="right">
					<assess-picker :dataInput="'decorateSituation'" :dataList="decorateSituationList"
						:dataValue="formData.decorateSituation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item  name="decorateSituationDescription" label="装修情况描述" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.decorateSituationDescription"
						placeholder="装修情况描述">
					</uni-easyinput>
				</uni-forms-item>




				<uni-forms-item required name="useCondition" label="使用情况" label-align="right">
					<assess-picker :dataInput="'useCondition'" :dataList="useConditionList"
						:dataValue="formData.useCondition" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="useConditionFlag" name="useConditionDescription" label="使用情况描述"
					label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.useConditionDescription"
						placeholder="使用情况描述">
					</uni-easyinput>
				</uni-forms-item>


				<uni-forms-item name="useEnvironment" label="使用环境" label-align="right">
					<assess-picker :dataInput="'useEnvironment'" :dataList="useEnvironmentList"
						:dataValue="formData.useEnvironment" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="useProduce" label="用房类型" label-align="right">
					<assess-picker :dataInput="'useProduce'" :dataList="useProduceList" :dataValue="formData.useProduce"
						@dataResult="initFormPickerResult">
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
			<button @click.stop="openSignatureView" class="mini-btn" type="primary" size="mini">手写签名</button>
			<button @click.stop="$refs.assessBasicApplyBatchFileModel.onFocus()" class="mini-btn" type="primary"
				size="mini">引用附件</button>
		</uni-group>

		<assess-basic-house-foot-nav ref="houseFootNav" :dataId="batchDetail.pid" :batchDetail="batchDetail"
			@renderFun="serverRenderingThisView">
		</assess-basic-house-foot-nav>


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

		<assess-basic-file-model ref="assessBasicApplyBatchFileModel" @getResults="getAssessBasicApplyBatchFileModel">
		</assess-basic-file-model>

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

	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	import assessBasicHouseFootNav from '@/components/assess/basic/assess-basic-house-foot-nav/assess-basic-house-foot-nav.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import assess_basic_file_model from '@/components/assess/assess-basic-file-model/assess-basic-file-model.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	// 多选框 必须包含 text和value
	let thisViewData = {
		transferId: '',
		cardObj: null,
		useConditionFlag: true,
		homeParam: {},
		tableFields: [],
		commitFlag: false,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		batchDetail: {},
		researchTypeList: [],
		useConditionList: [],
		useEnvironmentList: [],
		decorateSituationList: [],
		useProduceList: [],
		certUseNameList: [],
		certUseList: [],
		practicalUseList: [],
		practicalUseNameList: [],
		formData: {
			id: '0',
			houseNumber: "",
			floor: "",
			area: "",
			researchType: "",
			certUse: "",
			practicalUse: "",
			decorateSituation: "",
			decorateSituationDescription: "",
			useCondition: "",
			useConditionDescription: "",
			useEnvironment: "",
			useProduce: "",
		},
		loading: false,
		firstIndex: 0,
		rules: {
			houseNumber: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			floor: {
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
			researchType: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			certUse: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			practicalUse: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			decorateSituation: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			decorateSituationDescription: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			useCondition: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			useConditionDescription: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			useEnvironment: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			useProduce: {
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
		computed: {},
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
				if (cardObj.getUrl) {
					this.setServerData(cardObj.getUrl);
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
			"common-file-picker": commonFilePicker,
			"assess-basic-house-foot-nav": assessBasicHouseFootNav,
			"input-autocomplete": inputAutocomplete,
			"assess-basic-file-model": assess_basic_file_model
		},
		methods: {
			async additionalFun(callback) {
				var _this = this;
				let urls = ['/app.assess/basicHouseTrading/getByHouseId',
					'/app.assess/basicEstateLandCategoryInfo/getBasicEstateLandCategoryInfoByHouseId'
				];
				//使用链式调用
				await _this.$myRequest.pmccRequest({
					url: urls[0],
					method: 'POST',
					data: {
						houseId: _this.batchDetail.tableId
					}
				}).then(resOne => {
					_this.$myRequest.pmccRequest({
						url: urls[1],
						method: 'POST',
						data: {
							houseId: _this.batchDetail.tableId
						}
					}).then(resTwo => {
						let resultData = {
							landCategoryInfo: resTwo,
							basicTrading: resOne
						};
						console.log(resultData);
						if (callback) {
							callback(resultData);
						}
					});
				});
			},
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
					creator: userInfo.userAccount
				});
				_this.additionalFun(function(baseResultData) {
					let infoData = {
						basicHouse: data,
						landCategoryInfo: baseResultData.landCategoryInfo,
						basicTrading: baseResultData.basicTrading,
					};
					let coreData = {
						applyBatchDetailId: batchDetail.id,
						formData: JSON.stringify(infoData),
						formClassify: batchDetail.type,
						planDetailsId: batchDetail.planDetailsId
					};
					_this.submit(coreData, false);
				});
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
						id: _this.formData.id
					});
					console.log('表单返回得值：', data);

					_this.additionalFun(function(baseResultData) {
						let infoData = {
							basicHouse: data,
							landCategoryInfo: baseResultData.landCategoryInfo,
							basicTrading: baseResultData.basicTrading,
						};
						let coreData = {
							applyBatchDetailId: batchDetail.id,
							formData: JSON.stringify(infoData),
							formClassify: batchDetail.type,
							planDetailsId: batchDetail.planDetailsId
						};
						_this.submit(coreData, true);
					});
				});
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
				// this.changeLoadData("province");

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseUseProduceUse, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.useProduceList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseEnvironmentUse, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.useEnvironmentList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseUseCondition, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.useConditionList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseResearchType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.researchTypeList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseDecorateSituation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.decorateSituationList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseLoadUtility, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.push(item.name);
					});
					data.certUseNameList = arr;
					data.certUseList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHousePracticalUse, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.push(item.name);
					});
					data.practicalUseNameList = arr;
					data.practicalUseList = resultData;
				});
				assessCommonUtils.loadAllChildDataDicList('houseFilePart', function(
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
				let value = formData[name];
				switch (name) {
					case "useCondition": {
						if (!value) {
							break;
						}
						let arr = _this.useConditionList;
						let text = "";
						arr.forEach(function(item) {
							if (item.id == value) {
								text = item.name;
							}
						});
						if (text) {
							if (text != '自用' && text != '出租') {
								_this.useConditionFlag = true;
							} else {
								_this.useConditionFlag = false;
							}
						}
						break;
					}

					default: {
						break;
					}
				}
			},
			serverRenderingThisView(batchDetail) {
				this.batchDetail = batchDetail;
				let cardObj = this.cardObj;
				this.cardObj = cardObj;
				if (cardObj.getUrl) {
					this.setServerData(cardObj.getUrl);
				}
			},
			setServerData: function(url) {
				let _this = this;
				let batchDetail = this.batchDetail;
				let formData = this.formData;
				let query = {
					formClassify: batchDetail.type,
					tableId: batchDetail.tableId
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
						console.log(_this.formData);
						_this.initListData();
					}
				};
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
				this.$refs.form.setValue(dataInput, value);
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
			},
			openMapView() {
				let batchDetail = this.batchDetail;
				let param = {
					batchDetailJson: JSON.stringify(batchDetail)
				};
				uni.navigateTo({
					url: "../../common/basicMap/mapMarker" + "?" + utils.parseParam(param)
				});
			},
			openSignatureView() {
				let batchDetail = this.batchDetail;
				let cardObj = this.cardObj;
				let homeParam = this.homeParam;
				let param = {
					batchDetailJson: JSON.stringify(batchDetail),
					cardJson: JSON.stringify(cardObj),
					homeParam: JSON.stringify(homeParam),
				};
				this.submitTempForm();
				uni.navigateTo({
					url: "../../common/basicSignature/basicSignature" + "?" + utils.parseParam(param)
				});
			},
			getAssessBasicApplyBatchFileModel(obj) {
				let batchDetail = this.batchDetail;
				let dataId = null;
				if(utils.isArray(obj)){
					dataId = obj[0].id;
				}else {
					dataId = obj.id;
				}
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/bindChildHouse",
					data: {
						id: dataId,
						applyBatchDetailId: batchDetail.id
					},
					showLoading: true
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '操作成功'
						});
						this.$nextTick(() => {
							let cpns = this.$refs.fileCpn;
							if (utils.isArrayNotEmpty(cpns)) {
								cpns.forEach(cpn => {
									cpn.initFun();
								});
							} else {
								if (cpns) {
									cpns.initFun();
								}
							}
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
