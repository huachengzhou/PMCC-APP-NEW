<template>
	<view>
		<view class="content">
			<view class="uni-flex uni-row" >
				<view style="width: 50px; text-align: right;"><text  style="font-size: 16px; font">来自: </text></view>
				<view style="-webkit-flex: 1;flex: 1;">{{messageData.userSendName}}</view>	
			</view>
			<view class="uni-flex uni-row">
				<view style="width: 50px; text-align: right;"><text style="font-size: 16px;">时间:</text></view>
				<view style="-webkit-flex: 1;flex: 1;"><text>{{formatTime(messageData.sendTime)}}</text></view>	
			</view>
			<view class="uni-flex uni-row text-box">
				 <!-- {{messageData.messageContent}} -->
				 <rich-text :nodes="messageData.messageContent"></rich-text>
			</view>
			<view class="example">
				<button class="button"  @click="deleteMessage(messageData.id)">删除消息</button> 
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageData:{}
				/* id:'',
				userReceiveAccount:'',
				userReceiveName:'',
				userSendName:'',
				userSendAccount:'',
				sendTime:'',
				messageContent:'' */
				
			}
		},
		onLoad(option) {
			console.log("接收到："+option.data);
			let data = JSON.parse(option.data);
			this.messageData = data;
			if(!this.messageData.bisRead){
				this.messageRead(this.messageData.id);
			}
			
		},
		methods: {
			deleteMessage(id){
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
											uni.setStorageSync("isDoRefresh",1);
											uni.navigateBack({
												url:'message'
											});
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
			},
			async messageRead(id){
				console.log("id:"+id);
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					userAccount : userInfo.userAccount,
					id:id
				}
				let result = await _this.$myRequest.pmccRequest({
					url:`/app.message/messageAllRead?userAccount=`+userInfo.userAccount+"&id="+id,
					data:data,
					method:"POST",
					showLoading:true
				})
				if(result.data.ret){
					uni.setStorageSync("isDoRefresh",1);
				}
			}
		}
	}
</script>

<style>
.content{
	padding:0 30rpx;
	margin-top:30rpx;
}
.text-box {
		margin-bottom: 40rpx;
		padding: 40rpx 0;
		display: flex;
		min-height: 300rpx;
		background-color: #FFFFFF;
		justify-content: left;
		align-items: left;
		text-align: left;
		font-size: 30rpx;
		color: #353535;
		line-height: 1.8;
}
.example {
			padding: 0 15px 15px;
}
</style>
