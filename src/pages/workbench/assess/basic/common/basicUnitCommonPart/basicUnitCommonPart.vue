<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>
				
				<view>
					<common-custom-panel-grid :titles="fieldList" :list="DetailList"  @editItem="editItem"
						@deleteItem="deleteItem">
					</common-custom-panel-grid>
				</view>

				<!-- <view class="uni-container">
					<uni-table :loading="loading" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center">公共部位</uni-th>
							<uni-th align="center">单位</uni-th>
							<uni-th align="center">数量</uni-th>
							<uni-th align="center">描述</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(itemData, index) in DetailList" :key="index">
							<uni-td>{{getItemShowName(itemData.unitCommonPart)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.unitMonad)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.unitQuantity)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.unitLocation)}} </uni-td>
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

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';

	let fieldList = [{
			label: "公共部位",
			field: "unitCommonPart"
		},
		{
			label: "单位",
			field: "unitMonad"
		},
		{
			label: "数量",
			field: "unitQuantity"
		},
		{
			label: "描述",
			field: "unitLocation"
		}
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
			}
		},
		onNavigationBarButtonTap() {
			let cardObj = this.cardObj;
			var param = {
				cardJson: JSON.stringify(cardObj),
				id: 0
			};
			uni.navigateTo({
				url: "./basicUnitCommonPartEdit?" + utils.parseParam(param)
			});
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
					url: "./basicUnitCommonPartEdit?" + utils.parseParam(param)
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
			}
		}
	}
</script>

<style>

</style>
