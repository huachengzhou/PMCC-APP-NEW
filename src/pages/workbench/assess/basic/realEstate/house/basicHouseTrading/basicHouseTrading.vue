<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>

				<view class="uni-container">

					<view v-for="(itemData, index) in DetailList" :key="index">
						<uni-forms :modelValue="itemData" ref="form" validate-trigger="bind" err-show-type="undertext">
							<view>
								<common-custom-panel-grid :icon="false" :title="getItemShowName(index)"
									:titles="fieldList" :itemData="itemData">
								</common-custom-panel-grid>
							</view>
							<uni-group title="操作" mode="card">
								<view v-show="!commitFlag">
									<button type="primary" size="mini" @click="editItem(itemData)">编辑</button>
									<button v-if="index != 0" type="primary" size="mini"
										@click="deleteItem(itemData)">移除
									</button>
								</view>
								<view v-if="itemData.tradingTypeName == '出租'">
									<button type="primary" size="mini" @click="openTradingTypePage(1,itemData)">出租比率
									</button>
								</view>
								<view v-if="itemData.tradingTypeName == '出售'">
									<button type="primary" size="mini" @click="openTradingTypePage(2,itemData)">分期支付
									</button>
								</view>
							</uni-group>
						</uni-forms>
					</view>
				</view>
			</z-paging>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';

	let fieldList = [{
			label: "财产范围",
			field: "scopePropertyName"
		},
		{
			label: "范围包括",
			field: "scopeInclude"
		},
		{
			label: "范围不包括",
			field: "scopeNotInclude"
		},
		{
			label: "税费负担",
			field: "taxBurdenName"
		},
		{
			label: "交易情况",
			field: "transactionSituationName"
		},
		{
			label: "价格类型",
			field: "priceTypeName"
		},
		{
			label: "交易类型",
			field: "tradingTypeName"
		},
		{
			label: "付款方式",
			field: "paymentMethodName"
		},
		{
			label: "交易时间",
			field: "tradingTimeName"
		},
		{
			label: "交易总价（元）",
			field: "tradingTotalPrice"
		},
		{
			label: "交易单价（元）",
			field: "tradingUnitPrice"
		},
	];

	export default {
		data() {
			return {
				fieldList: fieldList,
				cardObj: null,
				homeParam: {},
				commitFlag: false,
				commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
				batchDetail: null,
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				transferId: '',
			}
		},
		onNavigationBarButtonTap() {
			var _this = this;
			var userInfo = _this.$helper.fetchLocalUser();
			let cardObj = this.cardObj;
			let batchDetail = this.batchDetail;
			let detailList = this.DetailList;
			console.log(detailList);

			let query = {
				houseId: cardObj.masterId,
				creator: userInfo.userAccount
			};
			if (detailList.length > 0) {
				query = detailList[0];
				let tradingTimeString = query.tradingTime;
				delete query.id;
				delete query.applyId;
				delete query.bisDelete;
				delete query.gmtCreated;
				delete query.gmtModified;
				query.tradingTimeString = tradingTimeString;
				query.creator = userInfo.userAccount;
				query.houseId = cardObj.masterId;
			}
			let option = {
				url: _this.cardObj.saveAndUpdateUrl,
				query: query,
				successCallback: function() {
					uni.showToast({
						title: '添加成功!',
						success() {
							_this.$refs.paging.reload();
						}
					});
				}
			};
			uni.showModal({
				title: "提示？",
				content: "添加新的交易信息",
				confirmText: "确定",
				cancelText: "取消",
				cancelColor: "#DD524D",
				confirmColor: "#4CD964",
				success: (res) => {
					if (res.confirm) {
						utils.requestDefault(option);
					}
				}
			});
			console.log(batchDetail);
			console.log(cardObj);
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

			if (option.homeParam) {
				this.homeParam = JSON.parse(option.homeParam);
			}
			//提交按钮控制
			estateCommonUtils.runBasicCheckWriteContent(this.homeParam.applyBatchId, this.$helper.fetchLocalUser(), this
				.$data);
			console.log(this.homeParam);
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		components: {
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
				var _this = this;
				let cardObj = this.cardObj;
				let batchDetail = this.batchDetail;
				var param = {
					cardJson: JSON.stringify(cardObj),
					batchDetailJson: JSON.stringify(batchDetail),
					id: item.id,
					transferId: _this.transferId
				};
				uni.navigateTo({
					url: "./basicHouseTradingEdit?" + utils.parseParam(param)
				});
			},
			getItemShowName(index) {
				let count = index + 1;
				return "交易信息" + count;
			},
			onSearch(obj) {
				this.searchValue = obj.value;
				this.$refs.paging.reload();
			},
			onCancel() {
				this.searchValue = null;
				this.$refs.paging.reload();
			},
			openTradingTypePage(key, itemData) {
				let tradingId = itemData.id;
				let card = {
					host: `${this.$config.server.host}`,
				};
				let batchDetail = this.batchDetail;
				let url = "";
				if (key == 1) {
					card.pageUrl = "/app.assess/basicHouseTradingLease/getPageResult";
					card.saveAndUpdateUrl = "/app.assess/basicHouseTradingLease/saveAndUpdateNew";
					card.deleteUrl = "/app.assess/basicHouseTradingLease/removeById";
					card.getUrl = "/app.assess/basicHouseTradingLease/getById";
					url = "../../../common/basicHouseTradingLease/basicHouseTradingLease";
				}
				if (key == 2) {
					card.pageUrl = "/app.assess/basicHouseTradingSell/getPageResult";
					card.saveAndUpdateUrl = "/app.assess/basicHouseTradingSell/saveAndUpdateNew";
					card.deleteUrl = "/app.assess/basicHouseTradingSell/removeById";
					card.getUrl = "/app.assess/basicHouseTradingSell/getById";
					url = "../../../common/basicHouseTradingSell/basicHouseTradingSell";
				}
				let param = {
					cardJson: JSON.stringify(card),
					batchDetailJson: JSON.stringify(batchDetail),
					transferId: batchDetail.id,
					tradingId: tradingId
				};

				uni.navigateTo({
					url: url + "?" + utils.parseParam(param)
				});

			}
		}
	}
</script>

<style>

</style>
