<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息" mode="card">
				<uni-forms-item  required name="costMain" label="费用主体" label-align="right" >
					<picker @change="changeCostMain" :value="costMainIndex" :range="costMainList" range-key="dicName">
						<view  v-if="costMainList.length > 0" class="uni-input picker-border">{{costMainList[costMainIndex].dicName}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item   name="projectId" label="所属项目" label-align="right" >
					<project-picker ref="project" :multiple="false"  :inputValue="projectValue" @getResults="getProjects" @getdrawType="getProjectDrawType"></project-picker>
				</uni-forms-item>
				<uni-forms-item  required name="prov" label="地区" label-align="right" >
					<uni-data-picker  placeholder="请选择地区" popup-title="请选择所在地区" :localdata="provTree" v-model="areaId"
						@change="onchangeProv" @nodeclick="onnodeclick" @popupopened="onpopupopened" @popupclosed="onpopupclosed">
					</uni-data-picker>
				</uni-forms-item>
				<uni-forms-item  required name="twoLevel" label="费用类型" label-align="right" >
					<picker @change="changetwoLevel" :value="twoLevelIndex" :range="twoLevelList" range-key="name">
						<view  v-if="twoLevelList.length > 0" class="uni-input picker-border">{{twoLevelList[twoLevelIndex].name}}</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item  required name="datetimeRange" label="时间范围" label-align="right" >
					<uni-datetime-picker  rangeSeparator="至" type="datetimerange"  v-model="formData.datetimeRange"    @change="timeChange('datetimeRange',$event)"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item  required name="days" label="天数" label-align="right" >
					<uni-easyinput :maxlength="5" 
						type="digit" v-model="formData.days" placeholder="天数" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="peopleCount" label="人员" label-align="right" >
					<employees-picker :multiple="true"  :inputValue="userValue" @getResults="getUsers" ></employees-picker>
				</uni-forms-item>
				<!-- <uni-forms-item   name="standardAmount" label="限额" label-align="right" >
						<uni-easyinput :maxlength="10" disabled type="number" v-model="formData.standardAmount" placeholder="限额" ></uni-easyinput>
				</uni-forms-item> -->
				<uni-forms-item  required name="actualStandardAmount" label="实际金额(元)" label-align="right" >
						<uni-easyinput :maxlength="10"  type="digit" v-model="formData.actualStandardAmount" placeholder="实际金额" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item   name="site" label="详细地址" label-align="right" >
						<uni-easyinput   type="text" v-model="formData.site" placeholder="详细地址" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  name="remarks" label="备注" label-align="right">
					<uni-easyinput  type="textarea" v-model="formData.remarks" placeholder="请输入内容" />
				</uni-forms-item>
				<uni-forms-item required name="file" label="附件" label-align="right">
					<common-file-picker  :appKey="appkey" :dataObj="attachmentData"></common-file-picker>
				</uni-forms-item>
				
			</uni-group>
			<uni-group v-if="dynamicFormDatas.length > 0" title="自定义数据" mode="card">
				<dynamic-form ref="sonFrom" :formItems="dynamicFormDatas"  @getResults="getDatas" @validateDynamicFrom='checkValidateDynamicFrom' ></dynamic-form>
			</uni-group>
		</uni-forms>
		
		<button @click="submit()" >保存</button>
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	//import  * as mydate from '../../../../common/datetime.js'
	export default {
		data() {
			return {
				appkey:'',
				attachmentData:'',
				notSaved:false,
				showpdraw:false,
				showpdraw1:false,
				validateDynamicFrom:false,
				msgType: 'error',
				message: '这是一条错误消息提示',
				areaId:'',
				userValue:[],
				projectValue:[],
				costMainList:[],
				costMainIndex:0,
				twoLevelList:[],
				twoLevelIndex:0,
				provTree:[],
                dynamicFormDatas:[],
				formData:{
					id:'',
					masterId:'',
					costMain:'',
					projectId:'',
					projectName:'',
					prov:'',
					city:'',
					twoLevel:'',
					dynamicFormData:'',
					datetimeRange:'',
					days:'',
					peopleCount:'',
					peopleCountName:'',
					standardAmount: 0,
					actualStandardAmount:'',
					site:'',
					remarks:''
				},
				rules:{
					costMain:{
						rules:[
								{ 	required:true,
									errorMessage:"费用主体为必填项",
								}
						]
					},
					prov:{
						rules:[
								{ 	required:true,
									errorMessage:"地区为必填项",
								}
						]
					},
					twoLevel:{
						rules:[
								{ 	required:true,
									errorMessage:"费用类型为必填项",
								}
						]
					},
					datetimeRange:{
						rules:[
								{ 	required:true,
									errorMessage:"时间范围为必填项",
								}
						]
					},
					days:{
						rules:[
								{ 	required:true,
									errorMessage:"天数为必填项",
								}
						]
					},
					peopleCount:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择人员",
								}
						]
					},
					actualStandardAmount:{
						rules:[
								{ 	required:true,
									errorMessage:"实际金额为必填项",
								}
						]
					},
				}
			}
		},
		onReady() {
		        // 需要在onReady中设置规则
				this.$refs.form.setRules(this.rules)
		},
		async onLoad(option) {
			//console.log("option.data"+option.data)
			let initData = JSON.parse(option.data);
			this.appkey = uni.getStorageSync('pmcc-finance');
			//附件所需参数
			var userInfo = this.$helper.fetchLocalUser();
			let obj = {
				tableId: initData.id,
				tableName: 'tb_form_data_expense_new_detail',
				appKey: 'pmcc-finance',
				creator:userInfo.userAccount
			};
			this.attachmentData = obj;
			console.log("onLoad"+JSON.stringify(this.attachmentData))
			await this.getCostMain();
			await this.getTwoLevel();
			await this.getProvinceList();
			await this.initData(initData);
			//this.areaId = '50'
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
		methods: {
			async initData(data){
				this.formData.id = data.id;
				this.formData.masterId = data.masterId;
				this.projectValue = [{text:data.projectName,value: parseInt(data.projectId)}];
				this.formData.projectId = data.projectId;
				this.formData.projectName = data.projectName;
				this.formData.prov = {
					areaId:data.prov,
					name:data.provName
				}
				this.formData.city = {
					areaId:data.city,
					name:data.cityName
				}

				this.areaId = data.city.toString();
				this.formData.datetimeRange = [this.formatTime(data.startDate),this.formatTime(data.endDate)];
				this.formData.days = data.days;
				this.formData.peopleCount = data.peopleCount,
				this.formData.peopleCountName = data.peopleCountName,
				//this.formData.standardAmount = data.standardAmount,
				this.formData.actualStandardAmount = data.actualStandardAmount / 100;
				this.formData.site = data.site;
				this.formData.dynamicFormData = data.formData;
				this.formData.remarks = data.remarks;
				
				this.costMainList.forEach((costMain,index)=>{
					if(data.costMainId === costMain.dicId){
						this.costMainIndex = index;
						this.formData.costMain = costMain;
					}
				})
				this.twoLevelList.forEach((twoLevel,index)=>{
					if(data.twoLevelId === twoLevel.id){
						this.twoLevelIndex = index;
						this.formData.twoLevel = twoLevel;
					}
				})
				await this.getDynamicFormDatas(this.formData.twoLevel.id,this.formData.dynamicFormData);
				await this.initUserData(data.peopleCount)
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
					
				}else{
					_this.msgType =  'error';
					_this.message = res.data.errmsg
					_this.$refs.popupMessage.open();
					
				}
			},
			submit(){
				var _this = this;
					//检验子组件动态表单并返回值
					if(_this.dynamicFormDatas && _this.dynamicFormDatas.length > 0){
						_this.$refs.sonFrom.getFormData();
					}
					_this.validateDynamicFrom=true;//动态表单暂不验证
					//计价时排除报价费用校验	
					 _this.$refs.form.validate().then(async (res)=>{
						 console.log('res:'+JSON.stringify(res))
						 //动态表单校验通过，主表单才能通过
						 if(_this.validateDynamicFrom){
							 var userInfo = _this.$helper.fetchLocalUser();
							 var data = {
								 id:_this.formData.id,
								 masterId:_this.formData.masterId,
								 costMainId:_this.formData.costMain.dicId,
								 projectId:_this.formData.projectId,
								 projectName:_this.formData.projectName,
								 prov:_this.formData.prov.areaId,
								 provName:_this.formData.prov.name,
								 city:_this.formData.city.areaId,
								 cityName:_this.formData.city.name,
								 twoLevelId:_this.formData.twoLevel.id,
								 twoLevelName:_this.formData.twoLevel.name,
								 datetimeRange:res.datetimeRange,
								 days:res.days,
								 peopleCount:_this.formData.peopleCount,
								 peopleCountName:_this.formData.peopleCountName,
								 //standardAmount:res.standardAmount,
								 actualStandardAmount:res.actualStandardAmount * 100,
								 site:res.site,
								 remarks:res.remarks,
							 	 formData:_this.formData.dynamicFormData,
								 userAccount:userInfo.userAccount
							 };
							 if(!data.formData){
							 	data.formData="{}";
							 }
							 console.log(JSON.stringify(data))
							 const result = await _this.$myRequest.pmccRequest({
							 	url:'/app.financedetail/saveExpenseDetail',
							 	method: 'POST',
							 	data:data,
								showLoading:true
							 })
							 if(result.data.ret){
								uni.redirectTo({
									url:'expenseDetailList'
								})
							 }else{
							 	this.msgType =  'error';
							 	this.message = result.data.errmsg
							 	this.$refs.popupMessage.open();
							 }
						 }
			
					});
				
			},
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
			async getTwoLevel(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.financedetail/financialBaseDataDic?userAccount='+userInfo.userAccount,
					data:{userAccount:userInfo.userAccount},
					method: 'GET'	
				})
				if(res.data.ret){
					_this.twoLevelList = res.data.data;
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			async getProvinceList(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					selectALL:'false'
					//areaIds:['501','502','2','2829']
				}
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.public/getProvinceList',
					data:data,
					method: 'POST'	
				})
				if(res.data.ret){
					_this.provTree = res.data.data;
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			async getAreaList(pid){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.public/getAreaList?pid='+pid,
					data:{pid:pid},
					method: 'POST'	
				})
				if(res.data.ret){
					_this.children = res.data.data;
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
				this.formData.costMain = this.costMainList[this.costMainIndex];
				this.$refs.form.setValue('costMain',this.formData.costMain)
			},
			changetwoLevel(e){
				this.twoLevelIndex = e.detail.value;
				this.formData.twoLevel = this.twoLevelList[this.twoLevelIndex];
				this.getDynamicFormDatas(this.formData.twoLevel.id)
				this.$refs.form.setValue('twoLevel',this.formData.twoLevel)
			},
			async timeChange(name,e){
				this.formData.datetimeRange = e;
				console.log(JSON.stringify(this.formData.datetimeRange))
				let day = this.getAllDay(this.formData.datetimeRange[0],this.formData.datetimeRange[1])
				console.log("day："+day)
				this.formData.days = day;
				this.$refs.form.setValue(name, this.formData.datetimeRange)


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
				this.formData.projectName = projectNames
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
				this.formData.peopleCount = userAccounts;
				this.formData.peopleCountName = userNames;
			},
			//当前页面附件上传所需参数
			setFileFieldsName() {
				var userInfo = this.$helper.fetchLocalUser();
				let obj = {
					fieldsName: 'formDataExpenseNewBill',
					tableId: 0,
					tableName: 'tb_form_data_expense_new_bill',
					appKey: 'pmcc-finance',
					creator: userInfo.userAccount
				};
				return obj;
			},
			onnodeclick(e) {
				//console.log("onnodeclick"+JSON.stringify(e));
			},
			onpopupopened(e) {
				//console.log('popupopened'+JSON.stringify(e));
			},
			onpopupclosed(e) {
				//console.log('popupclosed'+JSON.stringify(e));
			},
			onchangeProv(e) {
				this.formData.prov = e.detail.value[0];
				this.formData.city = e.detail.value[1];

			},
			getDatas(datas){
				this.formData.dynamicFormData = JSON.stringify(datas);
				console.log("dynamicFormData:"+ this.formData.dynamicFormData );
			},
			//获取子组件动态表单是否通过检验状态
			checkValidateDynamicFrom(data){
				this.validateDynamicFrom = data;
				console.log(this.validateDynamicFrom)
				
			},
			//根据费用类型Id获取报价动态表单
			async getDynamicFormDatas(formElementsId,formData){
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					var data = {
						businessId:formElementsId,
						formData:formData
					};
					const res = await _this.$myRequest.pmccRequest({
						url:'/app.financedetail/dynamicsFieldList',
						method: 'POST',
						data:data
						
					})
					if(res.data.ret){
						this.dynamicFormDatas = res.data.data;
					}else{
						uni.showToast({
							title: res.data.errmsg,
							mask: true,
							duration: 1000
						}); 
					}
			},
			//计算开始，借宿日期间隔天数
			getAllDay (begin, end) {
				  var dateSpan, iDays;
				  //兼容IOS时间类
				  begin = begin.replace(/-/g, "/");
				  end  = end.replace(/-/g, "/");
				  let sDate1 = Date.parse(this.formatTime(begin,"YYYY-MM-DD"));
				  let sDate2 = Date.parse(this.formatTime(end,"YYYY-MM-DD"));
				  dateSpan = sDate2 - sDate1;
				  dateSpan = Math.abs(dateSpan);
				  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
				  return iDays + 1;
			},
			getProjectDrawType(e){
				this.showpdraw1 = e.showdraw1;
				this.showpdraw = e.showdraw;
				//console.log(JSON.stringify(e))
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			},
		}
	}
</script>

<style>

</style>
