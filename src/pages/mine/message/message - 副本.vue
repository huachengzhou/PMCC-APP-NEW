<template>
	<view>
		<view v-if ="dataList.length > 0">
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
			<uni-load-more :status="status" :content-text="contentText" />
		</view>
		
		<view v-else >
			<!-- <text class="no-data">没有搜索到相关内容</text> -->
			<view style="margin-top: 80px;"></view>
			<view class="no-date-img">
				<image class="icon iconfont icon-wenjiansousuo" style="font-size:100px;text-align: center; color: #a8a8a8;"/>
			</view>
			<view style="text-align: center;">
				<text style="font-size: 14px; color: #a8a8a8;">没有搜索到相关内容</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'more',
				contentText: {
					contentdown: '',
					contentrefresh: '加载中',
					contentnomore: '没有更多数据了'
				},
				scheduleText:'',
				pageindex:1,
				pageSize:10,
				total:0,
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
			this.pageindex = 1
			this.dataList = []
			this.total = 0
			this.status = 'more'
			this.queryPageList();
			
			
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			this.scheduleText = e.text;
			this.pageindex = 1
			this.dataList = []
			this.total = 0
			this.status = 'more'
			this.queryPageList();
			
		},
		onLoad () {
			console.log("message onLoad");
			this.queryPageList();
			
		},
		onShow(){
			console.log("message onShow");
			var _this = this;
			let isDoRefresh = uni.getStorageSync("isDoRefresh");
			if(isDoRefresh === 1){
				uni.removeStorageSync("isDoRefresh");
				_this.dataList = []
				_this.pageindex = 1
				_this.total = 0
				_this.status = 'more'
				this.queryPageList()
			}
		},
		onReachBottom(){
			console.log("上拉加载")
			if(this.dataList.length === this.total) return /* this.pulldownLoad = true */this.status = 'noMore'
			this.pageindex++
			this.status = 'loading'
			this.queryPageList()
		},
		onPullDownRefresh() {
			console.log('下拉刷新了')
			this.pageindex = 1
			this.dataList = []
			this.total = 0
			this.status = 'more'
			this.queryPageList(()=>{
				uni.stopPullDownRefresh()
			}) 
				
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
					success:  (res) => {
					        if (res.confirm) {
								uni.showLoading({
									title:'加载中',
									mask:true
								});
								uni.request({
									url:`${_this.$config.server.host}/app.message/messageAllRead?userAccount=`+userInfo.userAccount,
									header:{
										"sign-value": _this.$helper.requestSign({userAccount:userInfo.userAccount}),
										"company-key": userInfo.userAccount 
									},
									method:"POST",
									success: (res) => {
										if(res.data.ret){
											uni.showToast({
												title: '设置成功',
												success() {
													 uni.hideLoading();
													_this.pageindex = 1;
													_this.dataList = [];
													_this.total = 0;
													_this.pulldownLoad = false;
													_this.queryPageList();	
												}
											});
										}else{
											uni.showToast({
												title: '设置失败',
												icon:'none',
												success() {
													 uni.hideLoading();
												}
											});
										}
									},
									fail(err) {	
										uni.hideLoading();
										console.log(err);
									}
									
								})
					        } 
					    }
				}) 
			}
		},
		methods: {
			 queryPageList(callBack) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNumber:_this.pageindex,
					pageSize:_this.pageSize,
					userAccount:userInfo.userAccount,
					
				};
				if(!(_this.scheduleText.length === 0 || !_this.scheduleText.trim())){
					data.search = _this.scheduleText;
				}
				uni.request({
					url:`${this.$config.server.host}/app.message/messagePage`,
					header: {
						"sign-value": _this.$helper.requestSign(data),
						"company-key": userInfo.userAccount
					},
					method:'POST',
					data:data,
					success: (res) => {
						if(res.data.ret){
							_this.total = res.data.data.total;
							console.log(res.data.data.rows);
							_this.dataList = [...this.dataList,...res.data.data.rows];
						}else{
							uni.showToast({
								title: res.data.errmsg,
								mask: true,
								duration: 1000
							});
						}
					},
					fail(err) {
						console.log(err);
						uni.showModal({
							title: '错误提示',
							content: err.errMsg,
							showCancel: false
						}); 
					}
				});
				callBack && callBack()
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
						success:  (res) => {
						        if (res.confirm) {
									uni.showLoading({
										title:'加载中',
										mask:true
									});
									uni.request({
										url:`${_this.$config.server.host}/app.message/deleteMessage?id=`+id,
										header:{
											"sign-value": _this.$helper.requestSign({id:id}),
											"company-key": userInfo.userAccount 
										},
										method:"POST",
										success: (res) => {
											if(res.data.ret){
												uni.showToast({
													title: '删除成功',
													success() {
														 uni.hideLoading();
														_this.pageindex = 1;
														_this.dataList = [];
														_this.total = 0;
														_this.pulldownLoad = false;
														_this.queryPageList();	
													}
												});
											}else{
												uni.showToast({
													title: '删除失败',
													icon:'none',
													success() {
														 uni.hideLoading();
													}
												});
											}
										},
										fail(err) {	
											uni.hideLoading();
											console.log(err);
										}
										
									})
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
.no-data {
	text-align: center;
	color: #999;
	height: 10rpx;
	line-height: 150px;
	
}
.no-date-img{
	text-align: center;
	height: 140px;
	line-height: 140px; 
}

	




</style>
