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
					<uni-list-item v-for="(detailData,index) in DetailList" :extra-icon="extraIcon"
						:show-extra-icon="true" :ellipsis="1" :title="detailData.projectName" showArrow
						:rightText="detailData.userAccountManagerName"
						:note="getNote(detailData)?getNote(detailData):'进度加载中'" clickable
						@click="itemClick(detailData,$event)" />
				</uni-list>
			</z-paging>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as commonKey from "@/common/commonKey.js";

	export default {
		data() {
			return {
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				appKey: "",
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'smallcircle'
				},
				eventChannel:null
			}
		},
		onNavigationBarButtonTap() {
			var _this = this;

		},
		components: {

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
		methods: {
			queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				let objFun = {
					run: function(bisState, callback) {
						var data = {
							pageNum: pageNo,
							pageSize: pageSize,
							userAccount: userInfo.userAccount,
							projectName: _this.searchValue,
							bisState: bisState
						};
						let option = {
							url: "/app.assess/public/getProjectInfoDtoList",
							method: 'POST',
							data: data
						};
						_this.$myRequest.pmccRequest(option).then(res => {
							if (res.data.ret) {
								if (bisState) {
									let arr = res.data.data.rows;
									let newArr = [];
									if (arr.length != 0) {
										for (let i = 0; i < _this.DetailList.length; i++) {
											let objData = _this.DetailList[i];
											let filterData = null;
											arr.forEach(item => {
												if (objData.id == item.id) {
													filterData = item;
												}
											});
											if (filterData) {
												newArr.push(filterData);
											} else {
												newArr.push(objData);
											}
										}
										_this.DetailList = newArr;
									}
								} else {
									_this.$refs.paging.complete(res.data.data.rows);
								}
								if (callback) {
									callback();
								}
							}
						}).catch(err => {
							uni.showModal({
								title: '错误提示',
								content: err.errMsg,
								showCancel: false
							});
						});
					}
				};
				uni.showToast({
					title: "加载中",
					icon: "loading",
					duration: 2000
				});
				objFun.run(false, function() {
					objFun.run(true);
					uni.showToast({
						title: "加载完成",
						icon: "success",
						duration: 1000
					});
				});

			},
			itemClick(item) {
				item.appKey = this.appKey;
				uni.navigateTo({
					url: "projectCenter/projectCenter?" + utils.parseParam(item)
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
			getNote(obj) {
				let arr = [];
				if (obj.projectCategoryName) {
					arr.push(obj.projectCategoryName);
				}
				if (obj.finishPre) {
					arr.push(" 进度:" + obj.finishPre + "%");
				}
				return arr.join("——");
			}
		}
	}
</script>

<style scoped>

</style>
