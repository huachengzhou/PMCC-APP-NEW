<template>

	<view>
		<view class="uni-container">
			<uni-table :loading="loading" border stripe type="selection" @selection-change="selectionChange">
				<uni-tr>
					<uni-th width="150" align="center">街道号</uni-th>
					<uni-th width="150" align="center">大门名称</uni-th>
					<uni-th align="center">附号</uni-th>
					<uni-th width="204" align="center">大门图</uni-th>
					<uni-th width="204" align="center">多个附件</uni-th>
					<uni-th width="204" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in DetailList" :key="index">
					<uni-td>{{ item.streetNumber }}</uni-td>
					<uni-td>
						<view class="name">{{ item.gateName }}</view>
					</uni-td>
					<uni-td align="center">{{ item.attachedNumber }}</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<block v-if="imageSrc">
								<image :src="imageSrc" class="image" mode="widthFix"></image>
							</block>
							<view class="uni-hello-addfile" @click="chooseImage(item)">+ 选择图片</view>
						</view>
					</uni-td>
					<uni-td align="center">
						<uni-file-picker @select="select" @progress="progress" @success="success" @fail="fail" limit="5"
							file-mediatype="all" title="最多选择5个文件">
						</uni-file-picker>
					</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary">修改</button>
							<!-- <button class="uni-button" size="mini" type="warn">删除</button> -->
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>

</template>

<script>
	import * as utils from "../../../../common/untils.js";
	import tableData from './tableData.js';


	export default {
		props: {
			masterId: {
				type: [Number],
				default: 0,
				required: false
			}
		},
		data() {
			return {
				searchVal: '',
				tableData: tableData,
				loading: false,
				DetailList: [],
				imageSrc: ''
			}
		},
		onLoad() {

		},
		onShow() {

		},
		components: {

		},
		methods: {
			initFun: function() {
				var pageNo = 1,
					pageSize = 30;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					masterId: _this.masterId
				};
				if (!data.masterId) {
					return false;
				}
				if (utils.isArrayNotEmpty(_this.DetailList)) {
					let item = _this.DetailList[0];
					if (item.estateId == _this.masterId) {
						return false;
					}
				}
				let option = {
					url: "/app.assess/basicEstateStreetInfo/getPageResult",
					query: data,
					successCallback: function(resultData) {
						let rows = resultData.rows;
						let arr = [];
						rows.forEach(function(row) {
							row.imageSrc = "";
							arr.push(row);
						});
						console.log(resultData);
						_this.DetailList = arr;
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			oldUploadFile: function(filePaths) {
				var imageSrc = filePaths[0]
				var _this = this;
				uni.uploadFile({
					url: 'https://unidemo.dcloud.net.cn/upload',
					filePath: imageSrc,
					fileType: 'image',
					name: 'data',
					success: (res) => {
						console.log('uploadImage success, res is:', res)
						uni.showToast({
							title: '上传成功',
							icon: 'success',
							duration: 1000
						});
					},
					fail: (err) => {
						console.log('uploadImage fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},
			uploadFileFun: function(filePaths) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let query = {
					appKey: 'pmcc-acc',
					tableName: 'tb_project_audit_task_form',
					tableId: 199,
					fieldsName: 'XXV',
					creator: userInfo.userAccount
				};
				uni.uploadFile({
					url: `${this.$config.server.host}/app.public/uploadFile`, // 后端api接口
					filePath: filePaths[0], // uni.chooseImage函数调用后获取的本地文件路劲
					name: 'file', //后端通过'file'获取上传的文件对象
					method: 'POST',
					formData: query,
					fileType: 'image',
					header: {
						// "content-Type": "multipart/form-data",
						"sign-value": _this.$helper.requestSign({}),
						"company-key": userInfo.userAccount
					},
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				});
			},
			otherloadFileFun: function(filePaths) {
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let query = {
					appKey: 'pmcc-acc',
					tableName: 'tb_project_audit_task_form',
					tableId: 199,
					fieldsName: 'XXV',
					creator: userInfo.userAccount
				};
				// 文件路劲封装
				let objs = filePaths.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				});
				uni.uploadFile({
					url: `${this.$config.server.host}/app.public/uploadFiles`,
					files: objs,
					formData: query,
					header: {
						"sign-value": _this.$helper.requestSign({}),
						"company-key": userInfo.userAccount
					},
					success: (res) => {
						if (res.statusCode === 200) {
							uni.showToast({
								title: "成功!"
							});
						}
					}
				});
			},
			chooseImage: function(item) {
				var _this = this;
				uni.chooseImage({
					count: 3,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						console.log(res);
						console.log(res.tempFilePaths);
						var imageSrc = res.tempFilePaths[0]
						_this.imageSrc = imageSrc;
						// _this.uploadFileFun(res.tempFilePaths);
						// _this.oldUploadFile(res.tempFilePaths);
						_this.otherloadFileFun(res.tempFilePaths);
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
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
						})
						// #endif
					}
				})
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e) ;
				var _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let query = {
					appKey: 'pmcc-acc',
					tableName: 'tb_project_audit_task_form',
					tableId: 199,
					fieldsName: 'XXV',
					creator: userInfo.userAccount
				};
				// 文件路劲封装
				let objs = e.tempFiles;
				uni.uploadFile({
					url: `${this.$config.server.host}/app.public/uploadFiles`,
					files: objs,
					formData: query,
					header: {
						"sign-value": _this.$helper.requestSign({}),
						"company-key": userInfo.userAccount
					},
					success: (res) => {
						if (res.statusCode === 200) {
							uni.showToast({
								title: "成功!"
							});
							objs.forEach(function(obj) {
								obj.progress = 100;
							}) ;
						}
					}
				});
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},
			// 上传成功
			success(e) {
				console.log('上传成功')
			},
			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			}
		},
		beforeCreate: function() {
			// console.group('beforeCreate 创建前状态===============》');
		},
		created: function() {
			// console.group('created 创建完毕状态===============》');
			// console.log(this.$attrs);
			// console.log(this.$listeners);
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
		},
		updated: function() {
			// console.group('updated 更新完成状态===============》');
			this.initFun();
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


</style>
