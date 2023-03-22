<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>

				<view slot="bottom">
					<view class="assessPrimarybutton">
						<button @click.stop="batchNetWork" type="primary">
							<view>快速添加</view>
						</button>
					</view>
				</view>


				<view>
					<common-custom-panel-grid :titles="fieldList" :list="DetailList" @editItem="editItem"
						@deleteItem="deleteItem">
					</common-custom-panel-grid>
				</view>

				<!-- <view class="uni-container">
					<uni-table :loading="loading" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center">供应商名称</uni-th>
							<uni-th align="center">服务内容</uni-th>
							<uni-th align="center">服务内容描述</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(itemData, index) in DetailList" :key="index">
							<uni-td>{{getItemShowName(itemData.supplierName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.serviceContentName)}} </uni-td>
							<uni-td>{{getItemShowName(itemData.remark)}} </uni-td>
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

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view style="margin-top:20rpx;">
						<view>
							<uni-title type="h3" align="center" title="通信网络"></uni-title>
						</view>
					</view>
					<view>
						<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
							:rules="rules">
							<uni-group mode="card">
								<uni-forms-item required name="type" label="服务商类型" label-align="right">
									<uni-data-checkbox multiple v-model="formData.type" :localdata="typeList" />
								</uni-forms-item>
							</uni-group>
						</uni-forms>
					</view>
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<button class="uni-button" size="mini" type="primary" @click.stop="sureFunModel">确定</button>
						<button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
					</view>
				</view>
			</my-ming-pop>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	const AssessDicKey = Explore.AssessDicKey;

	let fieldList = [{
			label: "供应商名称",
			field: "supplierName"
		},
		{
			label: "服务内容",
			field: "serviceContentName"
		},
		{
			label: "服务内容描述",
			field: "remark"
		},
	];

	export default {
		data() {
			return {
				fieldList: fieldList,
				cardObj: null,
				batchDetail: null,
				DetailList: [],
				typeList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				formData: {
					type: ''
				},
				rules: {
					type: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		onNavigationBarButtonTap() {
			let cardObj = this.cardObj;
			var param = {
				cardJson: JSON.stringify(cardObj),
				id: 0
			};
			uni.navigateTo({
				url: "./basicEstateNetworkEdit?" + utils.parseParam(param)
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

			let dataThis = this.$data;
			estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_network_supplier, function(
				resultData) {
				if (!resultData) {
					return false;
				}
				dataThis.typeList = estateCommonUtils.checkboxTransformBaseDic(resultData);
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
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		components: {
			"common-custom-panel-grid": common_custom_panel_grid,
			"my-ming-pop": myMingPop
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
					url: "./basicEstateNetworkEdit?" + utils.parseParam(param)
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
			sureFunModel() {
				// 手动提交表单
				var _this = this;
				//特殊处理一些兼容性东西
				let userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				let arr = [];
				let estateId = this.batchDetail.tableId;
				if (formData.type) {
					formData.type.forEach(supplier => {
						let obj = {
							supplier: supplier,
							bisDelete: false,
							creator: userInfo.userAccount,
							estateId: estateId
						};
						arr.push(obj);
					});
				}
				this.$refs.form.validate().then((res) => {
					let option = {
						method: 'POST',
						data: {
							formData: JSON.stringify(arr)
						},
						url: '/app.assess/basicEstateNetwork/batchInsert',
						showLoading: true
					};
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							this.$refs.paging.reload();
							this.$refs.myMingPop.close();
							uni.showToast({
								title: '保存成功'
							});
						}
					}).catch(err => {
						uni.showModal({
							title: '错误提示',
							content: err.errMsg,
							showCancel: false
						});
					});
				});
			},
			batchNetWork() {
				this.openModel();
			},
			openModel() {
				this.$refs.myMingPop.show();
				this.formData.type = '';
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.formData.type = '';
			}
		}
	}
</script>

<style>

</style>
