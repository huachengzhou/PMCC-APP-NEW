<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<slot name="head"></slot>
			<uni-group title="基本信息" mode="card">
				<assess-pick-regions ref="assessPickRegions" :provinceValue="formData.province"
					:cityValue="formData.city" :districtValue="formData.district" @getRegion="handleGetRegion">
				</assess-pick-regions>
				<uni-forms-item required name="location" label="所在地" label-align="right">
					<uni-easyinput type="text" v-model="formData.location" placeholder="所在地" />
				</uni-forms-item>
				<uni-forms-item required name="landRightType" label="类型" label-align="right">
					<assess-picker :dataInput="'landRightType'" :dataList="landRightTypeList"
						:dataValue="formData.landRightType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="year" label="年份" label-align="right">
					<uni-easyinput type="text" v-model="formData.year" placeholder="年份" />
				</uni-forms-item>
				<uni-forms-item  name="number" label="编号" label-align="right">
					<uni-easyinput type="text" v-model="formData.number" placeholder="编号" />
				</uni-forms-item>
				<uni-forms-item required name="ownership" label="土地使用权人" label-align="right">
					<uni-easyinput type="text" v-model="formData.ownership" placeholder="土地使用权人" />
				</uni-forms-item>
				<uni-forms-item required name="publicSituation" label="共有情况" label-align="right">
					<assess-picker :dataInput="'publicSituation'" :dataList="publicSituationList"
						:dataValue="formData.publicSituation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="landCertName" label="土地权证号" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.landCertName" placeholder="土地权证号">
					</uni-easyinput>
				</uni-forms-item>
				<view v-show="!bisDetail" class="uni-flex uni-row"
					style="-webkit-justify-content: center;justify-content: center;">
					<button @click.stop="warrantJoin()" type="primary" size="mini">
						自动拼接
					</button>
				</view>
				<uni-forms-item  name="publicSituationRemark" label="共有情况说明" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.publicSituationRemark"
						placeholder="共有情况说明">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  name="registrationDate" label="登记日期" label-align="right">
					<uni-datetime-picker type="date" :value="formData.registrationDate"
						v-on:change="setFormValue('registrationDate',$event)"></uni-datetime-picker>
				</uni-forms-item>
			</uni-group>

			<uni-group title="坐落信息" mode="card">
				<uni-forms-item required name="streetNumber" label="街道号" label-align="right">
					<uni-easyinput type="text" v-model="formData.streetNumber" placeholder="街道号" />
				</uni-forms-item>
				<uni-forms-item  name="attachedNumber" label="附号" label-align="right">
					<uni-easyinput type="text" v-model="formData.attachedNumber" placeholder="附号" />
				</uni-forms-item>
				<uni-forms-item required name="buildingNumber" label="栋号" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingNumber" placeholder="栋号" />
				</uni-forms-item>
				<uni-forms-item  name="unit" label="单元" label-align="right">
					<uni-easyinput type="text" v-model="formData.unit" placeholder="单元" />
				</uni-forms-item>
				<uni-forms-item  name="floor" label="楼层" label-align="right">
					<uni-easyinput type="text" v-model="formData.floor" placeholder="楼层" />
				</uni-forms-item>
				<uni-forms-item  name="roomNumber" label="房号" label-align="right">
					<uni-easyinput type="text" v-model="formData.roomNumber" placeholder="房号" />
				</uni-forms-item>
				<uni-forms-item required name="beLocated" label="坐落" label-align="right">
					<uni-easyinput type="text" v-model="formData.beLocated" placeholder="坐落" />
				</uni-forms-item>
				<view v-show="!bisDetail" class="uni-flex uni-row"
					style="-webkit-justify-content: center;justify-content: center;">
					<button @click.stop="seatJoin()" type="primary" size="mini">
						自动拼接
					</button>
				</view>
			</uni-group>

			<uni-group mode="card">
				<uni-forms-item  name="landNumber" label="地号" label-align="right">
					<uni-easyinput type="text" v-model="formData.landNumber" placeholder="地号" />
				</uni-forms-item>
				<uni-forms-item  name="graphNumber" label="图号" label-align="right">
					<uni-easyinput type="text" v-model="formData.graphNumber" placeholder="图号" />
				</uni-forms-item>
				<uni-forms-item required name="certUse" label="土地用途类型" label-align="right">
					<select-input :dataValue="formData.certUse" :dataInput="'certUse'" :selectDatas="certUseNameList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="certUseCategory" label="土地用途类别" label-align="right">
					<select-input :dataValue="formData.certUseCategory" :dataInput="'certUseCategory'"
						:selectDatas="certUseCategoryNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item  name="acquisitionPrice" label="取得价格" label-align="right">
					<uni-easyinput type="text" v-model="formData.acquisitionPrice" placeholder="取得价格" />
				</uni-forms-item>
				<uni-forms-item required name="landRightNature" label="权利性质" label-align="right">
					<assess-picker :dataInput="'landRightNature'" :dataList="landRightNatureList"
						:dataValue="formData.landRightNature" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="terminationDate" label="终止日期" label-align="right">
					<uni-datetime-picker type="date" :value="formData.terminationDate"
						v-on:change="setFormValue('terminationDate',$event)"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item required name="acquisitionType" label="土地取得方式" label-align="right">
					<assess-picker :dataInput="'acquisitionType'" :dataList="acquisitionTypeList"
						:dataValue="formData.acquisitionType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="registrationAuthority" label="登记机关" label-align="right">
					<uni-easyinput type="text" v-model="formData.registrationAuthority" placeholder="登记机关" />
				</uni-forms-item>
				<uni-forms-item  name="useRightArea" label="使用权面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.useRightArea" placeholder="使用权面积" />
				</uni-forms-item>
				<uni-forms-item name="eastToName" label="四至(1)" label-align="right">
					<select-input :dataValue="formData.eastToName" :dataInput="'eastToName'"
						:selectDatas="eastToNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item  name="eastTo" label="四至(1)" label-align="right">
					<uni-easyinput type="text" v-model="formData.eastTo" placeholder="四至(1)" />
				</uni-forms-item>
				<uni-forms-item name="southToName" label="四至(2)" label-align="right">
					<select-input :dataValue="formData.southToName" :dataInput="'southToName'"
						:selectDatas="southToNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item  name="southTo" label="四至(2)" label-align="right">
					<uni-easyinput type="text" v-model="formData.southTo" placeholder="四至(2)" />
				</uni-forms-item>
				<uni-forms-item name="westToName" label="四至(3)" label-align="right">
					<select-input :dataValue="formData.westToName" :dataInput="'westToName'"
						:selectDatas="westToNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item  name="westTo" label="四至(3)" label-align="right">
					<uni-easyinput type="text" v-model="formData.westTo" placeholder="四至(3)" />
				</uni-forms-item>
				<uni-forms-item name="northToName" label="四至(4)" label-align="right">
					<select-input :dataValue="formData.northToName" :dataInput="'northToName'"
						:selectDatas="northToNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item  name="northTo" label="四至(4)" label-align="right">
					<uni-easyinput type="text" v-model="formData.northTo" placeholder="四至(4)" />
				</uni-forms-item>
				<uni-forms-item  name="memo" label="记事" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.memo" placeholder="记事">
					</uni-easyinput>
				</uni-forms-item>
			</uni-group>

			<slot name="foot"></slot>
		</uni-forms>

		<view class="uni-flex uni-row " style="width: 100%;" v-show="!bisDetail">
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
</template>

<script>
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";
	import * as utils from "@/common/untils.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as Explore from '@/common/assess/Explore.key.js';

	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import assessPickRegions from '@/components/assess/common/regions/assess-pick-regions.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;
	var declareCommon = declareCommonUtils.declareCommon;

	let ruleField = [
		':province',
		':city',
		'district',
		':location',
		':landRightType',
		':year',
		'number',
		':ownership',
		':publicSituation',
		':landCertName',
		'publicSituationRemark',
		'registrationDate',
		':streetNumber',
		'attachedNumber',
		':buildingNumber',
		'unit',
		'floor',
		'roomNumber',
		':beLocated',
		'landNumber',
		'graphNumber',
		':certUse',
		':certUseCategory',
		'acquisitionPrice',
		':landRightNature',
		'terminationDate',
		':acquisitionType',
		':registrationAuthority',
		'useRightArea',
		'eastTo',
		'eastToName',
		'southTo',
		'southToName',
		'westTo',
		'westToName',
		'northTo',
		'northToName',
		'memo',
	];

	let rules = utils.getRules(ruleField);
	let formDataFields = utils.getFormDataField(ruleField);
	Object.assign(formDataFields, {});

	export default {
		props: {
			dataId: {
				type: [Number, String],
				default: ""
			},
			bisCenter: {
				type: [Boolean],
				default: false
			},
			bisDetail: {
				type: [Boolean],
				default: true
			},
			dataObj: {
				type: [Object],
				default: function() {
					return {};
				}
			},
			controlParam: {
				type: [Object],
				default: function() {
					return {};
				}
			}
		},
		data() {
			// 多选框 必须包含 text和value
			return {
				certUseList: [],
				certUseNameList: [],
				certUseCategoryList: [],
				certUseCategoryNameList: [],
				landRightTypeList: [],
				publicSituationList: [],
				landRightNatureList: [],
				acquisitionTypeList: [],
				eastToNameList: ["东至", "东南", "东北"],
				southToNameList: ["南至", "东南", "西南"],
				westToNameList: ["西至", "西南", "西北"],
				northToNameList: ["北至", "东北", "西北"],
				formData: {
					id: "",
					landCertGetQuestion: "",
					province: "",
					city: "",
					district: "",
					location: "",
					landRightType: "",
					year: "",
					number: "",
					ownership: "",
					publicSituation: "",
					landCertName: "",
					publicSituationRemark: "",
					registrationDate: "",
					streetNumber: "",
					attachedNumber: "",
					buildingNumber: "",
					unit: "",
					floor: "",
					roomNumber: "",
					beLocated: "",
					landNumber: "",
					graphNumber: "",
					certUse: "",
					certUseCategory: "",
					acquisitionPrice: "",
					landRightNature: "",
					terminationDate: "",
					acquisitionType: "",
					registrationAuthority: "",
					useRightArea: "",
					eastTo: "",
					eastToName: "",
					southTo: "",
					southToName: "",
					westTo: "",
					westToName: "",
					northTo: "",
					northToName: "",
					memo: "",
				},
				rules: rules
			};
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
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker,
			"select-input": selectInput,
			"common-file-picker": commonFilePicker,
			"assess-pick-regions": assessPickRegions,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			submit(data, commitFlag) {
				var _this = this;
				data = utils.assignObj(data, _this.controlParam);
				let url = "/app.assess/declare/declareRealtyLandCert/saveAndUpdate";
				if (this.bisCenter) {
					url = "/app.assess/declare/declareRealtyLandCert/saveAndUpdateCenter";
				}
				let option = {
					url: url,
					showLoading: true,
					query: data,
					successCallback: function(resultData) {
						uni.showToast({
							title: '保存成功',
							success() {
								_this.formData.id = resultData.id;
								_this.$emit("submit", {
									data: resultData,
									commitFlag: commitFlag
								});
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				let formData = this.formData;
				this.$refs.form.validate().then((res) => {
					//特殊处理一些兼容性东西
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(formData, {
						creator: userInfo.userAccount,
					});
					console.log('表单返回得值：', data);
					_this.submit(formData, true);
				});
			},
			submitTempForm(form) {
				// 手动提交表单
				var _this = this;
				let formData = this.formData;
				//特殊处理一些兼容性东西
				let userInfo = _this.$helper.fetchLocalUser();
				let data = utils.assignObj(formData, {
					creator: userInfo.userAccount,
				});
				console.log('表单返回得值：', data);
				_this.submit(formData, false);
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
				this.$nextTick(() => {
					this.$refs.assessPickRegions.init();
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareLandCertificateType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightTypeList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareCommonSituation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.publicSituationList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareUseRightType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightNatureList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareAcquisitionType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.acquisitionTypeList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_total_land_use, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.certUseList = resultData.reverse();
					let arr = [];
					data.certUseList.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.certUseNameList = arr;
					_this.changeLoadData("certUse");
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
					case "certUse": {
						let certUseList = this.certUseList;
						let tempId = "";
						if (utils.isNotEmptyString(value)) {
							certUseList.forEach(function(item) {
								if (item.name == value) {
									tempId = item.id;
								}
							});
						}
						if (!tempId) {
							return false;
						}
						assessCommonUtils.getDataDicListByPid(tempId, function(resultData) {
							if (!resultData) {
								return false;
							}
							data.certUseCategoryList = resultData.reverse();
							let arr = [];
							data.certUseCategoryList.forEach(function(item) {
								arr.unshift(item.name);
							});
							data.certUseCategoryNameList = arr;
						});
						break;
					}
					default: {
						break;
					}
				}
			},
			setServerData: function() {
				let _this = this;
				let formData = this.formData;
				let query = {
					id: _this.dataId
				};
				if (!query.id) {
					this.initListData();
					return false;
				}
				let option = {
					query: query,
					notParam: true,
					url: "/app.assess/declare/declareRealtyLandCert/getById?" + utils.parseParam(query),
					successCallback: function(resultData) {
						if (!resultData) {
							return false;
						}
						// var keys = Object.keys(formData);
						// for (var i = 0; i < keys.length; i++) {
						// 	var key = keys[i];
						// 	var value = formData[key];
						// 	formData[key] = resultData[key];
						// }
						// _this.formData = formData;
						_this.setServerValue(resultData);
						_this.initListData();
					}
				};
				utils.requestDefault(option);
			},
			setServerValue(resultData){
				let formData = this.formData;
				if (!resultData) {
					return false;
				}
				var keys = Object.keys(formData);
				var keyAll = Object.keys(resultData);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					if(keyAll.indexOf(key) == -1) {
						continue;
					}
					var value = formData[key];
					formData[key] = resultData[key];
				}
				this.formData = formData;
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
			handleGetRegion(regions) {
				if (!regions) {
					return false;
				}
				if (regions.province) {
					this.formData.province = regions.province;
				}
				if (regions.city) {
					this.formData.city = regions.city;
				}
				if (regions.district) {
					this.formData.district = regions.district;
				}
			},
			seatJoin() {
				let formData = this.formData;
				let temp = declareCommon.seatJoin(formData);
				if (temp) {
					this.formData.beLocated = temp;
				}
			},
			warrantJoin() {
				let formData = this.formData;
				let _this = this;
				let temp = declareCommon.warrantJoin(formData, "land", function(v) {
					if (v) {
						_this.formData.landCertName = v;
					}
				});
				if (temp) {
					this.formData.landCertName = temp;
				}
			}
		}
	}
</script>

<style>

</style>
