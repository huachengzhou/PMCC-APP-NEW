<template>
	<view>
		<uni-group  title="基本信息" mode="card" v-if="hrProcessBusinessData.vacationDataParam" >
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 假期类型:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{hrProcessBusinessData.vacationDataParam.vacationTypeName}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view  class="left"> 开始时间:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view class="demo-uni-col light"><text>{{hrProcessBusinessData.vacationDataParam.startDate}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view  class="left"> 结束时间:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view class="demo-uni-col light"><text>{{hrProcessBusinessData.vacationDataParam.endDate}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view  class="left"> 天数:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view class="demo-uni-col light"><text>{{hrProcessBusinessData.vacationDataParam.sysDays}}</text></text></view>
				</uni-col>
			</uni-row>
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view  class="left"> 小时:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view class="demo-uni-col light"><text>{{hrProcessBusinessData.vacationDataParam.sysHours}}</text></text></view>
				</uni-col>
			</uni-row>
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view  class="left"> 请假事由:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view class="demo-uni-col light"><rich-text :nodes="hrProcessBusinessData.vacationDataParam.reason"></rich-text></view>
				</uni-col>
			</uni-row>
			
		</uni-group> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gutter: 0,
				nvueWidth: 730,
				taskInfo:{},
				hrProcessBusinessData:{
					
				}
				
			}
		},
		async onLoad(option) {
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			console.log("接收到了数据taskInfo:" + this.taskInfo);
			await this.getHrProcessBusinessData(this.taskInfo.processInsId,'QINGJIA');
			console.log("接收到了数据hrProcessBusinessData:" + this.hrProcessBusinessData);
			 
		},
		methods: {
			async getHrProcessBusinessData(processInsId,hrDataType){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/hrProcessBusinessData?processInsId='+ processInsId+'&hrDataType='+hrDataType,
					data:{processInsId:processInsId,hrDataType:hrDataType},
					method: 'GET'
				})
				if(res.data.ret){
					_this.hrProcessBusinessData = res.data.data;
					console.log("hrProcessBusinessData："+ JSON.stringify(_this.hrProcessBusinessData))
				}else{
					_this.hrProcessBusinessData = '';
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
.uni-row {
	margin-bottom: 10px;
	/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
	display: block;
	/* #endif */
	/* border: 1px solid rgba(0, 0, 0, .125); */
}
.left{
	text-align: right;
	
}
</style>
