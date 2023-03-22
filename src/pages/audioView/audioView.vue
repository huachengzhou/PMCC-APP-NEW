<template>
	<view>
		<view class="imt-audio music">
			<view class="top">
				<view class="audio-control-wrapper">
					<view v-show="paused">
						<image src="./playbtn.png" alt="" @click="operationFun" class="play"></image>
					</view>
					<view v-show="!paused">
						<image src="./pausebtn.png" alt="" @click="operationFun" class="play"></image>
					</view>
				</view>
				<view>
				</view>
				<view v-show="paused">
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						{{ itemNameShowSubName(fileName) }}
					</view>
				</view>
				
				<view v-show="!paused" class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<image src="./music_gif.gif" alt="" style="height:300rpx;width:200rpx;" ></image>
				</view>
			</view>

			<view class="audio-wrapper">
				<!-- <button class="mini-btn" type="primary" size="mini" @click.stop="stopPlay();">结束播放</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";

	export default {
		data() {
			return {
				title: 'audio',
				audioUrl: '',
				showAudio: true,
				path: "",
				fileName: "",
				paused: false, //是否处于暂停状态
				innerAudioContext: ''
			}
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.endPlay();
			return false;
		},
		onLoad(option) {
			this.fileName = option.fileName;
			this.path = option.tempFilePath;
			let path = option.tempFilePath;
			let testPath =
				"https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3";
			const innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			// innerAudioContext.src =	testPath;
			innerAudioContext.src = path;
			innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
			innerAudioContext.onError((res) => {
				console.log(res.errMsg);
				console.log(res.errCode);
			});
			this.innerAudioContext = innerAudioContext;
			this.canvasDraw();
		},
		methods: {
			operationFun() {
				let innerAudioContext = this.innerAudioContext;
				//是否处于暂停状态
				let paused = this.paused;
				if (paused) {
					//暂停状态 将 播放器变更为播放
					innerAudioContext.play(); //执行播放  
					this.paused = false;
				} else {
					//播放状态 将 播放器变更为暂停
					innerAudioContext.pause(); //执行暂停 
					this.paused = true;
				}
			},
			stopPlay() {
				let innerAudioContext = this.innerAudioContext;
				innerAudioContext.stop(); //停止播放
				innerAudioContext.onStop((res) => {
					this.paused = true;
				});
			},
			endPlay(callbackFun){
				let innerAudioContext = this.innerAudioContext;
				innerAudioContext.stop(); //停止播放
				innerAudioContext.destroy(); //销毁播放
				innerAudioContext.onStop((res) => {
					if (callbackFun) {
						callbackFun();
					}
				});
			},
			itemNameShowSubName(item) {
				return utils.getItemShowName(item, 15);
			},
			canvasDraw() {

			}
		}
	}
</script>

<style scoped lang="scss">
	.imt-audio.music {
		padding: 0 30upx 30upx;
		background: #fff;

		.top {
			&>view:nth-child(2) {
				.title {
					font-weight: bold;
					font-size: 34rpx;
					margin-top: 24rpx;
					text-align: center;
				}

				.singer {
					color: #999;
					font-size: 26rpx;
					margin-top: 10rpx;
					text-align: center;
					margin-bottom: 18rpx;
				}
			}
		}

		.audio-wrapper {
			display: flex;
			align-items: center;
		}

		.audio-number {
			font-size: 24upx;
			line-height: 1;
			color: #333;
		}

		.audio-slider {
			flex: 1;
			margin: 0 30rpx 0 10rpx;
		}

		.audio-control-wrapper {
			margin: 100rpx auto;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

		}

		.cover {
			width: 280rpx;
			height: 280rpx;
			box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.13);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: 50%;
			border: 2px solid #fff
		}

		.cover.on {
			-webkit-animation: 10s rowup linear infinite normal;
			animation: 10s rowup linear infinite normal;
		}

		.play {
			width: 130rpx;
			height: 130rpx;
			z-index: 99;
			background: rgba(0, 0, 0, .4);
			border-radius: 50%
		}

		.prevbtn {
			width: 48rpx;
			height: 48rpx;
			margin-right: 40rpx;
		}

		.nextbtn {
			width: 48rpx;
			height: 48rpx;
			margin-left: 40rpx;
		}
	}

	.imt-audio.fm {
		background: #fff;
		border: 1px solid #cecece;
		width: 90%;
		margin: 0 auto;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		overflow: hidden;

		.top {
			background: #f5f5f5;
			display: flex;
			align-items: center;

			&>view:nth-child(2) {
				flex: 1;
				margin-left: 30rpx;

				.title {
					font-weight: bold;
					font-size: 34rpx;
					margin-top: 24rpx;
					text-align: left;
				}

				.singer {
					color: #999;
					font-size: 26rpx;
					margin-top: 10rpx;
					text-align: left;
					margin-bottom: 18rpx;
				}
			}
		}

		.audio-wrapper {
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
		}

		.audio-number {
			font-size: 24upx;
			line-height: 1;
			color: #333;
		}

		.audio-slider {
			flex: 1;
			margin: 0 30rpx 0 10rpx;
		}

		.audio-control-wrapper {
			margin: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			padding: 30rpx 20rpx;

		}

		.cover {
			width: 180rpx;
			height: 180rpx;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: 50%;
			border: 2px solid #fff
		}

		.cover.on {
			-webkit-animation: 10s rowup linear infinite normal;
			animation: 10s rowup linear infinite normal;
		}

		.play {
			width: 80rpx;
			height: 80rpx;
			z-index: 99;
			background: rgba(0, 0, 0, .4);
			border-radius: 50%
		}

		.prevbtn {
			width: 48rpx;
			height: 48rpx;
			margin-right: 40rpx;
		}

		.nextbtn {
			width: 48rpx;
			height: 48rpx;
			margin-left: 40rpx;
		}
	}

	@keyframes rowup {
		0% {
			-webkit-transform: translate(-50%, -50%) rotate(0deg);
			transform-origin: center center;
		}

		100% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			transform-origin: center center;
		}
	}
</style>
