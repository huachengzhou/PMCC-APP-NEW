<template>
	<view>
		<view class="title">请在下面输入签名：</view>
		<canvas class="mycanvas" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove"
			@touchend="touchend"></canvas>
		<view class="footer">
			<view class="left" @click="finish">完成</view>
			<view class="right" @click="clear">清除</view>
		</view>
		<view>
			<common-image-picker v-show="showParam" ref="imageComputer" :dataObj="getImgFieldsObj()">
			</common-image-picker>
		</view>
	</view>
</template>

<script>
	import * as Explore from '../../../../../../common/assess/Explore.key.js';
	import * as utils from "../../../../../../common/untils.js";
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	const AssessDBKey = Explore.AssessDBKey;
	var x = 20;
	var y = 20;
	export default {
		data() {
			return {
				ctx: '', //绘图图像
				points: [], //路径点集合
				cardObj: null,
				batchDetail: null,
				formData: {},
				homeParam: {},
				showParam: false
			}
		},
		onLoad(option) {
			this.ctx = uni.createCanvasContext("mycanvas", this); //创建绘图对象

			//设置画笔样式
			this.ctx.lineWidth = 4;
			this.ctx.lineCap = "round";
			this.ctx.lineJoin = "round";

			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let batchDetail = {};
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.cardObj = cardObj;
			this.batchDetail = batchDetail;
			this.setServerData();

			if (option.homeParam) {
				this.homeParam = JSON.parse(option.homeParam);
			}
			console.log(this.homeParam);
		},
		components: {
			"common-image-picker": commonImagePicker,
		},
		methods: {
			//触摸开始，获取到起点
			touchstart: function(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {
					X: startX,
					Y: startY
				};

				/* **************************************************
				    #由于uni对canvas的实现有所不同，这里需要把起点存起来
				 * **************************************************/
				this.points.push(startPoint);

				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},

			//触摸移动，获取到路径点
			touchmove: function(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {
					X: moveX,
					Y: moveY
				};
				this.points.push(movePoint); //存点
				let len = this.points.length;
				if (len >= 2) {
					this.draw(); //绘制路径
				}

			},

			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend: function() {
				this.points = [];
			},

			/* ***********************************************
			#   绘制笔迹
			#   1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#   2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#   3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw: function() {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},

			//清空画布
			clear: function() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						let canvasw = res.windowWidth;
						let canvash = res.windowHeight;
						that.ctx.clearRect(0, 0, canvasw, canvash);
						that.ctx.draw(true);
					},
				})
			},

			//完成绘画并保存到本地
			finish: function() {
				let _this = this;
				let flagId = this.getClientId();
				let userInfo = _this.$helper.fetchLocalUser();
				let data = {};
				let query = this.getImgFieldsObj();
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						console.log(res);
						if (flagId != 'h5') {
							_this.$refs.imageComputer.uploadFile([res.tempFilePath], query, function() {
								uni.showToast({
									title: '完成签名',
									icon: "none",
									duration: 1500,
									mask: true
								});
								_this.redirectFun();
							});
						} else {
							const BASE64_PREFIX = "data:image/jpeg;base64,";
							const old_BASE64_PREFIX = "data:image/png;base64,";
							let canvasCode = res.tempFilePath ;
							canvasCode = canvasCode.replace(old_BASE64_PREFIX,BASE64_PREFIX) ;
							data = {
								userAccount: userInfo.userAccount,
								houseId: _this.batchDetail.tableId,
								canvasCode: canvasCode
							};
							let url = "/app.assess/basicEstateSurveyRecord/basicSignatureCanvas";
							_this.$myRequest.pmccRequest({
								url: url,
								method: "POST",
								data: data,
								showLoading: true
							}).then(res => {
								if (res.data.ret) {
									_this.redirectFun();
								}
							});
						}
					}
				});
			},
			redirectFun() {
				let _this = this;
				uni.showToast({
					title: '保存成功',
					success() {
						let query = _this.homeParam;
						query.transferId = _this.batchDetail.id;
						let url = "../../home/surveyExploreHome?" + utils.parseParam(query);
						uni.redirectTo({
							url: url
						});
					}
				});
			},
			async setServerData() {
				let cardObj = this.cardObj;
				let data = {
					houseId: cardObj.masterId
				};
				let _this = this;
				let url = "/app.assess/basicEstateSurveyRecord/getEstateSurveyRecordByHouseId?" + utils.parseParam(
					data);
				await this.$myRequest.pmccRequest({
					url: url,
					method: "POST",
					urlParam: true,
					data: data
				}).then(res => {
					if (res.data.ret) {
						let formData = res.data.data;
						_this.formData = formData;
					}
				});
			},
			getClientId() {
				let id = '';
				// #ifdef APP-PLUS
				const client = plus.push.getClientInfo();
				id = client.clientid
				// #endif
				// #ifdef H5
				id = 'h5'
				// #endif
				//console.log('当前设备ID', id )
				return id;
			},
			getImgFieldsObj() {
				let _this = this;
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let query = {
					fieldsName: "basicSignature",
					tableId: _this.formData.id,
					tableName: AssessDBKey.BasicEstateSurveyRecord,
					appKey: appCacheKey,
					fileExtension: "jpg"
				};
				return query
			}
		},
	}
</script>

<style>
	.title {
		height: 50upx;
		line-height: 50upx;
		font-size: 16px;
	}

	.mycanvas {
		width: 100%;
		height: calc(100vh - 200upx);
		background-color: #ECECEC;
	}

	.footer {
		font-size: 16px;
		height: 150upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.left,
	.right {
		line-height: 100upx;
		height: 100upx;
		width: 250upx;
		text-align: center;
		font-weight: bold;
		color: white;
		border-radius: 5upx;
	}

	.left {
		background: #007AFF;
	}

	.right {
		background: orange;
	}
</style>
