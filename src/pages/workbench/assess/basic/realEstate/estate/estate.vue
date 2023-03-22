<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<view>
					<button style="margin-top: 14rpx;margin-left: 8rpx;margin-bottom:20rpx;" type="primary" size="mini"
						@click.stop="openMapView">
						<uni-icons color="'#8f8f94'" type="map-pin-ellipse" size="20"></uni-icons>
						地图标注
					</button>
				</view>
				<uni-forms-item required name="name" label="楼盘名称" label-align="right">
					<input-autocomplete class="assess-unit-item__input" v-model="formData.name" placeholder="楼盘名称"
						highlightColor="#FF0000" :loadData="loadAutocompleteData" v-on:selectItem="autoSelectItem"
						:debounce="1000">
					</input-autocomplete>

					<!-- <uni-easyinput type="text" v-model="formData.name" placeholder="楼盘名称" /> -->
				</uni-forms-item>

				<assess-pick-regions ref="assessPickRegions" :provinceValue="formData.province"
					:cityValue="formData.city" :districtValue="formData.district" @getRegion="handleGetRegion">
				</assess-pick-regions>


				<uni-forms-item required name="position" label="楼盘方位" label-align="right">
					<assess-picker :dataInput="'position'" :dataList="positionList" :dataValue="formData.position"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="buildingNumber" label="总楼栋数" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingNumber" placeholder="总楼栋数" />
				</uni-forms-item>
				<uni-forms-item required name="infrastructureCompleteness" label="基础设施完备度" label-align="right">
					<assess-picker :dataInput="'infrastructureCompleteness'" :dataList="infrastructureCompletenessList"
						:dataValue="formData.infrastructureCompleteness" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="infrastructure" label="外基础设施">
					<uni-data-checkbox multiple v-model="formData.infrastructure" :localdata="infrastructureList" />
				</uni-forms-item>

				<uni-forms-item name="pastName" label="曾用名(过去名称)" label-align="right">
					<uni-easyinput type="text" v-model="formData.pastName" placeholder="曾用名(过去名称)">
					</uni-easyinput>
				</uni-forms-item>

				<view v-for="(fieldData,index_f) in tableFields">
					<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
						<common-image-picker :dataObj="setImgFieldsName(fieldData.fieldName)">
						</common-image-picker>
					</uni-forms-item>
				</view>

			</uni-group>

			<uni-group title="补充信息1" mode="card">
				<uni-forms-item name="coverAnAreaUnit" label="占地面积(单位)" label-align="right">
					<select-input :dataValue="formData.coverAnAreaUnit" :dataInput="'coverAnAreaUnit'"
						:selectDatas="coverAnAreaUnitList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="coverAnArea" label="占地面积" label-align="right">
					<uni-easyinput type="text" v-model="formData.coverAnArea" placeholder="占地面积" />
				</uni-forms-item>
				<uni-forms-item name="volumetricRate" label="容积率" label-align="right">
					<uni-easyinput type="text" v-model="formData.volumetricRate" placeholder="容积率" />
				</uni-forms-item>
				<uni-forms-item name="greeningRate" label="绿化率" label-align="right">
					<uni-easyinput type="text" v-model="formData.greeningRate" placeholder="绿化率" />
				</uni-forms-item>
				<uni-forms-item name="developerName" label="开发商" label-align="right">
					<uni-easyinput type="text" v-model="formData.developerName" placeholder="开发商" />
				</uni-forms-item>
				<uni-forms-item name="openTime" label="开盘时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.openTime"
						v-on:change="setFormValue('openTime',$event)"></uni-datetime-picker>
				</uni-forms-item>
			</uni-group>

			<uni-group title="补充信息3" mode="card">
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
			<button type="primary" size="mini" @click="openStreetInfoView">街道号信息</button>
			<button @click.stop="$refs.assessBasicApplyBatchFileModel.onFocus()" class="mini-btn" type="primary"
				size="mini">引用附件
			</button>
		</uni-group>

		<view style="height:30px;">

		</view>

		<assess-basic-file-model ref="assessBasicApplyBatchFileModel" @getResults="getAssessBasicApplyBatchFileModel">
		</assess-basic-file-model>


		<assess-basic-house-foot-nav ref="houseFootNav" :firstQuote="firstQuote" :dataId="batchDetail.pid"
			:batchDetail="batchDetail" @renderFun="serverRenderingThisView">
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
	import * as estateUtils from "@/common/assess/basic/examine.estate.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as Explore from '@/common/assess/Explore.key.js';

	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';
	import commonMapPoiSearch from '@/components/common-map/common-map-poi-search.vue';
	import assessBasicHouseFootNav from '@/components/assess/basic/assess-basic-house-foot-nav/assess-basic-house-foot-nav.vue';
	import assessPickRegions from '@/components/assess/common/regions/assess-pick-regions.vue';
	import assess_basic_file_model from '@/components/assess/assess-basic-file-model/assess-basic-file-model.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	// 多选框 必须包含 text和value
	let thisViewData = {
		positionList: [{
			name: 'df',
			id: 12
		}],
		infrastructureCompletenessList: [{
			name: 'UG',
			id: 14
		}],
		infrastructureList: [{
			text: 'TqAm0U',
			value: 12,
			name: 'sdhsd',
			id: 12
		}],
		coverAnAreaUnitList: ['平方米', "亩"],
		cardObj: '',
		homeParam: {},
		tableFields: [],
		commitFlag: false,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		streetInfoList: [],
		AutocompleteData: [],
		batchDetail: {},
		formData: {
			id: '',
			province: "",
			city: "",
			district: "",
			name: "",
			position: "",
			buildingNumber: "",
			infrastructureCompleteness: "",
			infrastructure: [],
			coverAnAreaUnit: "",
			coverAnArea: "",
			volumetricRate: "",
			greeningRate: "",
			developerName: "",
			openTime: "",
			blockName: "",
			blockDescription: "",
			locationDescribe: "",
			pastName: ""
		},
		loading: false,
		firstQuote: true,
		firstIndex: 0,
		rules: {
			province: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			city: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			district: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			name: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			position: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			buildingNumber: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			infrastructureCompleteness: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			infrastructure: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			coverAnAreaUnit: {
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
			volumetricRate: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			greeningRate: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			developerName: {
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
			blockName: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			blockDescription: {
				rules: [{
					required: false,
					errorMessage: '请输入数据'
				}]
			},
			locationDescribe: {
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
			"common-map-poi-search": commonMapPoiSearch,
			"assess-basic-house-foot-nav": assessBasicHouseFootNav,
			"input-autocomplete": inputAutocomplete,
			"assess-pick-regions": assessPickRegions,
			"assess-basic-file-model": assess_basic_file_model
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
			initListData: function(init) {
				let data = this.$data;
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_infrastructureCompleteness, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.infrastructureCompletenessList = resultData;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandInfrastructure, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.infrastructureList = estateCommonUtils.checkboxTransformBaseDic(resultData);
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_position, function(resultData) {
					if (!resultData) {
						return false;
					}
					data.positionList = resultData;
				});
				this.$nextTick(() => {
					this.$refs.assessPickRegions.init();
				});
				let fieldsKey = "nonIndustrialFile";
				let baseType = this.homeParam.type;
				if (baseType) {
					if (Number(baseType) == 1) {
						fieldsKey = "industrialFile";
					}
				}
				assessCommonUtils.loadAllChildDataDicList(fieldsKey, function(
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
			changeLoadData: function(name, init) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
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
						if (_this.formData.infrastructure) {
							_this.formData.infrastructure = _this.formData.infrastructure.split(",");
						} else {
							_this.formData.infrastructure = [];
						}
						_this.initListData(true);
					}
				};
				utils.requestDefault(option);
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
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = '';
				try {
					value = item[dataId];
				} catch (e) {
					//TODO handle the exception
				}
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
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
					tableName: AssessDBKey.BasicEstate,
					appKey: appCacheKey
				};
				return obj;
			},
			/**
			 * 进入街道信息路由
			 */
			openStreetInfoView() {
				let _this = this;
				let card = {
					pageUrl: "/app.assess/basicEstateStreetInfo/getPageResult",
					deleteUrl: "/app.assess/basicEstateStreetInfo/removeById",
					saveAndUpdateUrl: "/app.assess/basicEstateStreetInfo/saveAndUpdate",
					getUrl: "/app.assess/basicEstateStreetInfo/getById",
					masterId: _this.batchDetail.tableId,
					masterType: '',
					title: "街道信息",
					tableName: '',
					bisParent: false,
					checkExist: true,
					childType: '',
					host: _this.cardObj.host,
				};
				console.log(card);
				let batchDetail = this.batchDetail;
				let param = {
					cardJson: JSON.stringify(card),
					batchDetailJson: JSON.stringify(batchDetail)
				};

				uni.navigateTo({
					url: "../../common/basicEstateStreetInfo/basicEstateStreetInfo" + "?" + utils.parseParam(param)
				})
			},
			/**
			 * 进入地图路由
			 */
			openMapView() {
				//-------------------------start---------------------------------
				let that = this;
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				let redirectTo = "";
				try {
					redirectTo = page.$route.fullPath;
				} catch (e) {}
				if (!redirectTo) {
					try {
						redirectTo = page.$page.fullPath;
					} catch (e) {}
				}
				//-------------------------end---------------------------------
				let batchDetail = this.batchDetail;
				let param = {
					batchDetailJson: JSON.stringify(batchDetail)
				};
				uni.navigateTo({
					url: "/pages/workbench/assess/basic/common/basicMap/mapMarker" + "?" + utils.parseParam(param),
					success: function(res) {
						res.eventChannel.emit('emitChildData', {
							redirectTo: redirectTo
						});
						that.submitTempForm();
					}
				});
			},
			/**
			 * 案例自动感应  (只针对案例库)
			 * @param {Object} name
			 */
			async loadAutocompleteData(name) {
				var availableTags = [];
				if (!name) {
					return false;
				}
				let _this = this;
				let data = {
					estateName: name,
					province: _this.formData.province,
					city: _this.formData.city
				};
				data = utils.filterEmptyData(data);
				await this.$refs.houseFootNav.inputAutocompleteCaseEstateListByName(data).then(res => {
					if (res.data.ret) {
						_this.AutocompleteData = res.data.data;
						_this.AutocompleteData.forEach(function(item) {
							let label = item.estateName + "(" + item.creatorName + ")";
							availableTags.push(label);
						});
					}
				});
				return Promise.resolve(availableTags);
			},
			/**
			 * 自动感应选择后
			 * @param {Object} e
			 */
			autoSelectItem(e) {
				let estateName = "";
				this.AutocompleteData.forEach(function(item) {
					let label = item.estateName + "(" + item.creatorName + ")";
					if (label == e) {
						estateName = item.estateName;
					}
				});
				this.$refs.houseFootNav.openFirstCaseModel(estateName);
			},
			getAssessBasicApplyBatchFileModel(obj) {
				let batchDetail = this.batchDetail;
				let dataId = null;
				if (utils.isArray(obj)) {
					dataId = obj[0].id;
				} else {
					dataId = obj.id;
				}
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/bindChildEstate",
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
			},
		}
	}
</script>

<style>

</style>
