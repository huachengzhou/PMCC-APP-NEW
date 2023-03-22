<template>
	<view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 0">
				<my-producer @claimDeclareRecordFun="claimDeclareRecordFun" @onSegmentedEvent="onSegmentedEvent"
					ref="myProducer" :projectInfo="projectInfo" :dataOptions="option" :bisDetail="true"></my-producer>
			</view>
		</view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 1">
				<my-consumer @surveyAssetInventoryHandle="surveyAssetInventoryHandle"
					@uniformityInventoryHandle="uniformityInventoryHandle" @onSegmentedEvent="onSegmentedEvent"
					ref="myConsumer" :projectInfo="projectInfo" :assetInfo="assetInfo" :dataOptions="option" :bisDetail="true">
				</my-consumer>
			</view>
		</view>

		<view :style="styleParam">
			<view v-show="option.tabIndex == 2">
				<my-consumer-group @onSegmentedEvent="onSegmentedEvent" ref="myConsumerGroup" :projectInfo="projectInfo"
					:dataOptions="option" :bisDetail="true"></my-consumer-group>
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
	import detailsCpn from '@/components/assess/common/details-cpn/details-cpn.vue';
	import producerCpn from '@/components/assess/asset/house/producer.vue';
	import consumerCpn from '@/components/assess/asset/house/consumer.vue';
	import consumerGroupCpn from '@/components/assess/asset/house/consumerGroup.vue';

	export default {
		components: {
			"details-cpn": detailsCpn,
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
					bisDetail: true
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
					url: "../inventory/uniformityAssetInventoryIndex" + parEl
				});
			},
			surveyAssetInventoryHandle(item) {
				let parEl = this.getCacheViewParams(item) ;
				uni.navigateTo({
					url: "../inventory/surveyAssetInventoryIndex" + parEl
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
			}
		}
	}
</script>

<style>

</style>
