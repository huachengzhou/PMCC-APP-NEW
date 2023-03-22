<template>
	<view>
		<view style="margin-top:2px;">
			<view v-show="tabIndex == 0">
				<custom-paging ref="pagingLand" @queryPageList="landQueryPageList">
					<view slot="scrollTop">
						<uni-segmented-control @clickItem="onSegmentedClick" :current="tabIndex" :values="tabBarNames"
							:style-type="styleType" :active-color="activeColor" />
					</view>
					<view v-for="(itemData, index) in landList">
						<view>
							<common-custom-panel-grid-item :icon="false" :titles="landFieldList" :itemData="itemData">
							</common-custom-panel-grid-item>
						</view>
						<uni-group mode="card">
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<view><button type="primary" size="mini" @click="findLandItem(itemData)">详情</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="primary"
										@click.stop="findModelHouseItem(itemData)">房产证</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="primary"
										@click.stop="actionLandSheetItem(itemData)">其它操作</button>
								</view>
							</view>
						</uni-group>
					</view>
				</custom-paging>
			</view>
			<view v-show="tabIndex == 1">
				<custom-paging ref="pagingRealEstate" @queryPageList="realEstateQueryPageList">
					<view slot="scrollTop">
						<uni-segmented-control @clickItem="onSegmentedClick" :current="tabIndex" :values="tabBarNames"
							:style-type="styleType" :active-color="activeColor" />
					</view>
					<view v-for="(itemData, index) in realEstateCertList">
						<view>
							<common-custom-panel-grid-item :icon="false" :titles="realEstateCertFieldList"
								:itemData="itemData">
							</common-custom-panel-grid-item>
						</view>
						<uni-group mode="card">
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<view><button type="primary" size="mini"
										@click="findRealEstateItem(itemData)">详情</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="primary"
										@click.stop="actionRealEstateSheetItem(itemData)">其它操作</button>
								</view>
							</view>
						</uni-group>
					</view>
				</custom-paging>
			</view>
			<view v-show="tabIndex == 2">
				<view>
					<uni-segmented-control @clickItem="onSegmentedClick" :current="tabIndex" :values="tabBarNames"
						:style-type="styleType" :active-color="activeColor" />
				</view>
				<declare-apply-model-cpn ref="declareApplyCpn" :projectPlanDetails="projectPlanDetails" :projectInfo="projectInfo">
				</declare-apply-model-cpn>
			</view>
		</view>
		<view>
			<details-cpn :projectPlanDetails="projectPlanDetails"></details-cpn>
		</view>
	</view>
</template>

<script>
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as utils from "@/common/untils.js";
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import topTabbar from '@/components/top-tabbar/top-tabbar.vue';
	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';
	import custom_paging from '@/components/assess/common/custom-paging/custom-paging.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import detailsCpn from '@/components/assess/common/details-cpn/details-cpn.vue';
	import DeclareApplyModel from '@/components/assess/declare/DeclareApplyModel.vue';

	const AssessDBKey = Explore.AssessDBKey;
	const AssessDicKey = Explore.AssessDicKey;
	var declareCommon = declareCommonUtils.declareCommon;

	let landFieldList = [];
	let realEstateCertFieldList = [];
	declareCommon.getLandColumn().forEach(item => {
		landFieldList.push({
			field: item.field,
			label: item.title
		});
	});

	declareCommon.getRealEstateColumn().forEach(item => {
		realEstateCertFieldList.push({
			field: item.field,
			label: item.title
		});
	});


	export default {
		components: {
			"declare-apply-model-cpn": DeclareApplyModel,
			topTabbar,
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-image-picker": commonImagePicker,
			"details-cpn": detailsCpn,
			"custom-paging": custom_paging
		},
		data() {
			return {
				fieldNamesList: [{
					fieldsName: "assess_report_enclosure",
					title: "评估报告（附件）"
				}],
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				landList: [],
				landFieldList: landFieldList,
				realEstateCertList: [],
				realEstateCertFieldList: realEstateCertFieldList,
				//将选中标签的索引绑定为tabIndex，以便后续的调用
				tabIndex: 0,
				activeColor: '#007aff',
				styleType: 'text',
				tabBarNames: ["土地证", "不动产证", "其它"],
				//导航栏标签列表数组数据结构示例，name为必须属性
				buttonRect: {},
				landCertGetYes: {},
				landCertGetNot: {},
			}
		},
		onLoad(option) {
			let query = {};
			try {
				query = JSON.parse(option.json);
			} catch (e) {
				try {
					query = uni.getStorageSync(option.keyCacheId);
				} catch (e) {
					uni.showToast({
						title: "参数错误",
						icon: "error",
						duration: 2000
					});
					return false ;
				}
			}
			this.phase = query.phase;
			this.projectInfo = query.projectInfo;
			this.projectPlanDetails = query.projectPlanDetails;
			//第一次加载
			this.loadInitFun();
		},
		onShow() {
			this.$nextTick(() => {
				//第一次加载
				this.loadInitFun();
			});
		},
		onPullDownRefresh() {
			uni.showToast({
				title: "刷新中",
				icon: "loading",
				duration: 2000
			});
			//下拉刷新
			this.loadInitFun();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			loadInitFun() {
				//  加载  页面数据
				this.$nextTick(() => {
					this.$refs.pagingLand.reload();
					this.$refs.pagingRealEstate.reload();
					this.$refs.declareApplyCpn.setServerData();
				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareCertificateIsnull,
					(resultData => {
						if (resultData) {
							for (var i = 0; i < resultData.length; i++) {
								let item = resultData[i];
								if (AssessDicKey.projectDeclareCertificate_YES == item.fieldName) {
									this.landCertGetYes = item;
								}
								if (AssessDicKey.projectDeclareCertificate_NO == item.fieldName) {
									this.landCertGetNot = item;
								}
							}
							console.log(this.landCertGetYes);
							console.log(this.landCertGetNot);
						}
					}));
			},
			//点击导航栏标签改变当前索引
			toggleTab(index) {
				this.tabIndex = index
			},
			onSegmentedClick(eObj) {
				let index = eObj.currentIndex;
				this.tabIndex = index;
			},
			getChildParam(data, bisNotCert) {
				var _this = this;
				var param = {
					phase: _this.phase,
					projectInfo: _this.projectInfo,
					projectPlanDetails: _this.projectPlanDetails,
					tabIndex: _this.tabIndex,
					bisDetail: true
				};
				let type = utils.getType(bisNotCert);
				if (type == 'boolean') {
					param.bisNotCert = bisNotCert;
				}
				if (data) {
					param.data = data;
				}
				return param;
			},
			getCacheChildParam(data,bisNotCert) {
				var userInfo = this.$helper.fetchLocalUser();
				var param = this.getChildParam(data,bisNotCert);
				let keyCacheId = utils.randomString(11) + utils.randomNum(2, 18) + userInfo.userAccount;
				let str = "?keyCacheId=" + keyCacheId + "&json=" + JSON.stringify(param);
				uni.setStorageSync(keyCacheId, param);
				console.log(keyCacheId) ;
				return str;
			},
			findModelHouseItem(item) {
				let parEl = this.getCacheChildParam(item) ;
				uni.navigateTo({
					url: "model/realtyHouseCert" + parEl
				});
			},
			actionLandSheetItem(item) {
				const that = this;
				let projectPlanDetails = this.projectPlanDetails;
				let parEl = this.getCacheChildParam(item) ;
				uni.showActionSheet({
					title: '操作选项',
					// itemList: ['不动产清单', '经济指标'],
					itemList: ['不动产清单'],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 0: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareRealtyCheckList/declareRealtyCheckList" +parEl
								});
								break;
							}
							default: {
								uni.showToast({
									title: '功能未开放!',
									duration: 1000,
									icon: "error",
									success() {}
								});
								break;
							}
						}
					}
				});
			},
			findLandItem(data) {
				if (data.landCertGetQuestion == this.landCertGetYes.id) {
					var parEl = this.getCacheChildParam(data, true);
					uni.navigateTo({
						url: "model/realtyLandCert" + parEl
					});
				}
				if (data.landCertGetQuestion == this.landCertGetNot.id) {
					var parEl = this.getCacheChildParam(data, false);
					uni.navigateTo({
						url: "model/realtyLandCert" + parEl
					});
				}
			},
			landQueryPageList(pageParam) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let projectPlanDetails = this.projectPlanDetails;
				var data = {
					pageNum: pageParam.pageNo,
					pageSize: pageParam.pageSize,
					planDetailsId: projectPlanDetails.id,
					enable: declareCommon.masterData,
				};
				if (!data.planDetailsId) {
					return false;
				}
				let option = {
					url: "/app.assess/declare/declareRealtyLandCert/getPageResult",
					query: data,
					successCallback: function(resultData) {
						_this.landList = _this.$refs.pagingLand.complete(pageParam, resultData);
						uni.showToast({
							title: "数据加载完成",
							icon: "success",
							duration: 1000
						});
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			realEstateQueryPageList(pageParam) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let projectPlanDetails = this.projectPlanDetails;
				var data = {
					pageNum: pageParam.pageNo,
					pageSize: pageParam.pageSize,
					planDetailsId: projectPlanDetails.id,
					enable: declareCommon.masterData,
				};
				if (!data.planDetailsId) {
					return false;
				}
				let option = {
					url: "/app.assess/declare/declareRealtyRealEstateCert/getPageResult",
					query: data,
					successCallback: function(resultData) {
						_this.realEstateCertList = _this.$refs.pagingRealEstate.complete(pageParam, resultData);
						uni.showToast({
							title: "数据加载完成",
							icon: "success",
							duration: 1000
						});
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			actionRealEstateSheetItem(item) {
				const that = this;
				var parEl = this.getCacheChildParam(item);
				let projectPlanDetails = this.projectPlanDetails;
				uni.showActionSheet({
					title: '操作选项',
					itemList: ['不动产清单', "建设工程规划许可证", "建设用地规划许可证",
						"建筑工程施工许可证", "商品房预售许可证", '经济指标'
					],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 0: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareRealtyCheckList/declareRealtyCheckList" +parEl
								});
								break;
							}
							case 1: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareBuildingPermit/declareBuildingPermit" +parEl
								});
								break;
							}
							case 2: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareLandUsePermit/declareLandUsePermit" +parEl
								});
								break;
							}
							case 3: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareBuildingConstructionPermit/declareBuildingConstructionPermit" +parEl
								});
								break;
							}
							case 4: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declarePreSalePermit/declarePreSalePermit" +parEl
								});
								break;
							}
							default: {
								uni.showToast({
									title: '功能未开放!',
									duration: 1000,
									icon: "error",
									success() {}
								});
								break;
							}
						}
					}
				});
			},
			findRealEstateItem(data) {
				if (data.landCertGetQuestion == this.landCertGetYes.id) {
					var parEl = this.getCacheChildParam(data, true);
					uni.navigateTo({
						url: "model/realtyRealEstateCert" + parEl
					});
				}
				if (data.landCertGetQuestion == this.landCertGetNot.id) {
					var parEl = this.getCacheChildParam(data, false);
					uni.navigateTo({
						url: "model/realtyRealEstateCert" + parEl
					});
				}
			},
			setImgFieldsName(fieldsName) {
				let projectInfo = this.projectInfo;
				let obj = {
					fieldsName: fieldsName,
					tableId: projectInfo.id,
					tableName: AssessDBKey.ProjectInfo,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}

	}
</script>

<style>

</style>
