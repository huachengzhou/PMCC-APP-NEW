<template>
	<view style="width: 100%;">
		<web-view :src="pdfUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				viewerUrl: '/static/pdf/web/viewer.html',
				fileUrl: `${this.$config.server.host}/app.public/pdfView`,
				pdfUrl: ''
			}
		},
		onLoad(option) {
			if (option._recordJson) {
				console.log("PDF"+option._recordJson)
				var record = JSON.parse(option._recordJson);
				var url = encodeURIComponent(`${this.fileUrl}?fileId=${record.fileId}`);
				
				/*
				// h5，使用h5访问的时候记得跨域
				// #ifdef H5
				this.pdfUrl = `${this.viewerUrl}?file=${url}`;
				// #endif
				
				// 在安卓和ios手机上
				// 判断是手机系统：安卓，使用pdf.js
				// #ifdef APP-PLUS
				if(plus.os.name === 'Android') {
					this.pdfUrl = `${this.viewerUrl}?file=${url}`;
				}
				// ios，直接访问pdf所在路径
				else {
					//this.pdfUrl = encodeURIComponent(`${this.fileUrl}?fileId=${record.fileId}`);
					this.pdfUrl = `${this.viewerUrl}?file=${url}`;
				}
				// #endif
				*/
				this.pdfUrl = `${this.viewerUrl}?file=${url}`;
				
			}
			
		},
		methods: {

		}
	}
</script>

<style>

</style>
