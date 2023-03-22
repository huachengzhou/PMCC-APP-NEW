<template>
	<view>
		<view >
			<z-paging ref="paging" fixed @query="queryPageList" v-model="dataList">
				<uni-swipe-action>
					<uni-swipe-action-item  v-for="(item,index) in dataList"  :key="index" :right-options="options"  @click="onClick($event,item.id)"   @change="swipeChange($event, index)" >
						<view class="content-box" @click="toMessageDetail(item)">
							<view class="uni-flex uni-row content-head"  >
								<!-- <view style="width: 200px; font-size: 18px;" ><text>{{item.userSendName}}</text></view> -->
								<view style="-webkit-flex: 1;flex: 1; text-align: right; font-size: 12px; color: #797979;" ><text>{{formatTime(item.sendTime,'YYYY-MM-DD')}} </text></view>
							</view>
							<view class="uni-flex uni-row content-text"   >
								<view > <uni-icons v-if="!item.bisRead" type="chat" size="22"></uni-icons></view>
								<view  style="font-size: 15px;"><text class="flex-text">{{item.messageContent}}</text></view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action> 
			</z-paging>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scheduleText:'',
				dataList:[],
				options:[
					 {
						 text: '删除',
						 style: {
							 backgroundColor: '#ff0000'
							 
						 }
					 }
				]
			}
		},
		/**
		 * 当 searchInput 输入时触发
		 */
		onNavigationBarSearchInputChanged(e) {
			this.scheduleText = e.text;
			this.$refs.paging.reload();
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			this.scheduleText = e.text;
			this.$refs.paging.reload();
			
		},
		onShow(){
			console.log("message onShow");
			var _this = this;
			let isDoRefresh = uni.getStorageSync("isDoRefresh");
			if(isDoRefresh === 1){
				uni.removeStorageSync("isDoRefresh");
				this.$refs.paging.reload();
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index=== 0){
				console.log("设置全部已读");
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				uni.showModal({
					title:"消息设置",
					content: "消息是否设置为全部已读",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor:"#DD524D",
					confirmColor:"#4CD964",
					success: async (res) => {
					        if (res.confirm) {
								let result = await _this.$myRequest.pmccRequest({
									url:`/app.message/messageAllRead?userAccount=`+userInfo.userAccount,
									data:{userAccount:userInfo.userAccount},
									method:"POST",
									showLoading:true
								})
								if(result.data.ret){
									uni.showToast({
										title: '设置成功',
										success() {
											 _this.$refs.paging.reload();
										}
									});
								}else{
									uni.showToast({
										title: '设置失败',
										icon:'none',
										success() {
										}
									});
								}
					        } 
					    }
				}) 
			}
		},
		methods: {
			async queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNumber:pageNo,
					pageSize:pageSize,
					userAccount:userInfo.userAccount,
					search:_this.scheduleText
				};
				let res = await _this.$myRequest.pmccRequest({
					url:`/app.message/messagePage`,
					method:'POST',
					data:data
				});
				if(res.data.ret){
					this.$refs.paging.complete(res.data.data.rows);
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					});
				}
			}, 
	
			toMessageDetail(data){
				var json = JSON.stringify(data);
				uni.navigateTo({
					url:'messageDetail?data='+ json
				});
			},
			onClick(e,id){
				if(e.position === 'right' && e.index ===0){
					console.log("删除Id："+id);
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					uni.showModal({
						title:"确定删除当前消息？",
						content: "删除相应的数据不可恢复",
						confirmText: "确定",
						cancelText: "取消",
						cancelColor:"#DD524D",
						confirmColor:"#4CD964",
						success: async (res) => {
						        if (res.confirm) {
									let result = await _this.$myRequest.pmccRequest({
										url:`/app.message/deleteMessage?id=`+id,
										data:{id:id},
										method:"POST",
										showLoading:true
									})
									if(result.data.ret){
										uni.showToast({
											title: '删除成功',
											success() {
												 _this.$refs.paging.reload();
											}
										});
									}else{
										uni.showToast({
											title: '删除失败',
											icon:'none',
											success() {
											}
										});
									}
						        } 
						    }
					}) 
				}
			},
			swipeChange(e,index){
				
			}
			
		}
	}
</script>

<style>
.content-box {
	/* #ifdef APP-NVUE */
	justify-content: center; 
	/* #endif */
	height: 65px;
	line-height: 65px;
	padding: 0 15px; 
	position: relative; 
	background-color: #ffffff;
	border-bottom-color: #dcdcdc;
	border-bottom-width: 1px;
	border-bottom-style: solid; 
}
.content-head{
	height: 20px;
	line-height: 20px;
}
.content-text {
	font-size: 15px;
	 height: 40px;
	line-height: 40px; 
	margin-top: 10px;
}
.isOver {
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	// background: #fff;
	font-size: 28rpx;
}


</style>
