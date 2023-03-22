<template>
	<view class="scrool-page">
			<view class="header-cont" style="margin-top: 2px;">
				<!-- <uni-group  title="费用主体" mode="card"> -->
					<picker @change="changeCostMain" :value="costMainIndex" :range="costMainList" range-key="dicName">
						<view  style="text-align: center;" v-if="costMainList.length > 0" class="uni-input picker-border">{{costMainList[costMainIndex].dicName}}</view>
					</picker>
				<!-- </uni-group> -->
			</view>
			<view class="list-cont">
				<!-- <uni-group  title="报销类别明细列表" mode="card"> -->
				 <scroll-view class="scrool-more" style="height: 100%" scroll-y="true" scroll-with-animation="true">
				<view v-if="dataList.length > 0" >
				<uni-swipe-action>
					<uni-swipe-action-item  v-for="(item,index) in dataList"    :key="index" :right-options="options"  @click="onClick($event,item.id)"   @change="swipeChange($event, index)" >
						<view class="content-box" @click="toExpenseDetailUpdate(item)" > 
							 <view class=" content-head" >
								<text space="emsp" class="flex-text">{{item.twoLevelName}}  </text>
								<view style="-webkit-flex: 1;flex: 1; text-align: right; font-size: 12px; color: #797979;" ><text space="emsp">{{formatTime(item.startDate,'YYYY-MM-DD')}} 至 {{formatTime(item.endDate,'YYYY-MM-DD')}} </text></view>
							</view>
							<view class="content-text">
								<view style="-webkit-flex: 1;flex: 1; text-align: right; font-size: 14px; color: #797979;" ><text space="emsp">实际金额：{{(item.actualStandardAmount/100).toFixed(2)}}(元)  </text></view>
								 <!-- <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>金额:{{(item.amount/100).toFixed(2)}}</text></view>
								 <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>税费:{{(item.taxes/100).toFixed(2)}}</text></view>
								 <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>价税合计:{{(item.costTaxesTotal/100).toFixed(2)}}</text></view> -->
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action> 
				</view>
					
				<!-- </uni-group> -->
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
				</scroll-view>
			</view>
			<view  class="footer" >
				<button @click="addExpenseDetail()" >新增</button>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				costMainList:[],
				costMainIndex:0,
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
		async onLoad(option) {
			if(option.appKey){
				uni.setStorageSync(option.appKey,option.appKey)
			}
			await this.getCostMain();
			let costMainId = this.costMainList[this.costMainIndex].dicId;
			this.getExpenseDetailList(costMainId);
		},
		methods: {
			async getCostMain(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.financedetail/costMainDutyList',
					method: 'GET'	
				})
				if(res.data.ret){
					_this.costMainList = res.data.data;
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			async getExpenseDetailList(costMainId) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let deviceCode = uni.getStorageSync('deviceCode');
				var data = {
				    masterId:0,
					costMainId:costMainId,
					userAccount:userInfo.userAccount,	
				};
				let res = await	_this.$myRequest.pmccRequest({
					url:`/app.financedetail/expenseDetailList`,
					method:'POST',
					data:data
				});
				if(res.data.ret){
					this.dataList = res.data.data;
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					});
				}
			},
			changeCostMain(e){
				this.costMainIndex = e.detail.value;
				let costMainId = this.costMainList[this.costMainIndex].dicId;
				this.getExpenseDetailList(costMainId);
				
			},
			onClick(e,id){
				console.log("删除Id："+id);
				  if(e.position === 'right' && e.index === 0){
					  	console.log("删除Id："+id);
					  	var _this = this;
					  	var userInfo = _this.$helper.fetchLocalUser();
					  	uni.showModal({
					  		title:"确定删除么？",
					  		content: "删除相应的数据不可恢复",
					  		confirmText: "确定",
					  		cancelText: "取消",
					  		cancelColor:"#DD524D",
					  		confirmColor:"#4CD964",
					  		success: async (res) => {
					  		        if (res.confirm) {
					  					let res = await _this.$myRequest.pmccRequest({
					  						url:`/app.financedetail/deleteExpenseDetail?id=`+id,
					  						method:"POST",
											data:{id:id},
											showLoading:true
					  					})
										if(res.data.ret){
											uni.showToast({
												title: '删除成功',
												success() {
													let costMainId = _this.costMainList[_this.costMainIndex].dicId;
													_this.getExpenseDetailList(costMainId);
												}
											});
										}
					  		        } 
					  		    }
					  	}) 
				  }
				  
			},
			swipeChange(e,index){
				
			},
			addExpenseDetail(){
				uni.navigateTo({
					url:'expenseDetailAdd'
				})
			},
			toExpenseDetailUpdate(item){
				let json = JSON.stringify(item)
				uni.navigateTo({
					url:'expenseDetailUpdate?data='+json
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
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
	border-bottom-color: #dcdcdc;
	border-bottom-width: 1px;
	border-bottom-style: solid; 
}
.content-head{
	display: flex;
	flex-direction: row;
	height: 20px;
	line-height: 20px;
}
.content-text {
	display: flex;
	flex-direction: row;
	font-size: 15px;
	height: 40px;
	line-height: 40px; 
	margin-top: 10px; 
}
.left{
	text-align: right;
	
}

.scrool-page {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.header-cont {
	width: 100%;
	height: 85rpx;
	line-height: 85rpx;
	text-align: center;
	//background: red;
}

.list-cont {
	flex: 1;
	position: relative;

	.scrool-more {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	// .list {
	// 	height: 80rpx;
	// 	line-height: 80rpx;
	// 	text-align: center;
	// 	background: #e0e0e0;

	// }
}


.footer {
	color: #fff;
	line-height: 90rpx;
	flex: 0 0 90rpx;
	/* 不放大不缩小固定100rpx */
}
.no-date-img{
	text-align: center;
	height: 140px;
	line-height: 140px; 
}
</style>
