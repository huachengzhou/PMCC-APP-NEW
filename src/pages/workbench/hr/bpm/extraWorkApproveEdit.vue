<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息" mode="card">
				<uni-forms-item   name="projectId" label="所属项目" label-align="right" >
					<project-picker ref="project" :multiple="false"  :inputValue="projectValue" @getResults="getProjects" @getdrawType="getProjectDrawType"></project-picker>
				</uni-forms-item>
				<uni-forms-item  required name="overtimeUser" label="加班人员" label-align="right" >
					<employees-picker ref="employees" :multiple="true"  :inputValue="userValue" @getResults="getUsers" @getdrawType="getEmployeesDrawType"></employees-picker>
				</uni-forms-item>
				<uni-forms-item  required name="planDatetimeRange" label="预计时间范围" label-align="right" >
					<uni-datetime-picker  rangeSeparator="至" type="datetimerange"  v-model="formData.planDatetimeRange"    @change="timeChange('planDatetimeRange',$event)"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item  required name="planHours" label="预计工时" label-align="right" >
					<uni-easyinput :maxlength="3" type="digit" v-model="formData.planHours" placeholder="预计工时" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="planAddress" label="加班地点" label-align="right" >
					<uni-easyinput  type="text" v-model="formData.planAddress" placeholder="加班地点" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="reason" label="加班事由" label-align="right" >
					<uni-easyinput  type="textarea" v-model="formData.reason" placeholder="加班事由" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="content" label="加班内容" label-align="right" >
					<uni-easyinput  type="textarea" v-model="formData.content" placeholder="加班内容" ></uni-easyinput>
				</uni-forms-item>
			</uni-group>
			<template v-for="(user,index) in formData.userInfos">
				<uni-group   :title="user.userName" mode="card">
					<uni-forms-item  
						required  
						label="预计时间范围" 
						label-align="right" 
						:rules="[{'required': true,errorMessage: '预计时间范围必填'}]"
						:name="'planDatetimeRangeDynamic[' + index + ']'">
						<uni-datetime-picker :key="index"  rangeSeparator="至" type="datetimerange"  v-model="formData.planDatetimeRangeDynamic[index]"  @change="userInfoTimeChange('planDatetimeRangeDynamic[' + index + ']',index,$event)" ></uni-datetime-picker>
					</uni-forms-item>
					
					<uni-forms-item  
						required
						:name="'planHoursDynamic[' + index + ']'" 
						label="预计工时" 
						label-align="right" 
						:rules="[{'required': true,errorMessage: '预计工时必填'}]">
						<uni-easyinput :maxlength="3" type="digit" v-model="formData.planHoursDynamic[index]" placeholder="预计工时" ></uni-easyinput>
					</uni-forms-item>
				</uni-group>
			</template>
			<uni-group v-if="bisSelectUser === '1' && ApproverList.length > 0" title="审批人"  mode="card">
				<uni-forms-item  required name="ApproverUser" label="审批人" label-align="right" >
					<picker @change="changeApproverUser('ApproverUser',$event)" :value="ApproverIndex" :range="ApproverList" range-key="userName">
						<view class="uni-input picker-border">{{ApproverList[ApproverIndex].userName}}</view>
					</picker>	
				</uni-forms-item>
			</uni-group>
		</uni-forms>
		<view >
			<uni-row class="uni-row" :width="nvueWidth">
				<uni-col :push="1" :span="8">
					<view><button  @click="toApprovalLogs" type="default" size="mini" >审批日志</button></view>
				</uni-col>
				
				<uni-col :push="1" :span="8">
					<view> <button @click="submit('edit',$event)" type="primary" size="mini" >提交申请</button></view>
				</uni-col>
				<uni-col :push="1" :span="8">
					<view> <button @click="closeProcess"  type="warn" size="mini" >撤销申请</button></view>
				</uni-col>
			</uni-row>
		</view>
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
	
</template>

<script>
	import employeesPicker from'../../../../components/employees-picker/employees-picker.vue'
	import projectPicker from'../../../../components/project-picker/project-picker.vue'
	export default {
		
		data() {
			return {
				taskInfo:'',
				hrProcessBusinessData:{},
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				nvueWidth: 730,
			
				ApproverIndex:0,
				ApproverList:[],
				bisSelectUser:'',
				userValue:[],
				projectValue:[],
				vError:'',
				formData:{
					planDatetimeRange:'',
					planHours:'',
					planAddress:'',
					reason:'',
					content:'',
					overtimeUser:'',
					overtimeUserName:'',
					ApproverUser:'',
					projectId:'',
					projectName:'',
					userInfos:[],
					//动态表单参数
					planDatetimeRangeDynamic:{},
					planHoursDynamic:{},
					
					
				},
				rules:{
					// projectId:{
					// 	rules:[
					// 			{ 	required:true,
					// 				errorMessage:"请选择项目",
					// 			}
					// 	]
					// },
					overtimeUser:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择员工",
								}
						]
					},
					planDatetimeRange:{
						rules:[
							{ 	required:true,
								errorMessage:"请选择预估时间范围",
							},
							{
								validateFunction:function(rule,value,data,callback){
									//value为String类型说明返回的是错误信息，时间范围为数组类型
									if(typeof value == 'string'){
										if ( value && value.length > 0) {
											 callback(value)
										}
									}
									return true
								}
							},
						],
					},
					planHours:{
						rules:[ { 	required:true,
									errorMessage:"预计工时为必填字段",
								}
							  ]
					},
					planAddress:{
						rules:[ { 	required:true,
									errorMessage:"加班地点为必填字段",
								}
							  ]
					},
					reason:{
						rules:[ { 	required:true,
									errorMessage:"加班事由为必填字段",
								}
							  ]
					},
					content:{
						rules:[ { 	required:true,
									errorMessage:"加班内容为必填字段",
								}
							  ]
					}
					
				}
			}
		},
		onReady() {
		        // 需要在onReady中设置规则
				this.$refs.form.setRules(this.rules)
		},
		async onLoad(option){
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			await this.getHrProcessBusinessData(this.taskInfo.processInsId,'JIABAN');
			await this.initData(this.hrProcessBusinessData.extraWorkDataParam);
			await this.initUserinfo(this.hrProcessBusinessData.extraWorkDataParam);
			await this.getApproverList();
			if(this.bisSelectUser && this.bisSelectUser ==='1'){
				this.formData.ApproverUser = this.ApproverList[this.ApproverIndex];
			}
			this.notSaved =false;
			
		},
		watch: {
		    formData: {
		        handler(newName, oldName) {
					console.log(newName)
		           this.notSaved = true;
		        },
		        immediate: true,
		        deep: true
		    }
		},
		
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			
			if (this.showpdraw1) {
				this.$refs.project.closedraw('draw1')
				return true
			}else{
				if(this.showpdraw){
					this.$refs.project.closedraw('draw')
					return true
				}
			}
			
			if (this.showedraw1) {
				this.$refs.employees.closedraw('draw1')
				return true
			}else{
				if(this.showedraw){
					this.$refs.employees.closedraw('draw')
					return true
				}
			}
			
			if(this.notSaved){
				uni.showModal({
					title:"确定退出当前页面吗",
					content: "还有未保存的数据",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor:"#DD524D",
					confirmColor:"#4CD964",
					success:  async (res) => {
					        if (res.confirm) {
								this.notSaved = false;
								uni.navigateBack({
								    delta: 1
								});
					        } 
					    }
				}) 
				return true;
			}
		},
		components: {
			"employees-picker":employeesPicker,
			"project-picker":projectPicker
		},
		methods: {
			async initData(data){
				console.log("init："+JSON.stringify(data))
				this.formData.projectId = data.projectId;
				this.formData.projectName = data.projectName;
				this.formData.overtimeUserName = data.overtimeUserName;
				this.formData.overtimeUser = data.overtimeUser;
				this.formData.content = data.content;
				this.formData.reason = data.reason;
				this.formData.planAddress = data.planAddress;
				this.formData.planHours = data.planHours;
				this.formData.planDatetimeRange = data.planDatetimeRange;
				this.projectValue = [{text:data.projectName,value: parseInt(data.projectId)}];
				await this.initUserData(data.overtimeUser);

			},
			//初始化选中列表的值，并初始化校验规则
			async initUserinfo(data){
				var userInfo = this.$helper.fetchLocalUser();
				let userList = [];
				data.userInfos.forEach((u,index)=>{
					userList.push({
						userAccount:u.userAccount,
						userName:u.userName,
						planDatetimeRange:u.planDatetimeRange,
						planHours:u.planHours,
						creator:userInfo.userAccount
					});
					this.$set(this.formData.planDatetimeRangeDynamic,index,u.planDatetimeRange);
					this.$set(this.formData.planHoursDynamic,index,u.planHours);
				})
				this.formData.userInfos = [];
				//保证组件 对象 数组赋值刷新
				await this.$nextTick(()=>{
					this.formData.userInfos = userList;
				})
				console.log("this.formData.userInfos："+JSON.stringify(this.formData.userInfos))
				this.builderUserInfosRules();
			},
			async initUserData(userAccounts){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.sys/findUserList?userAccounts='+userAccounts,
					data:{userAccounts:userAccounts},
					method: 'POST'	
				})
				if(res.data.ret){
					_this.userValue = res.data.data
					_this.vError = ''
					console.log("_this.userValue:"+JSON.stringify(_this.userValue))
				}else{
					_this.vError = res.data.errmsg
					
				}
			},
			submit(processActivity,e){
					this.$refs.form.validate().then(async(res)=>{
						 console.log("res:"+ JSON.stringify(res));
						var _this = this;
						var userInfo = _this.$helper.fetchLocalUser();
						_this.hrProcessBusinessData.extraWorkDataParam.planDatetimeRange = res.planDatetimeRange;
						_this.hrProcessBusinessData.extraWorkDataParam.planHours = parseInt(res.planHours);
						_this.hrProcessBusinessData.extraWorkDataParam.planAddress = res.planAddress;
						_this.hrProcessBusinessData.extraWorkDataParam.reason = res.reason;
						_this.hrProcessBusinessData.extraWorkDataParam.content = res.content;
						_this.hrProcessBusinessData.extraWorkDataParam.overtimeUser = res.overtimeUser;
						_this.hrProcessBusinessData.extraWorkDataParam.overtimeUserName = _this.formData.overtimeUserName;
						_this.hrProcessBusinessData.extraWorkDataParam.projectId = res.projectId;
						_this.hrProcessBusinessData.extraWorkDataParam.projectName = _this.formData.projectName;
						//把输入框本该是数字类型的值从String转为数字类型,[用于拦截器校验]
						_this.formData.userInfos.forEach((user,index) =>{
							user.planDatetimeRange = res.planDatetimeRangeDynamic[index]
							user.planHours = parseInt(res.planHoursDynamic[index])
						})
						_this.hrProcessBusinessData.extraWorkDataParam.userInfos = _this.formData.userInfos;
						var data = {
							boxId:_this.taskInfo.boxId,
							processInsId:_this.taskInfo.processInsId,
							taskId:_this.taskInfo.taskId,
							appKey:_this.taskInfo.appKey,
							currUserAccount:userInfo.userAccount,
							extraWorkDataParam:_this.hrProcessBusinessData.extraWorkDataParam,
							processActivity:processActivity,
							hrDataType:'JIABAN',
							approverUserAccount:(_this.bisSelectUser === '1' && _this.ApproverList.length > 0) ? res.ApproverUser.userAccount:'',
						}
						
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
			async getUsers(users){
				this.userValue = users;
				let userAccounts = '';
				let userNames = '';
				for (let i = 0; i < users.length; i++) {
						if(i === (users.length -1)){
							userAccounts += users[i].userAccount;
							userNames += users[i].userName
						}else{
							userAccounts += users[i].userAccount+',';
							userNames += users[i].userName+','
						}
				        
				}
				this.formData.overtimeUser = userAccounts,
				this.formData.overtimeUserName = userNames,
				await this.builderUesrInfos();
			},
			getProjects(project){
				this.projectValue = project;
				let projectIds = '';
				let projectNames = '';
				for (let i = 0; i < project.length; i++) {
						if(i === (project.length -1)){
							projectIds += project[i].value;
							projectNames += project[i].text;
						}else{
							projectIds += project[i].value+',';
							projectNames += project[i].text+','
						}
				        
				}
				this.formData.projectId = projectIds,
				this.formData.projectName = projectNames,
				console.log("this.projectValue:"+JSON.stringify(this.projectValue))
				console.log("this.formData.projectId:"+this.formData.projectId)
				console.log("this.formData.projectName:"+this.formData.projectName)
			},
			async timeChange(name,e){
				this.formData.planDatetimeRange = e;
				await this.getOvertimeTime();
				if(this.vError){
					this.$refs.form.setValue(name, this.vError)
				}else(
					this.$refs.form.setValue(name, this.formData.planDatetimeRange)
				)
				this.builderUesrInfos();
			},
			changeApproverUser(name,e){
				let _this = this;
				_this.ApproverIndex = e.detail.value;
				_this.formData.ApproverUser = _this.ApproverList[_this.ApproverIndex];
				this.$refs.form.setValue(name, _this.formData.ApproverUser)
			},
			//计算加班工时
			async getOvertimeTime(vacationTypeCode){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					planDatetimeRange:_this.formData.planDatetimeRange
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/getOvertimeTime',
					data:data,
					method: 'POST'	
				})
				if(res.data.ret){
					_this.formData.planHours = res.data.data
					_this.vError = ''
					console.log("_this.formData.planHours:"+JSON.stringify(_this.formData.planHours))
				}else{
					_this.vError = res.data.errmsg
					_this.formData.planHours = ''
					
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
					console.log("hrProcessBusinessData："+ JSON.stringify(_this.hrProcessBusinessData));
				}else{
					_this.hrProcessBusinessData = '';
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
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
			async closeProcess(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let processInstanceId = _this.taskInfo.processInsId;
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.bpm/closeProcess?processInstanceId='+ processInstanceId,
					data:{processInstanceId:processInstanceId},
					method: 'POST',
					showLoading:true
				})
				if(res.data.ret){
					uni.setStorageSync("isDoBacklogRefresh",1);
					uni.switchTab({
						 url:'../../../backlog/backlog'
					});
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			//动态添加人员
			async builderUesrInfos(){
				var userInfo = this.$helper.fetchLocalUser();
				let userList = []
				console.log("this.formData.userInfos前："+JSON.stringify(this.formData.userInfos))
				this.userValue.forEach((u,index)=>{
					console.log("时间："+this.formData.planDatetimeRange)
					userList.push({
						userAccount:u.userAccount,
						userName:u.userName,
						planDatetimeRange:this.formData.planDatetimeRange,
						planHours:this.formData.planHours,
						creator:userInfo.userAccount
					});
					this.$set(this.formData.planDatetimeRangeDynamic,index,this.formData.planDatetimeRange);
					this.$set(this.formData.planHoursDynamic,index,this.formData.planHours);
				})
				this.formData.userInfos = [];
				//保证组件 对象 数组赋值刷新
				await this.$nextTick(()=>{
					this.formData.userInfos = userList;
				})
				console.log("this.formData.userInfos后："+JSON.stringify(this.formData.userInfos))
			},
			//动态添加检验规则
			builderUserInfosRules(){
				console.log("规则前："+JSON.stringify(this.formData.userInfos));
				this.formData.userInfos.forEach((user,index)=>{
					this.$set(this.rules,'planDatetimeRange'+index,{rules:[
							{ 	required:true,
								errorMessage:"请选择预估时间范围",
							},
							{
								validateFunction:function(rule,value,data,callback){
									//value为String类型说明返回的是错误信息，时间范围为数组类型
									console.log(JSON.stringify("时间校验"+value))
									console.log(value)
									if(Array.isArray(value) && (!value[0]) || (!value[1])){
										callback("请选择预估时间范围")
									}
									if(typeof value == 'string'){
										if ( value && value.length > 0) {
											 callback(value)
										}
									}
									return true
								}
							}
						]});
						this.$set(this.rules,'planHours'+index,{rules:[ { required:true,
								errorMessage:"预计工时为必填字段",
							}
						  ]});
					
				})
				console.log("规则后："+JSON.stringify(this.rules));
			},
			async userInfoTimeChange(name,index,e){
				console.log("name:"+name +"e:"+e)
				this.formData.planDatetimeRangeDynamic[index] = e;
				await this.getUserInfosOvertimeTime(index);
				if(this.vError){
					this.$refs.form.setValue(name, this.vError)
				}else(
					this.$refs.form.setValue(name, this.formData.planDatetimeRangeDynamic[index])
				)
			},
			//计算UserInfo内时间控件加班工时
			async getUserInfosOvertimeTime(index){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					planDatetimeRange:_this.formData.planDatetimeRangeDynamic[index]
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/getOvertimeTime',
					data:data,
					method: 'POST'	
				})
				if(res.data.ret){
					_this.formData.planHoursDynamic[index] = res.data.data
					//_this.$set(_this.formData.userInfos, index, res.data.data);
					_this.vError = ''
				}else{
					_this.vError = res.data.errmsg
					
				}
							
			},
			//检验动态生成的组件
			checkUserInfosRules(){
				this.formData.userInfos.forEach((user,index)=>{
					console.log('planDatetimeRange'+index)
					this.$refs.form.setValue('planDatetimeRange'+index, user.planDatetimeRange);
					this.$refs.form.setValue('planHours'+index, user.planHours);
				});
			},
			getProjectDrawType(e){
				this.showpdraw1 = e.showdraw1;
				this.showpdraw = e.showdraw;
				//console.log(JSON.stringify(e))
			},
			getEmployeesDrawType(e){
				this.showedraw1 = e.showdraw1;
				this.showedraw = e.showdraw;
				//console.log(JSON.stringify(e))
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			}
		}
	}
</script>

<style>
	.vbutton {
		padding: 0 11px 11px;
		color: #a5a5a5;
		line-height: 100rpx;
		flex: 0 0 100rpx;
	 }
</style>
