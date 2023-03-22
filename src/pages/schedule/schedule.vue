<template>
	<view>
		<view>
			 <view class="content">
			        <zzx-calendar  @selected-change="selectchange" @days-change="dayschange"></zzx-calendar>
			 </view>
			 <view >
					<uni-swipe-action>
					    <uni-swipe-action-item  v-for="(item,index) in scheduleList" :disabled="item.bisFinish" :key="item.id" :right-options="options"  @click="onClick(item.id,$event)" @change="swipeChange">
							 <view class="uni-flex uni-column content-box" @click="toScheduleDetail(item)" :style="{'background-color':item.urgencyColor}">
								<view class="flex-item " style="font-size: 12px;">
									<text space="emsp">   {{item.datetimeRange[0]}}</text>
									</view>
								<view class="flex-item " style="font-size: 18px;">
									<text space="emsp">   {{item.title}}</text>
								</view>
							 </view>
					    </uni-swipe-action-item>
					</uni-swipe-action>
			 </view>
		</view>
	</view>
</template>

<script>
	import zzxCalendar from "@/components/zzx-calendar/zzx-calendar.vue"
	 import {
		mapState,
		mapMutations
	} from 'vuex'; 
	export default {
		data() {
			return {
				 timeSelected:'',
				 startDate:'',
				 endDate:'',
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
		computed: mapState(['hasLogin', 'userInfo']), 
		onLoad() {
			console.log('schedule load');
			var _this = this;
			_this.scheduleList = [];
			var data = {
				time : new Date() 
			}
			this.selectchange(data);
		},
		onShow() {
			console.log('schedule show');
			var _this = this;	
			let isDoRefresh = uni.getStorageSync("isDoRefresh");
			if(isDoRefresh === 1){
				uni.removeStorageSync("isDoRefresh");
				_this.scheduleList = [];
				var data = {
					time : _this.timeSelected
				}
				this.selectchange(data);
			}
			
		},
		onReady() {
			
		},
		methods: {
			  selectchange(data) {
				//console.log("time:"+data.time);
				console.log(JSON.stringify(data))
				var _this = this;
				 _this.timeSelected = data.time;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					startDate :_this.formatTime(new Date(data.time.toLocaleDateString()).getTime()),
					endDate: _this.formatTime(new Date(data.time.toLocaleDateString()).getTime()+ 24*60*60*1000-1),
				    userAccount :userInfo.userAccount
				}
                this.getScheduleList(data)
				
			},
			async getScheduleList(data){
				let res = await this.$myRequest.pmccRequest({
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
			},
			dayschange(data){
				/* this.startDate = data.start;
				this.endDate = data.end; */ 
			},
			 async onClick(id,e){
			      /* console.log('点击了'+(e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮' + e.index) */
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
													var data = {
														time : _this.timeSelected
													}
													_this.selectchange(data);
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
					 			setTimeout(function () {
					 			}, 2000);
					 			var data = {
					 				time : _this.timeSelected
					 			}
					 			_this.selectchange(data);
					 		}
					 	});
					 }else{
					 	uni.showToast({
					 		title: '完成失败',
					 		icon:'none',
					 		success() {
					 		}
					 	});
					 }
				  }
			},
			swipeChange(){
			     // console.log('当前状态：'+ open +'，下标：' + index)
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
				
				
			}
			    
		},
		onNavigationBarButtonTap(e) {
			if(e.index=== 0){
				uni.navigateTo({
				    url: "./addSchedule"
				});
			}else{
				uni.navigateTo({
					url:'./scheduleSearch'
				})
			}
		},
		components:{
		            zzxCalendar
		},
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 5px 5px;
		padding: 0 5px;
	} 
	.flex-item {
		// 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。
		display: -webkit-box;
		// 设置或检索伸缩盒对象的子元素的排列方式 。
		-webkit-box-orient:vertical;
		// 用省略号“…”隐藏超出范围的文本 。
		text-overflow: ellipsis;
		overflow: hidden;
		//用来限制在一个块元素显示的文本的行数。
		// -webkit-line-clamp: 3;
		// width: 50%;
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
