<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="province" label="省" label-align="right">
					<assess-picker :dataInput="'province'" :dataList="provinceList" :dataValue="formData.province"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="city" label="市" label-align="right">
					<assess-picker ref="city" :dataInput="'city'" :dataList="cityList" :dataValue="formData.city"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="name" label="地块名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.name" placeholder="地块名称" />
				</uni-forms-item>

				<uni-forms-item required name="landPieceNumbering" label="地块编号" label-align="right">
					<uni-easyinput type="text" v-model="formData.landPieceNumbering" placeholder="地块编号" />
				</uni-forms-item>


				<uni-forms-item name="position" label="地块方位" label-align="right">
					<assess-picker :dataInput="'position'" :dataList="positionList" :dataValue="formData.position"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="acquisitionType" label="土地取得方式" label-align="right">
					<assess-picker :dataInput="'acquisitionType'" :dataList="acquisitionTypeList"
						:dataValue="formData.acquisitionType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="landRightNature" label="土地权利性质" label-align="right">
					<assess-picker :dataInput="'landRightNature'" :dataList="landRightNatureList"
						:dataValue="formData.landRightNature" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item name="landRightType" label="权利类型" label-align="right">
					<assess-picker :dataInput="'landRightType'" :dataList="landRightTypeList"
						:dataValue="formData.landRightType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="regionalPlanning" label="区域规划" label-align="right">
					<uni-easyinput type="text" v-model="formData.regionalPlanning" placeholder="区域规划" />
				</uni-forms-item>
				<uni-forms-item name="developerName" label="土地权利人" label-align="right">
					<uni-easyinput type="text" v-model="formData.developerName" placeholder="土地权利人" />
				</uni-forms-item>


				<uni-forms-item name="averagePriceUnit" label="均价单位" label-align="right">
					<select-input :dataValue="formData.averagePriceUnit" :dataInput="'averagePriceUnit'"
						:selectDatas="averagePriceUnitList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="number" label="均价" label-align="right">
					<uni-easyinput type="digit" v-model="formData.number" placeholder="均价" />
				</uni-forms-item>




				<uni-forms-item name="priceRangeUnit" label="价格区间单位" label-align="right">
					<select-input :dataValue="formData.priceRangeUnit" :dataInput="'priceRangeUnit'"
						:selectDatas="priceRangeUnitList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item name="priceRange" label="价格区间" label-align="right">
					<uni-easyinput type="digit" v-model="formData.priceRange" placeholder="价格区间" />
				</uni-forms-item>

				<uni-forms-item name="openTime" label="取得时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.openTime"
						v-on:change="setFormValue('openTime',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item name="estate_heating_plan" label="总平面图" label-align="right">
					<common-image-picker :dataObj="setImgFieldsName('land_total_plane')">
					</common-image-picker>
				</uni-forms-item>

			</uni-group>

			<uni-group title="补充信息1" mode="card">


				<!--<uni-forms-item name="plotRatio" label="容积率" label-align="right">-->
					<!--<uni-easyinput type="text" v-model="formData.plotRatio" placeholder="容积率" />-->
				<!--</uni-forms-item>-->

				<!--<uni-forms-item name="plotRatioRemark" label="容积率说明" label-align="right">-->
					<!--<uni-easyinput type="textarea" autoHeight v-model="formData.plotRatioRemark" placeholder="容积率说明">-->
					<!--</uni-easyinput>-->
				<!--</uni-forms-item>-->

				<!--<uni-forms-item name="greenSpaceRate" label="绿地率" label-align="right">-->
					<!--<uni-easyinput type="text" v-model="formData.greenSpaceRate" placeholder="绿地率" />-->
				<!--</uni-forms-item>-->

				<!--<uni-forms-item name="buildingDensity" label="建筑密度" label-align="right">-->
					<!--<uni-easyinput type="text" v-model="formData.buildingDensity" placeholder="建筑密度" />-->
				<!--</uni-forms-item>-->


				<!--<uni-forms-item name="compatibleRatio" label="兼容比例" label-align="right">-->
					<!--<uni-easyinput type="text" v-model="formData.compatibleRatio" placeholder="兼容比例" />-->
				<!--</uni-forms-item>-->


				<uni-forms-item name="coverAnAreaUnit" label="占地面积(单位)" label-align="right">
					<select-input :dataValue="formData.coverAnAreaUnit" :dataInput="'coverAnAreaUnit'"
						:selectDatas="coverAnAreaUnitList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item name="coverAnArea" label="占地面积" label-align="right">
					<uni-easyinput type="text" v-model="formData.coverAnArea" placeholder="占地面积" />
				</uni-forms-item>
				
				
			</uni-group>

			<uni-group title="补充信息2" mode="card">
				<uni-forms-item name="blockName" label="基础版块" label-align="right">
					<uni-easyinput type="text" v-model="formData.blockName" placeholder="基础版块" />
				</uni-forms-item>
				<uni-forms-item name="blockDescription" label="基础版块描述" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.blockDescription" placeholder="基础版块描述">
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item name="locationDescribe" label="楼盘区位分析" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.locationDescribe" placeholder="楼盘区位分析">
					</uni-easyinput>
				</uni-forms-item>
			</uni-group>
		</uni-forms>





		<uni-group title="其它信息" mode="card">
			<button style="margin-top: 1rpx;margin-left: 8rpx;" type="primary" size="mini"
				@click="openMapView">地图标注</button>
		</uni-group>




		<assess-basic-house-foot-nav ref="houseFootNav" :firstQuote="firstQuote" :dataId="batchDetail.pid" :batchDetail="batchDetail"
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
		<assess-submit-button v-show="commitFlag" style="margin-top:50px;">
			{{commitTitle}}
		</assess-submit-button>



	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as estateUtils from "@/common/assess/basic/examine.estate.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	import assessBasicHouseFootNav from '@/components/assess/basic/assess-basic-house-foot-nav/assess-basic-house-foot-nav.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	let ruleField = [
		'id',
		':province',
		':city',
		':name',
		':landPieceNumbering',
		'position',
		'acquisitionType',
		'landRightNature',
		'landRightType',
		'regionalPlanning',
		'developerName',
		'averagePriceUnit',
		'number',
		'priceRange',
		'priceRangeUnit',
		'openTime',
		'coverAnAreaUnit',
		'coverAnArea',

		// 'plotRatio',
		// 'plotRatioRemark',
		// 'buildingDensity',
		// 'greenSpaceRate',
		// 'compatibleRatio',

		'blockName',
		'blockDescription',
		'locationDescribe',
	];

	let rules = utils.getRules(ruleField);
	let formDataFields = utils.getFormDataField(ruleField);
	Object.assign(formDataFields, {});

	// 多选框 必须包含 text和value
	let thisViewData = {
		transferId: '',
		cardObj: null,
		homeParam: {},
		commitFlag: false,
		firstQuote: true,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		batchDetail: {},
		priceRangeUnitList: ['元/平方米', '万元/亩'],
		provinceList: [],
		cityList: [],
		positionList: [],
		acquisitionTypeList: [],
		landRightNatureList: [],
		landRightTypeList: [],
		averagePriceUnitList: ['元/平方米', '万元/亩'],
		coverAnAreaUnitList: ['平方米', "亩"],
		formData: formDataFields,
		rules: rules
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
			"select-input": selectInput,
			"common-file-picker": commonFilePicker,
			"assess-basic-house-foot-nav": assessBasicHouseFootNav,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			submit(data, commitFlag) {
				var _this = this;
				console.log(data) ;

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
				//特殊处理一些兼容性东西
				if (utils.isArray(res.infrastructure)) {
					res.infrastructure = res.infrastructure.join(",");
				}
				let userInfo = _this.$helper.fetchLocalUser();
				let data = utils.assignObj(res, {
					creator: userInfo.userAccount
				});
				estateUtils.getBasicEstateLandStateByEstateId(data.id, function(estateLand) {
					let infoData = {
						basicEstate: data,
						basicEstateLandState: estateLand
					};
					let coreData = {
						applyBatchDetailId: batchDetail.id,
						formData: JSON.stringify(infoData),
						formClassify: batchDetail.type,
						planDetailsId: batchDetail.planDetailsId
					};
					console.log(infoData);
					console.log(coreData);
					_this.submit(coreData, commitFlag);
				});
			},
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				let batchDetail = this.batchDetail;
				this.$refs.form.validate().then((res) => {
					//特殊处理一些兼容性东西
					if (utils.isArray(res.infrastructure)) {
						res.infrastructure = res.infrastructure.join(",");
					}
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						id: _this.formData.id
					});
					console.log('表单返回得值：', data);
					estateUtils.getBasicEstateLandStateByEstateId(data.id, function(estateLand) {
						let infoData = {
							basicEstate: data,
							basicEstateLandState: estateLand
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
				estateUtils.setProvinceList(data, "provinceList");
				this.changeLoadData("province");
				this.changeLoadData("city");

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_position, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.positionList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareAcquisitionType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.acquisitionTypeList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareUseRightType, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightNatureList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareLandCertificateType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.landRightTypeList = resultData;
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
					case "province": {
						estateUtils.setAreaList(formData[name], null, null, function(resultData) {
							let cityList = [];
							resultData.forEach((item) => {
								cityList.unshift({
									name: item.name,
									id: item.areaId,
									parentName: item.parentName,
									parentId: item.parentId
								});
							});
							_this.cityList = cityList;
							_this.$refs.city.initFun();
						});
						break;
					}
					case "city": {
						estateUtils.setAreaList(formData[name], data, "districtList", function(resultData) {
							let districtList = [];
							resultData.forEach((item) => {
								districtList.unshift({
									name: item.name,
									id: item.areaId,
									parentName: item.parentName,
									parentId: item.parentId
								});
							});
							_this.districtList = districtList;
						});
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
					tableName: batchDetail.tableName,
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
					batchDetailJson: JSON.stringify(batchDetail)
				};
				uni.navigateTo({
					url: "../../common/basicMap/mapMarker" + "?" + utils.parseParam(param),
					success: function (res) {
						res.eventChannel.emit('emitChildData', {redirectTo: redirectTo});
						that.submitTempForm() ;
					}
					// url: "../../common/basicMap/mapPolygon" + "?" + utils.parseParam(param)
				});
			}
		}
	}
</script>

<style>

</style>
