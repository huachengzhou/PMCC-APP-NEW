<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<template v-for="(item,index) in formItems">
				<uni-forms-item v-if="'inputText'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-easyinput type="text" v-model="formData[item.field]" :placeholder="item.fieldName" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item v-if="'inputNumber'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-easyinput :maxlength="item.maxlength && item.maxlength > 0 ? item.maxlength : 10 " 
						type="number" v-model="formData[item.field]" :placeholder="item.fieldName" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item v-if="'inputDecimals'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-number-box :max="999999999999999" v-model="formData[item.field]" :step="0.01" @change="changeNumberValue(item,$event)" />
				</uni-forms-item>
				<uni-forms-item v-if="'textarea'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-easyinput  
						type="textarea" v-model="formData[item.field]" :placeholder="item.fieldName" ></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item v-if="'picker'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<picker @change="pickerChange(item,$event)" :value="item.pickerIndex" :range="item.pickerList" range-key="name">
						<view class="uni-input picker-border">{{item.pickerList[item.pickerIndex].name}}</view>
					</picker>	
				</uni-forms-item>
				<uni-forms-item v-if="'datetime'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-datetime-picker   type="datetime"  v-model="formData[item.field]"   @change="dateTimeChange(item,$event)"></uni-datetime-picker>	
				</uni-forms-item>
				<uni-forms-item v-if="'date'=== item.type" :required="item.required" :name="item.field" :label="item.fieldName" label-align="right" >
					<uni-datetime-picker   type="date"  v-model="formData[item.field]"   @change="dateTimeChange(item,$event)"></uni-datetime-picker>	
				</uni-forms-item>
			</template>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		name:"dynamic-form",
		props:{
			formItems:{type:Array,default:[]},
			//普通为true，报价特殊方式为false,兼容动态表单来源不一致，选择器返回结果不同问题
			usetype:{type:Boolean,default:true}
		},
		data() {
			return {
				formData:{
					
				},
				rules:{
					
				}
			};
		},
		watch:{
			formItems(data){
				if (!(Array.isArray(data))) {
					console.log("the props datas type must be array")
					return
				}
				
				this.builderFormDataField();
				this.builderRules();
				console.log('watch.rules'+JSON.stringify(this.rules))

			}
		},
		created() {
			this.builderFormDataField();
			this.builderRules();
			// console.log('created.rules'+JSON.stringify(this.rules))

		},
		mounted(){
			this.$refs.form.setRules(this.rules) 
			// this.$nextTick(()=>{
			// 	this.$refs.form.setRules(this.rules)
			// })
		},
		methods:{
			//初始化表单字段
			builderFormDataField(){
				 // this.$nextTick(()=>{
					// this.$refs.form.clearValidate();
				 // })				
				//this.formData = {};
				this.formItems.forEach((item,index)=>{
					switch(item.type){
						case 'picker':
							if(this.usetype){
								if(item.fieldValue){
									item.pickerList.forEach((pi,pindex) =>{
										if(item.fieldValue === pi.id){
											item.pickerIndex = pindex;
										}
									})
								}
								this.$set(this.formData,item.field,item.pickerList[item.pickerIndex].id);
								this.$set(this.formData,item.field+'_name',item.pickerList[item.pickerIndex].name);
							}else{
								this.$set(this.formData,item.field,item.pickerList[item.pickerIndex].name);
							}
							// console.log(JSON.stringify(item.pickerList[item.pickerIndex]))
						break;
						default:
						    this.$set(this.formData,item.field,item.fieldValue?item.fieldValue:'');
						break;
					}
				})
			},
			//初始化表单校验规则
			builderRules(){
				this.rules = {};
				//console.log("builderRules-formItems"+JSON.stringify(this.formItems))
				this.formItems.forEach((item,index)=>{
				//构建校验规则时，如果部分构建，切换动态表单有可能触发校验组件错误提示，故放到提交表单时，进行部分表必填单字段校验
				// if(item.required){
					this.$set(this.rules,item.field,{rules:[ { required:true,
								errorMessage:item.fieldName+"为必填字段",
							}
					]});
				// }
					
				})
				// console.log("builderRules-end"+ JSON.stringify(this.rules))

				// this.$nextTick(()=>{
				// 	this.$refs.form.setRules(this.rules); 
				// })
			},
			//检验表单并返回表单值
			getFormData(){
				//动态表单校验状态
				let checkDynamicFrom = false;
				let validateNames = [];
				this.formItems.forEach((item,index)=>{
					 if(item.required){
						validateNames.push(item.field)	
					 }
					
				})
				console.log("validateNames:"+JSON.stringify(validateNames))
				 this.$refs.form.validateField(validateNames).then((res)=>{
					// console.log("res动态表单:"+ JSON.stringify(res))
					// console.log("fromdata:"+ JSON.stringify(this.formData))
					//返回fromData的数据，res的数据不全
					this.$emit("getResults",this.formData);
					checkDynamicFrom = true;
					//异步会后执行，在设置一次值
					this.$emit("validateDynamicFrom",checkDynamicFrom);
				});
				//校验通过的情况下，会先于值修改前执行
				this.$emit("validateDynamicFrom",checkDynamicFrom);
			},
			//选择器选择变化事件
			pickerChange(item,e){
				console.log(e.detail.value)
				item.pickerIndex = e.detail.value;
				this.formData[item.field] = item.pickerList[item.pickerIndex].name;
				if(this.usetype){
					this.formData[item.field] = item.pickerList[item.pickerIndex].id;
					this.formData[item.field+'_name'] = item.pickerList[item.pickerIndex].name;
				}else{
					this.formData[item.field] = item.pickerList[item.pickerIndex].name;
				}
				//变化时触发校验
				this.$refs.form.setValue(item.field,this.formData[item.field])
			},
			//时间选择器变化事件
			dateTimeChange(item,e){
				console.log("dateTimeChange:"+ e);
				this.formData[item.field] = e;
				//变化时触发校验
				this.$refs.form.setValue(item.field,this.formData[item.field])
			},
			//数字输入框变化时间
			changeNumberValue(item,e){
				this.formData[item.field] = e
				this.$refs.form.setValue(item.field,this.formData[item.field])
			}
		}
	}
</script>

<style>

</style>
