<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="buildingNumber" label="名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingNumber" placeholder="名称" />
				</uni-forms-item>
				<uni-forms-item required name="propertyTypeName" label="物业类型" label-align="right">
					<select-input :dataValue="formData.propertyTypeName" :dataInput="'propertyTypeName'"
						:selectDatas="propertyTypeNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="propertyCategoryName" label="物业档次" label-align="right">
					<select-input :dataValue="formData.propertyCategoryName" :dataInput="'propertyCategoryName'"
						:selectDatas="propertyCategoryNameList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item required name="buildingStructureType" label="建筑结构类型" label-align="right">
					<assess-picker :dataInput="'buildingStructureType'" :dataList="buildingStructureTypeList"
						:dataValue="formData.buildingStructureType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="buildingStructureCategory" label="建筑结构类别" label-align="right">
					<assess-picker :dataInput="'buildingStructureCategory'" :dataList="buildingStructureCategoryList"
						:dataValue="formData.buildingStructureCategory" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="unitCount" label="单元数" label-align="right">
					<uni-easyinput type="text" v-model="formData.unitCount" placeholder="单元数" />
				</uni-forms-item>


				<uni-forms-item required name="reference" label="楼栋所在位置" label-align="right">
					<select-input :dataValue="formData.reference" :dataInput="'reference'" :selectDatas="referenceList"
						@dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item required name="orientation" label="楼栋所在位置" label-align="right">
					<select-input :dataValue="formData.orientation" :dataInput="'orientation'"
						:selectDatas="orientationList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item required name="floorHeight" label="层高" label-align="right">
					<uni-easyinput type="text" v-model="formData.floorHeight" placeholder="层高" />
				</uni-forms-item>
				<uni-forms-item required name="buildingHeight" label="建筑高度" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingHeight" placeholder="建筑高度" />
				</uni-forms-item>

				<view v-if="homeParam.type == 0">
					<uni-forms-item name="residenceUseYear" label="建筑使用年限" label-align="right">
						<assess-picker :dataInput="'residenceUseYear'" :dataList="residenceUseYearList"
							:dataValue="formData.residenceUseYear" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>
				</view>

				<view v-if="homeParam.type == 1">
					<uni-forms-item name="industryUseYear" label="建筑使用年限" label-align="right">
						<assess-picker :dataInput="'industryUseYear'" :dataList="industryUseYearList"
							:dataValue="formData.industryUseYear" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>
				</view>


				<uni-forms-item name="appearanceStyle" label="外观风格" label-align="right">
					<assess-picker :dataInput="'appearanceStyle'" :dataList="appearanceStyleList"
						:dataValue="formData.appearanceStyle" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="appearanceNewAndOld" label="外观新旧" label-align="right">
					<assess-picker :dataInput="'appearanceNewAndOld'" :dataList="appearanceNewAndOldList"
						:dataValue="formData.appearanceNewAndOld" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="betweenDistance" label="楼间距" label-align="right">
					<assess-picker :dataInput="'betweenDistance'" :dataList="betweenDistanceList"
						:dataValue="formData.betweenDistance" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="minimumFloorDistance" label="最小楼间距倍数" label-align="right">
					<uni-easyinput type="text" v-model="formData.minimumFloorDistance" placeholder="最小楼间距倍数" />
				</uni-forms-item>

				<uni-forms-item name="openTime" label="开盘时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.openTime"
						v-on:change="setFormValue('openTime',$event)"></uni-datetime-picker>
				</uni-forms-item>


				<uni-forms-item name="completedTimeType" label="竣工资料获取方式" label-align="right">
					<assess-picker :dataInput="'completedTimeType'" :dataList="completedTimeTypeList"
						:dataValue="formData.completedTimeType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="beCompletedTime" label="竣工时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.beCompletedTime"
						v-on:change="setFormValue('beCompletedTime',$event)"></uni-datetime-picker>
				</uni-forms-item>


				<uni-forms-item name="constructionQuality" label="工程质量" label-align="right">
					<assess-picker :dataInput="'constructionQuality'" :dataList="constructionQualityList"
						:dataValue="formData.constructionQuality" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="propertyFee" label="物业费(平方米)" label-align="right">
					<uni-easyinput type="text" v-model="formData.propertyFee" placeholder="物业费(平方米)" />
				</uni-forms-item>


				<uni-forms-item name="facilitiesUseFee" label="配套公共设施使用费" label-align="right">
					<uni-easyinput type="text" v-model="formData.facilitiesUseFee" placeholder="配套公共设施使用费" />
				</uni-forms-item>


				<uni-forms-item name="streetInfoId" label="街道号" label-align="right">
					<assess-picker :dataInput="'streetInfoId'" :dataList="streetInfoIdList"
						:dataValue="formData.streetInfoId" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="pastName" label="曾用名(过去名称)" label-align="right">
					<uni-easyinput type="text" v-model="formData.pastName" placeholder="曾用名(过去名称)">
					</uni-easyinput>
				</uni-forms-item>
				
				<view v-for="(fieldData,index_f) in tableFields">
					<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
						<common-image-picker 
							:dataObj="setImgFieldsName(fieldData.fieldName)">
						</common-image-picker>
					</uni-forms-item>
				</view>

				

			</uni-group>


			<uni-group title="补充信息" mode="card">
				<uni-forms-item name="landUseYear" label="土地使用年限" label-align="right">
					<uni-easyinput type="text" v-model="formData.landUseYear" placeholder="土地使用年限" />
				</uni-forms-item>
				<uni-forms-item name="coverAnArea" label="占地面积(平方米)" label-align="right">
					<uni-easyinput type="text" v-model="formData.coverAnArea" placeholder="占地面积(平方米)" />
				</uni-forms-item>
				<uni-forms-item name="builderName" label="建筑公司" label-align="right">
					<uni-easyinput type="text" v-model="formData.builderName" placeholder="建筑公司" />
				</uni-forms-item>

				<uni-forms-item name="propertyServiceType" label="物业服务类型" label-align="right">
					<assess-picker :dataInput="'propertyServiceType'" :dataList="propertyServiceTypeList"
						:dataValue="formData.propertyServiceType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item v-show="propertyServiceTypeFlag" name="propertyCompanyNature" label="物业公司性质"
					label-align="right">
					<assess-picker :dataInput="'propertyCompanyNature'" :dataList="propertyCompanyNatureList"
						:dataValue="formData.propertyCompanyNature" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item v-show="propertyServiceTypeFlag" name="propertySocialPrestige" label="物业公司社会信誉"
					label-align="right">
					<assess-picker :dataInput="'propertySocialPrestige'" :dataList="propertySocialPrestigeList"
						:dataValue="formData.propertySocialPrestige" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item v-show="propertyServiceTypeFlag" name="propertyName" label="物业公司名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.propertyName" placeholder="物业公司名称" />
				</uni-forms-item>
			</uni-group>

		</uni-forms>

		<uni-group title="其它信息" mode="card">
			<button style="margin-top: 1rpx;margin-left: 8rpx;" type="primary" size="mini"
				@click="openMapView">地图标注</button>
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
					<button @click.stop="submitTempForm(false)">
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

	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	import assessBasicHouseFootNav from '@/components/assess/basic/assess-basic-house-foot-nav/assess-basic-house-foot-nav.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	// 多选框 必须包含 text和value
	let thisViewData = {
		transferId: '',
		homeParam: {},
		tableFields: [],
		commitFlag: false,
		propertyServiceTypeFlag: true,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		cardObj: null,
		batchDetail: {},
		propertyServiceTypeList: [],
		buildingStructureTypeList: [],
		buildingStructureCategoryList: [],
		propertyTypeNameList: [],
		propertyTypeList: [],
		propertyCategoryList: [],
		propertyCategoryNameList: [],
		referenceList: ['楼盘内', '楼盘大门'],
		orientationList: ['左面', '右面', '南面', '北面', '东面', '西面', '东北', '东北面', '东南面', '西南面', '西北面'],
		residenceUseYearList: [],
		appearanceStyleList: [],
		appearanceNewAndOldList: [],
		betweenDistanceList: [],
		completedTimeTypeList: [],
		constructionQualityList: [],
		streetInfoIdList: [],
		propertyCompanyNatureList: [],
		propertySocialPrestigeList: [],
		industryUseYearList: [],
		formData: {
			id: '0',
			buildingNumber: "",
			propertyTypeName: "",
			propertyCategoryName: "",
			buildingStructureType: "",
			buildingStructureCategory: "",
			unitCount: "",
			reference: "",
			orientation: "",
			floorHeight: "",
			buildingHeight: "",
			residenceUseYear: "",
			appearanceStyle: "",
			appearanceNewAndOld: "",
			betweenDistance: "",
			minimumFloorDistance: "",
			openTime: "",
			completedTimeType: "",
			beCompletedTime: "",
			constructionQuality: "",
			propertyFee: "",
			facilitiesUseFee: "",
			streetInfoId: "",
			landUseYear: "",
			industryUseYear: "",
			coverAnArea: "",
			builderName: "",
			propertyCompanyNature: "",
			propertySocialPrestige: "",
			propertyName: "",
			propertyServiceType: "",
			pastName: ""
		},
		loading: false,
		firstIndex: 0,
		rules: {
			buildingNumber: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			propertyTypeName: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			propertyCategoryName: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			buildingStructureType: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			buildingStructureCategory: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			unitCount: {
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
			floorHeight: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			buildingHeight: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			residenceUseYear: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			industryUseYear: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			appearanceStyle: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			appearanceNewAndOld: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			betweenDistance: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			minimumFloorDistance: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			openTime: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			completedTimeType: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			beCompletedTime: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			constructionQuality: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			propertyFee: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			facilitiesUseFee: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			streetInfoId: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			landUseYear: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			coverAnArea: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			builderName: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			propertyCompanyNature: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			propertySocialPrestige: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			propertyName: {
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
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			//目的是防止多次点击还在同一页面
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let delta = 0;
			for (let i = 0; i < pages.length; i++) {
				let page = pages[i];
				if (page.route == nowPage.route) {
					delta = i;
					break;
				}
			}
			delta = pages.length - delta ;
			console.log("totalSize:" + pages.length + " delta:" + delta + " route:" + nowPage.route);
			uni.navigateBack({
				delta: delta
			});
			return true;
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
			"common-file-picker": commonFilePicker,
			"select-input": selectInput,
			"assess-basic-house-foot-nav": assessBasicHouseFootNav,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			submit(data, commitFlag) {
				var _this = this;
				let option = {
					url: _this.cardObj.saveAndUpdateUrl,
					showLoading: true,
					query: data,
					successCallback: function(resultData) {
						if (utils.getType(commitFlag) != 'boolean') {
							return false;
						}
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
			submitTempForm(commitFlag) {
				var _this = this;
				let batchDetail = this.batchDetail;
				let res = this.formData;
				let userInfo = _this.$helper.fetchLocalUser();
				let data = utils.assignObj(res, {
					creator: userInfo.userAccount,
					id: _this.formData.id
				});
				console.log('表单返回得值：', data);
				let infoData = {
					basicBuilding: data
				};
				let coreData = {
					applyBatchDetailId: batchDetail.id,
					formData: JSON.stringify(infoData),
					formClassify: batchDetail.type,
					planDetailsId: batchDetail.planDetailsId
				};
				console.log(coreData);
				_this.submit(coreData, commitFlag);
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
					let infoData = {
						basicBuilding: data
					};
					let coreData = {
						applyBatchDetailId: batchDetail.id,
						formData: JSON.stringify(infoData),
						formClassify: batchDetail.type,
						planDetailsId: batchDetail.planDetailsId
					};
					console.log(coreData);
					_this.submit(coreData, true);
				});
			},
			initListData: function() {
				var _this = this;
				let data = this.$data;
				this.changeLoadData("buildingStructureType");
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_property_structure, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.buildingStructureTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_residence_data, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.residenceUseYearList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_appearance_style, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.appearanceStyleList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_appearance_new_and_old, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.appearanceNewAndOldList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_between_distance, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.betweenDistanceList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.completed_time_type, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.completedTimeTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_construction_quality, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.constructionQualityList = resultData;
				});
				estateCommonUtils.getBuilderEstateStreetInfoList(_this.batchDetail, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let tempArr = [];
					resultData.forEach(function(item) {
						let obj = {};
						obj.name = item.streetNumber;
						obj.id = item.id;
						tempArr.push(obj);
					});
					data.streetInfoIdList = tempArr;
				});
				estateCommonUtils.getUnitPropertiesList(function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.propertyCompanyNatureList = resultData;
				});
				estateCommonUtils.getBuildingNewRateList(function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let tempArr = [];
					resultData.forEach(function(item) {
						let obj = {};
						if (item.buildingStructure) {
							obj.name = item.buildingStructure;
						} else if (item.buildingUseName) {
							obj.name = item.buildingUseName;
						}
						obj.id = item.id;
						tempArr.push(obj);
					});
					data.industryUseYearList = tempArr;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.data_company_reputation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.propertySocialPrestigeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_propertyServiceType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.propertyServiceTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_building_property_type, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.propertyTypeList = resultData;
					let arr = [];
					resultData.forEach(function(item) {
						arr.unshift(item.name);
					});
					data.propertyTypeNameList = arr;
					_this.changeLoadData("propertyTypeName");
				});
				assessCommonUtils.loadAllChildDataDicList('basicBuilding', function(
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
					case "buildingStructureType": {
						estateCommonUtils.getDataDicListByPid(value, function(resultData) {
							if (!resultData) {
								return false;
							}
							data.buildingStructureCategoryList = resultData;
						});
						break;
					}
					case "propertyTypeName": {
						let propertyTypeList = this.propertyTypeList;
						let tempId = "";
						if (utils.isNotEmptyString(value)) {
							propertyTypeList.forEach(function(item) {
								if (item.name == value) {
									tempId = item.id;
								}
							});
						}
						if (!tempId) {
							return false;
						}
						estateCommonUtils.getDataDicListByPid(tempId, function(resultData) {
							if (!resultData) {
								return false;
							}
							data.propertyCategoryList = resultData;
							let arr = [];
							resultData.forEach(function(item) {
								arr.unshift(item.name);
							});
							data.propertyCategoryNameList = arr;
						});
						break;
					}
					case "propertyServiceType": {
						let list = this.propertyServiceTypeList;
						if (value) {
							var newArr = list.filter(item => item.name == '自主管理' && item.id == value);
							this.propertyServiceTypeFlag = newArr.length != 1;
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
					tableName: AssessDBKey.BasicBuilding,
					appKey: appCacheKey
				};
				return obj;
			},
			openMapView() {
				//-------------------------start---------------------------------
				let that = this;
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				let redirectTo = "";
				try {
					redirectTo = page.$route.fullPath;
				} catch (e) {
				}
				if (!redirectTo) {
					try {
						redirectTo = page.$page.fullPath;
					} catch (e) {
					}
				}
				//-------------------------end---------------------------------
				let batchDetail = this.batchDetail;
				let param = {
					batchDetailJson: JSON.stringify(batchDetail),
					num: 2
				};
				uni.navigateTo({
					url: "../../common/basicMap/mapMarker" + "?" + utils.parseParam(param),
					success: function (res) {
						res.eventChannel.emit('emitChildData', {redirectTo: redirectTo});
						that.submitTempForm() ;
					}
				});
			}
		}
	}
</script>

<style>

</style>
