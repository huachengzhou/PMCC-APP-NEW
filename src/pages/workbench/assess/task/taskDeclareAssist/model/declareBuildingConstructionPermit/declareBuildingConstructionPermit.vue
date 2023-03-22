<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>

				<view>
					<common-custom-panel-grid :icon="!bisDetail" :titles="fieldList" :list="DetailList"
						@editItem="editItem" @deleteItem="deleteItem">
					</common-custom-panel-grid>
				</view>
			</z-paging>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";

	var declareCommon = declareCommonUtils.declareCommon;


	let fieldList = [{
			label: "证书编号",
			field: "certificateNumber"
		},
		{
			label: "发证机关",
			field: "issuingOrgan"
		},
		{
			label: "日期",
			field: "date",
			type: "date"
		},
		// {
		// 	label: "建设单位（个人）",
		// 	field: "buildUnit"
		// },
		// {
		// 	label: "建设项目名称",
		// 	field: "name"
		// },
		// {
		// 	label: "建设地址",
		// 	field: "buildAddress"
		// },
		// {
		// 	label: "建设规模",
		// 	field: "scaleConstruction"
		// },
		// {
		// 	label: "勘察单位",
		// 	field: "reconnaissanceUnit"
		// },
		// {
		// 	label: "设计单位",
		// 	field: "designUnit"
		// },
		// {
		// 	label: "施工单位",
		// 	field: "constructionUnit"
		// },
		// {
		// 	label: "监理单位",
		// 	field: "constructionControlUnit"
		// },
		// {
		// 	label: "勘察单位项目负责人",
		// 	field: "reconnaissanceUnitPerson"
		// },
		// {
		// 	label: "设计单位项目负责人",
		// 	field: "designUnitPerson"
		// },
		// {
		// 	label: "施工单位项目负责人",
		// 	field: "constructionUnitPerson"
		// },
		// {
		// 	label: "总监理工程师",
		// 	field: "chiefEngineerConstructionInspection"
		// },
		// {
		// 	label: "合同工期",
		// 	field: "contractPeriod",
		// 	type: "date"
		// },
		// {
		// 	label: "备注",
		// 	field: "remark"
		// },
	];

	export default {
		data() {
			return {
				projectInfo: {},
				phase: {},
				data: {},
				query: {},
				projectPlanDetails: {},
				fieldList: fieldList,
				DetailList: [],
				searchValue: null,
				pulldownLoad: false,
				top: '30px',
				loading: false
			}
		},
		onNavigationBarButtonTap() {
			if (this.bisDetail) {
				uni.showToast({
					title: '详情页不允许添加!',
					duration: 1000,
					icon: "error",
					success() {}
				});
				return false;
			}
			let data = this.data;
			let projectPlanDetails = this.projectPlanDetails;
			let item = {
				masterId: data.centerId,
				planDetailsId: projectPlanDetails.id
			};
			uni.navigateTo({
				url: "./editDeclareBuildingConstructionPermit?json=" + JSON.stringify(item)
			});
		},
		computed: {
			bisDetail: function() {
				let bisDetail = true;
				let query = this.query;
				let dataType = utils.getType(query.bisDetail);
				if (dataType == 'boolean') {
					bisDetail = query.bisDetail;
				}
				return bisDetail;
			}
		},
		onLoad(option) {
			let query = {};
			try {
				query = JSON.parse(option.json);
			} catch (e) {
				try {
					query = uni.getStorageSync(option.keyCacheId);
				} catch (e) {
					uni.showToast({
						title: "参数错误",
						icon: "error",
						duration: 2000
					});
					return false;
				}
			}
			this.phase = query.phase;
			this.projectInfo = query.projectInfo;
			this.projectPlanDetails = query.projectPlanDetails;
			this.query = query;
			if (query.data) {
				this.data = query.data;
			}
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
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
				let batchDetail = this.data;
				if (!batchDetail) {
					return false;
				}
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					masterId: batchDetail.centerId
				};
				if (!data.masterId) {
					return false;
				}
				let option = {
					url: "/app.assess/declare/declareBuildingConstructionPermit/getPageResult",
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
					url: "/app.assess/declare/declareBuildingConstructionPermit/removeById?" + utils.parseParam(query),
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
				uni.navigateTo({
					url: "./editDeclareBuildingConstructionPermit?json=" + JSON.stringify(item)
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
