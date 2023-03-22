<template>
	<view class="uni-container">
		<view class="uni-panel" v-for="(item, index) in list" @click="itemClick(index,item)">
			
			<view v-if="active && indexData == index">
				<view class="uni-panel-h uni-panel-h-on" >
					<view class="uni-panel-text" style="color: #000000;font-weight: bold;">{{item.title}}</view>
				</view>
				
				<view class="uni-navigate-item uni-navigate-item-on">
					<view class="uni-navigate-text" style="color: #000000;font-weight: bold;">
						{{item.content}}
					</view>
				</view>
			</view>
			
			<view v-else-if="indexData != index">
				<view class="uni-panel-h " >
					<view class="uni-panel-text">{{item.title}}</view>
				</view>
				
				<view class="uni-navigate-item ">
					<view class="uni-navigate-text ">
						{{item.content}}
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		name: "common-custom-panel",
		props: {
			list: {
				type: [Array],
				default: []
			},
			active:{
				type: [Boolean],
				default: false
			}
		},
		watch: {},
		components: {

		},
		data() {
			return {
				indexData :0
			};
		},
		methods: {
			itemClick(indexData,item) {
				this.indexData = indexData;
				this.$emit("itemClick", item);
			}
		}
	}
</script>

<style>
	.uni-container {
		padding: 15px;
		background-color: #f8f8f8;
	}

	.uni-panel {
		margin-bottom: 12px;
	}

	.uni-panel-h {
		/* #ifdef H5 */
		display: flex;
		/* #endif */
		background-color: #ffffff;
		flex-direction: row !important;
		/* justify-content: space-between !important; */
		align-items: center !important;
		padding: 12px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-panel-h:active {
		background-color: #f8f8f8;
	}

	.uni-panel-h-on {
		background-color: #f0f0f0;
	}

	.uni-panel-text {
		flex: 1;
		color: #000000;
		font-size: 14px;
		font-weight: normal;
	}

	.uni-navigate-item {
		/* #ifdef H5 */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		background-color: #FFFFFF;
		border-top-style: solid;
		border-top-color: #f0f0f0;
		border-top-width: 1px;
		padding: 12px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-navigate-item-on {
		background-color: #f0f0f0;
	}

	.uni-navigate-text {
		flex: 1;
		color: #000000;
		font-size: 14px;
		font-weight: normal;
	}

	.uni-navigate-icon {
		margin-left: 15px;
		color: #999999;
		font-size: 14px;
		font-weight: normal;
	}
</style>
