<template>
	<view>
		<view>
			<view>
				<uni-easyinput  :clearable="false" v-model="selectedResults" @focus="focus('draw')" placeholder="请选择项目"></uni-easyinput>
			</view>
			<uni-drawer  ref="draw" mode="right" mask :width="drawerWidth" @change="drawchange($event,'showdraw')" >
				<view class="view">
					<z-paging ref="paging" fixed @query="queryPageList" v-model="dataList">
						<view slot="top" >
							<view>
								<uni-search-bar  @confirm="OnSearch" @input="onInputSearch"></uni-search-bar>
							</view>
						</view>
						<view>
							<uni-data-checkbox   @change="change" :multiple="multiple" mode="list" icon="right" v-model="value" :localdata="dataList"></uni-data-checkbox>
						</view>
						<view class="box-bottom" slot="bottom" >
							<view @click="showSelectedDrawer('draw1')" class="text"><text style="color: #007AFF;">{{multiple ? value.length>0?'已选择:'+value.length+'个项目':'已选择:': typeof value == 'number'?'已选择:1个项目':'已选择:'}}</text></view>
							<view class="text"><button @click="confirm('draw')" class="mini-btn" type="primary" size="mini">{{multiple ? value.length>0?'确认('+value.length+')':'确认': typeof value == 'number'?'确认(1)':'确认'}}</button></view>
						</view>
					</z-paging>
				</view>
			</uni-drawer>
		</view>
		<view>
			<uni-drawer  ref="draw1" mode="right" mask :width="drawerWidth" @change="drawchange($event,'showdraw1')" >
				<view >
					<view class="box-bottom" >
						<view class="text"><text >{{multiple ? value.length>0?'已选择数量:'+value.length:'已选择数量:0' : typeof value == 'number'?'已选择数量:1':'已选择数量:0'}}</text></view>
						<view class="text"><button @click="confirmBack('draw1')" class="mini-btn" type="default" size="mini">确认</button></view>
					</view>
					<view>
						<scroll-view :scroll-top="scrollTop" :style="{'height': scrollHeight+'rpx'}" scroll-y="true" >
							<view>
								<uni-list >
									<uni-list-item v-for="(item,index) in selectedDatas">
										<text slot="body" class="slot-box slot-text">{{item.text}}</text>
										<template slot="footer">
											<uni-icons @click="delData(item.value)" color="#cccccc" type="close" size="22"/>
										</template>
									</uni-list-item>
								</uni-list>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-drawer>
		</view>
	</view>
</template>

<script>
	export default {
		name:"project-picker",
		//父传值给子
		props:{
			inputValue:{type:Array,default:[]},
			multiple:{type:Boolean,default:true},
			appKey:{type:String,default:"" ,required:false}
		},
		data() {
			return {
				//抽屉 是否打开
				showdraw:false,
				//抽屉1 是否打开
				showdraw1:false,
				//人员搜索条件
				searchValue:'',
				//可滑动区域起始位置
				scrollTop: 0,
				//可滑动区域高度
				scrollHeight:'',
				//抽屉弹窗宽度
				drawerWidth:'',
				//当前页已选中数据
				value: [],
				//发起网络请求已选中数据
				selectedsAll:[],
				//当前页未选中数据
				unselecteds:[],
				//当前页全部数据
				dataList:[],
				//所有选中数据集合
				selectedDatas:[],
				 //输入框展示的值
				selectedResults:'',
				
			}
		},
		watch:{
			inputValue(data){
				if (!(Array.isArray(data))) {
					console.log("the props datas type must be array")
					return
				}
				//console.log("watchs:"+ JSON.stringify(data)) 
				if(this.multiple){
					let eList = data;
					if(Array.isArray(eList) && eList.length > 0){
						let v = new Array();
						eList.forEach((project)=>{
							v.push(project.value)
						})
						this.value = v;
						this.selectedDatas = eList;
						this.selectedResults = this.getSelectedResults(this.selectedDatas);
					}
				}else{
					let eList = data;
					if(Array.isArray(eList) && eList.length > 0){
						this.value = eList[0].value;
						this.selectedDatas = eList;
						this.selectedResults = eList[0].text;
					}
				}
			}
		},
		created() {
			// if(this.multiple){
			// 	console.log("组件数据"+this.inputValue)
			// 	let eList = this.inputValue;
			// 	if(Array.isArray(eList) && eList.length > 0){
			// 		let v = new Array();
			// 		eList.forEach((user)=>{
			// 			v.push(user.value)
			// 		})
			// 		this.value = v;
			// 		this.selectedDatas = eList;
			// 		this.selectedResults = this.getSelectedResults(this.selectedDatas);
			// 	}
			// }else{
			// 	console.log("组件数据"+this.inputValue)
			// 	let eList = this.inputValue;
			// 	if(Array.isArray(eList) && eList.length > 0){
			// 		this.value = eList[0].value;
			// 		this.selectedDatas.push(eList[0]);
			// 		this.selectedResults = eList[0].text;
			// 	}
			// }
			this.scrollH();
		},
		
		methods: {
			//子传值给父
			backSelectedDatas(){
				this.$emit("getResults",this.selectedDatas);
			},
			//计算手机窗口的高度
			focus(e){
				this.$refs[e].open()
				//手动关闭软键盘
				uni.hideKeyboard();
			},
			scrollH(){
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750/winWidth;
				let winHeight =parseInt(sys.windowHeight*winrate)
				this.drawerWidth = winWidth;
				this.scrollHeight = winHeight
			},
			getSelectedResults(list){
				let resultString = '';
				for (let i = 0; i < list.length; i++) {
						if(i === (list.length -1)){
							resultString += list[i].text;
						}else{
							resultString += list[i].text+',';
						}
				        
				}
				return resultString;
			},
			confirm(e){
				this.selectedResults = this.getSelectedResults(this.selectedDatas);
				this.backSelectedDatas();
				this.$refs[e].close()
			},
			confirmBack(e){
				this.$refs[e].close()
			},
			delData(id){
				console.log("delData:"+ id)
				if(this.multiple){
					this.selectedDatas.forEach((item,index)=>{
						if(id === item.value){
							this.selectedDatas.splice(index,1)
						}
					});
					this.value.forEach((item,index) =>{
						if(id === item){
							this.value.splice(index,1)
						}
					})
				}else{
					this.selectedDatas.forEach((item,index)=>{
						if(id === item.value){
							this.selectedDatas.splice(index,1)
						}
					});
					this.value = '';
				}
				
			},
			change(e){
				//多选
				if(this.multiple){
					this.theMultiple(e)
				//单选	
				}else{
					this.theRadio(e)
				}
				
			},
			theRadio(e){
				var employes =  e.detail.data;
				this.selectedDatas = [];
				this.selectedDatas.push(employes);
			
			},
			theMultiple(e){
				// 1.获取当前人员列表已选中数据
				this.selectedDatas = e.detail.data;
				// 2.获取当前人员列表未选中数据
				if(this.dataList.length > 0){
					if(this.value.length>0){
						this.dataList.forEach((project) => {
							this.unselecteds.push(project.value);
						});
						this.value.forEach((id) => {
							this.unselecteds.forEach((project,index) =>{
								if(project === id){
									this.unselecteds.splice(index,1)
								}
							})
						})
						 this.unselecteds = Array.from(new Set(this.unselecteds));
					}else{
						//如果当前没有选中，则未选中数据为当前页所有数据
						this.dataList.forEach((project) => {
							this.unselecteds.push(project.value);
						})
						this.unselecteds = Array.from(new Set(this.unselecteds));
					}
				}
				// 3.获取发起网络请求时保存已选中数据,并和当前页面未选中数据对比，如有相同则删除
				this.selectedsAll = uni.getStorageSync("selectedProjectAll")
				if(this.selectedsAll.length > 0){
					this.unselecteds.forEach((project) =>{
						this.selectedsAll.forEach((item,index) =>{
							if(project === item){
								this.selectedsAll.splice(index,1)
							}
						})
					})
				}
				var datas = uni.getStorageSync("selectedProjectDatas")
				if(datas.length > 0){
					this.unselecteds.forEach((project) =>{
						datas.forEach((item,index) =>{
							if(project === item.value){
								datas.splice(index,1)
							}
						})
					})
				}
				// 4. 当前已选中数据和已保存选中数据合并去重
				this.selectedDatas = this.unique(this.selectedDatas.concat(datas));
				this.value = Array.from(new Set(this.value.concat(this.selectedsAll)));
			},
			//根据集合中对象value值去重复
			unique(arr) {
				const res = new Map();
				return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1));
			},
			showSelectedDrawer(e) {
				if(this.multiple){
					if(this.value.length>0){
						this.$refs[e].open()
					}
				}else{
					if(typeof this.value == 'number'){
						this.$refs[e].open()
					}
				}
				
			},
			OnSearch(value) {
				this.searchValue = value.value;
				this.$refs.paging.reload();
			},
			onInputSearch(value) {
				this.searchValue = value;
				this.$refs.paging.reload();
			},
			async queryPageList(pageNo, pageSize) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNumber: pageNo,
					pageSize: pageSize,
					userAccount: userInfo.userAccount,
					search: _this.searchValue ,
					appKey:_this.appKey
				};
				let res = await _this.$myRequest.pmccRequest({
					url: `/app.sys/projectInfoPageList`,
					method: 'POST',
					data: data
				});
				if (res.data.ret) {
					console.log("网络请求已选择："+this.value);
					if(this.multiple){
						uni.setStorageSync("selectedProjectAll",this.value);
						uni.setStorageSync("selectedProjectDatas",this.selectedDatas);
					}
					this.$refs.paging.complete(res.data.data);
				} else {
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					}); 
				}
			
			},
			// 抽屉状态发生变化触发
			drawchange(e, type) {
				this[type] = e
				let drawType = {showdraw: this.showdraw,showdraw1:this.showdraw1 }
				this.$emit("getdrawType",drawType);
			},
			//关闭抽屉
			closedraw(dramName){
				this.$refs[dramName].close();
				//手动关闭软键盘
				uni.hideKeyboard();
			}
			
		}
	}

</script>

<style lang="scss">
.mini-btn {
	    margin-right: 10rpx;
	}
	.segment {
		background-color: white;
		height: 80rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		font-size: 30rpx;
		color: darkgray;
		border-bottom: #eeeeee solid 1px;
		z-index: 1000;
	}
	.view {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
}
	.header-cont{
		width: 100%;
			height: 110rpx;
			line-height: 100rpx;
			text-align: center;
			/* background: red; */
	}
	.list-cont{
		flex: 1;
			position: relative;
	}
	.box-bottom {
		display: flex;
		flex-direction: row;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		
	}
	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		/* background-color: #ebebeb; */
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}
	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}
</style>
