<template>
	<view>
		<!-- #ifdef APP-PLUS  -->
		<!-- #endif -->
		<video id="myVideo" :src="videoUrl" @error="videoErrorCallback"></video>
		
		<!-- #ifdef H5  -->
		<view>不考虑h5</view>
		<!-- #endif -->
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				title: 'video',
				videoUrl: '',
				showVideo: true
			}
		},
		onLoad(option) {
			let that = this;
			// #ifndef MP-ALIPAY || MP-TOUTIAO
			// #endif
			this.videoContext = uni.createVideoContext('myVideo')
			
			
			
			
			//app平台上此代码生效
			// #ifdef APP-PLUS 
			// #endif 
			this.videoUrl = option.tempFilePath;
		},
		methods: {
			videoErrorCallback: function(e) {
				console.log(e);
				uni.showModal({
					content: '视频准备失败!',
					showCancel: false
				})
			},
		}
	}
</script>

<style>
	video {
		width: 690rpx;
		width: 100%;
		height: 400px;
	}
</style>
