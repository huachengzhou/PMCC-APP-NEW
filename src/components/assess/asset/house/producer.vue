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
							<view v-if="detailData.inventoryStatus != 'finish'">
								<uni-list-item :disabled="false" :extra-icon="extraIcon" :show-extra-icon="true"
									:ellipsis="2" :title="detailData.name?detailData.name:'权证无名称'"
									:showArrow="showArrow" :rightText="getInventoryStatusName(detailData)"
									:note="detailData.seat" clickable @click="itemClick(detailData,$event)" />
							</view>
							<view v-if="detailData.inventoryStatus == 'finish'">
								<uni-list-item :disabled="true" :extra-icon="extraIconDisable" :show-extra-icon="true"
									:ellipsis="2" :title="detailData.name?detailData.name:'权证无名称'"
									:showArrow="showArrow" :rightText="getInventoryStatusName(detailData)"
									:note="detailData.seat" clickable @click="itemClick(detailData,$event)" />
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
					type: 'flag-filled'
				},
				extraIconDisable: {
					color: '#4cd964',
					size: '22',
					type: 'flag'
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
				if (!this.claimInventoryStatue(item)) {
					uni.showToast({
						title: "数据不可认领!",
						icon: "error",
						duration: 500
					});
					return false;
				}
				const that = this
				if(this.bisDetail){
					return false ;
				}
				uni.showActionSheet({
					title: '操作选项',
					itemList: ['认领'],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 0: {
								this.$emit('claimDeclareRecordFun', item);
								break;
							}
							default: {
								break;
							}
						}
					}
				});
			},
			onSegmentedClick(eObj) {
				let index = eObj.currentIndex;
				this.$emit('onSegmentedEvent', index);
			},
			queryPageList(pageParam) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let projectInfo = this.projectInfo;
				var data = {
					pageNum: pageParam.pageNo,
					pageSize: pageParam.pageSize,
					projectId: projectInfo.id
				};
				if (!data.projectId) {
					return false;
				}
				let option = {
					url: "/app.assess/declare/declareRecord/getDeclareRecordDtoList",
					query: data,
					successCallback: function(resultData) {
						_this.dataList = _this.$refs.paging.complete(pageParam,resultData);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			claimInventoryStatue(item) {
				let value = item.inventoryStatus;
				if (value) {
					if (value == 'running') {
						return false;
					}
					if (value == 'runing') {
						return false;
					}
					if (value == 'finish') {
						return false;
					}
					return false;
				} else {
					return true;
				}
			},
			getInventoryStatusName(item) {
				let value = item.inventoryStatus;
				var html = "";
				if (value) {
					if (value == 'running') {
						html += "待清查";
					}
					if (value == 'runing') {
						html += "待清查";
					}
					if (value == 'finish') {
						html += "已清查";
					}
				} else {
					html += "待认领";
				}
				return html;
			}
		}
	}
</script>

<style>
</style>
