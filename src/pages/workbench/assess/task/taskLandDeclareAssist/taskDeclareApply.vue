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
								<view><button type="primary" size="mini" @click="editLandItem(itemData)">编辑</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="warn"
										@click.stop="deleteLandItem(itemData)">删除</button>
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
										@click="editRealEstateItem(itemData)">编辑</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="warn"
										@click.stop="deleteRealEstateItem(itemData)">删除</button>
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
			<approve-cpn ref="approve_cpn" :projectPlanDetails="projectPlanDetails" @sumitApproveFun="sumitApproveFun"></approve-cpn>
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
	import approveCpn from '@/components/assess/common/approve-cpn/approve-project-cpn.vue';
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
			topTabbar,
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-image-picker": commonImagePicker,
			"approve-cpn": approveCpn,
			"declare-apply-model-cpn": DeclareApplyModel,
			"custom-paging": custom_paging
		},
		data() {
			return {
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				landList: [],
				landCopy: {},
				landFieldList: landFieldList,
				realEstateCertList: [],
				realEstateCertCopy: {},
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
			if(query.tabIndex){
				this.tabIndex = query.tabIndex;
			}
			//第一次加载
			this.loadInitFun();
		},
		onShow() {
			this.$nextTick(() => {
				//第一次加载
				this.loadInitFun();
			});
		},
		onNavigationBarButtonTap() {
			if (this.tabIndex == 2) {
				return false;
			}
			let that = this;
			uni.showActionSheet({
				title: '操作选项',
				itemList: ["有权证", "无权证"],
				popover: {
					top: that.buttonRect.top * 2 + that.buttonRect.height,
					left: that.buttonRect.left + that.buttonRect.width / 2
				},
				success: (e) => {
					let index = e.tapIndex;
					if (index == 0) {
						if (this.tabIndex == 0) {
							this.addLandItem(null,true);
						}
						if (this.tabIndex == 1) {
							this.addRealEstateItem(null,true);
						}
					}
					if (index == 1) {
						if (this.tabIndex == 0) {
							this.addLandItem(null,false);
						}
						if (this.tabIndex == 1) {
							this.addRealEstateItem(null,false);
						}
					}
				}
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
					this.$refs.approve_cpn.initAutoGetServerData();
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
					bisDetail: false
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
				let parEl = this.getCacheChildParam(item) ;
				let projectPlanDetails = this.projectPlanDetails;
				uni.showActionSheet({
					title: '操作选项',
					// itemList: ['不动产清单', '经济指标',"复制", "粘贴"],
					itemList: ['不动产清单', "复制", "粘贴"],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 1: {
								that.landCopy = item;
								uni.showToast({
									title: '已复制!',
									duration: 1000,
									icon: "success"
								});
								break;
							}
							case 0: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareRealtyCheckList/declareRealtyCheckList" +parEl
								});
								break;
							}
							case 2: {
								let landCopy = this.landCopy;
								if (!landCopy.id) {
									uni.showToast({
										title: '未选择复制数据!',
										duration: 1000,
										icon: "error",
									});
									return false;
								}
								if (landCopy.id == item.id) {
									uni.showToast({
										title: '不同复制自身!',
										duration: 1000,
										icon: "error",
									});
									return false;
								}
								this.$myRequest.pmccRequest({
									url: "/app.assess/declare/declareBuildEngineeringAndEquipmentCenter/copyData",
									method: "POST",
									data: {
										sourceId: landCopy.centerId,
										targetId: item.centerId,
										targetPlanDetailsId: projectPlanDetails.id
									},
									showLoading: true
								}).then(res => {
									that.landCopy = {};
									uni.showToast({
										title: '粘贴成功!',
										duration: 1000,
										icon: "success",
										success() {
											that.loadInitFun();
										}
									});
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
			deleteLandItem(item) {
				var _this = this;
				let option = {
					url: "/app.assess/declare/declareRealtyLandCert/removeById?id=" + item.id,
					query: {
						id: item.id
					},
					notParam: true,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '删除成功',
							icon: "success",
							success() {
								_this.$refs.pagingLand.reload();
							}
						});
					}
				};
				uni.showModal({
					title: "确定删除当前数据？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							utils.requestDefault(option);
						}
					}
				});
			},
			editLandItem(item) {
				if (item.landCertGetQuestion == this.landCertGetYes.id) {
					this.addLandItem(item, true);
				}
				if (item.landCertGetQuestion == this.landCertGetNot.id) {
					this.addLandItem(item, false);
				}
			},
			addLandItem(data, bisNotCert) {
				var parEl = this.getCacheChildParam(data, bisNotCert);
				uni.navigateTo({
					url: "model/realtyLandCert" + parEl
				});
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
					itemList: ["复制", "粘贴", '不动产清单', "建设工程规划许可证", "建设用地规划许可证",
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
								that.realEstateCertCopy = item;
								uni.showToast({
									title: '已复制!',
									duration: 1000,
									icon: "success"
								});
								break;
							}
							case 1: {
								let realEstateCertCopy = this.realEstateCertCopy;
								if (!realEstateCertCopy.id) {
									uni.showToast({
										title: '未选择复制数据!',
										duration: 1000,
										icon: "error",
									});
									return false;
								}
								if (realEstateCertCopy.id == item.id) {
									uni.showToast({
										title: '不同复制自身!',
										duration: 1000,
										icon: "error",
									});
									return false;
								}
								this.$myRequest.pmccRequest({
									url: "/app.assess/declare/declareBuildEngineeringAndEquipmentCenter/copyData",
									method: "POST",
									data: {
										sourceId: realEstateCertCopy.centerId,
										targetId: item.centerId,
										targetPlanDetailsId: projectPlanDetails.id
									},
									showLoading: true
								}).then(res => {
									that.landCopy = {};
									uni.showToast({
										title: '粘贴成功!',
										duration: 1000,
										icon: "success",
										success() {
											that.loadInitFun();
										}
									});
								});
								break;
							}
							case 2: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareRealtyCheckList/declareRealtyCheckList" +parEl
								});
								break;
							}
							case 3: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareBuildingPermit/declareBuildingPermit" +parEl
								});
								break;
							}
							case 4: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareLandUsePermit/declareLandUsePermit" +parEl
								});
								break;
							}
							case 5: {
								uni.navigateTo({
									url: "../taskDeclareAssist/model/declareBuildingConstructionPermit/declareBuildingConstructionPermit" +parEl
								});
								break;
							}
							case 6: {
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
			deleteRealEstateItem(item) {
				var _this = this;
				let option = {
					url: "/app.assess/declare/declareRealtyRealEstateCert/removeById?id=" + item.id,
					query: {
						id: item.id
					},
					notParam: true,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '删除成功',
							icon: "success",
							success() {
								_this.$refs.pagingRealEstate.reload();
							}
						});
					}
				};
				uni.showModal({
					title: "确定删除当前数据？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							utils.requestDefault(option);
						}
					}
				});
			},
			editRealEstateItem(item) {
				if (item.landCertGetQuestion == this.landCertGetYes.id) {
					this.addRealEstateItem(item,true);
				}
				if (item.landCertGetQuestion == this.landCertGetNot.id) {
					this.addRealEstateItem(item,false);
				}
			},
			addRealEstateItem(data,bisNotCert) {
				var parEl = this.getCacheChildParam(data,bisNotCert);
				uni.navigateTo({
					url: "model/realtyRealEstateCert" + parEl
				});
			},
			sumitApproveFun(code) {
				let data = this.$refs.declareApplyCpn.getData();
				let option = {
					url: "/app.assess/declare/declareApply/saveAndUpdate",
					data: data.data,
					method: "POST"
				};
				let reFun = this.$myRequest.pmccRequest(option) ;
				reFun.then(res => {
					if (code == 1) {
						uni.showToast({
							title: '取消成功!',
							success() {
								uni.navigateBack({
									delta: 1
								});
							}
						});
					} else {
						uni.showToast({
							title: '提交成功!',
							success() {
								uni.navigateBack({
									delta: 1
								});
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
