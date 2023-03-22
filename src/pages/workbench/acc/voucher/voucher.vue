<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">

				<view slot="top">
					<!-- 基本用法 -->
					<uni-search-bar @confirm="onSearch" @cancel="onCancel"></uni-search-bar>
				</view>

				<view style="margin-top:10px;margin-bottom:10px;">
				</view>
				<uni-list>
					<uni-list-item v-for="(detailData,index) in DetailList" :extra-icon="extraIcon"
						:show-extra-icon="true" :ellipsis="1" :title="detailData.groupUuid" showArrow
						:rightText="detailData.projectName" :note="detailData.remarks" clickable
						@click="uploadVoucher(detailData,$event)" />
				</uni-list>

			</z-paging>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as commonKey from "@/common/commonKey.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';

	let fieldList = [{
			label: "凭证编号",
			field: "groupUuid"
		},
		{
			label: "项目名称",
			field: "projectName"
		},
		{
			label: "账套",
			field: "companyName"
		},
		{
			label: "发生额",
			field: "amount"
		},
		{
			label: "格式化发生额",
			field: "formatAmount"
		},
		{
			label: "摘要",
			field: "remarks"
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
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'smallcircle'
				},
				appKey: '',
				eventChannel:null
			}
		},
		onNavigationBarButtonTap() {

		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			//目的是防止多次点击还在同一页面
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let delta = 0;
			for (let i = 0; i < pages.length; i++) {
				let page = pages[i];
				if (page.route == nowPage.route) {
					delta = i;
					break;
				}
			}
			delta = pages.length - delta ;
			console.log("totalSize:" + pages.length + " delta:" + delta + " route:" + nowPage.route);
			uni.navigateBack({
				delta: delta
			});
			return true;
		},
		onLoad(option) {
			let eventChannel = null;
			// #ifdef APP-NVUE
			eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			eventChannel = this.getOpenerEventChannel();
			// #endif
			this.eventChannel = eventChannel;
			let that = this;
			eventChannel.on(commonKey.keys.emitWorkBenchKey, function(data) {
				console.log(data)
			});
			this.appKey = option.appKey;
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		onShow() {
			
		},
		components: {
			"common-custom-panel-grid-item": common_custom_panel_grid_item
		},
		methods: {
			queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					creator: userInfo.userAccount,
					groupUuid: _this.searchValue
				};
				let option = {
					url: "/app.acc/voucher/bomBaseVoucherGroup/getPageResult",
					query: data,
					successCallback: function(resultData) {
						_this.$refs.paging.complete(resultData.rows);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			uploadVoucher(item) {
				item.appKey = this.appKey;
				uni.navigateTo({
					url: "./uploadVoucher?json=" + JSON.stringify(item)
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
