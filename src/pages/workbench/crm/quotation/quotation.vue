<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息"  mode="card">
				<uni-forms-item  required name="quoteName" label="报价对象" label-align="right" >
					<uni-easyinput type="text" v-model="formData.quoteName" placeholder="报价对象" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item  required name="business" label="所属业务" label-align="right" >
					<department-picker :multiple="false" @getResults="selectedData" ></department-picker>
				</uni-forms-item>
				<uni-forms-item  required name="quoteTool" label="报价工具" label-align="right" >
					<picker @change="changeQuoteTool" :value="quoteToolIndex" :range="quoteToolList" range-key="name">
						<view  v-if="quoteToolList.length>0" class="uni-input picker-border">{{quoteToolList[quoteToolIndex].name}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item  required name="charge" label="收费类型" label-align="right" >
					<picker @change="changeCharge" :value="chargeIndex" :range="chargeList" range-key="chargeType">
						<view v-if="chargeList.length>0" class="uni-input picker-border">{{chargeList[chargeIndex].chargeType}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item  required name="quoteDate" label="报价日期" label-align="right" >
					<uni-datetime-picker  type="date"  v-model="formData.quoteDate"   @change="dateChange"></uni-datetime-picker>
				</uni-forms-item>
				
				<view v-if="dynamicFormDatas.length > 0">
					<dynamic-form ref="sonFrom" :usetype="false" :formItems="dynamicFormDatas"  @getResults="getDatas" @validateDynamicFrom='checkValidateDynamicFrom' ></dynamic-form>
				</view>
				
				<uni-forms-item  required name="bidAmount" label="报价费用(元)" label-align="right" >
					<view class="uni-flex uni-row">
						<uni-easyinput type="digit" v-model="formData.bidAmount" placeholder="报价费用" ></uni-easyinput>
						<text @click="quotationUserTool" class="iconfont icon-jisuan" style="font-size: 30px;"></text>
					</view>
					
				</uni-forms-item>
				<uni-forms-item   name="remark" label="相关说明" label-align="right" >
					<uni-easyinput type="textarea" v-model="formData.remark" placeholder="相关说明" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item required name="file" label="附件" label-align="right">
					<common-file-picker  :dataObj="setFileFieldsName()"></common-file-picker>
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
	import dynamicForm from'../../../../components/dynamic-form/dynamic-form.vue'
	import departmentPicker from '../../../../components/department-picker/department-picker.vue'
	export default {
		data() {
			return {
				//动态表单校验通过状态
				validateDynamicFrom:false,
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				quoteToolIndex:0,
				quoteToolList:[],
				chargeIndex:0,
				chargeList:[],
				formData:{
					quoteName:'',
					business:'',
					quoteDate:'',
					bidAmount:'',
					quoteTool:'',
					charge:'',
					dynamicFormData:'',
					remark:''
				},
				rules:{
					quoteName:{
						rules:[
								{ 	required:true,
									errorMessage:"报价对象为必填项",
								}
						]
					},
					business:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择所属业务",
								}
						]
					},
					quoteTool:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择报价工具",
								}
						]
					},
					charge:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择收费类型",
								}
						]
					},
					quoteDate:{
						rules:[
								{ 	required:true,
									errorMessage:"请选择报价日期",
								}
						]
					},
					bidAmount:{
						rules:[
								{ 	required:true,
									errorMessage:"报价费用为必填字段",
								}
						]
					}
				},
				dynamicFormDatas:[
					// {
					// 	type:'inputText',
					// 	required:true,
					// 	field:'sss',
					// 	fieldName:'SSS'
					// },
					// {
					// 	type:'inputNumber',
					// 	required:true,
					// 	field:'ddd',
					// 	fieldName:'DDD'
					// },
					// {
					// 	type:'textarea',
					// 	field:'www',
					// 	fieldName:'WWW'
					// },
					// {
					// 	type:'picker',
					// 	field:'zzzz',
					// 	fieldName:'ZZZZ',
					// 	pickerIndex:0,
					// 	pickerList:[
					// 		{
					// 			name:'无'
								
					// 		},
					// 		{
					// 			name:'自住'
								
					// 		},
					// 		{
					// 			name:'客户'
								
					// 		}
					// 	]
					// },
					// {
					// 	type:'picker',
					// 	field:'ooo',
					// 	fieldName:'OOOO',
					// 	pickerIndex:0,
					// 	pickerList:[
					// 		{
					// 			name:'哈哈'
					// 		},
					// 		{
					// 			name:'啦啦'
					// 		},
					// 		{
					// 			name:'呼呼'
					// 		}
					// 	]
					// },
					// {
					// 	type:'datetime',
					// 	required:true,
					// 	field:'ppppp',
					// 	fieldName:'PPPPPP'
					// },
					// {
					// 	type:'date',
					// 	required:true,
					// 	field:'ppppp2',
					// 	fieldName:'PPPPPP2'
						
					// }
				]
				
			}
		},
		onReady() {
		        // 需要在onReady中设置规则
				this.$refs.form.setRules(this.rules)
		},
		methods: {
			submit(){
				var _this = this;
					//检验子组件动态表单并返回值
					if(_this.dynamicFormDatas && _this.dynamicFormDatas.length > 0){
						_this.$refs.sonFrom.getFormData();
					}
					//计价时排除报价费用校验	
					 _this.$refs.form.validate().then(async (res)=>{
						 //console.log('res:'+JSON.stringify(res))
						 //动态表单校验通过，主表单才能通过
						 if(_this.validateDynamicFrom){
							 var userInfo = _this.$helper.fetchLocalUser();
							 var data = {
							 	businessId:_this.formData.business.id,
							 	businessName:_this.formData.business.name,
							 	quoteToolId:res.quoteTool.id,
							 	quoteToolName:res.quoteTool.name,
							 	chargeId:res.charge.id,
							 	chargeName:res.charge.chargeType,
							 	bidAmount:res.bidAmount,
							 	creator:userInfo.userAccount,
							 	remark:_this.formData.remark,
							 	quoteDate:res.quoteDate,
							 	quoteName:res.quoteName,
							 	formData:_this.formData.dynamicFormData
							 };
							 const result = await _this.$myRequest.pmccRequest({
							 	url:'/app.quotation/saveQuotation',
							 	method: 'POST',
							 	data:data,
								showLoading:true
							 })
							 if(result.data.ret){
								uni.redirectTo({
									url:'quotationList'
								})
							 }else{
							 	this.msgType =  'error';
							 	this.message = result.data.errmsg
							 	this.$refs.popupMessage.open();
							 }
						 }

					});
				
			},
			initDatas(){
				
			},
			getDatas(datas){
				this.formData.dynamicFormData = JSON.stringify(datas);
				console.log("dynamicFormData:"+ this.formData.dynamicFormData );
			},
			dateChange(date){
				console.log(date)
				this.formData.quoteDate = date;
				this.$refs.form.setValue('quoteDate',this.formData.quoteDate)
			},
			selectedData(data){
				
				this.formData.business = data[0];
				console.log("选中部门："+JSON.stringify(this.formData.business))
				//选择部门后，清空所有旧数据，在查询
				this.clearData();
				this.getQuoteToolList(this.formData.business.id);
			},
			changeQuoteTool(e){
				console.log(e.detail.value)
				this.quoteToolIndex =  e.detail.value;
				this.formData.quoteTool = this.quoteToolList[this.quoteToolIndex];
				this.$refs.form.setValue('quoteTool',this.formData.quoteTool )
				this.getChargeList(this.formData.quoteTool.id);
				
				
			},
			changeCharge(e){
				this.chargeIndex =  e.detail.value;
				this.formData.charge = this.chargeList[this.chargeIndex];
				this.$refs.form.setValue('charge',this.formData.charge )
				this.getDynamicFormDatas(this.formData.charge.id);
			},
			//根据部门Id获取报价工具
			async getQuoteToolList(departmentId){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.quotation/quoteTools?departmentId='+ departmentId,
					data:{departmentId:departmentId},
					method: 'GET',
					
				})
				if(res.data.ret){
					this.quoteToolList = res.data.data;
					//获取到报价工具集合后，默认选中第一个
					this.formData.quoteTool = this.quoteToolList[this.quoteToolIndex];
					//并触发校验
					this.$refs.form.setValue('quoteTool',this.formData.quoteTool )
					
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			//根据报价工具Id获取收费类型
			async getChargeList(toolId){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				const res = await _this.$myRequest.pmccRequest({
					url:'/app.quotation/quoteToolCharges?toolId='+ toolId,
					data:{toolId:toolId},
					method: 'GET',
					
				})
				if(res.data.ret){
					this.chargeList = res.data.data;
					//获取到收费类型集合后，默认选中第一个
					this.formData.charge = this.chargeList[this.chargeIndex];
					//并触发校验规则
					this.$refs.form.setValue('charge',this.formData.charge )
					//获取动态表单
					this.getDynamicFormDatas(this.formData.charge.id);
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			//根据收费类型Id获取报价动态表单
			async getDynamicFormDatas(chargeId){
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					const res = await _this.$myRequest.pmccRequest({
						url:'/app.quotation/quoteDynamicForm?chargeId='+ chargeId,
						data:{chargeId:chargeId},
						method: 'GET',
						
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
			//计算报价
			async quotationUserTool(){
				var _this = this;
					//检验子组件动态表单并返回值
					if(_this.dynamicFormDatas && _this.dynamicFormDatas.length > 0){
						_this.$refs.sonFrom.getFormData();
						
					}
					//计价时排除报价费用校验	
					 _this.$refs.form.validateField(['quoteName','business','quoteTool','charge','quoteDate']).then(async (res)=>{
						// console.log('res:'+JSON.stringify(res))
						 //动态表单校验通过，主表单才能通过
						 if(_this.validateDynamicFrom){
							 var userInfo = _this.$helper.fetchLocalUser();
							 var data = {
							 	businessId:_this.formData.business.id,
							 	businessName:_this.formData.business.name,
							 	quoteToolId:res.quoteTool.id,
							 	quoteToolName:res.quoteTool.name,
							 	chargeId:res.charge.id,
							 	chargeName:res.charge.chargeType,
							 	bidAmount:'',
							 	creator:userInfo.userAccount,
							 	remark:_this.formData.remark,
							 	quoteDate:res.quoteDate,
							 	quoteName:res.quoteName,
							 	formData:_this.formData.dynamicFormData
							 };
							 const result = await _this.$myRequest.pmccRequest({
							 	url:'/app.quotation/quotationUserTool',
							 	method: 'POST',
							 	data:data,
								showLoading:true
							 })
							 if(result.data.ret){
							 	this.formData.bidAmount = result.data.data;
							 }else{
							 	this.msgType =  'error';
							 	this.message = result.data.errmsg
							 	this.$refs.popupMessage.open();
							 }
						 }

					});
				
			},
			//选择所属业务，需要先清空数据，在查询
			clearData(){
				this.formData.quoteTool = '';
				this.formData.charge= '';
				this.quoteToolIndex = 0;
				this.chargeIndex = 0;
				this.quoteToolList =[];
				this.chargeList = [];
				this.formData.dynamicFormData = '';
				this.dynamicFormDatas = [];
			},
			//获取子组件动态表单是否通过检验状态
			checkValidateDynamicFrom(data){
				this.validateDynamicFrom = data;
				console.log(this.validateDynamicFrom)
				
			},
			popupchange(e){
				console.log('popup ' + e.type + ' 状态', e.show)
			},
			setFileFieldsName(){
				var userInfo = this.$helper.fetchLocalUser();
				let obj = {
					fieldsName: 'files',
					tableId: 0,
					tableName: 'tb_crm_quotation',
					appKey: 'pmcc-crm',
					creator:userInfo.userAccount
				};
				return obj;
			}
		},
		components: {
			"dynamic-form":dynamicForm,
			"department-picker":departmentPicker
		}
		
	}
</script>

<style>

</style>
