<template>
	<view>

		<view>
			<uni-easyinput :disabled="disabled"   :clearable="false" v-model="selectedResults" @focus="onFocus()" placeholder="请选择项目">
			</uni-easyinput>
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<uni-search-bar @confirm="onBasicAlternativeCaseSearch" @cancel="onBasicAlternativeCaseCancel">
						</uni-search-bar>
					</view>

					<uni-table ref="tableAlternativeCase" type="selection" @selection-change="selectionTableChange"
						:loading="loadingFlag" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="left" style="height:60rpx;">项目名称</uni-th>
							<uni-th align="left" style="height:60rpx;">创建时间</uni-th>
						</uni-tr>
						<uni-tr v-for="(itemData, index) in basicAlternativeCaseList" :key="index">
							<uni-td><text>
									{{getItemShowName(itemData.projectName)}}
								</text></uni-td>
							<uni-td><text>{{showDate(itemData.gmtCreated)}}</text></uni-td>
						</uni-tr>
					</uni-table>

					<view class="uni-pagination-box">
						<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
							@change="getProjectInfoDtoList" />
						<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
							<button class="uni-button" size="mini" type="primary"
								@click.stop="referenceAlternativeCase">确定</button>
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
	import * as utils from "../../../common/untils.js";
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	export default {
		props: {
			dataValue: {
				type: [String, Number],
				default: ""
			}
		},
		watch: {},
		components: {
			"my-ming-pop": myMingPop
		},
		data() {
			return {
				disabled : false,
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
				basicAlternativeCaseList: [],
			};

		},
		methods: {
			clear(){
				this.selectedResults = '' ;
				this.pageCurrent = 1;
				this.total = 0;
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.disabled = false;
			} ,
			selectionTableChange(e) {
				this.selectedIndexs = e.detail.index;
			},
			getItemShowName(name) {
				return utils.getItemShowName(name, 24);
			},
			onFocus() {
				this.selectedResults = this.dataValue;
				this.pageCurrent = 1;
				this.total = 0;
				this.$refs.myMingPop.show();
				this.getProjectInfoDtoList({
					current: 1
				});
				this.disabled = true;
			},
			onBasicAlternativeCaseCancel() {
				this.searchValue = null;
				this.getProjectInfoDtoList({
					current: 1
				});
			},
			onBasicAlternativeCaseSearch(obj) {
				this.searchValue = obj.value;
				this.getProjectInfoDtoList({
					current: 1
				});
			},
			getProjectInfoDtoList(e) {
				this.$refs.tableAlternativeCase.clearSelection();
				let pageNum = e.current;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let name = this.searchValue;
				var data = {
					pageSize: _this.pageSize,
					pageNum: pageNum
				};
				if (name) {
					data.projectName = name;
				}
				let option = {
					url: "/app.assess/basicApplyBatch/getProjectInfoDtoList",
					query: data,
					successCallback: function(resultData) {
						_this.basicAlternativeCaseList = resultData.rows;
						_this.total = resultData.total;
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			referenceAlternativeCase() {
				let _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let list = this.basicAlternativeCaseList;
				let selectedIndexs = this.selectedIndexs;
				if (list.length == 0 || selectedIndexs.length == 0) {
					this.$refs.myMingPop.close();
					return false;
				}
				if (selectedIndexs.length > 1) {
					uni.showToast({
						title: '只能选择一个',
						icon: 'error',
						duration: 3000
					});
					return false;
				}
				let arr = [];
				let selectedResults = [];
				for (let i = 0; i < selectedIndexs.length; i++) {
					let index = selectedIndexs[i] ;
					arr.push(list[index]);
					selectedResults.push(list[index].projectName);
				}
				this.selectedResults = selectedResults.join(",");
				this.$emit("getResults", arr);
				this.$refs.myMingPop.close();
				this.disabled = false;
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
