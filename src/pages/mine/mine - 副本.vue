<template>
	<view>
		<view class="header" v-bind:class="{'status':isH5Plus}">
			<view class="userinfo">
				<view class="face">
					<image src="../../static/head.png"></image>
				</view>
				<view class="info">
					<view class="username" v-if="!hasLogin">请登录...</view>
					<view class="username" v-else>{{userInfo.userName}}</view>
					<view class="integral">{{userinfo.mobile}}</view>
					
					<!-- <view class="username" >{{userInfo.userName}}</view>
					<view class="integral">{{userinfo.mobile}}</view> -->
				</view>
			</view>
		</view>

		<view class="list" v-if="hasLogin">
			<view class="li" hover-class="hover" @tap="openMessagePage()">
				<view class="icon">
					<image src="../../static/mine-center/l4.png"></image>
				</view>
				<view class="text">我的消息</view>
				<image class="to" src="../../static/mine-center/to.png"></image>
			</view>
			<view class="li" hover-class="hover" @tap="openModifyPasswordPage()">
				<view class="icon">
					<image src="../../static/unlock-password.png"></image>
				</view>
				<view class="text">修改密码</view>
				<image class="to" src="../../static/mine-center/to.png"></image>
			</view>
		</view>

		<button type="primary" class="login-btn" @click="bindLogin">{{hasLogin ? '退出登录' : '登录'}}</button>

	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				//#ifdef APP-PLUS
				isH5Plus: true,
				//#endif
				//#ifndef APP-PLUS
				isH5Plus: false,
				//#endif
				userinfo: {}
			}
		},
		computed: mapState(['hasLogin', 'userInfo']),
		onLoad() {},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				if (this.hasLogin) {
					this.logout()
				} else {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			},
			openModifyPasswordPage() {
				uni.navigateTo({
					url: './password/password'
				})
			},
			openMessagePage(){
				uni.navigateTo({
					url:'/pages/mine/message/message'
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.login-btn {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		color: white;
		background-color: rgba(0, 122, 255, 1.0);
		-webkit-tap-highlight-color: rgba(252, 44, 93, 1.0);

		&:active {
			color: #B6B6B6;
			background-color: rgba(252, 44, 93, 0.8);
		}
	}


	page {
		background-color: #fff
	}

	.header {
		&.status {
			padding-top: 1px;
		}

		background-color:#007AFF;
		width:92%;
		height:25vw;
		padding:0 4%;
		display:flex;
		align-items:center;

		.userinfo {
			width: 90%;
			display: flex;

			.face {
				flex-shrink: 0;
				width: 15vw;
				height: 15vw;

				image {
					width: 100%;
					height: 100%;
					border-radius: 100%
				}
			}

			.info {
				display: flex;
				flex-flow: wrap;
				padding-left: 30upx;

				.username {
					width: 100%;
					color: #fff;
					font-size: 40upx
				}

				.integral {
					display: flex;
					align-items: center;
					padding: 0 20upx;
					height: 40upx;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
					font-size: 24upx
				}
			}
		}

		.setting {
			flex-shrink: 0;
			width: 6vw;
			height: 6vw;

			image {
				width: 100%;
				height: 100%
			}
		}
	}

	.hover {
		background-color: #eee
	}

	.orders {
		background-color: #007AFF;
		width: 92%;
		height: 11vw;
		padding: 0 4%;
		margin-bottom: calc(11vw + 40upx);
		display: flex;
		align-items: flex-start;
		border-radius: 0 0 100% 100%;
		margin-top: -1upx;

		.box {
			width: 98%;
			padding: 0 1%;
			height: 22vw;
			background-color: #fefefe;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			margin-bottom: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.label {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-flow: wrap;
				width: 100%;
				height: 16vw;
				color: #666666;
				font-size: 26upx;

				.icon {
					position: relative;
					width: 7vw;
					height: 7vw;
					margin: 0 1vw;

					.badge {
						position: absolute;
						width: 4vw;
						height: 4vw;
						background-color: #ec6d2c;
						top: -1vw;
						right: -1vw;
						border-radius: 100%;
						font-size: 20upx;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 10;
					}

					image {
						width: 7vw;
						height: 7vw;
						z-index: 9;
					}
				}
			}
		}
	}

	.list {
		width: 100%;
		border-bottom: solid 26upx #f1f1f1;

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: solid 1upx #e7e7e7;
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx
			}
		}
	}
</style>
