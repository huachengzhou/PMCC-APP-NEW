<template>
	<view :class="['grid-item','col-'+Col, Order, Border]" :hover-class="hoverClass" :hover-start-time="200"
		@click="onCustomClick" :data-type="type" :data-url="url">
		<view class="sub">
			<view v-if="dot && badge==false" class="dot"></view>
			<view v-if="badge" class="badge">{{badge}}</view>

			<view :class="[iconFont!=''?'o-icon-'+iconFont:iconImg!=''?'o-img':'', iconSize]">
				<image v-if="iconImg!='' && iconFont==''" :src="iconImg" mode="aspectFit"></image>
			</view>
			<view class="o-text">{{text}}</view>
		</view>
	</view>
</template>

<script>
	
	import * as commonKey from "@/common/commonKey.js";
	
	
	
	export default {
		name: 'grid-item',
		props: {
			text: {
				type: String,
				default: ''
			}, //文字内容
			iconFont: {
				type: String,
				default: ''
			}, //字体图标 优先于图片图标
			iconImg: {
				type: String,
				default: ''
			}, //图片图标
			type: {
				type: String,
				default: ''
			}, //点击事件类型 tabbar、back、modal、toast
			url: {
				type: String,
				default: ''
			}, //链接地址
			hoverClass: {
				type: String,
				default: ''
			}, //按下时的样式类
			order: {
				type: [Number, String],
				default: ''
			}, //宫格排序,不支持小程序
			dot: {
				type: Boolean,
				default: false
			}, //右上角红点
			badge: {
				type: [Number, String],
				default: ''
			}, //图标右上角徽标的内容
			customObj: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		inject: ['col', 'border', 'iconsize'],

		methods: {
			onCustomClick(e) {
				let data = this.customObj;
				let url = data.url;
				let type = data.type;
				var callName = commonKey.keys.emitWorkBenchKey;
				try {
					uni.setStorageSync(commonKey.keys.cacheMenuKey, data);
					uni.setStorageSync(this.$commonKeys.keys.cacheAppKey, data.appKey);
				} catch (e) {
					// error
				}
				switch (type) {
					case 'tabbar': { //跳转到tabbar页
						uni.switchTab({
							url: url,
							success: function(res) {
								res.eventChannel.emit(callName, data);
							}
						});
						break;
					}
					case 'back': { //返回上一页，注意仅对左上角有原生返回键的页面起作用
						uni.navigateBack({
							delta: 1,
							success: function(res) {
								res.eventChannel.emit(callName, data);
							}
						});
						break;
					}
					case 'modal': { //弹出对话框
						uni.showModal({
							title: url,
							content: 'test'
						});
						break;
					}
					case 'toast': { //弹出提示框
						uni.showToast({
							icon: 'none',
							title: url
						})
						break;
					}
					default: { //跳转到非tabbar页
						if (!url) {
							uni.showToast({
								title: '暂未开放',
								icon: 'none',
								mask: true
							})
						} else {
							uni.navigateTo({
								url: url,
								success: function(res) {
									res.eventChannel.emit(callName, data);
								}
							})
						}
					}
				}
			},
			onClick(e) {
				let url = e.currentTarget.dataset.url;
				let type = e.currentTarget.dataset.type;
				//不知道为什么HBuilder 升级以后手机app上已经接收不到dataset的参数了因此对此方法重构
				/*
				"currentTarget": {
					"id": "",
					"dataset": {},
					"offsetLeft": 0,
					"offsetTop": 242
				},
				*/
				switch (type) {
					case 'tabbar': { //跳转到tabbar页
						uni.switchTab({
							url: url
						});
						break;
					}
					case 'back': { //返回上一页，注意仅对左上角有原生返回键的页面起作用
						uni.navigateBack({
							delta: 1
						});
						break;
					}
					case 'modal': { //弹出对话框
						uni.showModal({
							title: url,
							content: 'test'
						});
						break;
					}
					case 'toast': { //弹出提示框
						uni.showToast({
							icon: 'none',
							title: url
						})
						break;
					}
					default: { //跳转到非tabbar页
						if (!url) {
							uni.showToast({
								title: '暂未开放',
								icon: 'none',
								mask: true
							})
						} else {
							uni.navigateTo({
								url: url
							})
						}
					}
				}
				// this.$emit('Click');
			}
		},
		computed: {
			Col() {
				if (this.col < 2 && this.col != '') return 2;
				else if (this.col > 5) return 5;
				else if (this.col == '') return 3;
				else return this.col;
			},
			Border() {
				if (this.border == 'false' || this.border == 0) return 'noborder';
				else return '';
			},
			Order() { // 排序
				if (this.order < 0) return 'order--1';
				else if (this.order > -1 && this.order != '') return 'order-' + this.order;
				else return '';
			},
			iconSize() {
				if (this.iconsize == 'sm' || this.iconsize == 'lg') return this.iconsize;
				else return 'md';
			}
		}
	}
</script>

<style lang="scss">
	@for $i from -1 through 25 {
		.order-#{$i} {
			order:#{$i}
		}
	}

	.grid-item {
		box-sizing: border-box;
		background-color: #fff;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: row;
		/* #endif */
		align-items: center;
		justify-content: center;
		position: relative;
		flex-direction: column;
		/* #ifdef MP */
		position: relative;
		float: left;

		/* #endif */
		.sub {
			[class*="o-i"] {
				margin: 0 auto;
				text-align: center;
				overflow: hidden;
				display: flex;
				align-items: center;

				&::before,
				image {
					display: block;
					width: 100%;
					height: 100%;
				}

				image {
					margin: auto;
				}
			}

			.o-text {
				overflow: hidden;
				-webkit-line-clamp: 1;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				text-align: center;
				color: #878787;
			}

			.dot,
			.badge {
				background-color: #e00;
				border-radius: 50px;
				position: absolute;
				z-index: 10;
				text-align: center;
				left: 50%;
				bottom: 50%;
				box-sizing: border-box;
			}

			.dot {
				width: 8px;
				height: 8px;
			}

			.badge {
				color: #fff;
				line-height: 24rpx;
				font-size: 18rpx;
				padding: 0 8rpx;
				height: 25rpx;
				min-width: 30rpx;
				max-width: 52rpx;
			}
		}

		&::before,
		&::after {
			right: 0;
			bottom: 0;
			content: '';
			background-color: #f8f8f8;
			position: absolute;
		}

		&::before {
			width: 2rpx;
			top: 0;
		}

		&::after {
			height: 2rpx;
			left: 0;
		}
	}

	@for $x from 2 through 5 {
		@if $x<5 {
			.square .grid-item.col-#{$x} {
				min-height:calc(750rpx / #{$x})
			}
		}

		.grid-item.col-#{$x} {
			/* #ifdef MP */
			float: left;
			width:calc(100% / #{$x});
			/* #endif */
			/* #ifdef APP-PLUS || H5 */
			flex:0 0 calc(100% / #{$x});
			max-width:calc(100% / #{$x});
			/* #endif */
			padding:0 calc(8rpx * (6 - #{$x}));

			@if $x<5 {
				min-height:calc(750rpx / #{$x} - ((5 - #{$x}) * (4 - #{$x}) * 18rpx) - 30rpx);

				.o-text {
					font-size:calc(24rpx + 4rpx * (4 - #{$x}));
				}
			}

			@else {
				min-height:calc(750rpx / #{$x});

				.o-text {
					font-size: 22rpx;
					line-height: 26rpx;
				}
			}

			.sub {
				.dot {
					margin-bottom:calc(40rpx + 12rpx * (5 - #{$x}));
					margin-left: calc(24rpx + 6rpx * (5 - #{$x}));
				}

				.badge {
					margin-bottom:calc(40rpx + 10rpx * (5 - #{$x}));
					margin-left: calc(16rpx + 8rpx * (5 - #{$x}));
				}

				.o-text {
					line-height:calc(32rpx + 2rpx * (5 - #{$x}));
				}

				[class*="o-i"] {
					margin-bottom:calc(28rpx - 6rpx * #{$x});

					&::before {
						font-family: 'o-icon';
						font-weight: normal;
					}
				}

				[class*="o-i"].sm {
					width:calc((9 - #{$x}) * 14rpx);
					height:calc((9 - #{$x}) * 14rpx);

					&::before {
						line-height:calc((9 - #{$x}) * 14rpx) !important;

						@if $x>3 {
							font-size:calc((9 - #{$x}) * 14rpx - 4rpx)
						}

						@else {
							font-size:calc((9 - #{$x}) * 14rpx - 8rpx)
						}
					}
				}

				[class*="o-i"].md {
					width:calc((9 - #{$x}) * 16rpx);
					height:calc((9 - #{$x}) * 16rpx);

					&::before {
						line-height:calc((9 - #{$x}) * 16rpx) !important;

						@if $x>3 {
							font-size:calc((9 - #{$x}) * 16rpx - 4rpx)
						}

						@else {
							font-size:calc((9 - #{$x}) * 16rpx - 8rpx)
						}
					}
				}

				[class*="o-i"].lg {
					width:calc((9 - #{$x}) * 18rpx);
					height:calc((9 - #{$x}) * 18rpx);

					&::before {
						line-height:calc((9 - #{$x}) * 18rpx) !important;

						@if $x>3 {
							font-size:calc((9 - #{$x}) * 18rpx - 4rpx)
						}

						@else {
							font-size:calc((9 - #{$x}) * 18rpx - 8rpx)
						}
					}
				}
			}
		}
	}

	.noborder {

		&::before,
		&::after {
			content: none !important;
		}
	}

	@font-face {
		font-weight: 400;
		font-style: normal;
		font-display: auto;
		font-family: 'o-icon';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');

	}

	[class*="o-icon-"] {
		position: relative;
		display: block;
		font: normal 18px/1 "o-icon";
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;

		&::before {
			display: block;
		}
	}


	/* .o-icon::before{display:inline-block;} */
	.o-icon-bangongyongpinwenju:before {
		content: "\e62a";
	}

	.o-icon-fenxiqushi:before {
		content: "\e62b";
	}

	.o-icon-baoxiaozichan:before {
		content: "\e62c";
	}

	.o-icon-gongwen:before {
		content: "\e62d";
	}

	.o-icon-gengxinbiangeng:before {
		content: "\e62e";
	}

	.o-icon-fenxianggongxiang:before {
		content: "\e62f";
	}

	.o-icon-guoji:before {
		content: "\e630";
	}

	.o-icon-gongzhanggaizhang:before {
		content: "\e631";
	}

	.o-icon-jifenxiaofei:before {
		content: "\e632";
	}

	.o-icon-hetong:before {
		content: "\e633";
	}

	.o-icon-jigouyinhang:before {
		content: "\e634";
	}

	.o-icon-huiyi:before {
		content: "\e635";
	}

	.o-icon-guizhangzhidu:before {
		content: "\e636";
	}

	.o-icon-gongyingshangjianlirenyuan:before {
		content: "\e637";
	}

	.o-icon-liebiaoqingdan:before {
		content: "\e638";
	}

	.o-icon-lishiqingjia:before {
		content: "\e639";
	}

	.o-icon-jiagouliucheng:before {
		content: "\e63a";
	}

	.o-icon-pingshenqueren:before {
		content: "\e63b";
	}

	.o-icon-qiandaodaka:before {
		content: "\e63c";
	}

	.o-icon-shiyanshi:before {
		content: "\e63d";
	}

	.o-icon-jiaofu:before {
		content: "\e63e";
	}

	.o-icon-rilirichengjihua:before {
		content: "\e63f";
	}

	.o-icon-shenqinghuibaobaobei:before {
		content: "\e640";
	}

	.o-icon-shenpishenhe:before {
		content: "\e641";
	}

	.o-icon-morenyingyongtubiao:before {
		content: "\e642";
	}

	.o-icon-toubiaogongzheng:before {
		content: "\e643";
	}

	.o-icon-tongjifenxi:before {
		content: "\e644";
	}

	.o-icon-tousujianyi:before {
		content: "\e645";
	}

	.o-icon-tongzhigonggao:before {
		content: "\e646";
	}

	.o-icon-shourushoukuan:before {
		content: "\e647";
	}

	.o-icon-wenjianziliao:before {
		content: "\e648";
	}

	.o-icon-tushuzhishiku:before {
		content: "\e649";
	}

	.o-icon-yusuanjisuan:before {
		content: "\e64a";
	}

	.o-icon-zichancaichan:before {
		content: "\e64b";
	}

	.o-icon-jiaban:before {
		content: "\e64c";
	}

	.o-icon-liebiaoqingdan1:before {
		content: "\e64d";
	}

	.o-icon-wendangwenjian:before {
		content: "\e64e";
	}

	.o-icon-baomishemi:before {
		content: "\e64f";
	}

	.o-icon-daoyin:before {
		content: "\e6ab";
	}

	.o-icon-zhantingzhanlan:before {
		content: "\e6be";
	}
</style>
