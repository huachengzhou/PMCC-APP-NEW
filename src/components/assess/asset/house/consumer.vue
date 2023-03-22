<template>

	<view>
		<view>
			<custom-paging ref="paging" @queryPageList="queryPageList">
				<view slot="scrollTop" :style="styleParam">
					<uni-segmented-control @clickItem="onSegmentedClick" :current="dataOptions.tabIndex"
						:values="dataOptions.tabBarNames" :style-type="dataOptions.styleType"
						:active-color="dataOptions.activeColor" />
				</view>
				<uni-list>
					<view v-if="dataList.length > 0">
						<view v-for="(detailData,index) in dataList">
							<view v-show="getItemStatus(detailData)">
								<uni-list-item :extra-icon="extraIcon" :show-extra-icon="true" :ellipsis="2"
									:title="detailData.name?detailData.name:'权证无名称'" :showArrow="showArrow"
									rightText="已清查" :note="getFinishUniformityName(detailData)" clickable
									@click="itemClick(detailData,$event)" />
							</view>
							<view v-show="!getItemStatus(detailData)">
								<uni-list-item :extra-icon="extraIconDisable" :show-extra-icon="true" :ellipsis="2"
									:title="detailData.name?detailData.name:'权证无名称'" :showArrow="showArrow"
									rightText="未清查" :note="getFinishUniformityName(detailData)" clickable
									@click="itemClick(detailData,$event)" />
							</view>
						</view>
					</view>
				</uni-list>
			</custom-paging>
		</view>


		<view>

		</view>
	</view>

</template>

<script>
	import * as utils from "@/common/untils.js";
	import custom_paging from '@/components/assess/common/custom-paging/custom-paging.vue';

	export default {
		components: {
			"custom-paging": custom_paging
		},
		props: {
			dataOptions: {
				type: Object,
				default: function() {
					return {}
				}
			},
			projectInfo: {
				type: Object,
				default: function() {
					return {}
				}
			},
			assetInfo: {
				type: Object,
				default: function() {
					return {}
				}
			},
			bisDetail: {
				type: Boolean,
				default: function() {
					return false ;
				}
			}
		},
		data() {
			return {
				showArrow: false,
				dataList: [],
				buttonRect: {},
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'locked-filled'
				},
				extraIconDisable: {
					color: '#4cd964',
					size: '22',
					type: 'locked'
				},
				styleParam: {
					"margin-top": "20rpx"
				}
			}
		},
		watch: {},
		methods: {
			initFun() {
				this.$refs.paging.reload();
			},
			itemClick(item) {
				const that = this
				if(this.bisDetail){
					uni.showActionSheet({
						title: '详情查看选项',
						itemList: [ "一致性查看", "清查查看"],
						popover: {
							top: that.buttonRect.top * 2 + that.buttonRect.height,
							left: that.buttonRect.left + that.buttonRect.width / 2
						},
						success: (e) => {
							let index = e.tapIndex;
							switch (index) {
								case 0: {
									that.uniformityInventoryHandle(item);
									break;
								}
								case 1: {
									that.surveyAssetInventoryHandle(item);
									break;
								}
								default: {
									break;
								}
							}
						}
					});
				}else {
					uni.showActionSheet({
						title: '操作选项',
						itemList: ['移除', "一致性清查", "一致性操作", "清查操作"],
						popover: {
							top: that.buttonRect.top * 2 + that.buttonRect.height,
							left: that.buttonRect.left + that.buttonRect.width / 2
						},
						success: (e) => {
							let index = e.tapIndex;
							switch (index) {
								case 0: {
									that.deleteSurveyAssetInfoItemById(item);
									break;
								}
								case 1: {
									that.checkUniformityBatch(item);
									break;
								}
								case 2: {
									that.uniformityInventoryHandle(item);
									break;
								}
								case 3: {
									that.surveyAssetInventoryHandle(item);
									break;
								}
								default: {
									break;
								}
							}
						}
					});
				}
			},
			checkUniformityBatch(item) {
				this.$emit('checkUniformityBatch', item);
			},
			uniformityInventoryHandle(item) {
				if (item.groupId){
					uni.showToast({
						title: '当前数据不允许在手机操作!',
						icon: "error",
						duration: 1500
					});
					return false ;
				}
				this.$emit('uniformityInventoryHandle', item);
			},
			surveyAssetInventoryHandle(item) {
				if (item.groupId){
					uni.showToast({
						title: '当前数据不允许在手机操作!',
						icon: "error",
						duration: 1500
					});
					return false ;
				}
				this.$emit('surveyAssetInventoryHandle', item);
			},
			deleteSurveyAssetInfoItemById(item) {
				if (this.getItemStatus(item)) {
					uni.showToast({
						title: '提示:不能删除!',
						icon: "error"
					});
					return false;
				}
				let that = this;
				uni.showModal({
					title: "确定移除当前数据？",
					content: "移除后不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							that.$emit('deleteSurveyAssetInfoItemById', item);
						}
					}
				});
			},
			getItemStatus(item) {
				let value = item.status;
				if (value == 'running') {
					return false;
				}
				if (value == 'runing') {
					return false;
				}
				if (value == 'finish') {
					return true;
				}
				return false;
			},
			getFinishUniformityName(item) {
				if (item.bisFinishUniformity) {
					return "一致性清查——完成";
				}
				return "一致性清查——未处理";
			},
			onSegmentedClick(eObj) {
				let index = eObj.currentIndex;
				this.$emit('onSegmentedEvent', index);
			},
			queryPageList(pageParam) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let projectInfo = this.projectInfo;
				let assetInfo = this.assetInfo;
				var data = {
					pageNum: pageParam.pageNo,
					pageSize: pageParam.pageSize,
					projectId: projectInfo.id,
					assetInfoId: assetInfo.id
				};
				if (!data.projectId) {
					return false;
				}
				let option = {
					url: "/app.assess/asset/surveyAssetInfoItem/getPageResult",
					query: data,
					successCallback: function(resultData) {
						_this.dataList = _this.$refs.paging.complete(pageParam, resultData);
					}
				};
				//请求方法
				utils.requestDefault(option);
			}
		}
	}
</script>

<style>
</style>
