<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>

				<view>
					<common-custom-panel-grid :titles="fieldList" :list="DetailList" @editItem="editItem"
						@deleteItem="deleteItem">
					</common-custom-panel-grid>
				</view>

				<!-- <view class="uni-container">
					<uni-table :loading="loading" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center">名称</uni-th>
							<uni-th align="center">方位</uni-th>
							<uni-th align="center">街道级别</uni-th>
							<uni-th align="center">交通流量</uni-th>
							<uni-th align="center">人流量</uni-th>
							<uni-th align="center">距离</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(itemData, index) in DetailList" :key="index">
							<uni-td>{{getItemShowName(itemData.streetName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.positionName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.streetLevelName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.trafficFlowName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.visitorsFlowrateName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.distanceName)}} </uni-td>
							<uni-td>
								<button class="uni-button" size="mini" type="primary"
									@click.stop="editItem(itemData)">编辑</button>
								<button class="uni-button" size="mini" type="warn"
									@click.stop="deleteItem(itemData)">删除</button>
							</uni-td>
						</uni-tr>
					</uni-table>
				</view> -->
			</z-paging>
		</view>

		<facestreet-quote @getResults="getResults" :dataValue="estateId" ref="streetQuote"></facestreet-quote>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import assessBasicFacestreetQuote from '@/components/assess/common/assess-basic-facestreet-quote/assess-basic-facestreet-quote.vue';
	import * as Explore from '@/common/assess/Explore.key.js';
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';
	const AssessDBKey = Explore.AssessDBKey;
	let fieldList = [{
			label: "名称",
			field: "streetName"
		},
		{
			label: "方位",
			field: "positionName"
		},
		{
			label: "街道级别",
			field: "streetLevelName"
		},
		{
			label: "交通流量",
			field: "trafficFlowName"
		},
		{
			label: "人流量",
			field: "visitorsFlowrateName"
		},
		{
			label: "距离",
			field: "distanceName"
		},
	];
	export default {
		data() {
			return {
				fieldList: fieldList,
				cardObj: null,
				batchDetail: null,
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				estateId: '',
			}
		},
		onNavigationBarButtonTap(e) {
			let cardObj = this.cardObj;
			let index = e.index;
			if (index == 0) {
				var param = {
					cardJson: JSON.stringify(cardObj),
					id: 0
				};
				uni.navigateTo({
					url: "./basicHouseFaceStreetEdit?" + utils.parseParam(param)
				});
			} else if (index == 1) {
				this.openMainRoadQuote();
			}

		},
		onBackPress() {
			let batchDetail = this.batchDetail;
			try {
				uni.getStorage({
					key: estateCommonUtils.childNavigationCacheKey(batchDetail.id),
					success: function(res) {
						let query = res.data;
						if (query) {
							let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
							uni.redirectTo({
								url: url
							});
							return true;
						} else {
							return false;
						}
					}
				});
			} catch (e) {
				return false;
			}
			console.log("拦截");
			return false;
		},
		onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let batchDetail = {};
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.cardObj = cardObj;
			this.batchDetail = batchDetail;
			console.log(batchDetail);
			console.log(cardObj);
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		components: {
			"facestreet-quote": assessBasicFacestreetQuote,
			"common-custom-panel-grid": common_custom_panel_grid
		},
		methods: {
			queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				if (!_this.batchDetail) {
					return false;
				}
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					// creator: userInfo.userAccount,
					masterId: _this.batchDetail.tableId
					// fullName: _this.searchValue
				};
				if (!data.masterId) {
					return false;
				}
				if (_this.cardObj.childType) {
					data.childType = _this.cardObj.childType;
				}
				let option = {
					url: _this.cardObj.pageUrl,
					query: data,
					successCallback: function(resultData) {
						_this.$refs.paging.complete(resultData.rows);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			deleteItem(item) {
				var _this = this;
				var query = {
					id: item.id
				};
				let option = {
					url: _this.cardObj.deleteUrl + "?" + utils.parseParam(query),
					query: query,
					notParam: true,
					successCallback: function() {
						uni.showToast({
							title: '删除成功',
							success() {
								uni.hideLoading();
								_this.$refs.paging.reload();
							}
						});
					}
				};
				uni.showModal({
					title: "确定删除当前数据？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							});
							utils.requestDefault(option);
						}
					}
				});
			},
			editItem(item) {
				let cardObj = this.cardObj;
				var param = {
					cardJson: JSON.stringify(cardObj),
					id: item.id
				};
				uni.navigateTo({
					url: "./basicHouseFaceStreetEdit?" + utils.parseParam(param)
				});
			},
			getItemShowName(name) {
				return utils.getItemShowName(name);
			},
			onSearch(obj) {
				this.searchValue = obj.value;
				this.$refs.paging.reload();
			},
			onCancel() {
				this.searchValue = null;
				this.$refs.paging.reload();
			},
			openMainRoadQuote() {
				let batchDetail = this.batchDetail;
				let that = this;
				let option = {
					query: {
						tableId: batchDetail.tableId,
						tableName: AssessDBKey.BasicHouse,
						resultTableName: AssessDBKey.BasicEstate
					},
					url: "/app.assess/basicApplyBatchDetail/getSpecifyNodeData",
					successCallback: function(resultData) {
						that.estateId = resultData.tableId;
						setTimeout(function() {
							that.$refs.streetQuote.onFocus();
						}, "300");
					}
				};
				utils.requestDefault(option);
			},
			getResults(rows) {
				if (this.$commonUtils.isArrayEmpty(rows)) {
					return false;
				}
				let that = this;
				let batchDetail = this.batchDetail;
				var userInfo = this.$helper.fetchLocalUser();
				let ids = [];
				rows.forEach(item => {
					ids.push(item.id);
				});
				let query = {
					id: ids.join(","),
					houseId: batchDetail.tableId,
					userAccount: userInfo.userAccount
				};
				let option = {
					notParam: true,
					query: query,
					url: "/app.assess/basicHouseFaceStreet/itemReferenceDataByIds?" + utils.parseParam(query),
					successCallback: function() {
						that.$refs.paging.reload();
						uni.showToast({
							title: '成功!'
						});
					}
				};
				utils.requestDefault(option);
			}
		}
	}
</script>

<style>

</style>
