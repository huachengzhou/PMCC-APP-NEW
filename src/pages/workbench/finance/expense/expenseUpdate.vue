<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息" mode="card">
				<uni-forms-item   name="projectId" label="所属项目" label-align="right" >
					<project-picker ref="project" :multiple="false"  :inputValue="projectValue" @getResults="getProjects" @getdrawType="getProjectDrawType"></project-picker>
				</uni-forms-item>
				<uni-forms-item  required name="costMain" label="单位" label-align="right" >
					<picker @change="changeCostMain" :value="costMainIndex" :range="costMainList" range-key="dicName">
						<view  v-if="costMainList.length > 0" class="uni-input picker-border">{{costMainList[costMainIndex].dicName}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item  required name="costBillType" label="发票类型" label-align="right" >
					<picker @change="changeCostBillType" :value="costBillTypeIndex" :range="costBillTypeList" range-key="name">
						<view  v-if="costBillTypeList.length > 0" class="uni-input picker-border">{{costBillTypeList[costBillTypeIndex].name}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item  required name="billNumber" label="发票张数" label-align="right" >
						<uni-number-box v-model="formData.billNumber"  @change="changeNumberValue" />
				</uni-forms-item>
				<uni-forms-item  required name="invoiceNumber" label="发票编号" label-align="right" >
						<uni-easyinput  type="text" v-model="formData.invoiceNumber" placeholder="发票编号" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="expenseDate" label="开票日期" label-align="right" >
					<uni-datetime-picker  type="date"  v-model="formData.expenseDate"   @change="dateChange"></uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item  required name="amount" label="金额(元)" label-align="right" >
						<uni-easyinput @input="inputCalculate" :maxlength="10"  type="digit" v-model="formData.amount" placeholder="金额" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="taxes" label="税费(元)" label-align="right" >
						<uni-easyinput @input="inputCalculate" :maxlength="10"  type="digit" v-model="formData.taxes" placeholder="税费" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="costTaxesTotal" label="价税合计(元)" label-align="right" >
						<uni-easyinput @input=inputValue :maxlength="10" type="digit" v-model="formData.costTaxesTotal" placeholder="价税合计" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item required name="remarks" label="备注" label-align="right">
					<uni-easyinput  type="textarea" v-model="formData.remarks" placeholder="请输入内容" />
				</uni-forms-item>
				<uni-forms-item required name="file" label="附件" label-align="right">
					<common-file-picker   :orcType="'invoice'" :appKey="appkey" :dataObj="attachmentData"></common-file-picker>
				</uni-forms-item>
			</uni-group>
		</uni-forms>
		<button @click="submit()" >保存</button>
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import projectPicker from'../../../../components/project-picker/project-picker.vue'
	export default {
		data() {
			return {
				notSaved:false,
				showpdraw:false,
				showpdraw1:false,
				appkey:'',
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				attachmentData:'',
				projectValue:[],
				costBillTypeIndex:0,
				costBillTypeList:[],
				costMainList:[],
				costMainIndex:0,
				formData:{
					id:'',
					costMain:'',
					projectId:'',
					projectName:'',
					costBillType:'',
					billNumber:'',
					invoiceNumber:'',
					expenseDate:'',
					amount:'',
					taxes:'',
					costTaxesTotal:'',
					remarks:'',
					billData:''
				},
				rules:{
					costBillType:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择发票类型",
								}
						]
					},
					billNumber:{
						rules:[
								{ 	required:true,
									errorMessage:"发票张数为必填项",
								}
						]
					},
					invoiceNumber:{
						rules:[
								{ 	required:true,
									errorMessage:"发票编号为必填项",
								}
						]
					},
					expenseDate:{
						rules:[
								{ 	required:true,
									errorMessage:"开票日期为必填项",
								}
						]
					},
					amount:{
						rules:[
								{ 	required:true,
									errorMessage:"金额为必填项",
								}
						]
					},
					taxes:{
						rules:[
								{ 	required:true,
									errorMessage:"税费为必填项",
								}
						]
					},
					costTaxesTotal:{
						rules:[
								{ 	required:true,
									errorMessage:"价税合计为必填项",
								}
						]
					},
					remarks:{
						rules:[
								{ 	required:true,
									errorMessage:"备注为必填项",
								}
						]
					},
				}
			}
		},
	  async	onLoad(option) {
		  // console.log("onLoad")
		  this.appkey = uni.getStorageSync('pmcc-finance');
		  let initData = JSON.parse(option.data);
		  //附件所需参数
		  var userInfo = this.$helper.fetchLocalUser();
		  let obj = {
		  	fieldsName: 'formDataExpenseNewBill',
		  	tableId: initData.id,
		  	tableName: 'tb_form_data_expense_new_bill',
		  	appKey: 'pmcc-finance',
		  	creator:userInfo.userAccount
		  };
		  this.attachmentData = obj;
		  // console.log("onLoad"+JSON.stringify(this.attachmentData))
		  await this.getCostMain();	
		  await	this.getCostBillType();
		  await this.initData(initData);
		  
		 
				
		},
		onReady() {
		        // 需要在onReady中设置规则
				this.$refs.form.setRules(this.rules)
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
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				var _this =this;
				uni.scanCode({
				onlyFromCamera: true,
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						uni.showLoading({
							mask:true
						});
						console.log(res.result.split(','))
						try {
						   let arrays = res.result.split(',');
						   let type = arrays[1]
						   let fpdm = arrays[2];
						   let fphm = arrays[3];
						   let money = arrays[4];
						   let date = arrays[5];
						   let checkCode = arrays[6];
						   let code = type === '01' ? money : checkCode.substring(checkCode.length - 6);
						   let channel = arrays[7];
						   var url = `http://inv-veri.com/check?fpdm=${fpdm}&fphm=${fphm}&date=${date}&code=${code}&channel=${channel}`
						   console.log(url)
						   
						   uni.request({
								url:url,
								success: (result) => {
									console.log(JSON.stringify(result))
									if(result.data.code === 0){
										let data = result.data.data
										
										if(data.key1 === '002'){
											uni.hideLoading();
											_this.msgType =  'error';
											_this.message = data.message
											_this.$refs.popupMessage.open();
										}else{
											let keys = Object.keys(data);
											_this.formData.billData = JSON.stringify(data);
											keys.sort();
											keys.forEach(el=>{
												if(el.indexOf('fphm_') > -1) {
													_this.formData.invoiceNumber = data[el];
												}
												if(el.indexOf('je_') > -1) {
													_this.formData.amount = data[el];
												}
												if(el.indexOf('se_') > -1) {
													_this.formData.taxes = data[el];
												}
												if(el.indexOf('jshjxx_') > -1) {
													_this.formData.costTaxesTotal = data[el];
												}
												if(el.indexOf('kprq_') > -1) {
													_this.formData.expenseDate = _this.$commonUtils.formatTimeZh(data[el]);
												}
											})
											uni.hideLoading();
										}
											
									}else{
										uni.hideLoading();
										_this.msgType =  'error';
										_this.message = result.data.message
										_this.$refs.popupMessage.open();
										
									}
									
								}
						   })
						   
						}
						catch(err){
							console.log(err)
							uni.hideLoading();
						     uni.showModal({
						     	content: "请扫描正确的二维码",
						     	showCancel: false
						     })
						}
						
					}
				});
			}
		},
		methods: {
			submit(){
				var _this = this;
				_this.$refs.form.validate().then(async (res)=>{
					console.log("res:" +JSON.stringify(res))
					var userInfo = _this.$helper.fetchLocalUser();
					var data = {
						id:_this.formData.id,
						projectId:_this.formData.projectId,
						projectName:_this.formData.projectName,
						invoiceNumber:res.invoiceNumber,
						expenseDate:res.expenseDate,
						amount:parseInt(res.amount * 100),
						taxes:parseInt(res.taxes * 100),
						costTaxesTotal:parseInt(res.costTaxesTotal * 100),
						creator:userInfo.userAccount,
						costBillType:_this.formData.costBillType.code,
						costBillTypeName:_this.formData.costBillType.name,
						billNumber:res.billNumber,
						remarks:res.remarks,
						costMainId:_this.formData.costMain.dicId,
						costMainName:_this.formData.costMain.dicName,
						billData:_this.formData.billData?_this.formData.billData:null
					};
					if(this.checkCostTaxesTotal()){
						 const result = await _this.$myRequest.pmccRequest({
						 	url:'/app.finance/saveExpenseBill',
						 	method: 'POST',
						 	data:data,
							showLoading:true
						  })
						  if(result.data.ret){
						 	uni.redirectTo({
						 		url:'expenseList'
						 	})
						  }else{
						 	this.msgType =  'error';
						 	this.message = result.data.errmsg
						 	this.$refs.popupMessage.open();
						  }
					}
					
				});
			},
			async initData(initData){
				this.formData.id = initData.id,
				this.formData.projectId = initData.projectId,
				this.formData.projectName = initData.projectName,
				this.costBillTypeList.forEach((item,index)=>{
					if(initData.costBillType === item.code){
						this.costBillTypeIndex = index;
						this.formData.costBillType = item;
					}
				})
				this.costMainList.forEach((costMain,index)=>{
					if(initData.expenseCompanyId === costMain.dicId){
						this.costMainIndex = index;
						this.formData.costMain = costMain;
					}
				})
				this.formData.billNumber = initData.billNumber,
				this.formData.invoiceNumber = initData.invoiceNumber,
				this.formData.expenseDate = initData.expenseDate, 
				this.formData.amount = initData.amount / 100,
				this.formData.taxes = initData.taxes / 100,
				this.formData.costTaxesTotal = initData.costTaxesTotal / 100,
				this.formData.remarks = initData.remarks
				this.projectValue = [{text:initData.projectName,value: parseInt(initData.projectId)}];
				
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
			async getCostBillType(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.finance/billTypeList',
					method: 'GET'	
				})
				if(res.data.ret){
					_this.costBillTypeList = res.data.data;
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
			changeCostBillType(e){
				this.costBillTypeIndex = e.detail.value;
				this.formData.costBillType = this.costBillTypeList[this.costBillTypeIndex];
				this.$refs.form.setValue('costBillType',this.formData.costBillType)
				// if(this.formData.costTaxesTotal && this.formData.costTaxesTotal > 0){
				// 	this.formData.amount = (this.formData.costTaxesTotal /(1 + this.formData.costBillType.taxes).toFixed(2)).toFixed(2)
				// 	this.formData.taxes = (this.formData.costTaxesTotal - this.formData.amount).toFixed(2)
				// }
			},
			changeNumberValue(value){
				this.formData.billNumber = value;
				this.$refs.form.setValue('billNumber',this.formData.billNumber)
			},
			dateChange(date){
				console.log(date)
				this.formData.quoteDate = date;
				this.$refs.form.setValue('expenseDate',this.formData.quoteDate)
			},
			inputCalculate(){
				if(this.formData.amount && this.formData.taxes){
					this.formData.costTaxesTotal = (parseFloat(this.formData.amount)  + parseFloat(this.formData.taxes)).toFixed(2) ;
				}
			},
			inputValue(){
				//根据税价合计 计算金额和税费
				// if(this.formData.costTaxesTotal && this.formData.costTaxesTotal > 0){
				// 	this.formData.amount = (this.formData.costTaxesTotal /(1 + this.formData.costBillType.taxes).toFixed(2)).toFixed(2)
				// 	this.formData.taxes = (this.formData.costTaxesTotal - this.formData.amount).toFixed(2)
				// }
				
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			},
			checkCostTaxesTotal(){
				let status = true;
				let amount = parseFloat(this.formData.amount).toFixed(2)- 0
				let taxFree = parseFloat(this.formData.taxes).toFixed(2)- 0
				let costTaxesTotal = parseFloat(this.formData.costTaxesTotal).toFixed(2)-0
				if(!((amount+taxFree) === costTaxesTotal)){
					this.msgType =  'error';
					this.message = '金额 + 税费 不等于 税价合计，请检查重新填写';
					this.$refs.popupMessage.open();
					status = false;
				}
				return status;
			},
			getProjectDrawType(e){
				this.showpdraw1 = e.showdraw1;
				this.showpdraw = e.showdraw;
				//console.log(JSON.stringify(e))
			},
			
		}
	}
</script>

<style>

</style>
