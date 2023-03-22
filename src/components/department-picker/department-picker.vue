<template>
	<view>
		<uni-easyinput  :clearable="false" v-model="departmentName" @focus="focus()" placeholder="请选择"></uni-easyinput>
		<tki-tree 
			ref="tkitree" 
			:border="false" 
			cancelColor="#0055ff" 
			confirmColor="#0055ff" 
			titleColor="#0055ff" 
			:selectParent="true" 
			:multiple="multiple" 
			:range="departmentTreeList" 
			:foldAll="false" 
			idKey="id"
			rangeKey="name" 
			@confirm="treeConfirm"
			@cancel="treeCancel"
		></tki-tree>
		
	</view>
</template>

<script>
	export default {
		name:"department-picker",
		props:{
			multiple:{type:Boolean,default:false},
		},
		data() {
			return {
				departmentName:'',
				departmentTreeList:[]
			};
		},
		created() {
			this.initDepartmentTreeList();
			console.log(this.departmentTreeList);
		},
		methods:{
			//初始化部门数据
			async initDepartmentTreeList(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let res = await _this.$myRequest.pmccRequest({
					url: `/app.sys/departmentTree`,
					method: 'GET'
				});
				if (res.data.ret) {
					console.log(res.data.data) ;
					_this.departmentTreeList = res.data.data;
					
				} else {
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			},
			focus(){
				this.$refs.tkitree._show();
				//手动关闭软键盘
				uni.hideKeyboard();
			},
			// 确定回调事件
			treeConfirm(selectedData) {
				console.log(JSON.stringify(selectedData))
				this.departmentName = this.getDepartmentNames(selectedData);
				this.$emit("getResults",selectedData);
			},
			// 取消回调事件
			treeCancel(e) {
				console.log(e)
			},
			// 获取部门名称多个,分隔
			getDepartmentNames(list){
				let resultString = '';
				for (let i = 0; i < list.length; i++) {
						if(i === (list.length -1)){
							resultString += list[i].name;
						}else{
							resultString += list[i].name+',';
						}
				        
				}
				return resultString;
			},
		}
	}
</script>

<style>

</style>
