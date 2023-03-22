<template>
	<view class="content">
		<view>
			<z-paging ref="paging" fixed @query="queryPageList" v-model="taskList">
				<view class="expensetop picker-border" slot="top">
					<view style="-webkit-flex: 1;flex: 1;">
						<uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
					</view>
					<view style="width: 80px;">
						<picker @change="changeBisMApproval" :value="bisMApprovalIndex" :range="bisMApprovalList" range-key="name">
							<view  v-if="bisMApprovalList.length > 0" class="select-Input-picker">{{bisMApprovalList[bisMApprovalIndex].name}}</view>
						</picker>
					</view>
					
				</view>
				<view v-for="(item,index) in taskList" :key="index" >
					<view class="example-body">
						<uni-card :isShadow="true" :title="item.creatorName"
							:subTitle="item.processNameCn" mode="title" :thumbnail="imgInfo.mine" :extra="item.createdName" note="true">
							<view>
								
								<view class="content-box">
									<!-- <text class="content-box-text">{{item.description}}</text> -->
									<rich-text :nodes="item.description"></rich-text>
								</view>
							</view>
							<template slot="footer">
								<view v-if ="item.bisMApproval"  class="footer-box">
									<view @click.stop="toVacationApprove(item,$event)" ><text class="footer-box__item">审核</text>
									</view>
									<view  @click.stop="onTaskInfoDetail(item,$event)">
										<text class="footer-box__item">详情</text>
									</view>
									<!-- <view >
										<text class="footer-box__item">转交</text>
									</view> -->
								</view>
								<view v-else   style="text-align: center;">
									<text>手机暂不支持该流程审核</text>
								</view>
							</template>
						</uni-card>
					</view>

				</view>
			</z-paging>
		</view>
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				bisMApprovalList:[{name:'全部',value:false},{name:'可审批',value:true}],
				bisMApprovalIndex:0,
				bisMApproval:false,
				appMenu:'',
				taskList: [],
				searchValue: null,
				pulldownLoad: false,
				top: '30px',
				imgInfo: {
					head: '/static/head.png',
					mine: '/static/ic_mine.png',
				}
			}
		},
		onShow() {
			this.$nextTick(()=>{
				this.$refs.paging.reload();
			})
		},
		methods: {
			  async queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNumber: pageNo,
					pageSize: pageSize,
					bisMApproval:_this.bisMApproval,
					userAccount: userInfo.userAccount,
					search: _this.searchValue
				};
				let res = await _this.$myRequest.pmccRequest({
					url: `/app.myTaskInfo/myTaskPage`,
					method: 'POST',
					data: data
				});
				if (res.data.ret) {
					this.$refs.paging.complete(res.data.data.rows);
				} else {
					this.msgType =  'error';
					this.message = res.data.errmsg
					this.$refs.popupMessage.open();
					// uni.showToast({
					// 	title: res.data.errmsg,
					// 	mask: true,
					// 	duration: 1000
					// });
				}

			},
			 async onTaskInfoDetail(taskInfo, event) {
				await this.getUrl(taskInfo);
				var data ={
					taskInfo:taskInfo
				}
				var json = JSON.stringify(data);
				let urlhead = this.appMenu.processDisplayUrl
				let url = urlhead +'?data=' + json;
				console.log("url:"+url);
				uni.navigateTo({
					url: url
				})
			},
			OnSearch(obj) {
				this.searchValue = obj.value;
				this.$refs.paging.reload();
			},
			onCancel(){
				this.searchValue = null;
				this.$refs.paging.reload();
			},
			async toVacationApprove(taskInfo, event){
				await this.getUrl(taskInfo);
				var data ={
					taskInfo:taskInfo	
				}
				var json = JSON.stringify(data);
				let urlhead = taskInfo.currActivity==='edit'?this.appMenu.processEditUrl:this.appMenu.processApprovalUrl
				let url = urlhead +'?data=' + json;
				uni.navigateTo({
					url: url
				})
				
			},
			async getUrl(data){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.myTaskInfo/getTaskUrl',
					method: 'POST',
					data:{formData:JSON.stringify(data)}
				})
				if(res.data.ret){
					_this.appMenu = res.data.data;
				}else{
					_this.appMenu = '';
					this.msgType =  'error';
					this.message = res.data.errmsg
					this.$refs.popupMessage.open();
					// uni.showToast({
					// 	title: res.data.errmsg,
					// 	mask: true,
					// 	duration: 1000
					// }); 
				}
				
			},
			changeBisMApproval(e){
				this.bisMApprovalIndex = e.detail.value;
				this.bisMApproval = this.bisMApprovalList[this.bisMApprovalIndex].value;
				this.$refs.paging.reload();
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			}
			
		}
	}
</script>

<style scoped>
	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;
	}
	.expensetop{
		display: flex;
		flex-direction: row;
	}
	
	.select-Input-picker {
		height: 50rpx;
		 padding: 25rpx 0rpx; 
		line-height:50rpx;
		font-size:28rpx;
		background:#FFF;
		flex: 1;
		text-align: center
	}
	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 12px;
		color: #666;
	}
</style>
