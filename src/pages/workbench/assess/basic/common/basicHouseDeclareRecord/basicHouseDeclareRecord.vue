<template>
	<view class="container">
		<uni-section title="权证列表" type="line">
			<button class="mini-btn slot-image" type="primary" plain="true" size="mini"
				@click="selectDeclareModal()">选择</button>
			<button class="mini-btn slot-image" type="warn" plain="true" size="mini" @click="clearDeclare()">清空</button>
		</uni-section>
		<uni-list>
			<uni-list-item title="权证信息" v-for="(item,index) in declareList">
				<template v-slot:body>
					<text class="slot-box">{{item}}</text>
				</template>
			</uni-list-item>
		</uni-list>
		<assess-basic-declare-modal :projectId="projectId" ref="assess_basic_declare_modal"
			@getResults="selectedDeclare">
		</assess-basic-declare-modal>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import assess_basic_declare_modal from '@/components/assess/assess-basic-select-declare/assess-basic-select-declare.vue';
	export default {
		components: {
			"assess-basic-declare-modal": assess_basic_declare_modal
		},
		data() {
			return {
				projectId: 0,
				cardObj: null,
				batchDetail: null,
				declareList: []
			};
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
			this.projectId = batchDetail.projectId;
			this.getDeclareList();
		},
		methods: {
			getDeclareList: function() {
				let _this = this;
				let option = {
					data: {
						id: _this.batchDetail.id
					},
					urlParam: true,
					method: "POST",
					url: "/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailById?id=" + _this.batchDetail
						.id
				};
				this.$myRequest.pmccRequest(option).then(res => {
					this.declareList = [];
					if (res.data.ret && res.data.data.declareRecordName) {
						let array = res.data.data.declareRecordName.split(",");
						for (var i = 0; i < array.length; i++) {
							this.declareList.push(array[i]);
						}
					}
				});
			},
			//清空权证
			clearDeclare: function(id) {
				uni.showModal({
					title: "确定清空权证？",
					content: "清空权证数据不可恢复",
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
							this.$myRequest.pmccRequest({
								data: {
									applyBatchDetailId: this.batchDetail.id
								},
								method: "POST",
								urlParam: false,
								url: "/app.assess/basicApplyBatchDetail/clearDeclareRecord"
							}).then(res => {
								if (res.data.ret) {
									uni.hideLoading();
									this.declareList = [];
								}
							});
						}
					}
				});
			},
			//选择权证弹窗
			selectDeclareModal: function() {
				this.$refs.assess_basic_declare_modal.onFocus();
			},
			//选择权证
			selectedDeclare: function(arr) {
				if (arr && arr.length > 0) {
					let tempArray = this.declareList;
					let declareRecordIds = '';
					let declareRecordName = '';
					for (let i = 0; i < arr.length; i++) {
						let item = arr[i];
						tempArray.push(item.name);
						declareRecordIds += item.id + ",";
						declareRecordName += item.name + ",";
					}
					this.$myRequest.pmccRequest({
						data: {
							applyBatchDetailId: this.batchDetail.id,
							declareRecordIds: declareRecordIds.replace(/,$/, ''),
							declareRecordName: declareRecordName.replace(/,$/, '')
						},
						method: "POST",
						urlParam: false,
						url: "/app.assess/basicApplyBatchDetail/bindDeclareRecord"
					}).then(res => {
						if (res.data.ret) {
							this.declareList = tempArray;
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 80px;
		height: 30px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}
</style>
