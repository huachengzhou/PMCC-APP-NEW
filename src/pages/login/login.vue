<!-- 蓝色登录页面2 -->
<template>
	<view>
		<view class="img-a">
			<view class="t-b">
				欢迎使用
				<br />
				协合智能办公平台
			</view>
		</view>
		<!-- <image class="img-b" src="@/static/icon.png" style="opacity: 0.1;"></image> -->
		<view class="login-view" style="">
			<view class="t-login">
				<form class="cl">
					<view class="t-a">
						<text class="txt">用户名</text>
						<input  v-model="userAccount"  placeholder="请输入分配的账号名称"  />
					</view>
					<view class="t-a">
						<text class="txt">密 码</text>
						<input type="password" :type="pwdType" :value="password" @input="inputPwd"  placeholder="请输入您的密码"  />
					</view>
					<button @tap="bindLogin">登 录</button>
				</form>
				<view class="t-f"><text>四川四维魔方科技有限公司</text></view>
			</view>
		</view>
	</view>
</template>
<script>
	import MD5 from '../../common/md5.min.js';
	
	import {
		mapMutations  
	} from 'vuex'; 
	
	export default {
		data() {
			return {
				userAccount: '',
				password: '',
				pwdType: 'password',
				imgInfo: {
					head:  '/static/head.png',
					icon_user: '/static/icon_user.png',
					icon_del: '/static/icon_del1.png' ,
					icon_pwd: '/static/icon_pwd.png',
					icon_pwd_switch: '/static/icon_pwd_switch.png' 
				}
			}
		},
		onLoad: function() {
			this.logout();
		},
		methods: {
			inputUsername(e) {
				this.userAccount = e.target.value;
			},
			inputPwd(e) {
				this.password = e.target.value;
			},
			delUser() {
				this.userAccount = '';
			},
			switchPwd() {
				this.pwdType = this.pwdType === 'text' ? 'password' : 'text'
			},
			async bindLogin() {
				var _this = this;
				/* console.log(_this); */
				if(!_this.userAccount) {
					uni.showModal({
						content: '请输入用户账号',
						showCancel: false
					});
					return;
				}
				if(!_this.password){
					uni.showModal({
						content: '请输入密码',
						showCancel: false
					});
					return;
				}
				let deviceCode = uni.getStorageSync('deviceCode'); 
				console.log('deviceCode'+deviceCode)
				const res = await _this.$myRequest.pmccRequest({
					url: `/app.auth/login`,
					method: 'POST',
					data: {
						userAccount: _this.userAccount,
						password: MD5(_this.password),
						deviceCode:deviceCode
					},
					login:true,
					showLoading:true
				})
				if(res.data.ret) {
					var user = res.data.data;
					_this.login(user);
					uni.showToast({
						title: '登录成功',
						success() {
							uni.switchTab({
								url:'../schedule/schedule'
							});
						}
					});
				} else {
					uni.showModal({
						title: '登录提示',
						content: res.data.errmsg,
						showCancel: false,
						success: function(_rs) {
							_this.password = '';
						}
					});
				}
			},
			...mapMutations(['login', 'logout'])
		}
	}
</script>
<style>
.txt {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}
.img-a {
	width: 100%;
	height: 550rpx;
	background-image: url(@/static/head.png);
	background-size: 100%;
}
.img-b {
	position: absolute;
	width: 50%;
	bottom: 0;
	left: -5rpx;
	margin-bottom: -80rpx;
}

.login-view {
	width: 100%;
	position: relative;
	margin-top: -120rpx;
	background-color: #ffffff;
	border-radius: 8% 8% 0% 0;
}

.t-login {
	width: 600rpx;
	margin: 0 auto;
	font-size: 28rpx;
	padding-top: 80rpx;
}

.t-login button {
	font-size: 28rpx;
	background: #2796f2;
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50rpx;
	font-weight: bold;
}

.t-login input {
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 50rpx;
	border-bottom: 1px solid #e9e9e9;
	font-size: 28rpx;
}

.t-login .t-a {
	position: relative;
}

.t-b {
	text-align: left;
	font-size: 42rpx;
	color: #ffffff;
	padding: 130rpx 0 0 70rpx;
	font-weight: bold;
	line-height: 70rpx;
}
.t-login .t-f {
	text-align: center;
	margin: 150rpx 0 0 0;
	color: #666;
}

.t-login .uni-input-placeholder {
	color: #aeaeae;
}

.cl {
	zoom: 1;
}

.cl:after {
	clear: both;
	display: block;
	visibility: hidden;
	height: 0;
	content: '\20';
}
</style>
