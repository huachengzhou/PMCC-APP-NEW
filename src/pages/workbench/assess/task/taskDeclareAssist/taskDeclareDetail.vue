<template>
	<view>
		<view style="margin-top:2px;">

			<view v-show="tabIndex == 0">
				<custom-paging ref="pagingHouse" @queryPageList="houseQueryPageList">
					<view slot="scrollTop">
						<uni-segmented-control @clickItem="onSegmentedClick" :current="tabIndex" :values="tabBarNames"
							:style-type="styleType" :active-color="activeColor" />
					</view>
					<view v-for="(itemData, index) in houseList">
						<view>
							<common-custom-panel-grid-item :icon="false" :titles="houseFieldList" :itemData="itemData">
							</common-custom-panel-grid-item>
						</view>
						<uni-group mode="card">
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<view><button type="primary" size="mini" @click="findHouseItem(itemData)">详情</button>
								</view>

								<view>
									<button class="uni-button" size="mini" type="primary"
										@click.stop="findModelLandItem(itemData)">土地证</button>
								</view>
								<view>
									<button class="uni-button" size="mini" type="primary"
										@click.stop="actionHouseSheetItem(itemData)">其它操作</button>
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
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import detailsCpn from '@/components/assess/common/details-cpn/details-cpn.vue';

	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';
	import custom_paging from '@/components/assess/common/custom-paging/custom-paging.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import DeclareApplyModel from '@/components/assess/declare/DeclareApplyModel.vue';

	const AssessDBKey = Explore.AssessDBKey;
	var declareCommon = declareCommonUtils.declareCommon;

	let houseFieldList = [];
	let realEstateCertFieldList = [];
	declareCommon.getHouseColumn().forEach(item => {
		houseFieldList.push({
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
			"details-cpn": detailsCpn,
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-image-picker": commonImagePicker,
			"custom-paging": custom_paging
		},
		data() {
			return {
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				houseList: [],
				houseFieldList: houseFieldList,
				realEstateCertList: [],
				realEstateCertFieldList: realEstateCertFieldList,
				//将选中标签的索引绑定为tabIndex，以便后续的调用
				tabIndex: 0,
				//导航栏标签列表数组数据结构示例，name为必须属性
				activeColor: '#007aff',
				styleType: 'text',
				tabBarNames: ["房产证", "不动产证", "其它"],
				buttonRect: {},
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
					return false;
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
					this.$refs.pagingHouse.reload();
					this.$refs.pagingRealEstate.reload();
					this.$refs.declareApplyCpn.setServerData();
				});
			},
			//点击导航栏标签改变当前索引
			toggleTab(index) {
				this.tabIndex = index
			},
			onSegmentedClick(eObj) {
				let index = eObj.currentIndex;
				this.tabIndex = index;
			},
			getChildParam(data) {
				var _this = this;
				var param = {
					phase: _this.phase,
					projectInfo: _this.projectInfo,
					projectPlanDetails: _this.projectPlanDetails,
					tabIndex: _this.tabIndex,
					bisDetail: true
				};
				if (data) {
					param.data = data;
				}
				return param;
			},
			getCacheChildParam(data) {
				var userInfo = this.$helper.fetchLocalUser();
				var param = this.getChildParam(data);
				let keyCacheId = utils.randomString(10) + utils.randomNum(2, 10) + userInfo.userAccount;
				let str = "?keyCacheId=" + keyCacheId + "&json=" + JSON.stringify(param);
				uni.setStorageSync(keyCacheId, param);
				console.log(keyCacheId);
				return str;
			},
			findModelLandItem(item) {
				let parEl = this.getCacheChildParam(item);
				uni.navigateTo({
					url: "model/declareRealtyLand" + parEl
				});
			},
			actionHouseSheetItem(item) {
				const that = this;
				let parEl = this.getCacheChildParam(item);
				uni.showActionSheet({
					title: '操作选项',
					itemList: ['经济指标', '不动产清单'],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 0: {
								uni.showToast({
									title: '功能未开放!',
									duration: 1000,
									icon: "error",
									success() {}
								});
								break;
							}
							case 1: {
								uni.navigateTo({
									url: "./model/declareRealtyCheckList/declareRealtyCheckList" +
										parEl
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
			findHouseItem(data) {
				var _this = this;
				let parEl = this.getCacheChildParam(data);
				uni.navigateTo({
					url: "model/realtyHouseCert" + parEl
				});
			},
			houseQueryPageList(pageParam) {
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
					url: "/app.assess/declare/declareRealtyHouseCert/getPageResult",
					query: data,
					successCallback: function(resultData) {
						_this.houseList = _this.$refs.pagingHouse.complete(pageParam, resultData);
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
			findRealEstateItem(data) {
				var _this = this;
				let parEl = this.getCacheChildParam(data);
				uni.navigateTo({
					url: "model/realtyRealEstateCert" + parEl
				});
			},
			actionRealEstateSheetItem(item) {
				const that = this;
				let parEl = this.getCacheChildParam(item);
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
								var param = this.getChildParam(item);
								uni.navigateTo({
									url: "./model/declareRealtyCheckList/declareRealtyCheckList" +
										parEl
								});
								break;
							}
							case 1: {
								var param = this.getChildParam(item);
								uni.navigateTo({
									url: "model/declareBuildingPermit/declareBuildingPermit" + parEl
								});
								break;
							}
							case 2: {
								var param = this.getChildParam(item);
								uni.navigateTo({
									url: "model/declareLandUsePermit/declareLandUsePermit" + parEl
								});
								break;
							}
							case 3: {
								var param = this.getChildParam(item);
								uni.navigateTo({
									url: "model/declareBuildingConstructionPermit/declareBuildingConstructionPermit" +
										parEl
								});
								break;
							}
							case 4: {
								var param = this.getChildParam(item);
								uni.navigateTo({
									url: "model/declarePreSalePermit/declarePreSalePermit" + parEl
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
			}
		}

	}
</script>

<style>

</style>
