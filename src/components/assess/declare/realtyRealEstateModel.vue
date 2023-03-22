<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">

			<slot name="head"></slot>

			<uni-group title="基本信息" mode="card">
				<assess-pick-regions ref="assessPickRegions" :provinceValue="formData.province"
					:cityValue="formData.city" :districtValue="formData.district" @getRegion="handleGetRegion">
				</assess-pick-regions>
				<uni-forms-item required name="certName" label="不动产权证号" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.certName" placeholder="不动产权证号">
					</uni-easyinput>
				</uni-forms-item>
				<view v-show="!bisDetail" class="uni-flex uni-row"
					style="-webkit-justify-content: center;justify-content: center;">
					<button @click.stop="warrantJoin()" type="primary" size="mini">
						自动拼接
					</button>
				</view>
				<uni-forms-item required name="location" label="所在地" label-align="right">
					<uni-easyinput type="text" v-model="formData.location" placeholder="所在地" />
				</uni-forms-item>
				<uni-forms-item required name="number" label="编号" label-align="right">
					<uni-easyinput type="text" v-model="formData.number" placeholder="编号" />
				</uni-forms-item>
				<uni-forms-item required name="year" label="年份" label-align="right">
					<uni-easyinput type="digit" v-model="formData.year" placeholder="年份" />
				</uni-forms-item>
				<uni-forms-item  name="realEstateUnitNumber" label="不动产单元号" label-align="right">
					<uni-easyinput type="text" v-model="formData.realEstateUnitNumber" placeholder="不动产单元号" />
				</uni-forms-item>
				<uni-forms-item required name="ownership" label="房屋所有权人" label-align="right">
					<uni-easyinput type="text" v-model="formData.ownership" placeholder="房屋所有权人" />
				</uni-forms-item>
				<uni-forms-item required name="publicSituation" label="共有情况" label-align="right">
					<assess-picker :dataInput="'publicSituation'" :dataList="publicSituationList"
						:dataValue="formData.publicSituation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="publicSituationRemark" label="共有情况说明" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.publicSituationRemark"
						placeholder="共有情况说明">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  name="registrationTime" label="登记日期" label-align="right">
					<uni-datetime-picker type="date" :value="formData.registrationTime"
						v-on:change="setFormValue('registrationTime',$event)"></uni-datetime-picker>
				</uni-forms-item>
			</uni-group>

			<uni-group title="坐落信息" mode="card">
				<view v-if="bisShowBeLocated">
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
				</view>
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

			<uni-group title="房屋信息" mode="card">
				<uni-forms-item  name="housingStructure" label="房屋结构" label-align="right">
					<uni-easyinput type="text" v-model="formData.housingStructure" placeholder="房屋结构" />
				</uni-forms-item>
				<uni-forms-item required name="houseCertUse" label="房屋用途类型" label-align="right">
					<select-input :dataValue="formData.houseCertUse" :dataInput="'houseCertUse'"
						:selectDatas="houseCertUseNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="houseCertUseCategory" label="房屋用途类别" label-align="right">
					<select-input :dataValue="formData.houseCertUseCategory" :dataInput="'houseCertUseCategory'"
						:selectDatas="houseCertUseCategoryNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="nature" label="房屋性质" label-align="right">
					<assess-picker :dataInput="'nature'" :dataList="natureList" :dataValue="formData.nature"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="evidenceArea" label="证载面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.evidenceArea" placeholder="证载面积" />
				</uni-forms-item>
				<uni-forms-item  name="innerArea" label="套内面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.innerArea" placeholder="套内面积" />
				</uni-forms-item>
				<uni-forms-item  name="apportionmentArea" label="公摊面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.apportionmentArea" placeholder="公摊面积" />
				</uni-forms-item>
				<uni-forms-item  name="other" label="其它(房屋)" label-align="right">
					<uni-easyinput type="text" v-model="formData.other" placeholder="其它(房屋)" />
				</uni-forms-item>
				<uni-forms-item  name="otherNote" label="附记其它" label-align="right">
					<uni-easyinput type="text" v-model="formData.otherNote" placeholder="附记其它" />
				</uni-forms-item>
				<uni-forms-item  name="floorCount" label="总层数" label-align="right">
					<uni-easyinput type="digit" v-model="formData.floorCount" placeholder="总层数" />
				</uni-forms-item>
			</uni-group>

			<uni-group title="土地信息" mode="card">
				<uni-forms-item required name="acquisitionType" label="土地取得方式" label-align="right">
					<assess-picker :dataInput="'acquisitionType'" :dataList="acquisitionTypeList"
						:dataValue="formData.acquisitionType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="acquisitionPrice" label="土地取得价格" label-align="right">
					<uni-easyinput type="text" v-model="formData.acquisitionPrice" placeholder="土地取得价格" />
				</uni-forms-item>
				<uni-forms-item required name="landCertUse" label="土地用途类型" label-align="right">
					<select-input :dataValue="formData.landCertUse" :dataInput="'landCertUse'"
						:selectDatas="landCertUseNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="landCertUseCategory" label="土地用途类别" label-align="right">
					<select-input :dataValue="formData.landCertUseCategory" :dataInput="'landCertUseCategory'"
						:selectDatas="landCertUseCategoryNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="landRightNature" label="土地权利性质" label-align="right">
					<assess-picker :dataInput="'landRightNature'" :dataList="landRightNatureList"
						:dataValue="formData.landRightNature" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item  name="useRightArea" label="共用宗地面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.useRightArea" placeholder="共用宗地面积" />
				</uni-forms-item>

				<uni-forms-item required name="landRightType" label="权利类型" label-align="right">
					<assess-picker :dataInput="'landRightType'" :dataList="landRightTypeList"
						:dataValue="formData.landRightType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="landApportionArea" label="土地分摊面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.landApportionArea" placeholder="土地分摊面积" />
				</uni-forms-item>
				<uni-forms-item  name="useStartDate" label="土地使用年限起" label-align="right">
					<uni-datetime-picker type="date" :value="formData.useStartDate"
						v-on:change="setFormValue('useStartDate',$event)"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item  name="useEndDate" label="土地使用年限止" label-align="right">
					<uni-datetime-picker type="date" :value="formData.useEndDate"
						v-on:change="setFormValue('useEndDate',$event)"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item required name="registrationAuthority" label="登记机关" label-align="right">
					<uni-easyinput type="text" v-model="formData.registrationAuthority" placeholder="登记机关" />
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
		'province',
		'city',
		'district',
		':certName',
		':location',
		':number',
		':year',
		'realEstateUnitNumber',
		':ownership',
		':publicSituation',
		'publicSituationRemark',
		'registrationTime',
		':streetNumber',
		'attachedNumber',
		':buildingNumber',
		'unit',
		'floor',
		'roomNumber',
		':beLocated',
		'housingStructure',
		':houseCertUse',
		':houseCertUseCategory',
		':nature',
		':evidenceArea',
		'innerArea',
		'apportionmentArea',
		'other',
		'otherNote',
		'floorCount',
		':acquisitionType',
		'acquisitionPrice',
		':landCertUse',
		':landCertUseCategory',
		':landRightNature',
		'useRightArea',
		':landRightType',
		':landApportionArea',
		'useStartDate',
		'useEndDate',
		':registrationAuthority',
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
			},
			bisShowBeLocated: {
				type: [Boolean],
				default: true
			}
		},
		data() {
			// 多选框 必须包含 text和value
			return {
				houseCertUseList: [],
				houseCertUseCategoryList: [],
				houseCertUseNameList: [],
				houseCertUseCategoryNameList: [],
				landCertUseList: [],
				landCertUseCategoryList: [],
				landCertUseNameList: [],
				landCertUseCategoryNameList: [],
				publicSituationList: [],
				natureList: [],
				acquisitionTypeList: [],
				landRightNatureList: [],
				landRightTypeList: [],
				formData: {
					id: "",
					landCertGetQuestion: "",
					province: "",
					city: "",
					district: "",
					certName: "",
					location: "",
					number: "",
					year: "",
					realEstateUnitNumber: "",
					ownership: "",
					publicSituation: "",
					publicSituationRemark: "",
					registrationTime: "",
					streetNumber: "",
					attachedNumber: "",
					buildingNumber: "",
					unit: "",
					floor: "",
					roomNumber: "",
					beLocated: "",
					housingStructure: "",
					houseCertUse: "",
					houseCertUseCategory: "",
					nature: "",
					evidenceArea: "",
					innerArea: "",
					apportionmentArea: "",
					other: "",
					otherNote: "",
					floorCount: "",
					acquisitionType: "",
					acquisitionPrice: "",
					landCertUse: "",
					landCertUseCategory: "",
					landRightNature: "",
					useRightArea: "",
					landRightType: "",
					landApportionArea: "",
					useStartDate: "",
					useEndDate: "",
					registrationAuthority: "",
					memo: ""
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
				let url = "/app.assess/declare/declareRealtyRealEstateCert/saveAndUpdate";
				if (this.bisCenter) {
					url = "/app.assess/declare/declareRealtyRealEstateCert/saveAndUpdateCenter";
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

				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareCommonSituation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.publicSituationList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareLandCertificateType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightTypeList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareUseRightType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightNatureList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareRoomType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.natureList = resultData;
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareAcquisitionType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.acquisitionTypeList = resultData;
				});

				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseLoadUtility, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.houseCertUseList = resultData.reverse();
					let arr = [];
					data.houseCertUseList.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.houseCertUseNameList = arr;
					_this.changeLoadData("houseCertUse");
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_total_land_use, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.landCertUseList = resultData.reverse();
					let arr = [];
					data.landCertUseList.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.landCertUseNameList = arr;
					_this.changeLoadData("landCertUse");
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
					case "houseCertUse": {
						let houseCertUseList = this.houseCertUseList;
						let tempId = "";
						if (utils.isNotEmptyString(value)) {
							houseCertUseList.forEach(function(item) {
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
							data.houseCertUseCategoryList = resultData;
							let arr = [];
							resultData.forEach(function(item) {
								arr.unshift(item.name);
							});
							data.houseCertUseCategoryNameList = arr;
						});
						break;
					}
					case "landCertUse": {
						let landCertUseList = this.landCertUseList;
						let tempId = "";
						if (utils.isNotEmptyString(value)) {
							landCertUseList.forEach(function(item) {
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
							data.landCertUseCategoryList = resultData.reverse();
							let arr = [];
							data.landCertUseCategoryList.forEach(function(item) {
								arr.unshift(item.name);
							});
							data.landCertUseCategoryNameList = arr;
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
					url: "/app.assess/declare/declareRealtyRealEstateCert/getById?" + utils.parseParam(query),
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
				let temp = '';
				let objHandle = {
					run: function() {
						temp = declareCommon.warrantJoin(formData, "real", function(v) {
							if (v) {
								_this.formData.certName = v;
							}
						});
					}
				};
				if (formData.province) {
					assessCommonUtils.assessCommon.getSysAreaDto(formData.province, function(areaData) {
						_this.formData.provinceName = areaData.name;
						objHandle.run();
					});
				} else {
					objHandle.run();
				}
				if (temp) {
					this.formData.certName = temp;
				}
			}
		}
	}
</script>

<style>

</style>
