<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="scopeProperty" label="财产范围" label-align="right">
					<assess-picker :dataInput="'scopeProperty'" :dataList="scopePropertyList"
						:dataValue="formData.scopeProperty" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="scopeInclude" label="范围包括" label-align="right">
					<uni-easyinput type="text" v-model="formData.scopeInclude" placeholder="范围包括" />
				</uni-forms-item>
				<uni-forms-item required name="scopeNotInclude" label="范围不包括" label-align="right">
					<uni-easyinput type="text" v-model="formData.scopeNotInclude" placeholder="范围不包括" />
				</uni-forms-item>


				<uni-forms-item required name="taxBurden" label="税费负担" label-align="right">
					<assess-picker :dataInput="'taxBurden'" :dataList="taxBurdenList" :dataValue="formData.taxBurden"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="transactionSituation" label="交易情况" label-align="right">
					<assess-picker :dataInput="'transactionSituation'" :dataList="transactionSituationList"
						:dataValue="formData.transactionSituation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="priceType" label="价格类型" label-align="right">
					<assess-picker :dataInput="'priceType'" :dataList="priceTypeList" :dataValue="formData.priceType"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item v-show="descriptionHflag" name="descriptionType" label="说明事项类型" label-align="right">
					<assess-picker :dataInput="'descriptionType'" :dataList="descriptionTypeList"
						:dataValue="formData.descriptionType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="descriptionHflag" name="descriptionContent" label="说明事项内容" label-align="right">
					<uni-easyinput type="text" v-model="formData.descriptionContent" placeholder="说明事项内容" />
				</uni-forms-item>


				<uni-forms-item name="tradingType" label="交易类型" label-align="right">
					<assess-picker :dataInput="'tradingType'" :dataList="tradingTypeList"
						:dataValue="formData.tradingType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="paymentMethod" label="付款方式" label-align="right">
					<assess-picker :dataInput="'paymentMethod'" :dataList="paymentMethodList"
						:dataValue="formData.paymentMethod" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="installmentInterestRateHflag" name="installmentInterestRate" label="分期支付利率"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.installmentInterestRate" placeholder="分期支付利率" />
				</uni-forms-item>

				<uni-forms-item v-show="tradingConditionHflag" name="downPaymentRatio" label="首付款比例"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.downPaymentRatio" placeholder="首付款比例" />
				</uni-forms-item>
				<uni-forms-item v-show="tradingConditionHflag" name="lendingRate" label="贷款利率" label-align="right">
					<uni-easyinput type="text" v-model="formData.lendingRate" placeholder="贷款利率" />
				</uni-forms-item>
				<uni-forms-item v-show="tradingConditionHflag" name="loanPeriod" label="贷款期限" label-align="right">
					<uni-easyinput type="text" v-model="formData.loanPeriod" placeholder="贷款期限" />
				</uni-forms-item>

				<uni-forms-item v-show="ExamineHouseTradingSellHflag" name="buyerExtraTax" label="买方额外支付的税"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.buyerExtraTax" placeholder="买方额外支付的税" />
				</uni-forms-item>
				<uni-forms-item v-show="ExamineHouseTradingSellHflag" name="buyerExtraFee" label="买方额外支付的费"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.buyerExtraFee" placeholder="买方额外支付的费" />
				</uni-forms-item>

				<uni-forms-item v-show="ExamineHouseTradingLeaseHflag" name="rentingExtraTax" label="承租方额外支付的税"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.rentingExtraTax" placeholder="承租方额外支付的税" />
				</uni-forms-item>
				<uni-forms-item v-show="ExamineHouseTradingLeaseHflag" name="rentingExtraFee" label="承租方额外支付的费"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.rentingExtraFee" placeholder="承租方额外支付的费" />
				</uni-forms-item>
				<uni-forms-item v-show="ExamineHouseTradingLeaseHflag" name="deposit" label="押金（元）" label-align="right">
					<uni-easyinput type="text" v-model="formData.deposit" placeholder="押金（元）" />
				</uni-forms-item>

				<uni-forms-item name="tradingTime" label="交易时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.tradingTime"
						v-on:change="setFormValue('tradingTime',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item name="tradingTotalPrice" label="交易总价（元）" label-align="right">
					<uni-easyinput v-on:blur="changeLoadData('tradingTotalPrice')" type="text"
						v-model="formData.tradingTotalPrice" placeholder="交易总价（元）" />
				</uni-forms-item>

				<uni-forms-item name="tradingUnitPrice" label="交易单价（元）" label-align="right">
					<uni-easyinput v-on:blur="changeLoadData('tradingUnitPrice')" type="text"
						v-model="formData.tradingUnitPrice" placeholder="交易单价（元）" />
				</uni-forms-item>

				<uni-forms-item name="bisReal" label="可进案例库" label-align="right">
					<assess-picker :dataInput="'bisReal'" :dataList="bisRealList"
						:dataValue="formData.bisReal" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="priceConnotation" label="单价内涵" label-align="right">
					<assess-picker :dataInput="'priceConnotation'" :dataList="priceConnotationList"
						:dataValue="formData.priceConnotation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="priceConnotationUnitFlag" name="priceConnotationUnit" label="单价单位"
					label-align="right">
					<uni-easyinput type="text" v-model="formData.priceConnotationUnit" placeholder="单价单位" />
				</uni-forms-item>


				<uni-forms-item name="informationType" label="信息来源" label-align="right">
					<assess-picker :dataInput="'informationType'" :dataList="informationTypeList"
						:dataValue="formData.informationType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="infomationTypeOpenFlag" name="informationCategory" label="信息来源类别"
					label-align="right">
					<assess-picker :dataInput="'informationCategory'" :dataList="informationCategoryList"
						:dataValue="formData.informationCategory" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="infomationTypeOtherFlag" name="name" label="姓名" label-align="right">
					<uni-easyinput type="text" v-model="formData.name" placeholder="姓名" />
				</uni-forms-item>
				<uni-forms-item v-show="infomationTypeOtherFlag" name="phone" label="电话" label-align="right">
					<uni-easyinput type="text" v-model="formData.phone" placeholder="电话" />
				</uni-forms-item>

				<uni-forms-item name="house_trading_file_f" label="房屋交易信息" label-align="right">
					<common-image-picker :mediatype="'image'" :dataObj="setImgFieldsName('house_trading_file_f')">
					</common-image-picker>
				</uni-forms-item>

			</uni-group>
		</uni-forms>

		<uni-group title="其它信息" mode="card">
		</uni-group>

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

		<!-- <assess-submit-button @submit="submitForm" :loading="loading">
			提交
		</assess-submit-button> -->

	</view>
</template>

<script>
	import * as utils from "../../../../../../../common/untils.js";
	import * as estateCommonUtils from "../../../../../../../common/assess/basic/examine.common.js";
	import * as Explore from "../../../../../../../common/assess/Explore.key.js";


	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;



	// 多选框 必须包含 text和value
	let thisViewData = {
		id: '',
		transferId: '',
		cardObj: null,
		batchDetail: {},
		scopePropertyList: [],
		taxBurdenList: [],
		transactionSituationList: [],
		priceTypeList: [],
		descriptionTypeList: [],
		tradingTypeList: [],
		paymentMethodList: [],
		priceConnotationList: [],
		informationTypeList: [],
		informationCategoryList: [],
		bisRealList: [{id:true,name:'是'},{id:false,name:'否'}],
		formData: {
			id: '0',
			scopeProperty: "",
			scopeInclude: "",
			scopeNotInclude: "",
			taxBurden: "",
			transactionSituation: "",
			priceType: "",
			descriptionType: "",
			descriptionContent: "",
			tradingType: "",
			paymentMethod: "",
			installmentInterestRate: "",
			downPaymentRatio: "",
			lendingRate: "",
			loanPeriod: "",
			buyerExtraTax: "",
			buyerExtraFee: "",
			rentingExtraTax: "",
			rentingExtraFee: "",
			deposit: "",
			tradingTime: "",
			tradingTotalPrice: "",
			tradingUnitPrice: "",
			priceConnotation: "",
			priceConnotationUnit: "",
			informationType: "",
			informationCategory: "",
			name: "",
			phone: "",
			bisReal:''
		},
		infomationTypeOtherFlag: false,
		infomationTypeOpenFlag: false,
		priceConnotationUnitFlag: true,
		descriptionHflag: true,
		ExamineHouseTradingLeaseHflag: true,
		ExamineHouseTradingSellHflag: true,
		installmentInterestRateHflag: true,
		tradingConditionHflag: true,
		loading: false,
		houseData: {},
		firstIndex: 0,
		rules: {
			scopeProperty: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			scopeInclude: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			scopeNotInclude: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			taxBurden: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			transactionSituation: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			priceType: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			descriptionType: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			descriptionContent: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			tradingType: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			paymentMethod: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			installmentInterestRate: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			downPaymentRatio: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			lendingRate: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			loanPeriod: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			buyerExtraTax: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			buyerExtraFee: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			rentingExtraTax: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			rentingExtraFee: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			deposit: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			tradingTime: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			tradingTotalPrice: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			tradingUnitPrice: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			priceConnotation: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			priceConnotationUnit: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			informationType: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			informationCategory: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			name: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			phone: {
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
			if (option.id) {
				this.id = option.id;
			}
			if (option.cardJson) {
				let cardObj = JSON.parse(option.cardJson);
				this.cardObj = cardObj;
				if (cardObj.getUrl) {
					this.setServerData(cardObj.getUrl);
				}
			}
			if (option.transferId) {
				this.transferId = option.transferId;
			}
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
								let transferId = _this.transferId;
								if (!transferId) {
									transferId = _this.batchDetail.id;
								}
								let query = {
									id: transferId,
									applyBatchId: _this.batchDetail.applyBatchId
								};
								uni.showToast({
									title: '保存成功',
									success() {
										if (commitFlag) {
											uni.setStorageSync("isDoRefresh", 1);
											uni.navigateBack({
												delta: 1
											});
										}
									}
								});
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
				//特殊处理一些兼容性东西
				let userInfo = _this.$helper.fetchLocalUser();
				//对日期进行折中处理一下下
				let data = utils.assignObj(res, {
					creator: userInfo.userAccount,
					id: _this.formData.id,
					tradingTimeString: _this.formData.tradingTime,
					tradingTime: '',
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
					//对日期进行折中处理一下下
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						id: _this.formData.id,
						tradingTimeString: _this.formData.tradingTime,
						tradingTime: '',
						houseId: _this.batchDetail.tableId,
					});
					console.log('表单返回得值：', data);
					_this.submit(data, true);
				});
			},
			initListData: function() {
				let formData = this.formData;
				let batchDetail = this.batchDetail;
				let data = this.$data;
				var _this = this;
				// this.changeLoadData("province");

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseTransactionSituation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.transactionSituationList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseScopeProperty, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.scopePropertyList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHousetaxBurden, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.taxBurdenList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseDescriptionType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.descriptionTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseTransactionType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.tradingTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseFinancingConditions, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.financingConditionsList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseInformationSourceType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.informationTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseInformationSourceCategory, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.informationCategoryList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHousePriceConnotation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.priceConnotationList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouse_transaction_price_type, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.priceTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseTransactionTransactionLevel, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.transactionLevelList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHousePaymentMethod, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.paymentMethodList = resultData;
				});
				let houseQuery = {
					formClassify: batchDetail.type,
					tableId: batchDetail.tableId
				};
				let houseOption = {
					query: houseQuery,
					notParam: true,
					url: "/app.assess/basicApplyBatchDetail/getNodeByFormData?" + utils.parseParam(houseQuery),
					successCallback: function(houseData) {
						if (!houseData) {
							return false;
						}
						_this.houseData = houseData;
					}
				};
				utils.requestDefault(houseOption);

				utils.requestDefault({
					query: {
						applyBatchId: batchDetail.applyBatchId
					},
					notParam: true,
					url: "/app.assess/data/assessDataValueDefinition/getValueDefinition?applyBatchId="+batchDetail.applyBatchId,
					successCallback: function(data) {
						if (!data) {
							return false;
						}
						console.log(data) ;
						if (data.propertyScope && !formData.scopeProperty) {
							formData.scopeProperty = data.propertyScope;
						}
						if (data.scopeInclude && !formData.scopeInclude) {
							formData.scopeInclude = data.scopeInclude;
						}
						if (data.scopeNotInclude && !formData.scopeNotInclude) {
							formData.scopeNotInclude = data.scopeNotInclude;
						}
					}
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
				let houseData = this.houseData;
				let value = formData[name];
				switch (name) {
					case "informationType": {
						if (!value) {
							break;
						}
						let arr = _this.informationTypeList;
						let text = "";
						arr.forEach(function(item) {
							if (item.id == value) {
								text = item.name;
							}
						});
						if (text) {
							if (text != "公开信息") {
								_this.infomationTypeOtherFlag = true;
								_this.infomationTypeOpenFlag = false;
							} else {
								_this.infomationTypeOtherFlag = false;
								_this.infomationTypeOpenFlag = true;
							}
						}
						break;
					}
					case "priceConnotation": {
						if (!value) {
							break;
						}
						let arr = _this.priceConnotationList;
						let text = "";
						arr.forEach(function(item) {
							if (item.id == value) {
								text = item.name;
							}
						});
						if (text) {
							if (text == "建筑面积单价" || text == "套内面积单价") {
								_this.priceConnotationUnitFlag = false;
							} else {
								_this.priceConnotationUnitFlag = true;
							}
						}
						break;
					}
					case "transactionSituation": {
						if (!value) {
							break;
						}
						let arr = _this.transactionSituationList;
						let text = "";
						arr.forEach(function(item) {
							if (item.id == value) {
								text = item.name;
							}
						});
						if (text) {
							if (text.indexOf("不正常") != -1) {
								_this.descriptionHflag = true;
							} else {
								_this.descriptionHflag = false;
							}
						}
						break;
					}
					case "tradingType": {
						if (!value) {
							break;
						}
						estateCommonUtils.getDataDicInfo(value, function(item) {
							if (item.fieldName == AssessDicKey.examineHouseTransactionTypeSell) {
								_this.ExamineHouseTradingSellHflag = true;
								_this.ExamineHouseTradingLeaseHflag = false;
							} else if (item.fieldName == AssessDicKey.examineHouseTransactionTypeLease) {
								_this.ExamineHouseTradingSellHflag = false;
								_this.ExamineHouseTradingLeaseHflag = true;
							} else {
								_this.ExamineHouseTradingSellHflag = false;
								_this.ExamineHouseTradingLeaseHflag = false;
							}
						});
						break;
					}
					case "paymentMethod": {
						if (!value) {
							break;
						}
						estateCommonUtils.getDataDicInfo(value, function(item) {
							let key = item.fieldName;
							if (key == AssessDicKey.examineHousePaymentMethodInstallment) {
								_this.installmentInterestRateHflag = false;
							} else {
								_this.installmentInterestRateHflag = true;
							}
							if (key == AssessDicKey.examineHousePaymentMethodDisposable || key == AssessDicKey
								.examineHousePaymentMethodLeaseDisposable) {
								_this.tradingConditionHflag = false;
							} else {
								_this.tradingConditionHflag = true;
							}
						});
						break;
					}
					case "tradingTotalPrice": {
						let tempValue = formData.tradingUnitPrice;
						if (!tempValue) {
							let area = houseData.area;
							if (value && area) {
								tempValue = Number(value) / Number(area);
								formData.tradingUnitPrice = tempValue.toFixed(2);
							}
						}
						break;
					}
					case "tradingUnitPrice": {
						let tempValue = formData.tradingTotalPrice;
						if (!tempValue) {
							let area = houseData.area;
							if (utils.isNumber(value) && utils.isNumber(area)) {
								tempValue = Number(value) * Number(area);
								formData.tradingTotalPrice = tempValue.toFixed(2);
							}
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
					id: _this.id
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
						console.log(formData);
						_this.formData = formData;
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
				// this.$refs.form.setValue(dataInput,value) ;
			},
			setImgFieldsName(fieldsName) {
				let _this = this;
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let obj = {
					fieldsName: fieldsName + _this.id,
					tableId: _this.id,
					tableName: AssessDBKey.BasicHouseTrading,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
