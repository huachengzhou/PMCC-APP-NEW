<template>
	<view class="content">
		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">
				<view slot="top">
					<!-- 基本用法 -->
					<uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
				</view>
				<view v-for="(batchDetail,index) in DetailList" :key="index">
					<view>
						<uni-card :isShadow="true" :extra="showDate(batchDetail.gmtCreated)"
							v-on:click="itemClick(batchDetail,$event)" :title="batchDetail.creatorName" note="true">
							<view style="font-size:10px;">
								<view class="uni-flex uni-row" v-show="getDataStatus(batchDetail) != 0">
									<view v-if="batchDetail.processInsId && batchDetail.processInsId != '0'">
										<uni-icons type="star-filled" size="13" style="color: blue;" />
										{{batchDetail.projectName?batchDetail.projectName+'——':''}}
										{{batchDetail.projectPhaseName?batchDetail.projectPhaseName+'——':''}}
									</view>
									{{batchDetail.estateName}}
								</view>

								<view class="uni-flex uni-row" v-show="getDataStatus(batchDetail) == 0">
									<text style="color: #FF0000;">
										{{batchDetail.estateName}}——案例库待提交审批!
									</text>
								</view>
							</view>
							<template slot="footer">
								<view class="footer-box">
									<view v-show="getDataStatus(batchDetail) == 0">
										<text class="footer-box__item" style="color: #FF0000;">
											{{batchDetail.modelPhoneTypeName}}
										</text>
										<uni-icons type="gear" size="13" style="color:#FF0000;" />
									</view>
									<view @click.stop="itemSetting(batchDetail,$event)"
										v-show="getDataStatus(batchDetail) != 0">
										<view>
											<text class="footer-box__item">
												{{batchDetail.modelPhoneTypeName}}
											</text>
											<uni-icons type="gear-filled" size="13" style="color: #8f8f94;" />
										</view>
									</view>
									<view v-show="getDataStatus(batchDetail) == 1"
										@click.stop="dismissProject(batchDetail,$event)">
										<uni-icons type="redo" size="13" style="color: #8f8f94;" />
										<text class="footer-box__item">解除绑定</text>
									</view>
									<view v-show="getDataStatus(batchDetail) == 2"
										@click.stop="bindProject(batchDetail,$event)">
										<uni-icons type="locked" size="13" style="color: #8f8f94;" />
										<text class="footer-box__item">项目绑定</text>
									</view>
									<view v-show="getDataStatus(batchDetail) == 0">
										<uni-icons type="eye-slash-filled" size="13" style="color: #FF0000;" />
										<text class="footer-box__item" style="color: #FF0000;">未审批</text>
									</view>
									<view @click.stop="itemEidt(batchDetail,$event)">
										<uni-icons type="compose" size="13" style="color: #8f8f94;" />
										<text class="footer-box__item">编辑</text>
									</view>
								</view>
							</template>
						</uni-card>
					</view>
				</view>
			</z-paging>
		</view>
		
		<assess-basic-file-model ref="assessBasicApplyBatchFileModel" @getResults="getAssessBasicApplyBatchFileModel">
		</assess-basic-file-model>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import assess_basic_file_model from '@/components/assess/assess-basic-file-model/assess-basic-file-model.vue';


	export default {
		data() {
			return {
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				appKey: "",
				imgInfo: {
					head: '/static/head.png',
					mine: '/static/ic_mine.png',
				},
				buttonRect: {},
				thisNodeData:{},
				currDate: new Date()
			}
		},
		onNavigationBarButtonTap() {
			var _this = this;
			let query = {
				appKey: _this.appKey
			};
			uni.navigateTo({
				url: "surveyExploreFormSave?" + utils.parseParam(query)
			});
		},
		components: {
			"assess-basic-file-model": assess_basic_file_model
		},
		onShow() {
			let isDoRefresh = uni.getStorageSync("isDoRefresh");
			if (isDoRefresh === 1) {
				uni.removeStorageSync("isDoRefresh");
				this.$nextTick(() => {
					this.$refs.paging.reload();
				});
			}
		},
		onLoad(option) {
			this.appKey = option.appKey;
		},
		methods: {
			async queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					creator: userInfo.userAccount,
					estateName: _this.searchValue
				};
				let option = {
					url: "/app.assess/basicApplyBatch/getBasicApplyBatchByWhere",
					method: 'POST',
					data: data
				};
				await this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						_this.$refs.paging.complete(res.data.data.rows);
					}
				}).catch(err => {
					uni.showModal({
						title: '错误提示',
						content: err.errMsg,
						showCancel: false
					});
				});
			},
			itemSetting(obj, event) {
				const that = this;
				this.thisNodeData = obj;
				uni.showActionSheet({
					title: '查勘操作选项',
					itemList: ['提交审批', '查看审批', '修改案例', '名称自动更新', "选择查勘图片"],
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let index = e.tapIndex;
						switch (index) {
							case 0: {
								that.submitProjectTask(obj, event);
								break;
							}
							case 1: {
								let appKey = that.appKey;
								obj.appKey = appKey;
								var data = {
									taskInfo: obj
								};
								var json = JSON.stringify(data);
								uni.navigateTo({
									url: "bpm/survey/detail?data=" + json
								})
								break;
							}
							case 2: {
								that.itemEidt(obj, event);
								break;
							}
							case 3: {
								let option = {
									data: {
										applyBatchId: obj.id
									},
									method: "POST",
									url: "/app.assess/basicApplyBatch/autoUpdateBasicApplyBatchName?applyBatchId=" +
										obj.id,
									showLoading: true,
									urlParam: true
								};
								that.$myRequest.pmccRequest(option).then(res => {
									if (res.data.ret) {
										uni.showToast({
											title: '更新成功!',
											duration: 1000,
											success() {
												that.$refs.paging.reload();
											}
										});

									}
								});
							}
							case 4: {
								that.$refs.assessBasicApplyBatchFileModel.onFocus();
								break;
							}
							default: {
								break;
							}
						}
					}
				});
			},
			//项目发起任务
			submitProjectTask(obj, event) {
				if (obj.processInsId && obj.processInsId != '0' && obj.processInsId != 0) {
					uni.showToast({
						title: '已经提交过任务了',
						duration: 1000,
						success() {

						}
					});
					return false;
				}
				if (!obj.planDetailsId) {
					uni.showToast({
						title: '未绑定项目不能提交',
						duration: 1000,
						success() {

						}
					});
					return false;
				}
				var userInfo = this.$helper.fetchLocalUser();
				let _this = this;
				var formData = {};
				formData.declareId = '';
				formData.projectId = obj.projectId;
				formData.planDetailsId = obj.planDetailsId;
				let data = {
					userAccount: userInfo.userAccount,
					projectId: obj.projectId,
					projectDetailsId: obj.planDetailsId,
					formData: JSON.stringify(formData),
					mustUseBox: true,
					actualHours: 0
				};
				let option = {
					data: data,
					method: "POST",
					url: "/app.assess/basic/public/submitProjectTask",
					showLoading: true
				};
				_this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '提交成功',
							duration: 1000,
							success() {
								_this.$refs.paging.reload();
							}
						});

					}
				});
			},
			itemClick(obj, event) {
				let query = {
					projectId: '',
					type: obj.type,
					applyBatchId: obj.id,
					modelPhoneType: obj.modelPhoneType,
					planDetailsId: ''
				}
				if (obj.projectId) {
					query.projectId = obj.projectId;
				}
				if (obj.planDetailsId) {
					query.planDetailsId = obj.planDetailsId;
				}
				uni.navigateTo({
					url: "home/surveyExploreHome?" + utils.parseParam(query)
				});
			},
			itemEidt(obj, event) {
				var _this = this;
				let query = {
					appKey: _this.appKey,
					dataJson: JSON.stringify(obj)
				};
				uni.navigateTo({
					url: "surveyExploreFormSave?" + utils.parseParam(query)
				});
			},
			bindProject(obj, event) {
				var _this = this;
				let query = {
					appKey: _this.appKey,
					dataJson: JSON.stringify(obj)
				};
				uni.navigateTo({
					url: "./suveyBindProject?" + utils.parseParam(query)
				});
			},
			dismissProject(obj, event) {
				var userInfo = this.$helper.fetchLocalUser();
				let _this = this;
				let data = {
					userAccount: userInfo.userAccount,
					projectId: obj.projectId,
					planDetailsId: obj.planDetailsId,
					id: obj.id
				};
				let option = {
					data: data,
					method: "POST",
					url: "/app.assess/basicApplyBatch/dismissProject?" + utils.parseParam(data),
					urlParam: true,
					showLoading: true
				};
				uni.showModal({
					title: '提示',
					content: '如果查勘任务已经提交并且被项目经理审核那么则不允许解除绑定？',
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认解除绑定", // 确认按钮文字  
					showCancel: true, // 是否显示取消按钮，默认为 true
					confirmColor: '#f55850',
					cancelColor: '#39B54A',
					success: (res) => {
						if (res.confirm) {
							_this.$myRequest.pmccRequest(option).then(res => {
								if (res.data.ret) {
									if (res.data.data) {
										uni.showToast({
											title: '解除绑定成功',
											duration: 1000,
											success() {
												_this.$refs.paging.reload();
											}
										});
									} else {
										uni.showToast({
											title: '解绑失败!检查任务状态或者使用管理员账号强行解除',
											icon: 'error',
											duration: 3000
										});
									}
								}
							});
						}
					}
				});
			},
			updateBasicApplyBatch(data) {
				var userInfo = this.$helper.fetchLocalUser();
				let _this = this;
				let option = {
					data: data,
					method: "POST",
					url: "/app.assess/basicApplyBatch/updateBasicApplyBatch",
					showLoading: false
				};
				_this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						if (res.data.data) {
							_this.$refs.paging.reload();
						}
					}
				});
			},
			getAssessBasicApplyBatchFileModel(obj){
				let data = this.thisNodeData;
				let dataId = null;
				if(utils.isArray(obj)){
					dataId = obj[0].id;
				}else {
					dataId = obj.id;
				}
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/bind",
					data: {
						id: dataId,
						applyBatchId: data.id
					},
					showLoading: true
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '操作成功'
						});
						this.$refs.paging.reload();
					}
				});
			},
			OnSearch(obj) {
				this.searchValue = obj.value;
				this.$refs.paging.reload();
			},
			onCancel() {
				this.searchValue = null;
				this.$refs.paging.reload();
			},
			showDate(date) {
				if (date) {
					return utils.formatTime(date, "YYYY-MM-DD");
				}
				return "";
			},
			getDiffHours() {
				var ms = new Date().getTime() - this.currDate.getTime();
				if (ms < 0) return 0;
				return (ms / 1000 / 60 / 60).toFixed(4);
			},
			getDataStatus(item) {
				if (item.projectId) {
					return 1;
				}
				if (item.draftFlag) {
					return 0;
				}
				if (item.bisCase) {
					return 2;
				}
				return 0;
			}
		}
	}
</script>

<style scoped>
	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;
	}

	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 10px;
		color: #666;
	}
</style>
