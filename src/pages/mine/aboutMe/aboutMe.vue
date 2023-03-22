<template>
	<view>

		<view>
			
			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<uni-title type="h2" title="关于我们" align="center"></uni-title>
			</view>

			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<view>
					<image mode="aspectFit" class="image" src="@/static/icon.png"></image>
				</view>
			</view>

			<!-- <view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<uni-title type="h2" :title="title" align="center"></uni-title>
			</view> -->

			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<uni-title type="h4" :title="'版本 '+versionInfo.thisVersion" align="center"></uni-title>
			</view>

			<view style="margin-top:20px;">
				<uni-list>
					<!-- <uni-list-item :ellipsis="1" title="建议" showArrow clickable @click="suggestFun" /> -->
					<!-- <uni-list-item :ellipsis="1" title="功能介绍" showArrow clickable @click="functionReadMe" /> -->
					<!-- <uni-list-item :ellipsis="1" title="检查新版本" showArrow clickable @click="checkNewVersionFun" /> -->
					<uni-list-item :ellipsis="1" title="法律声明及隐私权政策" showArrow clickable @click="privacyPolicyMe()" />
				</uni-list>
			</view>

			<view style="margin-top:20px;">
				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<uni-title align="center" class="h5" type="h5" color="#666" title="技术支持：四川四维魔方科技有限公司"></uni-title>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				versionInfo: {
					maxVersion: '10.0.0',
					thisVersion: '无法获取当前版本',
					softVersion: ''
				},
				title: "协合智能办公平台",
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.initFun();
			});
		},
		onShow() {
			this.$nextTick(() => {
				this.initFun();
			});
		},
		methods: {
			checkNewVersionFun(){
				uni.showToast({
					title: '未开放',
					icon:"error"
				});
			},
			suggestFun(){
				uni.showToast({
					title: '未开放',
					icon:"error"
				});
			},
			functionReadMe(){
				uni.showToast({
					title: '未开放',
					icon:"error"
				});
			},
			privacyPolicyMe(){
				uni.navigateTo({
					url:"./privacyPolicyMe"
				});
			},
			initFun() {
				// #ifdef APP-PLUS
				this.versionInfo.softVersion = plus.runtime.version;
				plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
					this.versionInfo.thisVersion = wgtinfo.version ;
					this.title = wgtinfo.name;
				});
				// #endif 
				try {

				} catch (e) {
					//TODO handle the exception
				}
			}
		}
	}
</script>

<style>
	.iconImage {
		width: 50upx;
		height: 50upx;
	}
</style>
