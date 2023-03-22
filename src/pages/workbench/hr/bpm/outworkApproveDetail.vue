<template>
	<view>
		<view >
			<uni-group  title="基本信息" mode="card" v-if="hrProcessBusinessData.outworkDataParam">
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 所属项目:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.projectName}}</text></view>
					</uni-col>
				</uni-row>
				 <uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 外勤人员:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.legworkUserName}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计开始时间:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.planDatetimeRange[0]}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计结束时间:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.planDatetimeRange[1]}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计工时:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.planHours}}小时</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 外勤地点:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.legworkAddress}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 交通工具:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.legworkVehicle}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 住宿方式:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{accommodationMethodName}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row v-if="this.hrProcessBusinessData.outworkDataParam.accommodationMethod != -1" class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 住宿天数:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.outworkDataParam.accommodationDays}}天</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 事由:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><rich-text :nodes="hrProcessBusinessData.outworkDataParam.reasons"></rich-text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 内容及成果:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><rich-text :nodes="hrProcessBusinessData.outworkDataParam.legworkContent"></rich-text></view>
					</uni-col>
				</uni-row> 
				
			</uni-group> 
			 <view v-if="hrProcessBusinessData.outworkDataParam">
			 	<view v-for="(user,index) in hrProcessBusinessData.outworkDataParam.userInfos">
			 		<uni-group   :title="user.userName" mode="card">
			 			<uni-row class="uni-row" :width="nvueWidth">
			 				<uni-col :span="6">
			 					<view  class="left"> 预计开始时间:</view>
			 				</uni-col>
			 				<uni-col :push="1" :span="18">
			 					<view ><text>{{hrProcessBusinessData.outworkDataParam.userInfos[index].planDatetimeRange[0]}}</text></view>
			 				</uni-col>
			 			</uni-row>
			 			<uni-row class="uni-row" :width="nvueWidth">
			 				<uni-col :span="6">
			 					<view  class="left"> 预计结束时间:</view>
			 				</uni-col>
			 				<uni-col :push="1" :span="18">
			 					<view ><text>{{hrProcessBusinessData.outworkDataParam.userInfos[index].planDatetimeRange[1]}}</text></view>
			 				</uni-col>
			 			</uni-row>
			 			<uni-row class="uni-row" :width="nvueWidth">
			 				<uni-col :span="6">
			 					<view  class="left"> 预计工时:</view>
			 				</uni-col>
			 				<uni-col :push="1" :span="18">
			 					<view ><text>{{hrProcessBusinessData.outworkDataParam.userInfos[index].planHours}}小时</text></view>
			 				</uni-col>
			 			</uni-row>
			 		</uni-group>
			 	</view>
			 </view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gutter: 0,
				nvueWidth: 730,
				taskInfo:{},
				hrProcessBusinessData:{},
				accommodationMethodName:'',
				accommodationList:[
					{
						name:'无',
						value:-1
					},
					{
						name:'自住',
						value:0
					},
					{
						name:'客户',
						value:1
					}
				]
				
			}
		},
		async onLoad(option){
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			console.log("接收到了数据taskInfo:" + this.taskInfo);
			await this.getHrProcessBusinessData(this.taskInfo.processInsId,'WAIQIN');
			console.log("接收到了数据hrProcessBusinessData:" + this.hrProcessBusinessData);
			this.initData();
		},
		methods: {
			initData(){
				this.accommodationList.forEach(a =>{
					if(a.value === this.hrProcessBusinessData.outworkDataParam.accommodationMethod){
						this.accommodationMethodName = a.name;
					}
				})
				
			},
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
	/* border: 1px solid rgba(0, 0, 0, .125); */
}
</style>
