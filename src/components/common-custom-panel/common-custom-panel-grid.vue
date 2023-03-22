<template>
	<view>
		<uni-group v-for="(itemData, index) in list" mode="card" @click.stop="clickItem(itemData)">

			<view @click.stop="clickItem(itemData)" class="uni-panel-h " v-for="(item, index) in titles">

				<!-- #ifndef APP-PLUS -->
				<view>
					<uni-row :gutter="gutter" :width="nvueWidth">
						<uni-col :span="8">
							<view style="color: #000000;font-weight: bold;">{{item.label}}</view>
						</uni-col>
						<uni-col :span="16">
							<view style="margin-left:20rpx;text-align: center;">{{getText(itemData,item)}}
							</view>
						</uni-col>
					</uni-row>
				</view>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS  -->
				<view style="height:20rpx;font-size: 24rpx;line-height:18rpx;">
					<uni-row :gutter="gutter" :width="nvueWidth">
						<uni-col :span="8">
							<view style="color: #000000;font-weight: bold;">{{item.label}}</view>
						</uni-col>
						<uni-col :span="16">
							<view style="margin-left:20rpx;text-align: center;">{{getText(itemData,item)}}
							</view>
						</uni-col>
					</uni-row>
				</view>
				<!-- #endif -->
			</view>
			<view class="uni-navigate-item " v-show="icon">
				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<button class="uni-button" size="mini" type="primary" @click.stop="editItem(itemData)">编辑</button>
					<button class="uni-button" size="mini" type="warn" @click.stop="deleteItem(itemData)">删除</button>
					<view @click.stop="btnItem(itemData)">
						<slot name="btn"></slot>
					</view>
				</view>
			</view>
		</uni-group>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	// let list = [];
	// let titles = [{
	// 		label: "id",
	// 		field: "id"
	// 	}, {
	// 		label: "名称",
	// 		field: "name"
	// 	},
	// 	{
	// 		label: "内容",
	// 		field: "content"
	// 	}
	// ];
	// for (var i = 20; i < 200; i++) {
	// 	let obj = {
	// 		id: i + 1,
	// 		name: Math.round(Math.random()) * 10,
	// 		content: new Date().getTime() + Math.random().toString() + Math.random().toString() + Math.random()
	// 			.toString()
	// 	};
	// 	list.push(obj);
	// }

	// <common-custom-panel-grid :titles="titles" :list="list" @clickItem="clickItem" @editItem="editItem"
	// 	@deleteItem="deleteItem">

	// </common-custom-panel-grid>


	export default {
		props: {
			list: {
				type: [Array],
				default: []
			},
			titles: {
				type: [Array],
				default: []
			},
			icon: {
				type: [Boolean],
				default: true
			}
		},
		data() {
			return {
				gutter: 0,
				nvueWidth: 730
			}
		},
		methods: {
			/**
			 * 判断数据类型
			 * @return {string} - 可能返回的结果有，均为小写字符串
			 * number、boolean、string、null、undefined、array、object、function等
			 * @param {Object} val
			 */
			getType(val) {
				//判断数据是 null 和 undefined 的情况
				if (val == null) {
					return val + "";
				}
				return typeof(val) === "object" ?
					Object.prototype.toString.call(val).slice(8, -1).toLowerCase() :
					typeof(val);
			},
			getText(itemData, item) {
				let text = itemData[item.field];
				let type = item.type;
				if (type) {
					if (type == 'date') {
						text = utils.formatTime(text, "YYYY-MM-DD");
					}
				}
				return this.showText(text);
			},
			showText(text) {
				let paramType = this.getType(text);
				switch (paramType) {
					case "undefined": {
						return "";
					}
					case "null": {
						return "";
					}
				}
				let len = 20;
				let packContent = "" + text + "";
				if (packContent.length < len) {
					return packContent;
				} else {
					return packContent.substring(0, len - 1) + "......";
				}
			},
			editItem(item) {
				this.$emit("editItem", item);
			},
			deleteItem(item) {
				this.$emit("deleteItem", item);
			},
			clickItem(item) {
				this.$emit("clickItem", item);
			},
			btnItem(item) {
				this.$emit("btnItem", item);
			}

		}
	}
</script>

<style>
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
</style>
