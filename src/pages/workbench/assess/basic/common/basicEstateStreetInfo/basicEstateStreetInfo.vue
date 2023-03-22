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
						<view>
							<common-custom-panel-grid :icon="false" 
								:titles="fieldList" :itemData="itemData">
							</common-custom-panel-grid>
							<uni-group :title="'数据操作'"  mode="card">
								<view>
									<uni-row :gutter="gutter" :width="nvueWidth">
										<uni-col :span="6">
											<view class="text">大门图</view>
										</uni-col>
										<uni-col :span="18">
											<common-image-picker :imageLabelName="'大门图'" :dataObj="setImgFieldsName(itemData,'estateStreetInfoObj')">
											</common-image-picker>
										</uni-col>
									</uni-row>
								</view>
								
								<view>
									<uni-row :gutter="gutter" :width="nvueWidth">
										<uni-col :span="6">
											<view class="text">门牌号</view>
										</uni-col>
										<uni-col :span="18">
											<common-image-picker :imageLabelName="'门牌号'"  :dataObj="setImgFieldsName(itemData,'estateStreetInfoDoorplate')">
											</common-image-picker>
										</uni-col>
									</uni-row>
								</view>
								
								<view>
									<uni-row :gutter="gutter" :width="nvueWidth">
										<uni-col :span="12">
											<button class="uni-button" size="mini" type="primary"
												@click.stop="editItem(itemData)">编辑</button>
										</uni-col>
										<uni-col :span="12">
											<button class="uni-button" size="mini" type="warn"
												@click.stop="deleteItem(itemData)">删除</button>
										</uni-col>
									</uni-row>
								</view>
							</uni-group>
						</view>
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
			label: "街道号",
			field: "streetNumber"
		},
		{
			label: "大门名称",
			field: "gateName"
		},
		{
			label: "附号",
			field: "attachedNumber"
		},
	];
	import * as Explore from '../../../../../../common/assess/Explore.key.js';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';

	export default {
		data() {
			return {
				gutter: 0,
				nvueWidth: 730,
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
				url: "./basicEstateStreetInfoEdit?" + utils.parseParam(param)
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
			console.log(batchDetail);
			console.log(cardObj);
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		components: {
			"common-image-picker": commonImagePicker,
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
					url: "./basicEstateStreetInfoEdit?" + utils.parseParam(param)
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
			setImgFieldsName(item, fields) {
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let fieldsName = fields + item.id;
				let obj = {
					fieldsName: fieldsName,
					tableId: item.id,
					tableName: AssessDBKey.BasicEstateStreetInfo,
					appKey: appCacheKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
