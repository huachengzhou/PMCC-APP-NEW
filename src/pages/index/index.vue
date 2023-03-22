<template>
	<view >
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group  title="基本信息" mode="card">
				<uni-forms-item  name="selectInput" label="备注" label-align="right">
					<select-Input  :selectDatas="datas" @getResults="getResults"></select-Input>
				</uni-forms-item>
			</uni-group>
		</uni-forms>
		<button @click="submit()" >保存</button>
	</view>
</template>

<script>
	import selectInput from '../../components/select-Input/select-Input.vue'
	export default {
		data() {
			return {
				datas: ['断点','断点试试','呵呵'],
				test:[{"name":"应急通道门2","index":1,"description":"未知","unitLocation":"左门"},{"name":"应急通道门1","index":2,"description":"未知","unitLocation":"后门"}],
				formData:{
					selectInput:'',
				},
				rules:{
					selectInput:{
						rules:[
								{ 	required:true,
									errorMessage:"选择器为必填项",
								}
						]
					},
				},
				
			}
		},
		onLoad() {

		},
		components:{
			'select-Input':selectInput
		},
		methods: {
			getResults(e){
				console.log("返回结果："+ e)
				this.selectInput= e;
			},
			submit(){
				
				
				//
				// uni.downloadFile({
				//   url: 'http://192.168.2.206/attachment/downloadFileFromServer?id=39061',
				//   success: function (res) {
				//     var filePath = res.tempFilePath;
				// 	console.log('filePath'+filePath);
				// 	// escape(filePath)
				//     uni.openDocument({
				//       filePath: filePath,
				//       success: function (res) {
				//         console.log('打开文档成功');
				//       }
				//     });
				//   }
				// });
				// this.$refs.form.validate().then((res)=>{
				// 	console.log(JSON.stringify(res));
				// });
			}
		}
	}
</script>

<style>
	
</style>
