<template>
	<view style="margin-top: 20px;">
		<uni-forms :value="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息" mode="card">
			<uni-forms-item  required name="title" label="标题" label-align="right" >
				<uni-easyinput suffixIcon="label-icon" style="width: 90%;" type="text" v-model="formData.title"   disabled />
			</uni-forms-item>
			<uni-forms-item required name="text" label="内容" label-align="right">
				<uni-easyinput suffixIcon="label-icon" style="width: 90%;" type="textarea" v-model="formData.text"  disabled />
			</uni-forms-item>
			<uni-forms-item  required name="datetimeRange" label="时间范围"  label-align="right"> 
				<!-- <uni-datetime-picker style="width: 90%;" rangeSeparator="至" type="datetimerange"  v-model="formData.datetimeRange"  :start-placeholder='formData.datetimeRange[0]'	:end-placeholder='formData.datetimeRange[1]'   @change="timeChange"></uni-datetime-picker> -->
				
				<view class="item-text" style="-webkit-flex: 1;flex: 1;">
					<text>{{formData.datetimeRange[0]}} 至 {{formData.datetimeRange[1]}} </text>
				</view>
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
									 }
								 ]
						  }
						  
					  }
				}
			
		},
		
		onLoad(option) {
			let data = JSON.parse(option.data);
			this.formData.id = data.id;
			this.formData.title = data.title;
			this.formData.text =data.text;
			this.formData.datetimeRange = data.datetimeRange;
			this.formData.urgencyType = data.urgencyType;
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
	.example {
			padding: 0 15px 15px;
		}
	.item-text{
		display: flex;
		flex-direction: row;
		margin:23rpx 0rpx;
		/* padding: 0 15rpx; */
		text-align: left;
		font-size: 26rpx;
		 /*-webkit-justify-content: center;
		justify-content: center;
		-webkit-align-items: center;
		align-items: center; */
	}
</style>
