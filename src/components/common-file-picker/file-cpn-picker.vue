<template>
	<view>
		<l-file ref="lFile" @up-success="onISuccess"></l-file>
		<view class="uni-uploader-body">
			<view class="uni-uploader__files">
				<block v-for="(item,index) in imageList" :key="index">
					<view class="uni-uploader__file">
						<view>
							<view v-show="getFileExtensionCustomType(item) == '1'">
								<view v-show="bisDeleteFlag" style="margin-top:0rpx;margin-bottom:0rpx;" class="childDiv"
									@click="deleteAttachmentById(item.attachmentId)">
									<uni-icons color="'#5555ff'" type="clear" size="35"></uni-icons>
								</view>
								<image class="uni-uploader__img parentDiv" :src="item.base64String"
									:data-src="item.base64String" @tap="fileImagePreview(item.attachmentId)">
								</image>
							</view>
							<view v-show="getFileExtensionCustomType(item) == '2'">
								<view v-show="bisDeleteFlag" style="margin-top:0rpx;margin-bottom:0rpx;" class="childDiv"
									@click="deleteAttachmentById(item.attachmentId)">
									<uni-icons color="'#5555ff'" type="clear" size="35"></uni-icons>
								</view>
								<view v-show="item.base64String">
									<image class="uni-uploader__img parentDiv" :src="item.base64String"
										:data-src="item.base64String" @tap="fileVideoPreview(item.attachmentId,item)">
									</image>
								</view>
								<view v-show="!item.base64String" style="color: #0081FF;font-size:24rpx;">
									{{itemNameShowSubName(item)+'视频文件'}}
								</view>
							</view>
							<view v-show="getFileExtensionCustomType(item) == '4'">
								<view v-show="bisDeleteFlag" style="margin-top:0rpx;margin-bottom:0rpx;" class="childDiv"
									@click="deleteAttachmentById(item.attachmentId)">
									<uni-icons color="'#5555ff'" type="clear" size="35"></uni-icons>
								</view>
								<image class="uni-uploader__img parentDiv" src="./audioType.png"
									 @tap="fileAudioPreview(item.attachmentId,item)">
								</image>
							</view>
							<view style="margin-right:10rpx;"
								v-show="getFileExtensionCustomType(item) == '0' || getFileExtensionCustomType(item) == '3'">
								<uni-row>
									<uni-col :span="20">
										<view v-show="getFileExtensionCustomType(item) == '3'"
											style="color: #0081FF;font-size:24rpx;" class="text"
											@click="filePDFPreview(item.attachmentId, item.fileExtension, item.bisOpen)">
											{{itemNameShowSubName(item)+'PDF文件'}}
										</view>
										<view v-show="getFileExtensionCustomType(item) == '0'"
											style="color: #0081FF;font-size:24rpx;" class="text"
											@click="filePreview(item.attachmentId, item.fileExtension, item.bisOpen)">
											{{itemNameShowSubName(item)}}
										</view>
									</uni-col>
									<uni-col :span="4">
										<view v-show="bisDeleteFlag" style="margin-top:0rpx;margin-bottom:0rpx;"
											@click="deleteAttachmentById(item.attachmentId)">
											<uni-icons color="'#5555ff'" type="clear" size="35"></uni-icons>
										</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</view>
				</block>
				<view v-show="bisDeleteFlag">
					<view v-show="!bisImgFlag"  class="uni-uploader__input-box" @click.stop="onIUploadFile()">
						<view v-show="!bisImgFlag" class="uni-uploader__input" @click.stop="onIUploadFile()"></view>
					</view>
					<view v-show="bisImgFlag"  class="uni-uploader__input-box" @click.stop="chooseImage()">
						<view v-show="bisImgFlag" class="uni-uploader__input" @click.stop="chooseImage()"></view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	import * as utils from "@/common/untils.js";

	export default {
		name: 'common-file-picker',
		props: {
			dataObj: {
				type: Object,
				default: {}
			},
			count: {
				type: [String, Number],
				default: 5
			},
			bisImgFlag: {
				type: [Boolean],
				default: function() {
					return true;
				}
			},
			bisDeleteFlag: {
				type: [Boolean],
				default: function() {
					return true;
				}
			}
		},
		data() {
			return {
				imageList: [],
				selectName: "",
				gutter: 0,
				nvueWidth: 730,
				newImgTypes: ["BMP", "DIB", "EMF", "GIF", "ICB", "ICO", "JPG", "JPEG", "PBM", "PCD", "PCX", "PGM", "PNG",
					"PPM", "PSD", "PSP", "RLE", "SGI", "TGA", "TIF"
				],
				pdfTypes: ["pdf", "doc", "docx", "txt"],
				videoTypes: ["avi", "rmvb", "rm", "asf", "divx", "mpg", "mpeg", "mpe", "wmv", "mp4", "mkv", "vob", "mov",
					"flv", "m4v"
				],
				audioTypes:['CD','OGG','MP3','ASF','WMA','WAV','MP3PRO','RM','REAL','APE','MODULE','MIDI','VQF']
			}
		},
		methods: {
			itemNameShowSubName(item) {
				return utils.getItemShowName(item.fileName, 15);
			},
			getFileExtensionCustomType(item) {
				let imgTypes = this.newImgTypes;
				let videoTypes = this.videoTypes;
				let pdfTypes = this.pdfTypes;
				let audioTypes = this.audioTypes;
				if (item.fileExtension) {
					let videoType = item.fileExtension.toLowerCase();
					let imgType = item.fileExtension.toUpperCase();
					let audioType = item.fileExtension.toUpperCase();
					let pdfType = item.fileExtension.toLowerCase();
					if (imgTypes.includes(imgType)) {
						return "1";
					}
					if (videoTypes.includes(videoType)) {
						return "2";
					}
					if (pdfTypes.includes(pdfType)) {
						return "3";
					}
					if (audioTypes.includes(audioType)) {
						return "4";
					}
				}
				return "0";
			},
			//文件上传方法
			onIUploadFile() {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let query = this.dataObj;
				query.creator = userInfo.userAccount;
				let deviceCode = uni.getStorageSync('deviceCode');
				if (!deviceCode) {
					deviceCode = "";
				}
				/**
				 * currentWebview: 当前webview
				 * url：上传接口地址
				 * name：附件key,服务端根据key值获取文件流，默认file,上传文件的key
				 * header: 上传接口请求头
				 */
				console.log('--------------------');
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					//（app端必传）nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: this.$mp.page.$getAppWebview(),
					// #endif
					//替换为你的上传接口地址
					url: `${this.$config.server.host}/app.public/uploadFileNew`,
					name: 'file',
					// 服务端接收附件的key
					//根据你接口需求自定义 (优先不传content-type,安卓端无法收到参数再传)
					header: {
						"company-key": userInfo.userAccount,
						"deviceCode": deviceCode
					},
					// 限制选择附件的大小上限，默认220M
					maxSize: 220,

					// 若需要在body单独添加附件名或附件大小如下方式传入组件：
					// addName: '后端要的附件名称字段key,此处请勿写name的同值如(file)，会覆盖name',
					// addSize: '后端要的附件大小字段key'

					// body参数直接写key,value,如：
					// date: '2020-1-1',
					// key2: 'value2',
				});
			},
			//文件上传成功调用方法
			onISuccess(result) {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				let query = this.dataObj;
				query.creator = userInfo.userAccount;
				let url = "/app.public/updateAppAttachmentDtoByWhere";
				if (result.ret) {
					let arr = result.data;
					let ids = [];
					if (utils.isArrayNotEmpty(arr)) {
						arr.forEach(item => {
							ids.push(item.attachmentId);
						});
						query.ids = ids.join(",");
						let option = {
							query: query,
							url: url,
							successCallback: function() {
								_this.initFun();
								// uni.showToast({
								// 	title: '上传成功'
								// });
							}
						};
						utils.requestDefault(option);
					}
				}
			},
			//删除文件
			deleteAttachmentById(id) {
				var _this = this;
				let query = {
					attachmentIds: id
				};
				let url = "/app.public/deleteAttachmentByIds";
				let option = {
					query: query,
					notParam: true,
					url: url + "?" + utils.parseParam(query),
					successCallback: function() {
						_this.initFun();
						uni.showToast({
							title: '删除成功',
							success() {
								uni.hideLoading();
							}
						});
					}
				};
				uni.showModal({
					title: "确定删除当前附件？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中',
								mask: true
							});
							utils.requestDefault(option);
						}
					}
				})
			},
			//图片上传
			uploadFile: function(filePaths, query, callback) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				// 文件路径封装
				let objs = filePaths.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				});
				query.creator = userInfo.userAccount;
				let deviceCode = uni.getStorageSync('deviceCode');
				if (!deviceCode) {
					deviceCode = "";
				}
				let option = {
					debug: true,
					url: `${this.$config.server.host}/app.public/uploadFiles`,
					files: objs,
					formData: query,
					header: {
						"company-key": userInfo.userAccount,
						"deviceCode": deviceCode
					},
					success: (res) => {
						if (res.statusCode === 200) {
							if (callback) {
								callback();
							}
						}
					}
				};
				let flagId = this.getClientId();
				if (flagId != 'h5') {
					// // app必传
					option.cuWebview = this.$mp.page.$getAppWebview();
				}
				uni.uploadFile(option);
			},
			//选择图片
			chooseImage: function() {
				var _this = this;
				uni.chooseImage({
					count: _this.count,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						_this.uploadFile(res.tempFilePaths, _this.dataObj, function() {
							_this.initFun();
							uni.showToast({
								title: "上传成功!"
							});
						});
					},
					fail: (err) => {
						console.log('chooseImage fail', err);
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						});
						// #endif
					}
				});
			},
			//附件获取 (从服务端获取)
			initFun: function() {
				let query = this.dataObj;
				var _this = this;
				if (!query.tableId) {
					query.tableId = 0;
					let userInfo = _this.$helper.fetchLocalUser();
					query.creator=userInfo.userAccount;
				}
			
				let option = {
					url: "/app.public/downloadFtpFileToLocalByAttachmentDto",
					query: query,
					successCallback: function(resultData) {
						let arr = [];
						resultData.forEach(item => {
							if (item.base64String) {
								let qcCode = "data:image/jpeg|png|gif;base64," + item.base64String;
								qcCode = qcCode.replace(/[\r\n]/g, "");
								item.base64String = qcCode;
							}
							arr.push(item);
						});
						_this.imageList = arr;
						_this.handleVideoGifFun();
					}
				};
				utils.requestDefault(option);
			},
			handleVideoGifFun() {
				let that = this;
				let imageList = this.imageList;
				if (imageList.length == 0) {
					return false;
				}
				let maxFrame = 1;
				for (var i = 0; i < imageList.length; i++) {
					let item = imageList[i];
					if (this.getFileExtensionCustomType(item) != '2') {
						continue;
					}
					let resResult = this.$myRequest.pmccRequest({
						url: "/app.public/getBase64StringByVideoAttachmentId",
						method: "POST",
						data: {
							id: item.attachmentId,
							maxFrame: maxFrame
						}
					});
					resResult.then(res => {
						if (res.data.ret) {
							let qcCode = "data:image/jpeg|png|gif;base64," + res.data.data;
							qcCode = qcCode.replace(/[\r\n]/g, "");
							item.base64String = qcCode;
						}
					});
				}
			},
			//预览功能
			filePreview(fileId, fileTypeSource, bisOpen) {
				fileTypeSource = fileTypeSource + "";
				let fileType = fileTypeSource.toLowerCase();
				// #ifdef APP-PLUS
				uni.showLoading({
					mask: true
				});
				uni.downloadFile({
					url:`${this.$config.server.host}/app.public/downloadFile?attachmentId=` +
							fileId,
					success: function(res) {
						var filePath = res.tempFilePath;
						switch (uni.getSystemInfoSync().platform) {
							case 'android':
								//console.log('运行Android上')
								break;
							case 'ios':
								filePath = escape(filePath)
								//console.log('运行iOS上')
								break;
							default:
								//console.log('运行在开发者工具上')
								break;
						}
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								uni.hideLoading();
								console.log('打开文档成功');
							},
							fail() {
								uni.showModal({
									content: "此类型不支持预览",
									showCancel: false
								});
								uni.hideLoading();
							}
						});
					}
				});
				// #endif
			},
			fileImagePreview(fileId) {
				var imgUrls = [];
				imgUrls.push(`${this.$config.server.host}/app.public/imgView?fileId=${fileId}`);
				uni.previewImage({
					urls: imgUrls,
					current: 0,
				});
			},
			fileAudioPreview(fileId,item){
				console.log(item) ;
				let tempFilePath = `${this.$config.server.host}/app.public/playAudio?fileId=` + fileId;
				if(!item.fileExtension){
					uni.showToast({
						title: '非标准文件!',
						icon: "error"
					});
				}
				uni.navigateTo({
					url: "/pages/audioView/audioView?fileId=" +
						fileId + "&tempFilePath=" + tempFilePath+"&fileExtension="+item.fileExtension+"&fileName="+item.fileName
				});
			},
			fileVideoPreview(fileId,item) {
				let tempFilePath = `${this.$config.server.host}/app.public/playVideo?fileId=` + fileId;
				if(!item.fileExtension){
					uni.showToast({
						title: '非标准文件!',
						icon: "error"
					});
				}
				uni.navigateTo({
					url: "/pages/videoView/videoView?fileId=" +
						fileId + "&tempFilePath=" + tempFilePath+"&fileExtension="+item.fileExtension
				});
				console.log(item);
				// uni.showLoading({
				// 	mask: true,
				// 	title: "加载视频中"
				// });
				// let tempUri = `${this.$config.server.host}/app.sys.medium/public/downloadFile?attachmentId=` + fileId;
				// const downloadTask = uni.downloadFile({
				// 	url: tempUri,
				// 	timeout:80000,
				// 	success: function(res) {
				// 		uni.hideLoading();
				// 		uni.showToast({
				// 			title: '跳转视频',
				// 			icon: "loading",
				// 			duration: 3000,
				// 			success: () => {
				// 				var filePath = res.tempFilePath;
				// 				uni.navigateTo({
				// 					url: "/pages/videoView/videoView?fileId=" +
				// 						fileId + "&tempFilePath=" + res.tempFilePath
				// 				});
				// 			}
				// 		});
				// 	},
				// 	fail: function(res) {
				// 		uni.hideLoading();
				// 	}
				// });
				// let that = this;
				// downloadTask.onProgressUpdate((red) => {
				// });
			},
			filePDFPreview(fileId) {
				var data = {
					fileId: fileId
				};
				var _recordJson = JSON.stringify(data);
				console.log("跳转PDF");
				uni.navigateTo({
					url: '/pages/preview/pdfView?_recordJson=' + _recordJson
				})
			},
			getClientId() {
				let id = '';
				// #ifdef APP-PLUS
				const client = plus.push.getClientInfo();
				id = client.clientid;
				// #endif
				// #ifdef H5
				id = 'h5';
				// #endif
				//console.log('当前设备ID', id )
				return id;
			}
		},
		beforeCreate: function() {
			// console.group('beforeCreate 创建前状态===============》');
		},
		created: function() {
			// console.group('created 创建完毕状态===============》');
		},
		beforeMount: function() {
			// console.group('beforeMount 挂载前状态===============》');
			// console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
		},
		mounted: function() {
			// console.group('mounted 挂载结束状态===============》');
			this.initFun();
		},
		beforeUpdate: function() {
			// console.group('beforeUpdate 更新前状态===============》');
			// this.initFun();
		},
		updated: function() {
			// console.group('updated 更新完成状态===============》');
			// this.initFun();
		},
		beforeDestroy: function() {
			// console.group('beforeDestroy 销毁前状态===============》');
		},
		destroyed: function() {
			// console.group('destroyed 销毁完成状态===============》');
		}
	}
</script>

<style>
	.parentDiv {
		position: relative;
		z-index: 1;
	}

	.childDiv {
		position: absolute;
		margin-right: 150 rpx;
		margin-left: 150 rpx;
		padding-top: 0 rpx;
		padding-right: 10 rpx;
		margin-top: 0 rpx;
		z-index: 2;
	}
</style>
