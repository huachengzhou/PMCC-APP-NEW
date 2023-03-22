<template>

	<view style="margin-top: 40px;">
		<!-- <uni-group title="地图标注" mode="card">
			<button type="primary" size="mini" @click.stop="openMapView">地图标注</button>
		</uni-group> -->

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">

				<uni-forms-item required name="unitNumber" label="名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.unitNumber" placeholder="名称" />
				</uni-forms-item>

				<uni-forms-item required name="huxingNum" label="户型数" label-align="right">
					<uni-easyinput type="text" v-model="formData.huxingNum" placeholder="户型数" />
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
		</uni-forms>




		<assess-basic-house-foot-nav ref="houseFootNav" :dataId="batchDetail.pid" :batchDetail="batchDetail"
			@renderFun="serverRenderingThisView">
		</assess-basic-house-foot-nav>

		<view style="height:30px;">
		
		</view>
		<uni-group title="地图标注" mode="card">
			<button type="primary" size="mini" @click.stop="openMapView">地图标注</button>
		</uni-group>
		<view style="height:70px;">
		
		</view>

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

			<!-- <assess-submit-button @submit="submitForm" :loading="loading" style="margin-top:50px;">
				提交
			</assess-submit-button> -->
		</view>
		<assess-submit-button v-show="commitFlag" style="margin-top:50px;">
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
		cardObj: null,
		homeParam: {},
		tableFields: [],
		commitFlag: false,
		commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
		batchDetail: {},
		formData: {
			id: '0',
			unitNumber: "",
			huxingNum: "",
			pastName: ""
		},
		loading: false,
		firstIndex: 0,
		rules: {
			unitNumber: {
				rules: [{
					required: true,
					errorMessage: '请输入数据'
				}]
			},
			huxingNum: {
				rules: [{
					required: true,
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
			delta = pages.length - delta;
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
					basicUnit: data
				};
				let coreData = {
					applyBatchDetailId: batchDetail.id,
					formData: JSON.stringify(infoData),
					formClassify: batchDetail.type,
					planDetailsId: batchDetail.planDetailsId
				};
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
						basicUnit: data
					};
					let coreData = {
						applyBatchDetailId: batchDetail.id,
						formData: JSON.stringify(infoData),
						formClassify: batchDetail.type,
						planDetailsId: batchDetail.planDetailsId
					};
					_this.submit(coreData, true);
				});
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
				// this.changeLoadData("province");
				// this.changeLoadData("city");
				// estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_infrastructureCompleteness, function(
				//     resultData) {
				//     if (!resultData) {
				//         return false;
				//     }
				//     data.infrastructureCompletenessList = resultData;
				// });
				assessCommonUtils.loadAllChildDataDicList('basicUnit', function(
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
				// this.$refs.form.setValue(dataInput,value) ;
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
				} catch (e) {}
				if (!redirectTo) {
					try {
						redirectTo = page.$page.fullPath;
					} catch (e) {}
				}
				//-------------------------end---------------------------------
				let batchDetail = this.batchDetail;
				let param = {
					batchDetailJson: JSON.stringify(batchDetail),
					num: 3
				};
				uni.navigateTo({
					url: "../../common/basicMap/mapMarker" + "?" + utils.parseParam(param),
					success: function(res) {
						res.eventChannel.emit('emitChildData', {
							redirectTo: redirectTo
						});
						that.submitTempForm();
					}
				});
			}
		}
	}
</script>

<style>

</style>
