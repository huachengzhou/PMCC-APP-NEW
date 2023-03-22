<template>
	
	<view>
		<view @click.stop="init();">
			<slot></slot>
		</view>
		
		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="true" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					</view>
		
					<uni-table ref="tableApprovalLog" 
						:loading="loadingFlag" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center" width="10">创建人</uni-th>
							<uni-th align="center" width="10">结论</uni-th>
							<uni-th align="center" width="10">时间</uni-th>
							<uni-th align="center" width="30">节点</uni-th>
							
						</uni-tr>
						<uni-tr v-for="(itemData, index) in dataList" :key="index">
							<uni-td>{{itemData.createrName}}</uni-td>
							<uni-td>{{itemData.conclusion}}</uni-td>
							<uni-td>{{showDate(itemData.mdified)}}</uni-td>
							<uni-td>{{itemData.activityName}}</uni-td>
						</uni-tr>
					</uni-table>
		
					<view class="uni-pagination-box">
						<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
							@change="findApprovalLog" />
						<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
							<button class="uni-button" size="mini" type="warn"
								@click.stop="closeModel">关闭</button>
						</view>
					</view>
				</view>
			</my-ming-pop>
		</view>
	</view>
	
</template>

<script>
	import * as utils from "../../common/untils.js";
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	
	export default {
		props: {
			dataId: {
				type: [String, Number],
				default: ""
			},
			appKey: {
				type: [String, Number],
				default: ""
			},
		},
		watch: {},
		components: {
			"my-ming-pop": myMingPop
		},
		data() {
			return {
				selectedResults: '',
				loadingFlag: false,
				// 每页数据量
				pageSize: 4,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				searchValue: '',
				//表格选中数据
				selectedIndexs: [],
				dataList: [],
			};
	
		},
		methods: {
			closeModel() {
				this.$refs.myMingPop.close();
			} ,
			selectionTableChange(e) {
				this.selectedIndexs = e.detail.index;
			},
			getItemShowName(name) {
				return utils.getItemShowName(name, 24);
			},
			init() {
				this.pageCurrent = 1;
				this.total = 0;
				this.$refs.myMingPop.show();
				this.findApprovalLog({
					current: 1
				});
			},
			findApprovalLog(e) {
				this.$refs.tableApprovalLog.clearSelection();
				let pageNum = e.current;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageSize: _this.pageSize,
					pageNo: pageNum,
					appKey:_this.appKey,
					processInsId:_this.dataId
				};
				let option = {
					url: "/app.bpm/approvalLogPage",
					query: data,
					successCallback: function(resultData) {
						_this.dataList = resultData.rows;
						_this.total = resultData.total;
					}
				};
				//请求方法
				utils.requestDefault(option);
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
</style>
