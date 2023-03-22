<template>
	<view >
		<view>
				<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
					<uni-group  title="基本信息" mode="card">
						<uni-forms-item  required name="vacationType" label="假期类型" label-align="right" >
							<picker @change="binddata('vacationType',$event)" :value="vacationTypeIndex" :range="vacationTypes" range-key="name">
								<view class="uni-input picker-border">{{vacationTypes[vacationTypeIndex].name}}</view>
							</picker>
							<view v-if="vacationTime.dayCount > 0 || vacationTime.hourCount > 0" class="vacationTypetext"> 
								<text style="color: #09BB07;">可用:{{this.timeAvailable}}</text>
							</view>		
						</uni-forms-item>
						<uni-forms-item  required name="startDate" label="开始时间"  label-align="right">
							<uni-datetime-picker ref="startDate" rangeSeparator="至" type="datetime"  v-model="formData.startDate"    @change="timeChange('startDate',$event)"></uni-datetime-picker>
						</uni-forms-item>
						<uni-forms-item  required name="endDate" label="结束时间"  label-align="right">
							<uni-datetime-picker ref="endDate" rangeSeparator="至" type="datetime"  v-model="formData.endDate"    @change="timeChange('endDate',$event)"></uni-datetime-picker>
						</uni-forms-item>
						
						
						<uni-forms-item  required name="sysDays" label="天数" label-align="right" >
							<uni-easyinput :disabled="true" :clearable="false" type="digit" v-model="formData.sysDays" placeholder="天数" ></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item  required name="sysHours" label="小时" label-align="right" >
							<uni-easyinput  :disabled="true" :clearable="false" type="digit" v-model="formData.sysHours" placeholder="小时" ></uni-easyinput>
						</uni-forms-item>
						
						<uni-forms-item required name="reason" label="请假事由" label-align="right">
							<uni-easyinput  type="textarea" v-model="formData.reason" placeholder="请输入内容" />
						</uni-forms-item>
					</uni-group>
					
					<uni-group v-if="bisSelectUser === '1' && ApproverList.length > 0" title="审批人"  mode="card">
						<uni-forms-item  required name="ApproverUser" label="审批人" label-align="right" >
							<picker @change="changeApproverUser('ApproverUser',$event)" :value="ApproverIndex" :range="ApproverList" range-key="userName">
								<view class="uni-input picker-border">{{ApproverList[ApproverIndex].userName}}</view>
							</picker>	
						</uni-forms-item>
					</uni-group>
				</uni-forms>
				
		</view>
		<view class="vbutton" >
			<button @click="vsubmit()" :loading="loading">提交</button>
		</view>
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import employeesPicker from'../../../components/employees-picker/employees-picker.vue'
	const systemInfo = uni.getSystemInfoSync();
	export default {
		data() {
			return {
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				appMenuId:'',
				vacationTypeIndex:0,
				vacationTypes:[{name:''}],
				ApproverIndex:0,
				ApproverList:[],
				bisSelectUser:'',
				//{userName:''}
				formData:{
					id:'',
					vacationType:'',
					sysDays:'',
					sysHours:'',
					startDate:'',
					endDate:'',
					modifyDays:'',
					modifyHours:'',
					mainId:'',
					reason:'',
					ApproverUser:''
					
				},
				rules:{
					vacationType:{
						rules:[
								// { 	required:true,
								// 	errorMessage:"请选择请假类型",
								// }
						]
					},
					startDate:{
						rules:[
							{ 	required:true,
								errorMessage:"请选择开始时间",
							}
						],
					},
					endDate:{
						rules:[
							{ 	required:true,
								errorMessage:"请选择结束时间",
							}
						],
					},
					sysDays:{
						rules:[ { 	required:true,
									errorMessage:"天数为必填字段",
								}
							  ]
					},
					sysHours:{
						rules:[ { 	required:true,
									errorMessage:"小时为必填字段",
								}
							  ]
					},
					reason:{
						rules:[ { 	required:true,
									errorMessage:"请填写请假事由",
								}
							  ]
					},
					ApproverUser:{
						rules:[ { 	required:true,
									errorMessage:"审批人不能为空",
								}
							  ]
					}
					
				},
				loading:false,
				vacationTime:'',
				timeAvailable:'',
				computeVacation:'',
				vError:''
				
		
			}
		},
		components: {"employees-picker":employeesPicker},
		onReady() {
		        // 需要在onReady中设置规则
				this.$refs.form.setRules(this.rules)
		},
		async onLoad(option) {
			console.log("v-onLoad:"+option.id)
			this.appMenuId = option.id;
			await this.getVacationTypeList();
			this.formData.vacationType = this.vacationTypes[this.vacationTypeIndex];
			await this.getVacationTime(this.formData.vacationType.id);
			this.getTimeAvailable();
			await this.getApproverList()
			console.log("this.bisSelectUser: "+ this.bisSelectUser)
			if(this.bisSelectUser && this.bisSelectUser ==='1'){
				this.formData.ApproverUser = this.ApproverList[this.ApproverIndex];
			}
			

		},
		methods: {
			vsubmit(){
				this.$refs.form.validate().then(async (res)=>{
					console.log("res:"+ JSON.stringify(res));
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					var vacationDataParam = {			
						vacationType:res.vacationType.id,
						vacationTypeName:res.vacationType.name,
						startDate:res.startDate,
						endDate:res.endDate,
						sysDays:parseInt(res.sysDays),
						sysHours:parseInt(res.sysHours),
						modifyDays:parseInt(_this.formData.modifyDays),
						modifyHours:parseInt(_this.formData.modifyHours),
						reason:res.reason
						
					};
					var data = {
						appMenuId:_this.appMenuId,
						userAccount:userInfo.userAccount,
						approverUserAccount:(_this.bisSelectUser === '1' && _this.ApproverList.length > 0) ? res.ApproverUser.userAccount:'',
						vacationDataParam:vacationDataParam
					}
					
					let result = await _this.$myRequest.pmccRequest({
						url:`/app.hr/applyProcess`,
						method:'POST',
						data:data,
						showLoading:true
					})
					if(result.data.ret){ 
						uni.showToast({
							title: '操作成功',
							mask:true,
							success() {
							   uni.switchTab({
								   url:'../workbench'
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
			async timeChange(name,e){
				if(name === 'startDate'){
					this.formData.startDate = e;
				}
				if(name === 'endDate'){
					this.formData.endDate = e;
				}
				if(this.formData.startDate && this.formData.endDate){
					// 校验结束时间不能小于开始时间
					if(this.$commonUtils.checkDateEndGreaterThenStart(this.formData.startDate,this.formData.endDate)){
						await this.autoComputeVacation();
					}else{
						this.msgType =  'error';
						this.message = "结束时间不能小于开始时间";
						this.$refs.popupMessage.open();
						this.$nextTick(()=>{
							this.$refs[name].clear();
						});
					}
					
				}
				//时间组件需要手动触发表单校验
				if(name === 'startDate'){
					this.$refs.form.setValue(name, this.formData.startDate);
				}
				if(name === 'endDate'){
					this.$refs.form.setValue(name, this.formData.endDate);
				}
				
			},
			
			
			async binddata(name,e){
				let _this = this;
				_this.vacationTypeIndex = e.detail.value;
				_this.formData.vacationType = _this.vacationTypes[_this.vacationTypeIndex];
				await _this.getVacationTime(_this.formData.vacationType.id);
				_this.getTimeAvailable();
				if(_this.formData.startDate && _this.formData.endDate){
					await this.autoComputeVacation();
					this.$refs.form.setValue('startDate', this.formData.startDate);
					this.$refs.form.setValue('endDate', this.formData.endDate);
				}
				this.$refs.form.setValue(name, _this.formData.vacationType)
			},
			changeApproverUser(name,e){
				let _this = this;
				_this.ApproverIndex = e.detail.value;
				_this.formData.ApproverUser = _this.ApproverList[_this.ApproverIndex];
				this.$refs.form.setValue(name, _this.formData.ApproverUser)
			},
			getResults(e){
				 this.inputValue = e;
				 console.log(JSON.stringify(this.inputValue))
			},
			getTimeAvailable(){
				console.log("getTimeAvailable："+JSON.stringify(this.vacationTime))
				if(this.vacationTime){
					if(this.vacationTime.dayCount > 0 && this.vacationTime.hourCount > 0){
						this.timeAvailable = this.vacationTime.dayCount+'天'+ this.vacationTime.hourCount+'小时'
					} 
					if((this.vacationTime.dayCount && this.vacationTime.dayCount > 0) && ((!this.vacationTime.hourCount) || this.vacationTime.hourCount === 0) ){
						this.timeAvailable = this.vacationTime.dayCount+'天'
					}
					if((this.vacationTime.hourCount && this.vacationTime.hourCount >0) &&((!this.vacationTime.dayCount)|| this.vacationTime.dayCount ===0)){
						this.timeAvailable = this.vacationTime.hourCount+'小时'
					}
					console.log("timeAvailable"+this.timeAvailable)
				}
			},
			
			async getVacationTypeList(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/vacationTypeList',
					method: 'GET'	
				})
				if(res.data.ret){
					_this.vacationTypes = res.data.data;
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
				
			},
			//取得当前人选择假期类型可使用的请假天数
		  async getVacationTime(vacationTypeCode){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let data = {
					vacationType:vacationTypeCode,
					userAccount:userInfo.userAccount
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/vacationTime',
					data:data,
					method: 'POST'	
				})
				if(res.data.ret){
					_this.vacationTime = res.data.data
					console.log("getVacationTime:"+JSON.stringify(_this.vacationTime))
				}else{
					// uni.showToast({
					// 	title: res.data.errmsg,
					// 	mask: true,
					// 	duration: 1000
					// }); 
					this.msgType =  'error';
					this.message = res.data.errmsg;
					this.$refs.popupMessage.open();
				}
				
			},
			async autoComputeVacation(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let data = {
					vacationType:_this.formData.vacationType.id,
					userAccount:userInfo.userAccount,
					startDate:_this.formData.startDate,
					endDate:_this.formData.endDate
				}
				
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/autoComputeVacation',
					data:data,
					method: 'POST'	
				})
				if(res.data.ret){
					_this.computeVacation = res.data.data
					if(_this.computeVacation){
						_this.formData.sysDays = _this.computeVacation.sysDays
						_this.formData.sysHours = _this.computeVacation.sysHours
						_this.formData.modifyDays = _this.computeVacation.sysDays
						_this.formData.modifyHours = _this.computeVacation.sysHours
					
					}
					
				}else{
					_this.formData.sysDays = ''
					_this.formData.sysHours= ''
					_this.formData.modifyDays = ''
					_this.formData.modifyHours= ''
					
					this.msgType =  'error';
					this.message = res.data.errmsg;
					this.$refs.popupMessage.open();
				}
			},
			async getApproverList(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data ={
					appMenuId:this.appMenuId,
					userAccount:userInfo.userAccount
					
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.hr/approverList',
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
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			}

		}
	}
</script>

<style>
.vacationTypetext{
	padding: 0 11px 11px;
}
 .vbutton {
 	padding: 0 11px 11px;
	color: #a5a5a5;
	line-height: 100rpx;
	flex: 0 0 100rpx;
 }
 
.position-sticky {
    position: -webkit-sticky!important;
    position: sticky!important;
}
    
.fixed-bottom {
    position: fixed;
    right: 0;
    bottom: calc( var(--window-bottom) + 3px);
    left: 0;
    z-index: 1030;
    margin-bottom: 6;
}


 
.scroll-view-super {
	flex: 1;
	position: relative;
}
.scroll-view {
	height: 100%;
	width: 100%;
	/* position: absolute; */
	top: 0;
	left: 0;
}
.scroll-bottom {
	/* #ifndef APP-NVUE */
	width: auto;
	/* #endif */
	position: fixed;
	left: 0;
	right: 0;
	z-index: 999;
	bottom: calc(var(--window-bottom) + 10px);
}
</style>
