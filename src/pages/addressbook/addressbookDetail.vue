<template>
	<view>
		<view class="uni-flex">
			<view class=" uni-flex" style="-webkit-flex: 1;flex: 1;height: 100rpx;-webkit-align-items: flex-start;align-items: flex-start;">
			</view>
			<view  class="icon">
				{{name.slice(1,3)}}
			</view>
			<view class=" uni-flex" style="-webkit-flex: 1;flex: 1;height: 100rpx;-webkit-align-items: flex-end;align-items: flex-end;">
			</view>
		</view>
		<view>
			<view style="text-align:center;margin-top: 15rpx;">
				<text style="font-size: 40rpx;">{{user.employeeName}}</text>
			</view>
		</view>
		<view>
			<uni-section title="员工信息" type="line"></uni-section>
			<uni-list>
				<uni-list-item :show-extra-icon="true" showArrow :extra-icon="{size: '22',type: 'contact-filled'}" :title="'公司：'+user.companyName" />
				<uni-list-item :show-extra-icon="true" showArrow :extra-icon="{size: '22',type: 'contact'}" :title="'部门：'+user.departmentName" />
				<uni-list-item :show-extra-icon="true" clickable  @click="call(user.mobile)" showArrow :extra-icon="{size: '22',type: 'phone-filled'}" :title="'电话：'+user.mobile" />
			</uni-list>
		</view>
		<!-- <view class="uni-flex uni-row" style="margin-top: 20rpx;" >
			<view style="width: 150rpx; text-align: right; margin-right: 20rpx;"><text  style="font-size: 16px; font">公司: </text></view>
			<view style="-webkit-flex: 1;flex: 1;">{{user.companyName}}</view>	
		</view>
		<view class="uni-flex uni-row" style="margin-top: 20rpx;">
			<view style="width: 150rpx; text-align: right;  margin-right: 20rpx;"><text style="font-size: 16px;">部门:</text></view>
			<view style="-webkit-flex: 1;flex: 1;"><text>{{user.departmentName}}</text></view>	
		</view>
		<view class="uni-flex uni-row" style="margin-top: 40rpx;">
			<view style="width: 150rpx; text-align: right;  margin-right: 20rpx;"><text style="font-size: 16px;">电话:</text></view>
			<view style="-webkit-flex: 1;flex: 1;"><text>{{user.mobile}}</text></view>	
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				user:{},
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'gear-filled'
				}
			}
		},
		onLoad(option) {
			var data = JSON.parse(option.data)
			var userAccount = data.userAccount;
			this.name = data.employeeName;
			this.findUserInfo(userAccount);
			uni.setNavigationBarTitle({
			    title: data.employeeName
			}); 
			
		},
		onShow() {
			
		},
		onReady() {
			
		}
		,
		methods: {
			async findUserInfo(userAccount){
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let res = await _this.$myRequest.pmccRequest({
					url:`/app.addressbook/user?userAccount=`+userAccount,
					data:{userAccount:userAccount},
					method:'POST'
				})
				if(res.data.ret){
					this.user = res.data.data;	
				}else{
					uni.showToast({
						title: res.data.errmsg,
						mask: true,
						duration: 1000
					});
				}
			},
			call(mobile){
				console.log(mobile);
				uni.makePhoneCall({
				    phoneNumber: mobile 
				});
			}
		
		}
	}
</script>

<style lang="scss">
.icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		font-size: 30rpx;
		color: #fff;
		background:#00aaff;
		
	}
	.flex-item {
		width: 33.3%;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
	}
	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		border-radius: 50%;
		background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}
</style>
