<template>
	<view>
			<view v-if="scheduleList.length > 0">
				<!-- <uni-card title="标题文字" :isFull="true" isShadow='true'> -->
				<uni-section title="日程列表" type="line" ></uni-section>
					<uni-swipe-action>
						<uni-swipe-action-item  v-for="(item,index) in scheduleList" :disabled="item.bisFinish" :key="item.id" :right-options="options"  @click="onClick(item.id,$event)" @change="swipeChange">
							<view class="uni-flex uni-column content-box" @click="toScheduleDetail(item)" :style="{'background-color':item.urgencyColor}">
								<view class="flex-item " style="font-size: 12px;">
									<text>{{item.datetimeRange[0]}}</text>
									</view>
								<view class="flex-item " style="font-size: 18px;">
									<text>{{item.title}}</text>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				<!-- </uni-card> -->
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
				 scheduleText:'',
				 scheduleList:[],
				 options:[
				         {
				             text: '删除',
				             style: {
				                 backgroundColor: '#ff0000'
								 
				             }
				         }, {
				             text: '完成',
				             style: {
				                 backgroundColor: '#00aa7f'
				
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
			this.selectScheduleList(this.scheduleText);
			
			
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			this.scheduleText = e.text;
			this.selectScheduleList(this.scheduleText);
			
		},
		methods: {
			async onClick(id,e){
				  if(e.position === 'right' && e.index === 0){
					  	console.log("删除Id："+id);
					  	var _this = this;
					  	var userInfo = _this.$helper.fetchLocalUser();
					  	uni.showModal({
					  		title:"确定删除当前日程？",
					  		content: "删除相应的数据不可恢复",
					  		confirmText: "确定",
					  		cancelText: "取消",
					  		cancelColor:"#DD524D",
					  		confirmColor:"#4CD964",
					  		success:  async (res) => {
					  		        if (res.confirm) {
					  					let result = await _this.$myRequest.pmccRequest({
					  						url:`/app.schedule/deleteSchedule?id=`+id,
											data:{id:id},
					  						method:"POST",
											showLoading:true
					  					})
										if(result.data.ret){
											uni.showToast({
												title: '删除成功',
												success() {
													_this.selectScheduleList(_this.scheduleText);
												}
											});
										}
					  		        } 
					  		    }
					  	}) 
					  
				  }
				  if(e.position === 'right' && e.index === 1){
					 var _this = this;
					 var userInfo = _this.$helper.fetchLocalUser();
					 let result = await _this.$myRequest.pmccRequest({
					 	url:`/app.schedule/completeSchedule?id=`+id,
						data:{id:id},
					 	method:"POST",
						showLoading:true
					 })
					 if(result.data.ret){
					 	uni.showToast({
					 		title: '完成日程',
					 		success() {
					 			_this.selectScheduleList(_this.scheduleText);
					 		}
					 	});
					 }
				  }
			},
			
			toScheduleDetail(data){
				var json = JSON.stringify(data);
				console.log(json);
				if(data.bisFinish){
					uni.navigateTo({
						url:'scheduleDetail?data=' + json
					});
				}else{
					uni.navigateTo({
						url:'updateSchedule?data=' + json
					});
				}
				
				
			},swipeChange(){
			     // console.log('当前状态：'+ open +'，下标：' + index)
			},
			async selectScheduleList(scheduleText){
				var _this = this;
				console.log("length:"+scheduleText.length);
				console.log("trim:"+scheduleText.trim());
				if(scheduleText.length === 0 || !scheduleText.trim()){
					this.scheduleList = [];
					return
				}
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					searchText : scheduleText,
				    userAccount :userInfo.userAccount
				}
				console.log("签名:" + _this.$helper.requestSign(data));
				let res = await _this.$myRequest.pmccRequest({
					url:`/app.schedule/findSchedules`,
					method:'POST',
					data: data
				})
				if(res.data.ret){
					this.scheduleList = res.data.data;	
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					});
				}
			}
			
		}
	}
</script>

<style>
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

.flex-item {
	width: 50%;
	height: 55rpx;
	text-align: left;
	line-height: 55rpx;
	color: #f5f5f5;
}
	
.content-box {
	/* #ifdef APP-NVUE */
	justify-content: center; 
	/* #endif */
	height: 65px;
	line-height: 65px;
	padding: 0 15px; 
	position: relative; 
	background-color: #ffffff;
	border-bottom-color: #c7c7c7;
	border-bottom-width: 1px;
	border-bottom-style: solid; 

}
</style>
