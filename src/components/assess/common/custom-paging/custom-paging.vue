<template>

	<view>

		<view>
			<slot name="head">
			</slot>
		</view>

		<scroll-view :refresher-threshold="10" :refresher-triggered="refresherTriggered" refresher-enabled="true"
			@refresherrefresh="onRefresh" @refresherrestore="refresherrestore" @refresherabort="refresherabort"
			:scroll-top="scrollTop" class="scroll-view" scroll-y="true" @scrolltolower="lower" @scroll="scroll">
			<view>
				<slot name="scrollTop">
				</slot>
			</view>

			<view>
				<view v-show="total==0 && !endFlag">
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<view class="text" style="color: #0B877F;">无数据!</view>
					</view>
				</view>
				<slot>
				</slot>
				<view v-show="endFlag" class="uni-flex uni-row"
					style="-webkit-justify-content: center;justify-content: center;">
					<view class="text" style="color: #0B877F;">没有更多了!</view>
				</view>
			</view>

			<view>
				<slot name="scrollFoot">
				</slot>
			</view>
		</scroll-view>

		<view>
			<slot name="bottom">
			</slot>
		</view>

		<view>
			<slot name="foot">
			</slot>
		</view>

	</view>

</template>

<script>
	import * as utils from "@/common/untils.js";

	export default {
		name: 'custom-paging',
		props: {
			pageSize: {
				type: [Number, String],
				default: 10
			}
		},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				list: [],
				total: 0,
				pageNo: 1,
				pageFirstNo: 1,
				endFlag: false,
				refresherTriggered: false,
				_refresherTriggered: false
			}
		},
		watch: {

		},
		methods: {
			distinctFun(arr, idName) {
				let obj1 = {};
				let res1 = [];
				arr.forEach((item) => {
					if (!obj1[item[idName]]) {
						res1.push(item);
						obj1[item[idName]] = true;
					}
				});
				return res1;
			},
			complete(pageParam, resultData,idName) {
				if (!idName) {
					idName = "id";
				}
				/*
				resultData
				 {"total":1,"rows":[{id:2}]}
				*/
				this.total = resultData.total;
				if (pageParam.initFlag) {
					this.list = resultData.rows;
					return resultData.rows;
				} else {
					let arr = this.list ;
					let newArr = arr.concat(resultData.rows);
					let resultArr = this.distinctFun(newArr, idName);
					this.list = resultArr;
					return resultArr;
				}
			},
			lower(e) {
				if (!this.total) {
					this.pageNo = this.pageNo + 1;
					this.run(false);
					return false;
				}
				let page = 0;
				let temp = this.total % this.pageSize;
				if (temp == 0) {
					page = this.total / this.pageSize;
				} else {
					page = parseInt(this.total / this.pageSize) + 1;
				}
				let tempPage = this.pageNo + 1;
				if (tempPage > page) {
					//'没有更多了!'
					this.endFlag = true;
					return false;
				}
				this.pageNo = tempPage;
				this.run(false);
				// 滚动到底部/右边触发
			},
			reload() {
				this.run(true);
			},
			run(initFlag) {
				let _this = this;
				let obj = {
					pageNo: _this.pageNo,
					pageSize: _this.pageSize,
					initFlag: initFlag
				};
				if (initFlag) {
					obj.pageNo = this.pageFirstNo;
				}
				this.$emit("queryPageList", obj);
			},
			setParam(obj) {
				let total = obj.total;
				if (utils.getType(total) == 'number') {
					this.total = total;
				}
			},
			onRefresh() {
				// console.log("自定义下拉刷新被触发");
				let _this = this;
				if (_this._refresherTriggered) {
					return;
				}
				_this._refresherTriggered = true;
				//界面下拉触发，triggered可能不是true，要设为true
				if (!_this.refresherTriggered) {
					_this.refresherTriggered = true;
				}
				this.reload();
				setTimeout(() => {
					_this.refresherTriggered = false; //触发onRestore，并关闭刷新图标
					_this._refresherTriggered = false;
				}, 1000)
			},
			refresherrestore() {
				// console.log("自定义下拉刷新被复位");
				let _this = this;
				_this.refresherTriggered = false;
				_this._refresherTriggered = false;
			},
			refresherabort() {
				// console.log("自定义下拉刷新被中止	");
				let _this = this;
				_this.refresherTriggered = false;
				_this._refresherTriggered = false;
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				});
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			}
		}
	}
</script>

<style>
	.scroll-view {
		height: 600px;
		width: 100%;
	}

	.scroll-view .top {
		height: 200px;
		width: 100%;
		background: red;
	}

	.scroll-view .center {
		height: 200px;
		width: 100%;
		background: green;
	}

	.scroll-view .bottom {
		height: 200px;
		width: 100%;
		background: blue;
	}
</style>
