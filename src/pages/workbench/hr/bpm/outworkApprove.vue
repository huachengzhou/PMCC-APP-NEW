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
			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
				 <uni-group  title="审批意见"  mode="card">
					<uni-forms-item v-if="bisSelectUser === '1' && ApproverList.length > 0" required name="ApproverUser" label="审批人" label-align="right" >
						<picker @change="changeApproverUser('ApproverUser',$event)" :value="ApproverIndex" :range="ApproverList" range-key="userName">
							<view class="uni-input picker-border">{{ApproverList[ApproverIndex].userName}}</view>
						</picker>	
					</uni-forms-item>
					<uni-forms-item required name="approvalOpinions" label="审批意见" label-align="right">
						<uni-easyinput  type="textarea" v-model="formData.approvalOpinions" placeholder="请输入内容" />
					</uni-forms-item>
				</uni-group> 
			</uni-forms> 
			<view class="approve-button-box">
					<view class="approve-button-left"><button  @click="toApprovalLogs" type="default" size="mini">审批日志</button></view>
					<view class="approve-button"><button @click="submit('Back',$event)" type="warn" size="mini">退回申请人</button></view>
					<view class="approve-button"><button @click="submit('Decline',$event)" type="warn" size="mini">退回上一级</button></view>
					<view class="approve-button-right"><button @click="submit('Approval',$event)" type="primary" size="mini">同意</button></view>
				<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
					<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
				</uni-popup>
			</view>
			<!-- <view style="align-items: center;">
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col  :span="5">
						<view><button  @click="toApprovalLogs" type="default" size="mini" >日志</button></view>
					</uni-col>
					<uni-col  :span="7">
						<view ><button @click="submit('Back',$event)" type="warn" size="mini" >退回申请人</button></view>
					</uni-col>
					<uni-col  :span="7">
						<view> <button @click="submit('Decline',$event)" type="warn" size="mini" >退回上一级</button></view>
					</uni-col>
					<uni-col  :span="5">
						<view> <button @click="submit('Approval',$event)" type="primary" size="mini" >同意</button></view>
					</uni-col>
					
				</uni-row>
				<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
					<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
				</uni-popup>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				gutter: 0,
				nvueWidth: 730,
				//防止重复提交
				taskInfo:{},
				hrProcessBusinessData:{},
				ApproverIndex:0,
				ApproverList:[],
				bisSelectUser:'',
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
				],
				formData:{
					ApproverUser:'',
					approvalOpinions:''
				},
				rules:{
					ApproverUser:{
						rules:[ { 	required:true,
									errorMessage:"审批人不能为空",
								}
						]
					},
					approvalOpinions:{
						rules:[ { 	required:true,
									errorMessage:"审批意见不能为空",
								}
						]
					}
				}
			}
		},
		async onLoad(option){
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			await this.getHrProcessBusinessData(this.taskInfo.processInsId,'WAIQIN');
			console.log("接收到了数据hrProcessBusinessData:" + JSON.stringify(this.hrProcessBusinessData));
			await this.getApproverList();
			if(this.bisSelectUser && this.bisSelectUser ==='1'){
				this.formData.ApproverUser = this.ApproverList[this.ApproverIndex];
			}
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
			submit(conclusion,e){
					this.$refs.form.validate().then(async(res)=>{
						console.log("res:"+ JSON.stringify(res));
						var _this = this;
						var userInfo = _this.$helper.fetchLocalUser();
						var data = {
							boxId:this.taskInfo.boxId,
							processInsId:this.taskInfo.processInsId,
							taskId:this.taskInfo.taskId,
							appKey:this.taskInfo.appKey,
							conclusion:conclusion,
							opinions:res.approvalOpinions,
							currUserAccount:userInfo.userAccount,
							agentUserAccount:_this.taskInfo.agentUserAccount,
							hrDataType:'WAIQIN',
							outworkDataParam:_this.hrProcessBusinessData.outworkDataParam,
							appointUserAccount:(_this.bisSelectUser === '1' && _this.ApproverList.length > 0) ? res.ApproverUser.userAccount:''
						};
						
						let result = await _this.$myRequest.pmccRequest({
							url:`/app.hr/approvalProcess`,
							method:'POST',
							data:data,
							showLoading:true
						})
						if(result.data.ret){
							uni.showToast({
								title: '操作成功',
								mask:true,
								success() {
								   uni.setStorageSync("isDoBacklogRefresh",1);
								   uni.switchTab({
									   url:'../../../backlog/backlog'
								   });
								}
							});
						}else{
							this.msgType =  'error';
							this.message = result.data.errmsg
							this.$refs.popupMessage.open();
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
			},
			async getApproverList(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data ={
					currUserAccount:userInfo.userAccount,
					processInsId:this.taskInfo.processInsId,
					boxId:this.taskInfo.boxId,
					taskId:this.taskInfo.taskId
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/approvalProcessList',
					method: 'POST',
					data:data
				})
				if(res.data.ret){
					_this.ApproverList = res.data.data.approverList;
					_this.bisSelectUser = res.data.data.bisSelectUser;
					
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			changeApproverUser(name,e){
				let _this = this;
				_this.ApproverIndex = e.detail.value;
				_this.formData.ApproverUser = _this.ApproverList[_this.ApproverIndex];
				this.$refs.form.setValue(name, _this.formData.ApproverUser)
			},
			toApprovalLogs(){
				let json = JSON.stringify({
					appKey:this.taskInfo.appKey,
					processInsId:this.taskInfo.processInsId,
				})
			
				uni.navigateTo({
					url: './approvalLog?data=' + json
				})
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
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
