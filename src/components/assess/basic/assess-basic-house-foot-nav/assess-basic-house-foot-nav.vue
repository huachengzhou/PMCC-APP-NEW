<template>
	<view>

		<view class="goods-carts">
			<uni-goods-nav :options="footBars" :fill="true" :button-group="footButtonGroup" @click="footNavClick"
				@buttonClick="footNavClick" />
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="true" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">

					<view v-if="footCode == caseCode">
						<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
							<uni-search-bar v-model="searchValue" @confirm="confirmCaseEstateListByName"
								@cancel="cancelCaseEstateListByName">
							</uni-search-bar>
						</view>
						<uni-table ref="tableNavCase" type="selection" @selection-change="selectionTableChange"
							:loading="loadingFlag" border stripe emptyText="暂无更多数据">
							<uni-tr>
								<uni-th align="left" style="height:60rpx;">名称</uni-th>
							</uni-tr>
							<uni-tr v-for="(itemData, index) in basicItemList" :key="index">
								<uni-td><text>
										{{firstQuote?getItemShowName(itemData.estateName):getItemShowName(itemData.name)}}
									</text></uni-td>
							</uni-tr>
						</uni-table>

						<view class="uni-pagination-box">
							<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
								@change="getCaseEstateListByName" />
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<button class="uni-button" size="mini" type="primary"
									@click.stop="sureCaseEstateListByName">确定</button>

								<button class="uni-button" size="mini" type="warn"
									@click.stop="closeModel()">关闭</button>
							</view>
						</view>
					</view>

					<view v-if="footCode == alternativeCode">
						<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
							<uni-search-bar v-model="searchValue" @confirm="confirmBasicAlternativeServerList"
								@cancel="cancelBasicAlternativeServerList">
							</uni-search-bar>
						</view>

						<uni-table ref="tableNavAlternative" type="selection" @selection-change="selectionTableChange"
							:loading="loadingFlag" border stripe emptyText="暂无更多数据">
							<uni-tr>
								<uni-th align="left" style="height:60rpx;">名称</uni-th>
								<uni-th align="left" style="height:60rpx;">类型</uni-th>
							</uni-tr>
							<uni-tr v-for="(itemData, index) in basicItemList" :key="index">
								<uni-td><text>
										{{getItemShowName(itemData.name)}}
									</text></uni-td>
								<uni-td><text>{{getItemShowName(itemData.typeName)}}</text></uni-td>
							</uni-tr>
						</uni-table>
						<view class="uni-pagination-box">
							<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
								@change="getBasicAlternativeServerList" />
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<button class="uni-button" size="mini" type="primary"
									@click.stop="sureBasicAlternativeServer">确定</button>
								<button class="uni-button" size="mini" type="warn"
									@click.stop="closeModel()">关闭</button>
							</view>
						</view>
					</view>

					<view v-if="footCode == historyRecordCode">
						<uni-table ref="tableNavHistoryRecordData"  
							:loading="loadingFlag" border stripe emptyText="暂无更多数据">
							<uni-tr>
								<uni-th align="left" style="height:60rpx;">名称</uni-th>
								<uni-th align="left" style="height:60rpx;">创建人</uni-th>
								<uni-th align="left" style="height:60rpx;">创建时间</uni-th>
							</uni-tr>
							<uni-tr v-for="(itemData, index) in basicItemList" :key="index">
								<uni-td><text>
										{{getItemShowName(itemData.name)}}
									</text></uni-td>
								<uni-td><text>{{getItemShowName(itemData.creatorName)}}</text></uni-td>
								<uni-td><text>{{showDate(itemData.gmtCreated)}}</text></uni-td>
							</uni-tr>
						</uni-table>
						
						<view class="uni-pagination-box">
							<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
								@change="getHistoryRecordDataList" />
							<view class="uni-flex uni-row"
								style="-webkit-justify-content: center;justify-content: center;">
								<button class="uni-button" size="mini" type="warn"
									@click.stop="closeModel()">关闭</button>
							</view>
						</view>
					</view>
				</view>
			</my-ming-pop>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	const caseCode = 1;
	const alternativeCode = 2;
	const historyRecordCode = 3;

	export default {
		props: {
			dataId: {
				type: [String, Number],
				default: ""
			},
			firstQuote: {
				type: [Boolean],
				default: false
			},
			batchDetail: {
				type: [Object],
				default: {}
			}
		},
		watch: {},
		components: {
			"my-ming-pop": myMingPop
		},
		data() {
			return {
				caseCode: caseCode,
				alternativeCode: alternativeCode,
				historyRecordCode: historyRecordCode,
				loadingFlag: false,
				quoteId: '',
				quoteObj: '',
				// 每页数据量
				pageSize: 6,
				// 当前页
				pageCurrent: 1,
				searchValue: '',
				// 数据总量
				total: 0,
				footCode: '',
				//表格选中数据
				selectedIndexs: [],
				basicItemList: [],
				footBars: [{
						icon: 'pengyouquan',
						text: '引用案例',
						code: caseCode
					},
					{
						icon: 'smallcircle',
						text: '备选案例',
						code: alternativeCode
					}

				],
				footButtonGroup: [{
					text: '历史记录',
					icon: 'plus',
					backgroundColor: '#ffa200',
					color: '#fff',
					code: historyRecordCode
				}],
			};

		},
		methods: {
			async footNavClick(e) {
				let content = e.content;
				let code = content.code;
				this.footCode = code;
				this.pageCurrent = 1;
				this.total = 0;
				this.selectedIndexs = [];
				this.basicItemList = [];
				this.searchValue = '';
				this.openModel();
				await this.initFun();
				switch (code) {
					case caseCode: {
						this.getCaseEstateListByName({
							current: 1
						});
						break;
					}
					case alternativeCode: {
						this.getBasicAlternativeServerList({
							current: 1
						});
						break;
					}
					case historyRecordCode: {
						this.getHistoryRecordDataList({
							current: 1
						});
						break;
					}
					default: {
						break;
					}
				}
				console.log("content ", content);
			},
			openModel() {
				this.$refs.myMingPop.show();
				// this.searchValue = '' ;
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.searchValue = '';
				this.selectedIndexs = [];
				this.basicItemList = [];
				this.total = 0;
			},
			openFirstCaseModel(estateName) {
				this.searchValue = estateName;
				this.footCode = caseCode;
				this.selectedIndexs = [];
				this.getCaseEstateListByName({
					current: 1
				});
				this.openModel();
			},

			/**
			 * 案例库案例 确认搜索
			 * @param {Object} e
			 */
			confirmCaseEstateListByName(e) {
				this.searchValue = e.value;
				this.getCaseEstateListByName({
					current: 1
				});
			},
			/**
			 * 案例库案例 放弃搜索
			 */
			cancelCaseEstateListByName() {
				this.searchValue = '';
				this.getCaseEstateListByName({
					current: 1
				});
			},
			/**
			 * 案例库案例  确认引用
			 */
			sureCaseEstateListByName() {
				let _this = this;
				let list = this.basicItemList;
				let selectedIndexs = this.selectedIndexs;
				let arr = [];
				for (let i = 0; i < selectedIndexs.length; i++) {
					let index = selectedIndexs[i];
					arr.push(list[index]);
				}
				if (arr.length == 0) {
					uni.showToast({
						title: "未选择任何数据",
						icon: 'none',
						duration: 2000
					});
					this.closeModel();
					return false;
				} else if (arr.length > 1) {
					uni.showToast({
						title: "只能选择一个数据",
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let obj = arr[0];
				let userInfo = _this.$helper.fetchLocalUser();
				let sourceApplyBatchId = obj.id;
				let sourceApplyBatchDetailId = obj.id;
				let targetApplyBatchDetailId = this.batchDetail.id;
				let userAccount = userInfo.userAccount;
				let option = {};
				let firstQuote = this.firstQuote;
				if (firstQuote) {
					option = {
						url: "/app.assess/basicApplyBatch/quoteCaseEstate",
						showLoading: true,
						query: {
							targetApplyBatchDetailId: targetApplyBatchDetailId,
							sourceApplyBatchId: sourceApplyBatchId,
							userAccount: userAccount
						},
						successCallback: function(resultData) {
							_this.closeModel();
							uni.showToast({
								title: '引用成功重新渲染页面',
								success() {
									_this.$emit("renderFun", resultData);
								}
							});
						}
					};
				} else {
					option = {
						url: "/app.assess/basicApplyBatch/quoteCaseOther",
						showLoading: true,
						query: {
							targetApplyBatchDetailId: targetApplyBatchDetailId,
							sourceApplyBatchDetailId: sourceApplyBatchDetailId,
							userAccount: userAccount
						},
						successCallback: function(resultData) {
							_this.closeModel();
							uni.showToast({
								title: '引用成功重新渲染页面',
								success() {
									_this.$emit("renderFun", resultData);
								}
							});
						}
					};
				}
				uni.showToast({
					title: "引用数据中,请稍后",
					icon: 'none',
					duration: 2000
				});
				utils.requestDefault(option);
			},
			/**
			 * 案例库案例 列表
			 * @param {Object} e
			 */
			getCaseEstateListByName(e) {
				this.$nextTick(() => {
					this.$refs.tableNavCase.clearSelection();
				});
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
				let firstQuote = this.firstQuote;
				let option = {};
				if (firstQuote) {
					option = {
						url: "/app.assess/basicApplyBatch/getCaseEstateListByName",
						query: data,
						successCallback: function(resultData) {
							_this.basicItemList = resultData.rows;
							_this.total = resultData.total;
							console.log(resultData);
						}
					};
				} else {
					data.pid = this.quoteId;
					if (!data.pid) {
						_this.basicItemList = [];
						_this.total = 0;
						uni.showToast({
							title: "上个节点没有引用案例库数据",
							icon: 'help',
							duration: 2000
						});
						return false;
					}
					option = {
						url: "/app.assess/basicApplyBatch/getBasicApplyBatchDetailList",
						query: data,
						successCallback: function(resultData) {
							_this.basicItemList = resultData.rows;
							_this.total = resultData.total;
							console.log(resultData);
						}
					};
				}
				//请求方法
				utils.requestDefault(option);
			},
			/**
			 * 案例库案例 自动感应 方法提供
			 * @param {Object} data
			 */
			async inputAutocompleteCaseEstateListByName(data) {
				let option = {
					url: "/app.assess/basicApplyBatch/inputAutocompleteCaseEstateListByName",
					data: data,
					method: "POST"
				};
				return await this.$myRequest.pmccRequest(option);
			},
			getBasicAlternativeServerList(e) {
				this.$nextTick(() => {
					this.$refs.tableNavAlternative.clearSelection();
				});
				let pageNum = e.current;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let name = this.searchValue;
				var data = {
					pageSize: _this.pageSize,
					pageNum: pageNum,
					applyBatchDetailId: _this.batchDetail.id
				};
				if (name) {
					data.name = name;
				}
				let option = {
					url: "/app.assess/public/getBasicAlternativeCaseList",
					query: data,
					successCallback: function(resultData) {
						_this.basicItemList = resultData.rows;
						_this.total = resultData.total;
						console.log(resultData);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			confirmBasicAlternativeServerList(e) {
				this.searchValue = e.value;
				this.getBasicAlternativeServerList({
					current: 1
				});
			},
			cancelBasicAlternativeServerList() {
				this.searchValue = "";
				this.getBasicAlternativeServerList({
					current: 1
				});
			},
			sureBasicAlternativeServer() {
				let _this = this;
				let list = this.basicItemList;
				let selectedIndexs = this.selectedIndexs;
				let arr = [];
				for (let i = 0; i < selectedIndexs.length; i++) {
					let index = selectedIndexs[i];
					arr.push(list[index]);
				}
				if (arr.length == 0) {
					uni.showToast({
						title: "未选择任何数据",
						icon: 'none',
						duration: 2000
					});
					this.closeModel();
					return false;
				} else if (arr.length > 1) {
					uni.showToast({
						title: "只能选择一个数据",
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let obj = arr[0];
				console.log(obj);
				let userInfo = _this.$helper.fetchLocalUser();
				let sourceApplyBatchDetailId = obj.batchDetailId;
				let targetApplyBatchDetailId = this.batchDetail.id;
				let quoteCaseTableId = 0;
				let userAccount = userInfo.userAccount;
				let url = "/app.assess/basicApplyBatch/quoteCaseOther";
				let option = {
					url: url,
					showLoading: true,
					query: {
						targetApplyBatchDetailId: targetApplyBatchDetailId,
						sourceApplyBatchDetailId: sourceApplyBatchDetailId,
						quoteCaseTableId: quoteCaseTableId,
						userAccount: userAccount
					},
					successCallback: function(resultData) {
						_this.closeModel();
						uni.showToast({
							title: '引用成功重新渲染页面',
							success() {
								_this.$emit("renderFun", resultData);
							}
						});
					}
				};
				uni.showToast({
					title: "引用数据中,请稍后",
					icon: 'none',
					duration: 2000
				});
				utils.requestDefault(option);
			},
			getHistoryRecordDataList(e) {
				this.$nextTick(() => {
					this.$refs.tableNavHistoryRecordData.clearSelection();
				});
				let pageNum = e.current;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageSize: _this.pageSize,
					pageNum: pageNum,
					relevanceId: _this.batchDetail.tableId,
					type: _this.batchDetail.tableName
				};
				let option = {
					url: "/app.assess/basicApplyBatch/getDataByRelevanceId",
					query: data,
					successCallback: function(resultData) {
						let arr = [];
						resultData.rows.forEach(item => {
							let obj = {
								id: item.id,
								creatorName: item.creatorName,
								gmtCreated: item.gmtCreated
							};
							if (item.name) {
								obj.name = item.name;
							}
							if (item.buildingName) {
								obj.name = item.buildingName;
							}
							if (item.unitNumber) {
								obj.name = item.unitNumber;
							}
							if (item.houseNumber) {
								obj.name = item.houseNumber;
							}
							arr.push(obj);
						});
						_this.basicItemList = arr;
						_this.total = resultData.total;
						console.log(resultData);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			/**
			 * 第一次调用需要从服务器获取的数据
			 */
			async initFun() {
				if (!this.firstQuote) {
					let id = this.dataId;
					let option = {
						data: {
							id: id
						},
						urlParam: true,
						method: "POST",
						url: "/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailById?id=" + id
					};
					await this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							this.quoteId = res.data.data.quoteId;
							console.log(res.data.data);
						}
					});
				}
				console.log("foot nav 调用");
			},
			getItemShowName(name) {
				return utils.getItemShowName(name, 24);
			},
			selectionTableChange(e) {
				this.selectedIndexs = e.detail.index;
			},
			showDate(date) {
				if (date) {
					return utils.formatTime(date, "YYYY-MM-DD");
				}
				return "";
			}
		},
		created() {

		}
	}
</script>

<style>
	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
</style>
