<template>
	<view>
			<uni-group  title="基本信息" mode="card">
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 所属项目:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.projectName}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 发票类型:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.costBillTypeName}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 发票张数:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.billNumber}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 发票编号:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.invoiceNumber}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 开票日期:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formatTime(formData.expenseDate,'YYYY-MM-DD')}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 金额(元):</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.amount}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 税费(元):</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.taxes}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 价税合计(元):</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><text>{{formData.costTaxesTotal}}</text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 备注:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><rich-text :nodes="formData.remarks"></rich-text></view>
					</uni-col>
				</uni-row>
				<uni-row class="uni-row" :width="nvueWidth">
					<uni-col :span="6">
						<view class="left"> 附件:</view>
					</uni-col>
					<uni-col :push="1" :span="18">
						<view ><common-file-picker :isShow='false' :dataObj="attachmentData"></common-file-picker></view>
					</uni-col>
				</uni-row>
			</uni-group>
		
	</view>
</template>

<script>
	import projectPicker from'../../../../components/project-picker/project-picker.vue'
	export default {
		data() {
			return {
				nvueWidth: 730,
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				attachmentData:'',
				formData:{
					id:'',
					projectId:'',
					projectName:'',
					costBillTypeName:'',
					billNumber:'',
					invoiceNumber:'',
					expenseDate:'',
					amount:'',
					taxes:'',
					costTaxesTotal:'',
					remarks:''
				}
			}
		},
	  async	onLoad(option) {
		  // console.log("onLoad")
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
		  await this.initData(initData);
		  
		 
				
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
						amount:res.amount * 100,
						taxes:res.taxes * 100,
						costTaxesTotal:res.costTaxesTotal * 100,
						creator:userInfo.userAccount,
						costBillType:_this.formData.costBillType.code,
						costBillTypeName:_this.formData.costBillType.name,
						billNumber:res.billNumber,
						remarks:res.remarks
					};
					uni.showLoading({
						mask:true
					})
					const result = await _this.$myRequest.pmccRequest({
						url:'/app.finance/saveExpenseBill',
						method: 'POST',
						data:data
					 })
					 if(result.data.ret){
						uni.hideLoading();
						uni.redirectTo({
							url:'expenseList'
						})
					 }else{
						this.msgType =  'error';
						this.message = result.data.errmsg
						this.$refs.popupMessage.open();
						uni.hideLoading();
					 }
					
				});
			},
			async initData(initData){
				this.formData.id = initData.id,
				this.formData.projectId = initData.projectId,
				this.formData.projectName = initData.projectName,
				this.formData.billNumber = initData.billNumber,
				this.formData.invoiceNumber = initData.invoiceNumber,
				this.formData.expenseDate = initData.expenseDate, 
				this.formData.amount = initData.amount / 100,
				this.formData.taxes = initData.taxes / 100,
				this.formData.costTaxesTotal = initData.costTaxesTotal / 100,
				this.formData.remarks = initData.remarks
				this.formData.costBillTypeName = initData.costBillTypeName
				
				
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
			changeCostBillType(e){
				this.costBillTypeIndex = e.detail.value;
				this.formData.costBillType = this.costBillTypeList[this.costBillTypeIndex];
				this.$refs.form.setValue('costBillType',this.formData.costBillType)
				if(this.formData.costTaxesTotal && this.formData.costTaxesTotal > 0){
					this.formData.amount = (this.formData.costTaxesTotal /(1 + this.formData.costBillType.taxes).toFixed(2)).toFixed(2)
					this.formData.taxes = (this.formData.costTaxesTotal - this.formData.amount).toFixed(2)
				}
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
			inputValue(){
				//根据税价合计 计算金额和税费
				if(this.formData.costTaxesTotal && this.formData.costTaxesTotal > 0){
					this.formData.amount = (this.formData.costTaxesTotal /(1 + this.formData.costBillType.taxes).toFixed(2)).toFixed(2)
					this.formData.taxes = (this.formData.costTaxesTotal - this.formData.amount).toFixed(2)
				}
				
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			}
		}
	}
</script>

<style>
.left{
	text-align: right;
	
}
</style>
