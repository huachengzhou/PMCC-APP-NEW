<template>

	<view>
		<view class="content">
			<view class="switch-wrapper">
				<text>{{beCopyObject.name?'已复制'+beCopyObject.name:''}} {{defaultExpandAll ? '点击折叠全部' : '点击展开全部'}}</text>
				<switch :checked="defaultExpandAll" @change="switchChange"></switch>
			</view>
			<ly-tree ref="tree" :showRadio="showRadio" node-key="id" :tree-data="dataTreeList" @node-expand=""
				@node-click="" @radio-change="handleRadioChange" :toggleExpendAll="defaultExpandAll" />
		</view>


		<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
			<view style="margin-right:30px;">
				<uni-tag :circle="true" :inverted="true" :text="batchDetail.name? '选中 '+ batchDetail.name:'未选择'"
					type="primary" />
			</view>
			<view style="margin-left:30px;"><button @click.stop="openView" class="mini-btn" type="primary"
					size="mini">查看</button></view>
		</view>

		<view class="uni-flex uni-row"
			style="-webkit-justify-content: center;justify-content: center;margin-top:30rpx;">
			<view style="margin-left:30px;"><button @click.stop="copyFun()" class="mini-btn" type="primary"
					size="mini">复制</button></view>
			<view style="margin-left:30px;"><button @click.stop="deepCopyFun()" class="mini-btn" type="warn"
					size="mini">深复制</button></view>
			<view style="margin-left:30px;"><button @click.stop="pasteFun()" class="mini-btn" type="warn"
					size="mini">粘贴</button></view>
		</view>

	</view>

</template>

<script>
	import * as utils from "@/common/untils.js";

	import LyTree from '@/components/ly-tree/ly-tree.vue';

	export default {
		data() {
			return {
				batchDetail: {}, //树节点  选中数据
				batchDetailOther: {},
				beCopyObject: {},
				homeParam: {},
				batchDetailArray: [],
				dataTreeList: [],
				defaultExpandAll: true,
				showRadio: true
			}
		},
		onNavigationBarButtonTap() {
			let query = this.homeParam;
			query.transferId = this.batchDetailOther.id;
			uni.redirectTo({
				url: "./surveyExploreHome?" + utils.parseParam(query)
			});
		},
		onLoad(option) {
			if (option.batchDetailJson) {
				let batchDetailOther = JSON.parse(option.batchDetailJson);
				this.batchDetailOther = batchDetailOther;
				console.log(batchDetailOther);
			}
			if (option.homeParam) {
				this.homeParam = JSON.parse(option.homeParam);
			}
			console.log(this.homeParam);
			this.setBatchDetailArray();
		},
		onPullDownRefresh() {
			this.setBatchDetailArray();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		components: {
			"ly-tree": LyTree
		},
		methods: {
			setBatchDetailArray() {
				let _this = this;
				let batchDetailOther = this.batchDetailOther;
				this.$myRequest.pmccRequest({
					data: {
						applyBatchId: batchDetailOther.applyBatchId,
					},
					url: '/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailTreeData',
					method: "POST",
					urlParam: false
				}).then(res => {
					if (!res) {
						return false;
					}
					if (res.data.ret) {
						this.batchDetailArray = res.data.data;
						this.selectTreeNodeFun();
						this.$nextTick(() => {
							let treeEle = this.$refs.tree;
							let defaultExpandAll = this.defaultExpandAll;
							treeEle.store.toggleExpendAll(defaultExpandAll);
						});
						
					}
				});
			},
			selectTreeNodeFun() {
				let list = this.batchDetailArray;
				if (list.length == 0) {
					uni.showToast({
						title: "数据未完全渲染请等待!"
					});
					return false;
				}
				//1:找出pid = 0;
				//2:第二步 递归列表
				let firstData = {};
				list.forEach(function(item) {
					if (item.pid == 0) {
						firstData = item;
					}
				});
				let viewName = firstData.name + "(" + firstData.executorName + ")";
				if (firstData.executorName) {
					viewName = firstData.name + "(" + firstData.creatorName + ")";
				}
				let obj = Object.assign({
					id: firstData.id,
					pid: firstData.pid,
					label: viewName,
					name: firstData.name,
					children: []
				}, firstData);
				this.traverseFun(obj, list);
				this.dataTreeList = [obj];
			},
			traverseFun(root, list) {
				let that = this;
				var newArr = list.filter(item => root.id == item.pid);
				if (newArr.length == 0) {
					return;
				} else {
					list.forEach(function(item) {
						if (root.id == item.pid) {
							let viewName = item.name + "(" + item.executorName + ")";
							if (item.executorName) {
								viewName = item.name + "(" + item.creatorName + ")";
							}
							let obj = Object.assign({
								id: item.id,
								pid: item.pid,
								label: viewName,
								name: item.name,
								children: []

							}, item);
							that.traverseFun(obj, list);
							root.children.push(obj);
						}
					});
				}
			},
			switchChange(e) {
				this.defaultExpandAll = !this.defaultExpandAll;
			},
			handleRadioChange(e) {
				let checked = e.checked;
				let node = e.node;
				let batchDetail = {};
				if (checked) {
					this.batchDetailArray.forEach(item => {
						if (item.id == node.key) {
							batchDetail = item;
						}
					});
				}
				this.batchDetail = batchDetail;
			},
			copyFun() {
				let batchDetail = this.batchDetail;
				if (!batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				if (batchDetail.pid == 0) {
					uni.showToast({
						title: "不允许复制根节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				this.beCopyObject = batchDetail;
			},
			deepCopyFun() {
				var _this = this;
				let userInfo = _this.$helper.fetchLocalUser();
				let batchDetail = this.batchDetail;
				if (!batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				let option = {
					data: {
						id: batchDetail.id,
						userAccount: userInfo.userAccount
					},
					url: '/app.assess/basicApplyBatchDetail/deepCopy',
					method: "POST",
					showLoading: true
				};
				uni.showModal({
					title: "提示？",
					content: "确认要进行深复制" + batchDetail.name + "节点",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							_this.$myRequest.pmccRequest(option).then(res => {
								if (res.data.ret) {
									uni.showToast({
										title: '复制成功'
									});
									_this.setBatchDetailArray();
								}
							});
						}
					}
				});
			},
			pasteFun() {
				var _this = this;
				let userInfo = _this.$helper.fetchLocalUser();
				let beCopyObject = this.beCopyObject;
				if (!beCopyObject.id) {
					uni.showToast({
						title: "没有复制节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				let batchDetail = this.batchDetail;
				if (!batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				if (batchDetail.id == beCopyObject.id) {
					uni.showToast({
						title: "不能复制粘贴自身",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				let option = {
					data: {
						sourceBatchDetailId: beCopyObject.id,
						targetBatchDetailId: batchDetail.id,
						userAccount: userInfo.userAccount
					},
					url: '/app.assess/basicApplyBatchDetail/pasteExamineInfo',
					method: "POST",
					showLoading: true
				};
				uni.showModal({
					title: "确认要粘贴么？",
					content: "将覆盖原来数据",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							_this.$myRequest.pmccRequest(option).then(res => {
								if (res.data.ret) {
									uni.showToast({
										title: '操作成功'
									});
									_this.setBatchDetailArray();
									_this.beCopyObject = {};
								}
							});
						}
					}
				});
			},
			openView() {
				let batchDetail = this.batchDetail;
				if (!batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				let query = this.homeParam;
				query.transferId = batchDetail.id;
				uni.navigateTo({
					url: "./surveyExploreHome?" + utils.parseParam(query)
				});
			}
		}
	}
</script>

<style>
	.switch-wrapper {
		background-color: #f7f7f7;
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
	}

	.button-sp-area {
		margin: 0 auto;
		width: 60%;
	}
</style>
