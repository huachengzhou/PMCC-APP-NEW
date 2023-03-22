<template>
	<view>
		<txl @ev="toUserInfo" :datas="datas" :index="true" color="#00aaff" name="employeeName"></txl>
	</view>
</template>

<script>
	import txl from '@/components/yt-txl/index.vue';
	export default {
		components:{
			txl
		},
		data() {
			
			return {
				datas: []
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.initAddressbook();
		},
		methods: {
			toUserInfo(user){
				var data = JSON.stringify(user);
				uni.navigateTo({
					url:'./addressbookDetail?data='+data
				})
			}
			,
			async initAddressbook(){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let res = await _this.$myRequest.pmccRequest({
					url:`/app.addressbook/userList`,
					method:'POST'
				})
				if(res.data.ret){
					_this.datas = res.data.data;	
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
