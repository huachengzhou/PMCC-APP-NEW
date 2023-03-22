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
							<uni-th align="center">休闲娱乐名称</uni-th>
							<uni-th align="center">休闲娱乐类别</uni-th>
							<uni-th align="center">休闲娱乐距离</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(itemData, index) in DetailList" :key="index">
							<uni-td>{{getItemShowName(itemData.name)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.categoryName)}} </uni-td>
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


				<view class="box-bottom" slot="bottom">
					<view>
						<common-map-poi-search :funType="1" ref="mapPoi" :position="position" :search="search"
							:querytype="querytype" :dataFilterDicByKey="dataFilterDicByKey" @outputResult="mapCallback"
							:dataKey="dataKey">
						</common-map-poi-search>
					</view>
				</view>

			</z-paging>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';
	import * as Explore from '@/common/assess/Explore.key.js';
	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;
	let fieldList = [{
			label: "休闲娱乐名称",
			field: "name"
		},
		{
			label: "休闲娱乐类别",
			field: "categoryName"
		},
		{
			label: "休闲娱乐距离",
			field: "distanceName"
		},
	];

	import commonMapPoiSearch from '@/components/common-map/common-map-poi-search.vue';



	export default {
		data() {
			return {
				dataFilterDicByKey: AssessDicKey.DATA_BASE_MAP_FILTER_RECREATION,
				fieldList: fieldList,
				cardObj: null,
				batchDetail: null,
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				position: "",
				search: "",
				querytype: ""
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
		onNavigationBarButtonTap() {
			let cardObj = this.cardObj;
			var param = {
				cardJson: JSON.stringify(cardObj),
				id: 0
			};
			uni.navigateTo({
				url: "./basicMatchingLeisurePlaceMatchingRecreationEdit?" + utils.parseParam(param)
			});
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

			this.setMapPostion();
			console.log(batchDetail);
			console.log(cardObj);
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		components: {
			"common-map-poi-search": commonMapPoiSearch,
			"common-custom-panel-grid": common_custom_panel_grid
		},
		computed: {
			dataKey() {
				let key = AssessDicKey.estate_entertainment_category;
				return key;
			}
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
			mapCallback(result, ) {
				let _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let url = "/app.assess/basicMatchingLeisurePlace/addMapData";
				let query = {
					formData: JSON.stringify(result),
					type: _this.cardObj.childType,
					masterId: _this.cardObj.masterId,
					creator: userInfo.userAccount
				};
				let option = {
					url: url,
					query: query,
					successCallback: function() {
						uni.showToast({
							title: '保存成功'
						});
						_this.$refs.paging.reload();
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			setMapPostion() {
				let _this = this;
				let query = {
					tableId: _this.batchDetail.tableId,
					type: _this.batchDetail.type
				};
				estateCommonUtils.getBasicEstateTaggingDtoListByWhere(query, function(resultData) {
					if (!resultData) {
						return false;
					}
					if (utils.isArrayEmpty(resultData)) {
						return false;
					}
					let tempData = resultData[0];
					let position = tempData.lng + "," + tempData.lat;
					_this.position = position;
					_this.$refs.mapPoi.initBaseData();
				});
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
					url: "./basicMatchingLeisurePlaceMatchingRecreationEdit?" + utils.parseParam(param)
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
