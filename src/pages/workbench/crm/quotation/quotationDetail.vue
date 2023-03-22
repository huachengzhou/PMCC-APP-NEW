<template>
	<view>
		<uni-group  title="基本信息" mode="card" v-if="datas">
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 报价对象:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{datas.quoteName}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 所属业务:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{datas.businessName}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 报价工具:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{datas.quoteToolName}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 收费类型:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{datas.chargeName}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 报价日期:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{formatTime(datas.quoteDate,'YYYY-MM-DD')}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row v-for="(item,index) in dynamicFormDataList" class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> {{item.fieldName}}:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{item.value}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 报价费用(元):</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><text>{{datas.bidAmount}}</text></view>
				</uni-col>
			</uni-row>
			<uni-row  class="uni-row" :width="nvueWidth">
				<uni-col :span="6">
					<view class="left"> 相关说明:</view>
				</uni-col>
				<uni-col :push="1" :span="18">
					<view ><rich-text :nodes="datas.remark"></rich-text></view>
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
		<uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
			<uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nvueWidth: 730,
				type: 'top',
				msgType: 'error',
				message: '这是一条错误消息提示',
				value: '默认输入的内容',
				datas:{},
				dynamicFormDataList:[],
				dynamicFormDatas:[],
				dynamicFormKeys:[],
				attachmentData:''
			}
		},
		async onLoad(option) {
			console.log(option.id)
			var userInfo = this.$helper.fetchLocalUser();
			let obj = {
				fieldsName: 'files',
				tableId: option.id,
				tableName: 'tb_crm_quotation',
				appKey: 'pmcc-crm',
				creator:userInfo.userAccount
			};
			this.attachmentData = obj;
			await this.initData(option.id)
			//console.log("onload" + JSON.stringify(this.datas))
			//console.log("onload" + JSON.stringify(this.datas.formData))
			if(this.datas.formData){
				this.dynamicFormDatas = JSON.parse(this.datas.formData)
				this.dynamicFormKeys = Object.keys(this.dynamicFormDatas);
				//console.log(JSON.stringify(this.dynamicFormKeys))
				await this.getDynamicFormDataList(this.datas.chargeId);
				//console.log(JSON.stringify(this.dynamicFormDataList))
				this.dynamicFormDataList.forEach((item,index)=>{
					this.dynamicFormKeys.forEach((key,i)=>{
						if(item.field === key){
							this.$set(item,'value',this.dynamicFormDatas[key]);
						}
						
					})
				})
				//console.log(JSON.stringify(this.dynamicFormDataList))
				
			}
			
			console.log(JSON.stringify(this.attachmentData))   	
		},
		methods: {
			async initData(id){
				 var _this = this;
				 var userInfo = _this.$helper.fetchLocalUser();
				 uni.showLoading({
					mask:true
				 })
				 const res = await _this.$myRequest.pmccRequest({
					url:'/app.quotation/quotationDetail?id='+id,
					data:{id:id},
					method: 'GET'
				 })
				 if(res.data.ret){
					_this.datas = res.data.data;
					uni.hideLoading();
					
				 }else{
					this.msgType =  'error';
					this.message = res.data.errmsg
					this.$refs.popupMessage.open();
					uni.hideLoading();
				 }				
			},
			//根据收费类型Id获取报价动态表单
			async getDynamicFormDataList(chargeId){
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					const res = await _this.$myRequest.pmccRequest({
						url:'/app.quotation/quoteDynamicForm?chargeId='+ chargeId,
						data:{chargeId:chargeId},
						method: 'GET',
						
					})
					if(res.data.ret){
						_this.dynamicFormDataList = res.data.data;
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
