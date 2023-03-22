<template>
	<view>
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<template v-for="(item,index) in formItems">
				
				
				
				<uni-forms-item  :required="item.bisRequired" :name="item.formField" :label="item.fieldName" label-align="right" >
					
					<uni-easyinput :clearable="bisDeleteFlag" :disabled="!bisDeleteFlag" v-if="'1'=== item.fieldType" type="text" v-model="formData[item.formField]" :placeholder="item.fieldName" />
					<uni-easyinput :clearable="bisDeleteFlag"  :disabled="!bisDeleteFlag" v-if="'2'=== item.fieldType" type="textarea" autoHeight v-model="formData[item.formField]" :placeholder="item.fieldName" />
					
					<uni-easyinput :clearable="bisDeleteFlag"  :disabled="!bisDeleteFlag" v-if="'3'=== item.fieldType || '4'=== item.fieldType" 	type="digit" v-model="formData[item.formField]" :placeholder="item.fieldName" />
					
					<uni-datetime-picker :clearable="bisDeleteFlag"  :disabled="!bisDeleteFlag" v-if="'8'=== item.fieldType"  type="datetime"  v-model="formData[item.formField]"   @change="dateTimeChange(item,$event)"/>
					
					<uni-datetime-picker :clearable="bisDeleteFlag" :disabled="!bisDeleteFlag" v-if="'7'=== item.fieldType"  type="date"  v-model="formData[item.formField]"   @change="dateTimeChange(item,$event)"/>
					
					<common-file-picker :bisDeleteFlag="bisDeleteFlag" v-if="'13'=== item.fieldType" :dataObj="fileParam">
					</common-file-picker>
					
					<assess-picker :disabled="!bisDeleteFlag" v-if="'15'=== item.fieldType"  :dataInput="item.formField" :dataList="pickerParam[item.formField]"
						v-model:dataValue="formData[item.formField]">
					</assess-picker>
					<!-- 
					 暂时缺  部门选择 和人员选择
					 -->
					
				</uni-forms-item>
				
				
			</template>
		</uni-forms>
	</view>
</template>

<script>
	import commonFilePicker from '@/components/common-file-picker/file-cpn-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	
	export default {
		name:"dynamic-form",
		props:{
			formItems:{type:Array,default:[]},
			//普通为true，报价特殊方式为false,兼容动态表单来源不一致，选择器返回结果不同问题
			fileParam:{
				type:Object,default:() => {
					return {}
				}
			},
			pickerParam:{
				type:Object,default:() => {
					return {}
				}
			},
			bisDeleteFlag: {
				type: [Boolean],
				default: function() {
					return true;
				}
			}
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
		},
		mounted(){
			this.$refs.form.setRules(this.rules) 
		},
		methods:{
			//初始化表单字段
			builderFormDataField(){
				
				this.formItems.forEach((item,index)=>{
					// 这里 fieldValue 实际是没有的 传入进来使用
					this.$set(this.formData,item.formField,item.fieldValue?item.fieldValue:'');
				})
			},
			//初始化表单校验规则
			builderRules(){
				this.rules = {};
				//console.log("builderRules-formItems"+JSON.stringify(this.formItems))
				this.formItems.forEach((item,index)=>{
				//构建校验规则时，如果部分构建，切换动态表单有可能触发校验组件错误提示，故放到提交表单时，进行部分表必填单字段校验
				// if(item.required){
					this.$set(this.rules,item.formField,{rules:[ { required:item.bisRequired,
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
					 if(item.bisRequired){
						validateNames.push(item.formField)	
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
			//时间选择器变化事件
			dateTimeChange(item,e){
				console.log("dateTimeChange:"+ e);
				this.formData[item.formField] = e;
				//变化时触发校验
				this.$refs.form.setValue(item.formField,this.formData[item.formField])
			}
		},
		components: {
			"assess-picker": assessPicker,
			"common-file-picker": commonFilePicker,
		},
	}
</script>

<style>

</style>
