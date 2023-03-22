<template>
	<view>
		<view>
			<uni-group  title="基本信息" mode="card" v-if="hrProcessBusinessData.extraWorkDataParam">
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 所属项目:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.projectName}}</text></view>
					</uni-col>
				</uni-row>
				 <uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 加班人员:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.overtimeUserName}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计开始时间:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.planDatetimeRange[0]}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计结束时间:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.planDatetimeRange[1]}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 预计工时:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.planHours}}小时</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 加班地点:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{hrProcessBusinessData.extraWorkDataParam.planAddress}}</text></text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 加班事由:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><rich-text :nodes="hrProcessBusinessData.extraWorkDataParam.reason"></rich-text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view  class="left"> 加班内容:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><rich-text :nodes="hrProcessBusinessData.extraWorkDataParam.content"></rich-text></view>
					</uni-col>
				</uni-row> 
				
			</uni-group>
			<view v-if="hrProcessBusinessData.extraWorkDataParam">
				<view v-for="(user,index) in hrProcessBusinessData.extraWorkDataParam.userInfos">
					<uni-group   :title="user.userName" mode="card">
						<uni-row class="uni-row" :width="nvueWidth">
							<uni-col :span="6">
								<view  class="left"> 预计开始时间:</view>
							</uni-col>
							<uni-col :push="1" :span="18">
								<view ><text>{{hrProcessBusinessData.extraWorkDataParam.userInfos[index].planDatetimeRange[0]}}</text></view>
							</uni-col>
						</uni-row>
						<uni-row class="uni-row" :width="nvueWidth">
							<uni-col :span="6">
								<view  class="left"> 预计结束时间:</view>
							</uni-col>
							<uni-col :push="1" :span="18">
								<view ><text>{{hrProcessBusinessData.extraWorkDataParam.userInfos[index].planDatetimeRange[1]}}</text></view>
							</uni-col>
						</uni-row>
						<uni-row class="uni-row" :width="nvueWidth">
							<uni-col :span="6">
								<view  class="left"> 预计工时:</view>
							</uni-col>
							<uni-col :push="1" :span="18">
								<view ><text>{{hrProcessBusinessData.extraWorkDataParam.userInfos[index].planHours}}小时</text></view>
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
				hrProcessBusinessData:{
				
				}
			}
		},
		async onLoad(option) {
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			console.log("接收到了数据taskInfo:" + this.taskInfo);
			await this.getHrProcessBusinessData(this.taskInfo.processInsId,'JIABAN');
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
