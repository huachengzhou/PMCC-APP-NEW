<template>
	<view >
			<uni-forms :value="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
				<uni-group  title="基本信息" mode="card">
					<uni-forms-item  required name="title" label="标题" label-align="right" >
						<uni-easyinput style="width: 90%;" type="text" v-model="formData.title" placeholder="请输入标题" ></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item required name="text" label="内容" label-align="right">
						<uni-easyinput style="width: 90%;" type="textarea" v-model="formData.text" placeholder="请输入内容" />
					</uni-forms-item>
					<uni-forms-item  required name="datetimeRange" label="时间范围"  label-align="right"> 
						<uni-datetime-picker style="width: 90%;" rangeSeparator="至" type="datetimerange"  v-model="formData.datetimeRange"    @change="timeChange"></uni-datetime-picker>
					</uni-forms-item>
					<uni-forms-item  required name="urgencyType" label="标识"  label-align="right">
						<uni-rate  @change="rateOnChange" :is-fill="false" active-color="red" v-model="formData.urgencyType" />
					</uni-forms-item>
				</uni-group>
			</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				  formData:{
						id:'',
						title:'',
						text:'',
						urgencyType:'1',
						datetimeRange: []	
				  },
				  rules:{
					  title: {
						 rules:[{
							 required:true,
							 errorMessage:'请输入标题'
						 }]
					  },
					  text: {
						 rules:[{
							 required:true,
							 errorMessage:'请输入内容'
						 }]
					  },
					  datetimeRange: {
							 rules:[
								 {
									 required:true,
									 errorMessage:"请选择日程时间范围"
								 },
								 {
									 validateFunction:function(rule,value,data,callback){
										var startDate = new Date(value[0]).getTime();
										var endDate = new Date(value[1]).getTime();
										if (startDate > endDate) {
											 callback('开始时间不能大于结束时间')
										}
										return true
									}
								 }
							 ]
					  }
					  
				  }
			}
		},
		onLoad(e) {
				
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				// 手动提交表单
				this.$refs.form.validate().then(async (res)=>{
					console.log('表单返回得值：', res)
					var _this = this;
					var userInfo = this.$helper.fetchLocalUser();
					var data = {
						userAccount:userInfo.userAccount,
						title: res.title,
						text: res.text,
						urgencyType:res.urgencyType,
						datetimeRange: res.datetimeRange	
					}
					let result = await this.$myRequest.pmccRequest({
						url:`/app.schedule/saveSchedule`,
						method:'POST',
						data:data,
						showLoading:true
					})
					if(result.data.ret){
						uni.showToast({
							title: '保存成功',
							success() {
								uni.setStorageSync("isDoRefresh",1);
								uni.switchTab({
									url:'schedule'
								});
							}
						});
					}
				})
			}
		},
		methods: {
			submitForm(form) {
				// 手动提交表单
				this.$refs.form.validate().then((res)=>{
					console.log('表单返回得值：', res);
					
				})
				
			},
			timeChange(e){
				console.log(e);
			},
			 rateOnChange(e) {
			    console.log('rate发生改变:' + JSON.stringify(e))
			
			}
		}
		
	}
</script>

<style>
	.info-box{
		padding: 10 10px;
		color: #007AFF;
	}
	.text-box{
		width: 100%;
		height: 40px;
		line-height: 40px;
	}
	.left{
		float: left;
		width: 200rpx;
		font-size: 15px;
	}
	.right{
		float: right;
		-webkit-flex: 1;
		flex: 1;
	}
	

</style>
