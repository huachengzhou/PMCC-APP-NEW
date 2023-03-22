<template>
	<view>
		
		<view></view>
		<view v-if="app.length > 0">
				<view v-for="(item,index) in app" :keys="index">
					<grid :title="item.title" :col="item.col">
						<grid-item  v-for="(o,i) in item.apps"  
							:order="o.order"  
							:badge="o.badge" 
							:dot="o.dot" 
							:url="o.url" 
							:iconImg="o.iconImg"  
							:iconFont="o.iconFont" 
							:text="o.text"
							:style="{'color':o.color}"
							:type="o.type"
							:customObj="o"
						>
						</grid-item>
					</grid>
				</view>
		</view>
		<view v-else >
			<!-- <text class="no-data">没有搜索到相关内容</text> -->
			<view style="margin-top: 80px;"></view>
			<view class="no-date-img">
				<image class="icon iconfont icon-wenjiansousuo" style="font-size:100px;text-align: center; color: #a8a8a8;"/>
			</view>
			<view style="text-align: center;">
				<text style="font-size: 14px; color: #a8a8a8;">没有搜索到相关内容</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import grid from '@/components/oveui-grid/grid/grid.vue';
	import gridItem from '@/components/oveui-grid/grid-item/grid-item.vue';
	export default {
		data() {
			return {
				app:[]
			}
		},
		components:{
			"grid":grid,
			"grid-item":gridItem
		},
		onShow() {
			this.findUserMenus();
		},
		methods: {
			   async findUserMenus(){
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					let data = {
						userAccount : userInfo.userAccount
					};
					let res = await _this.$myRequest.pmccRequest({
						url:`/app.workbench/appMenus?userAccount=`+ userInfo.userAccount,
						method:'GET',
						data:data
					});
					if(res.data.ret){
						_this.app = res.data.data;	
					}else{
						uni.showToast({
							title: res.data.errmsg,
							mask: true,
							duration: 1000
						});
					}
			}
		}
	}
</script>

<style>
.no-data {
	text-align: center;
	color: #999;
	height: 10rpx;
	line-height: 150px;
	
}
.no-date-img{
	text-align: center;
	height: 140px;
	line-height: 140px; 
}
</style>
