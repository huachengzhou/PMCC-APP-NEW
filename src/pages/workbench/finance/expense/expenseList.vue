<template>
	<view>
		<view>
			<uni-drawer  ref="draw" mode="right" mask :width="drawerWidth" @change="drawchange($event,'showdraw')" >
				
				<uni-forms  ref="form" validate-trigger="bind" err-show-type="undertext" >
					<uni-group  title="查询条件" mode="card">
					<uni-forms-item   name="projectId" label="发票号码" label-align="right" >
						<uni-search-bar :value="invoiceNumber" radius="5" placeholder="请输入发票号码" clearButton="auto" cancelButton="none" @input="searchInvoiceNumber" />
					</uni-forms-item>
					<uni-forms-item   name="projectId" label="发票类型" label-align="right" >
						<picker @change="changeCostBillType" :value="costBillTypeIndex" :range="costBillTypeList" range-key="name">
							<view  style="text-align: center;" v-if="costBillTypeList.length > 0" class="uni-input picker-border ">{{costBillTypeList[costBillTypeIndex].name}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item   name="projectId" label="单位" label-align="right" >
						<picker @change="changeCostMain" :value="costMainIndex" :range="costMainList" range-key="dicName">
							<view style="text-align: center;" v-if="costMainList.length > 0" class="uni-input picker-border">{{costMainList[costMainIndex].dicName}}</view>
						</picker>
					</uni-forms-item>
					</uni-group>
				</uni-forms>
				
				<view class="example">
					<button style="margin-top: 5px;" class="button" @click="selectData()">查询</button>
				</view>
				
				
			</uni-drawer>
		</view>
		<view>
			<z-paging ref="paging" fixed @query="queryPageList" v-model="dataList">
				<!-- <view class="expensetop picker-border"  slot="top" >
					<view style="-webkit-flex: 1;flex: 1;">
						<uni-search-bar radius="5" placeholder="请输入发票号码" clearButton="auto" cancelButton="none" @input="
						" />
					</view>
					<view style="width: 90px;">
						<picker @change="changeCostBillType" :value="costBillTypeIndex" :range="costBillTypeList" range-key="name">
							<view  v-if="costBillTypeList.length > 0" class="select-Input-picker ">{{costBillTypeList[costBillTypeIndex].name}}</view>
						</picker>
					</view>
					<view style="width: 90px;">
						<picker @change="changeCostMain" :value="costMainIndex" :range="costMainList" range-key="dicName">
							<view  v-if="costMainList.length > 0" class="select-Input-picker ">{{costMainList[costMainIndex].dicName}}</view>
						</picker>
					</view>
				</view> -->
				<uni-swipe-action>
					<uni-swipe-action-item  v-for="(item,index) in dataList"  :disabled="item.billStatus === '1' || item.billStatus === '2'"  :key="index" :right-options="options"  @click="onClick($event,item.id)"   @change="swipeChange($event, index)" >
						<view class="content-box" @click="toExpenseDetail(item)">
							 <view class=" content-head" >
								<text space="emsp" class="flex-text">{{item.costBillTypeName}}  {{billStatus(item.billStatus)}}</text>
								<view style="-webkit-flex: 1;flex: 1; text-align: right; font-size: 12px; color: #797979;" ><text>{{formatTime(item.expenseDate,'YYYY-MM-DD')}} </text></view>
							</view>
							<view class="content-text">
								 <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>金额:{{(item.amount/100).toFixed(2)}}(元)</text></view>
								 <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>税费:{{(item.taxes/100).toFixed(2)}}(元)</text></view>
								 <view style="-webkit-flex: 1;flex: 1; font-size: 12px; color: #797979;"><text>价税合计:{{(item.costTaxesTotal/100).toFixed(2)}}(元)</text></view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action> 
				<view  slot="bottom" >
					<button @click="addExpense" >新增</button>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showdraw:false,
				//抽屉弹窗宽度
				drawerWidth:0,
				showdraw:false,
				costMainList:[],
				costMainIndex:0,
				costBillType:'',
				costBillTypeList:[],
				costBillTypeIndex:0,
				costMain:'',
				invoiceNumber:'',
				dataList:[],
				options:[
					 {
						 text: '删除',
						 style: {
							 backgroundColor: '#ff0000'
							 
						 }
					 }
				]
				
			}
		},
		async onLoad(option) {
			if(option.appKey){
				uni.setStorageSync(option.appKey,option.appKey)
			}
			let sys = uni.getSystemInfoSync();
			let winWidth = sys.windowWidth;
			let winrate = 750/winWidth;
			let winHeight =parseInt(sys.windowHeight*winrate)
			this.drawerWidth = winWidth;
			//console.log(JSON.stringify(option.appKey))
			await this.getCostMain();
			await	this.getCostBillType();
			  var costBillType = {	
				code: '',
				name: "请选择发票",
				taxes: 0
			  };
			  var costMain = {
				code: '',
				dicName: "请选择单位",
			  };
			  this.costMainList.splice(0,0,costMain);
			  this.costBillTypeList.splice(0,0,costBillType);
		 //this.$set(, 0, cost)
		  
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				this.$refs.draw.open();
			}
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if(this.showdraw){
				this.$refs.draw.close();
				return true;
			}
			
		},
		methods: {
			searchInvoiceNumber(res){
				this.invoiceNumber = res;
				//this.$refs.paging.reload();
				
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
			addExpense(){
				uni.navigateTo({
					url:'expense'
				})
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
			toExpenseDetail(data){
				var json = JSON.stringify(data);
				// console.log(json)
				if(data.billStatus === '0'){
					uni.navigateTo({
						url:'expenseUpdate?data='+ json
					});
				}
				if(data.billStatus === '1'){
					uni.navigateTo({
						url:'expenseDetail?data='+ json
					});
				}
				if(data.processInsId && data.billStatus === '2'){
					uni.navigateTo({
						url:'expenseDetail?data='+ json
					});
				}

				
			},
			async queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNumber:pageNo,
					pageSize:pageSize,
					userAccount:userInfo.userAccount,
					costBillType:_this.costBillType,
					invoiceNumber:_this.invoiceNumber,
					costMainId:_this.costMain
				};
				let res = await _this.$myRequest.pmccRequest({
					url:`/app.finance/expenseBillList`,
					method:'POST',
					data:data
				});
				if(res.data.ret){
					this.$refs.paging.complete(res.data.data.rows);
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					});
				}
			},
			billStatus(status){
				let result = '';
				 switch (status) {
				     case "0":
				     result = '未使用'
				     break;
				     case "1":
				     result = '选中'
				     break;
				     case "2":
				     result = '已使用'
				     break;
				     default:
				     break;
				 }
				
				 return result;
			},
			swipeChange(e,index){
				
			},
			changeCostBillType(e){
				this.costBillTypeIndex = e.detail.value;
				this.costBillType = this.costBillTypeList[this.costBillTypeIndex].code;
				//this.$refs.paging.reload();
				
			},
			changeCostMain(e){
				this.costMainIndex = e.detail.value;
				this.costMain = this.costMainList[this.costMainIndex].dicId;
				//this.$refs.paging.reload();
				
			},
			onClick(e,id){
				console.log("删除Id："+id);
				  if(e.position === 'right' && e.index === 0){
					  	console.log("删除Id："+id);
					  	var _this = this;
					  	var userInfo = _this.$helper.fetchLocalUser();
					  	uni.showModal({
					  		title:"确定删除么？",
					  		content: "删除相应的数据不可恢复",
					  		confirmText: "确定",
					  		cancelText: "取消",
					  		cancelColor:"#DD524D",
					  		confirmColor:"#4CD964",
					  		success: async (res) => {
					  		        if (res.confirm) {
										let result = await _this.$myRequest.pmccRequest({
												url:`/app.finance/deleteExpenseNewBill?id=`+id,
												data:{id:id},
												method:"POST",
												showLoading:true
										})
										// console.log(result)
										if(result.data.ret){
										 	uni.showToast({
										 		title: '删除成功',
										 		success() {
										 			_this.$refs.paging.reload();
										 		}
										 	});
										 }
					  		        }
									
					  		    }
					  	}) 
				  }
				  
			},
			// 抽屉状态发生变化触发
			drawchange(e, type) {
				this[type] = e
			},
			selectData(){
				this.$refs.draw.close();
				this.$refs.paging.reload();
			}
			
			
		}	
	}
</script>

<style>
.content-box {
	/* #ifdef APP-NVUE */
	justify-content: center; 
	/* #endif */
	height: 65px;
	line-height: 65px;
	padding: 0 15px; 
	position: relative; 
	background-color: #ffffff;
	border-bottom-color: #dcdcdc;
	border-bottom-width: 1px;
	border-bottom-style: solid; 
}
.content-head{
	display: flex;
	flex-direction: row;
	height: 20px;
	line-height: 20px;
}
.content-text {
	display: flex;
	flex-direction: row;
	font-size: 15px;
	height: 40px;
	line-height: 40px; 
	margin-top: 10px; 
}
.expensetop{
	display: flex;
	flex-direction: row;
}
.select-Input {
	height: 70rpx;
	padding: 0rpx 0rpx;
	line-height:70rpx;
	font-size:28rpx;
	background:#FFF;
	flex: 1;
}
.select-Input-picker {
	height: 50rpx;
	 padding: 25rpx 0rpx; 
	line-height:50rpx;
	font-size:28rpx;
	background:#FFF;
	flex: 1;
	text-align: center
}
.example {
			padding: 0 15px 15px;
	}
</style>
