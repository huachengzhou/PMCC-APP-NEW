<template>
	<view>

		<view>

		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">

					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<uni-search-bar @confirm="ondataInfoFunctionSearch" @cancel="ondataInfoFunctionCancel">
						</uni-search-bar>
					</view>

					<uni-list>
						<uni-list-item v-for="(detailData,index) in dataInfoList" :extra-icon="extraIcon"
							:show-extra-icon="true" :ellipsis="1" :title="detailData.estateName" showArrow
							:rightText="detailData.creatorName" :note="showDate(detailData.gmtCreated)" clickable
							@click="itemClick(detailData,$event)" />
					</uni-list>

					<view class="uni-pagination-box">
						<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
							@change="getdataInfoList" />
						<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
							<button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
						</view>
					</view>
				</view>
			</my-ming-pop>
		</view>

		<view>
			<my-ming-pop ref="myMingPopTree" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						{{treeNode.estateName}}
					</view>
				</view>

				<view class="content">
					<view class="switch-wrapper">
						<text>{{defaultExpandAll ? '点击折叠全部' : '点击展开全部'}}</text>
						<switch :checked="defaultExpandAll" @change="switchChange"></switch>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<ly-tree ref="tree" :showRadio="showRadio" node-key="id" :tree-data="dataTreeList"
							:toggle-expend-all="defaultExpandAll" @node-expand="" @node-click=""
							@radio-change="handleRadioChange" />
					</scroll-view>


				</view>

				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<view style="margin-right:30px;">
						<uni-tag :circle="true" :inverted="true" :text="batchDetail.name? '选中 '+ batchDetail.name:'未选择'"
							type="primary" />
					</view>
					<view style="margin-left:30px;"><button @click.stop="openView" class="mini-btn" type="primary"
							size="mini">查看</button></view>
				</view>

				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<button class="uni-button" size="mini" type="primary" @click.stop="referenceFun">确定</button>
					<button class="uni-button" size="mini" type="warn"
						@click.stop="$refs.myMingPopTree.close()">关闭</button>
				</view>
			</my-ming-pop>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import LyTree from '@/components/ly-tree/ly-tree.vue';

	export default {
		props: {
			dataValue: {
				type: [String, Number],
				default: ""
			},
			projectPlanDetails: {
				type: [Object],
				default: function() {
					return {};
				}
			}
		},
		watch: {},
		components: {
			"my-ming-pop": myMingPop,
			"ly-tree": LyTree
		},
		data() {
			return {
				disabled: false,
				showRadio: true,
				defaultExpandAll: false,
				selectedResults: '',
				loadingFlag: false,
				// 每页数据量
				pageSize: 6,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				searchValue: '',
				//表格选中数据
				selectedIndexs: [],
				dataInfoList: [],
				batchDetailArray: [],
				dataTreeList: [],
				treeNode: {},
				batchDetail: {}, //树节点  选中数据
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'smallcircle'
				}
			};

		},
		methods: {
			clear() {
				this.selectedResults = '';
				this.pageCurrent = 1;
				this.total = 0;
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.disabled = false;
			},
			selectionTableChange(e) {
				this.selectedIndexs = e.detail.index;
			},
			getItemShowName(data) {
				let name = data.estateName;
				if (data.creatorName) {
					name += "(" + data.creatorName + ")";
				}
				return utils.getItemShowName(name, 24);
			},
			onFocus() {
				this.selectedResults = this.dataValue;
				this.pageCurrent = 1;
				this.total = 0;
				this.$refs.myMingPop.show();
				this.getdataInfoList({
					current: 1
				});
				this.disabled = true;
			},
			ondataInfoFunctionCancel() {
				this.searchValue = null;
				this.getdataInfoList({
					current: 1
				});
			},
			ondataInfoFunctionSearch(obj) {
				this.searchValue = obj.value;
				this.getdataInfoList({
					current: 1
				});
			},
			getdataInfoList(e) {
				let pageNum = e.current;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let name = this.searchValue;
				var data = {
					pageSize: _this.pageSize,
					pageNum: pageNum
				};
				if (name) {
					data.estateName = name;
				}
				let option = {
					url: "/app.assess/basicApplyBatch/getCaseEstateListByName",
					query: data,
					successCallback: function(resultData) {
						_this.dataInfoList = resultData.rows;
						_this.total = resultData.total;
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			itemClick(item) {
				console.log(item);
				this.treeNode = item;
				this.$refs.myMingPopTree.show();
				this.$refs.myMingPop.close();

				let res = this.$myRequest.pmccRequest({
					data: {
						applyBatchId: item.id,
					},
					url: '/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailTreeData',
					method: "POST",
					urlParam: false
				});
				res.then(res => {
					if (!res) {
						return false;
					}
					if (res.data.ret) {
						this.batchDetailArray = res.data.data;
						this.selectTreeNodeFun();
					}
				});
			},
			referenceFun() {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				let projectPlanDetails = this.projectPlanDetails;
				let targetApplyBatchId = this.dataValue;
				let planDetailsId = 0;
				let projectId = 0;
				if (projectPlanDetails) {
					if (projectPlanDetails.projectId) {
						projectId = projectPlanDetails.projectId;
					}
					if (projectPlanDetails.id) {
						planDetailsId = projectPlanDetails.id;
					}
				}
				let list = this.batchDetailArray;
				let arr = [];
				let obj = null;
				do {
					if (obj == null) {
						obj = this.batchDetail;
					} else {
						for (let i = 0; i < list.length; i++) {
							let item = list[i];
							if (obj.pid == item.id) {
								obj = item;
							}
						}
					}
					arr.push(obj);
				} while (obj.pid != 0);

				let query = {
					planDetailsId: planDetailsId,
					projectId: projectId,
					targetApplyBatchId: targetApplyBatchId,
					clearData: true,
					userAccount: userInfo.userAccount,
					formData: JSON.stringify(arr)
				};
				console.log(query);
				this.$refs.myMingPopTree.close();
				uni.showModal({
					title: "是否确认引用当前数据?",
					content: "引用后原来的数据后将不可恢复,请耐心等待!",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							let res = this.$myRequest.pmccRequest({
								data: query,
								showLoading:true,
								url: '/app.assess/basicApplyBatch/copyVersionDataBasicApplyBatchDetailInfo',
								method: "POST"
							});
							res.then(res => {
								if (res.data.ret) {
									uni.showToast({
										title: '操作成功',
										success() {
											_this.$emit("getResults", arr);
										}
									});
								}
							});
						}else {
							this.$refs.myMingPopTree.show();
						}
					}
				});
				this.disabled = false;
			},
			showDate(date) {
				if (date) {
					return utils.formatTime(date, "YYYY-MM-DD");
				}
				return "";
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
				let node = e.node;
				let checked = e.checked;
				let batchDetail = {};
				if (checked) {
					this.batchDetailArray.forEach(item => {
						if (item.id == node.key) {
							batchDetail = item;
						}
					});
					if (e.data) {
						batchDetail = e.data;
					}
				}
				this.batchDetail = batchDetail;
			},
			openView() {
				let batchDetail = this.batchDetail;
				let obj = this.treeNode;
				if (!batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false;
				}
				let query = {
					projectId: '',
					type: obj.type,
					applyBatchId: obj.id,
					modelPhoneType: obj.modelPhoneType,
					planDetailsId: ''
				}
				if (obj.projectId) {
					query.projectId = obj.projectId;
				}
				if (obj.planDetailsId) {
					query.planDetailsId = obj.planDetailsId;
				}
				query.transferId = batchDetail.id;
				uni.navigateTo({
					url: "/pages/workbench/assess/basic/home/surveyExploreHome?" + utils.parseParam(query)
				});
			}
		},
		created() {

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

	.scroll-Y {
		height: 370rpx;
	}
</style>
