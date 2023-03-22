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
				dataList: [],
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
			itemClick(item) {},
			onSegmentedClick(eObj) {
				let index = eObj.currentIndex;
				this.$emit('onSegmentedEvent',index) ;
			},
			queryPageList(pageParam) {
				
			}
		}
	}
</script>

<style>
</style>
