<template>
	<view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 0">
				<my-producer @claimDeclareRecordFun="claimDeclareRecordFun" @onSegmentedEvent="onSegmentedEvent"
					ref="myProducer" :projectInfo="projectInfo" :dataOptions="option"></my-producer>
			</view>
		</view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 1">
				<my-consumer @surveyAssetInventoryHandle="surveyAssetInventoryHandle"
					@uniformityInventoryHandle="uniformityInventoryHandle"
					@deleteSurveyAssetInfoItemById="deleteSurveyAssetInfoItemById"
					@checkUniformityBatch="checkUniformityBatch" @onSegmentedEvent="onSegmentedEvent" ref="myConsumer"
					:projectInfo="projectInfo" :assetInfo="assetInfo" :dataOptions="option"></my-consumer>
			</view>
		</view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 2">
				<my-consumer-group @onSegmentedEvent="onSegmentedEvent" ref="myConsumerGroup" :projectInfo="projectInfo"
					:dataOptions="option"></my-consumer-group>
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
	import approveCpn from '@/components/assess/common/approve-cpn/approve-project-cpn.vue';
	import producerCpn from '@/components/assess/asset/house/producer.vue';
	import consumerCpn from '@/components/assess/asset/house/consumer.vue';
	import consumerGroupCpn from '@/components/assess/asset/house/consumerGroup.vue';

	export default {
		components: {
			"approve-cpn": approveCpn,
			"my-producer": producerCpn,
			"my-consumer": consumerCpn,
			"my-consumer-group": consumerGroupCpn
		},
		data() {
			return {
				styleParam: {
					"margin-top": "5rpx"
				},
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				assetInfo: {},
				option: {
					tabIndex: 0,
					activeColor: '#007aff',
					styleType: 'text',
					// tabBarNames: ["清查权证", "认领的权证", "资产清查组列表"]
					tabBarNames: ["清查权证", "认领的权证"]
				}
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
		onNavigationBarButtonTap() {},
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
			getViewParams(item) {
				let projectInfo = this.projectInfo;
				let projectPlanDetails = this.projectPlanDetails;
				let assetInfo = this.assetInfo;
				let params = {
					projectInfo: projectInfo,
					projectPlanDetails: projectPlanDetails,
					assetInfo: assetInfo,
					data: item,
					bisDetail: false
				};
				return params;
			},
			getCacheViewParams(data) {
				var userInfo = this.$helper.fetchLocalUser();
				let projectPlanDetails = this.projectPlanDetails;
				var param = this.getViewParams(data);
				let keyCacheId = utils.randomString(15) + utils.randomNum(2, 10) + userInfo.userAccount + "_" +
					projectPlanDetails.id;
				let str = "?keyCacheId=" + keyCacheId + "&json=" + JSON.stringify(param);
				uni.setStorageSync(keyCacheId, param);
				console.log(keyCacheId);
				return str;
			},
			uniformityInventoryHandle(item) {
				let parEl = this.getCacheViewParams(item) ;
				uni.navigateTo({
					url: "../inventory/uniformityAssetInventoryIndex" +parEl
				});
			},
			surveyAssetInventoryHandle(item) {
				let parEl = this.getCacheViewParams(item) ;
				uni.navigateTo({
					url: "../inventory/surveyAssetInventoryIndex" + parEl
				});
			},
			//一致性清查
			checkUniformityBatch(item) {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				this.$myRequest.pmccRequest({
					method: "POST",
					data: {
						assetInfoItemIds: item.id,
						userAccount: userInfo.userAccount
					},
					showLoading: true,
					url: "/app.assess/asset/surveyAssetInfoItem/checkUniformityBatch"
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '操作成功!',
							icon: "success",
							duration: 1500,
							success() {
								_this.loadInitFun();
							}
						});
					}
				});
			},
			//删除认领的权证 业务删除
			deleteSurveyAssetInfoItemById(item) {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				this.$myRequest.pmccRequest({
					method: "POST",
					data: {
						id: item.id,
						userAccount: userInfo.userAccount
					},
					url: "/app.assess/asset/surveyAssetInfoItem/deleteSurveyAssetInfoItemById"
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '删除认领的权证成功!',
							icon: "success",
							duration: 1500,
							success() {
								_this.loadInitFun();
							}
						});
					}
				});
			},
			//认领权证
			claimDeclareRecordFun(declareRecord) {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				var assetInfo = this.assetInfo;
				let data = {
					ids: declareRecord.id,
					userAccount: userInfo.userAccount,
					assetInfoId: assetInfo.id
				};
				this.$myRequest.pmccRequest({
					method: "POST",
					data: data,
					url: "/app.assess/asset/surveyAssetInfoItem/addSurveyAssetInfoItemRecordData"
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '认领成功!',
							icon: "success",
							duration: 1500,
							success() {
								_this.loadInitFun();
							}
						});
					}
				});
			},
			loadInitFun() {
				let that = this;
				var userInfo = this.$helper.fetchLocalUser();
				let projectPlanDetails = this.projectPlanDetails;
				let projectInfo = this.projectInfo;
				//  加载  页面数据 
				that.$nextTick(() => {
					that.$refs.myProducer.initFun();
					this.$refs.approve_cpn.initAutoGetServerData();
				});
				let objFun = {
					load: function() {
						//  加载  页面数据
						that.$nextTick(() => {
							that.$refs.myConsumer.initFun();
							that.$refs.myConsumerGroup.initFun();
						});
					},
					getMasterFun: function(callback) {
						that.$myRequest.pmccRequest({
							method: "POST",
							data: {
								userAccount: userInfo.userAccount,
								planDetailId: projectPlanDetails.id,
								projectId: projectInfo.id
							},
							url: "/app.assess/asset/surveyAssetInfo/initSurveyAssetInfoInit"
						}).then(res => {
							if (res.data.ret) {
								that.assetInfo = res.data.data;
								if (callback) {
									callback();
								}
							}
						});
					}
				};
				if (this.assetInfo.id) {
					objFun.load();
				} else {
					objFun.getMasterFun(function() {
						objFun.load();
					});
				}
			},
			//点击导航栏标签改变当前索引
			onSegmentedEvent(index) {
				this.option.tabIndex = index;
			},
			sumitApproveFun(code) {
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
			}
		}
	}
</script>

<style>

</style>
