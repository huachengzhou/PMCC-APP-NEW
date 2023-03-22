<template>
	<view>
		<z-paging ref="paging" fixed @query="queryPageList" v-model="dataList">
			<uni-list>
				<uni-list-item link :to="'quotationDetail?id='+item.id" v-for="(item,index) in dataList" :title="item.quoteName" :note="formatTime(item.quoteDate,'YYYY-MM-DD')" :rightText="'报价金额:'+item.bidAmount+'(元)'" />
			</uni-list>
			<view  slot="bottom" >
				<button @click="quotation()" >报价</button>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList:[]
			}
		},
	    onShow() {
			 this.$nextTick(()=>{
				this.$refs.paging.reload();
			})
			
		},
		methods: {
			quotation(){
				uni.navigateTo({
					url:'quotation'
				})
			},
			async queryPageList(pageNo,pageSize){
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					var data = {
						pageNumber:pageNo,
						pageSize:pageSize,
						userAccount:userInfo.userAccount
						
					};
					let res = await _this.$myRequest.pmccRequest({
						url:`/app.quotation/quotationPageList`,
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
			}
		}
	}
</script>

<style>

</style>
