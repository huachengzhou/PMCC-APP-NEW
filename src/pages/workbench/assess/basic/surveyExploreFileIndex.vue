<template>
	<view class="content">
		<view>
			<z-paging ref="paging" :fixed="true" @query="queryPageList" v-model="DetailList">
				<view slot="top">
					<!-- 基本用法 -->
					<uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
				</view>
				<view style="margin-top:10px;margin-bottom:10px;">
				</view>
				<uni-list>
					<uni-list-item v-for="(detailData,index) in DetailList"
						:extra-icon=" detailData.status == 'finish'?extraIcon:extraIconOld" :show-extra-icon="true"
						:ellipsis="1" :title="detailData.name" showArrow :rightText="detailData.creatorName"
						:note="showDate(detailData.gmtCreated)" clickable @click="itemClick(detailData,$event)" />
				</uni-list>
			</z-paging>
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view style="margin-top:20rpx;">
						<view>
							<uni-title type="h3" align="center" title="查勘图片名称"></uni-title>
						</view>
					</view>
					<view>
						<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
							:rules="rules">
							<uni-group mode="card">
								<uni-forms-item required name="name" label="名称" label-align="right">
									<uni-easyinput type="text" v-model="formData.name" placeholder="名称">
									</uni-easyinput>
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
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	export default {
		data() {
			return {
				DetailList: [],
				buttonRect: {},
				searchValue: '',
				appKey: "",
				extraIcon: {
					color: '#5500ff',
					size: '22',
					type: 'circle-filled'
				},
				extraIconOld: {
					color: '#DCDCDC',
					size: '22',
					type: 'circle-filled'
				},
				formData: {
					name: '',
					id: ''
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		components: {
			"my-ming-pop": myMingPop
		},
		onNavigationBarButtonTap() {
			var _this = this;
			this.openModel();
		},
		onLoad(option) {
			this.appKey = option.appKey;
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		methods: {
			queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					pid: 0,
					userAccount: userInfo.userAccount,
					name: _this.searchValue,
				};
				let option = {
					url: "/app.assess/basicApplyBatchFileModel/getMyPageResult",
					method: 'POST',
					data: data
				};
				_this.$myRequest.pmccRequest(option).then(res => {
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
			itemClick(item) {
				const that = this;
				let userInfo = this.$helper.fetchLocalUser();
				let arr = [{
					code: 0,
					text: '编辑名称'
				}, {
					code: 1,
					text: '删除查勘图片数据'
				}, {
					code: 2,
					text: '上传查勘图片数据'
				}, {
					code: 3,
					text: '查看查勘图片数据'
				}, 
				// {
				// 	code: 4,
				// 	text: '完成查勘图片上传'
				// },
				];
				if (item.status) {
					// if (item.status == 'finish') {
					// 	let newArr = [];
					// 	for (let i = 0; i < arr.length; i++) {
					// 		let obj = arr[i];
					// 		if (obj.code == 3) {
					// 			newArr.push(obj);
					// 		}
					// 	}
					// 	arr = newArr;
					// }
				}
				if (item.creator) {
					if (item.creator != userInfo.userAccount) {
						let newArr = [];
						for (let i = 0; i < arr.length; i++) {
							let obj = arr[i];
							if (obj.code == 3) {
								newArr.push(obj);
							}
						}
						arr = newArr;
					}
				}
				let strArr = [];
				for (let i = 0; i < arr.length; i++) {
					strArr.push(arr[i].text);
				}
				uni.showActionSheet({
					title: '操作选项',
					itemList: strArr,
					popover: {
						top: that.buttonRect.top * 2 + that.buttonRect.height,
						left: that.buttonRect.left + that.buttonRect.width / 2
					},
					success: (e) => {
						let obj = arr[e.tapIndex];
						let index = obj.code;
						//这里巧妙利用 索引  作用是我可以动态改变数组里的内容,并且和元素顺序脱钩 从而起到了动态作用
						switch (index) {
							case 0: {
								this.openModel();
								this.formData.name = item.name;
								this.formData.id = item.id;
								break;
							}
							case 1: {
								uni.showModal({
									title: "确定删除当前数据？",
									content: "删除相应的数据不可恢复",
									confirmText: "确定",
									cancelText: "取消",
									cancelColor: "#DD524D",
									confirmColor: "#4CD964",
									success: (res) => {
										if (res.confirm) {
											this.$myRequest.pmccRequest({
												method: 'POST',
												url: "/app.assess/basicApplyBatchFileModel/deleteById",
												data: {
													id: item.id
												},
												showLoading: true
											}).then(res => {
												if (res.data.ret) {
													uni.showToast({
														title: '删除成功'
													});
													this.$refs.paging.reload();
												}
											});
										}
									}
								});
								break;
							}
							case 2: {
								this.writeItemData(item, false);
								break;
							}
							case 3: {
								this.writeItemData(item, true);
								break;
							}
							case 4: {
								uni.showModal({
									title: "确定完成当前模型？",
									content: "完成相应的数据不可在处理数据",
									confirmText: "确定",
									cancelText: "取消",
									cancelColor: "#DD524D",
									confirmColor: "#4CD964",
									success: (res) => {
										if (res.confirm) {
											this.$myRequest.pmccRequest({
												method: 'POST',
												url: "/app.assess/basicApplyBatchFileModel/finish",
												data: {
													id: item.id
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
										}
									}
								});
								break;
							}
							default: {
								break;
							}
						}
					}
				});
			},
			writeItemData(item, bisDetail) {
				let appKey = this.appKey;
				var param = {
					id: item.id,
					appKey: appKey,
					bisDetail: bisDetail,
					title: item.name
				};
				uni.navigateTo({
					url: "./surveyExploreFileItem?" + utils.parseParam(param)
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
			sureFunModel() {
				// 手动提交表单
				var _this = this;
				//特殊处理一些兼容性东西
				let userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				let data = {
					name: formData.name,
					id: formData.id,
					pid: 0,
					userAccount: userInfo.userAccount
				};
				this.$refs.form.validate().then((res) => {
					let option = {
						method: 'POST',
						data: data,
						showLoading: true
					};
					if (data.id) {
						option.url = "/app.assess/basicApplyBatchFileModel/updateBasicApplyBatchFileModel";
					} else {
						option.url = "/app.assess/basicApplyBatchFileModel/addModel";
					}
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
			openModel() {
				this.$refs.myMingPop.show();
				this.formData.name = '';
				this.formData.id = '';
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.formData.name = '';
				this.formData.id = '';
			}
		}
	}
</script>

<style scoped>

</style>
