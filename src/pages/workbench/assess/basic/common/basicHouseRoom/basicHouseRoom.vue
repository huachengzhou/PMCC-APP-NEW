<template>
	<view class="content">

		<view>
			<z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">
				<view slot="top">
					<!-- <button @click.stop="autoGenerateFun()" class="mini-btn" type="primary" size="mini">自动生成</button> -->
					<!-- 基本用法 -->
					<!-- <uni-search-bar  @confirm="onSearch" @cancel="onCancel"></uni-search-bar> -->
				</view>

				<view slot="bottom">
					<view class="assessPrimarybutton">
						<button @click.stop="batchUpdateHouseRoom" type="primary">
							<view>批量修改</view>
						</button>
					</view>
				</view>

				<view>
					<common-custom-panel-grid :titles="fieldList" :list="DetailList" @editItem="editItem"
						@deleteItem="deleteItem">
					</common-custom-panel-grid>
				</view>
			</z-paging>
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view style="margin-top:20rpx;">
						<view>
							<uni-title type="h3" align="center" title="房间批量修改"></uni-title>
						</view>
					</view>
					<view>
						<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
							:rules="rules">
							<uni-forms-item required name="houseRoom" label="房间" label-align="right">
								<uni-data-checkbox multiple v-model="formData.houseRoom"
									:localdata="houseRoomList" />
							</uni-forms-item>
							
							<uni-forms-item required name="aeration" label="通风" label-align="right">
								<uni-data-checkbox mode="tag" v-model="formData.aeration"
									:localdata="houseRoomcompareList"></uni-data-checkbox>
							</uni-forms-item>
							
							<uni-forms-item required name="lighting" label="采光" label-align="right">
								<uni-data-checkbox mode="tag" v-model="formData.lighting"
									:localdata="houseRoomcompareList"></uni-data-checkbox>
							</uni-forms-item>
							
							<uni-forms-item required name="sunshine" label="日照" label-align="right">
								<uni-data-checkbox mode="tag" v-model="formData.sunshine"
									:localdata="houseRoomcompareList"></uni-data-checkbox>
							</uni-forms-item>
							
							<uni-forms-item required name="soundInsulation" label="隔音" label-align="right">
								<uni-data-checkbox mode="tag" v-model="formData.soundInsulation"
									:localdata="houseRoomcompareList"></uni-data-checkbox>
							</uni-forms-item>
							
							<uni-forms-item name="layerHeight" label="层高" label-align="right">
								<uni-easyinput type="digit" v-model="formData.layerHeight" placeholder="层高" />
							</uni-forms-item>
							
							<uni-forms-item name="clearHeight" label="净高" label-align="right">
								<uni-easyinput type="digit" v-model="formData.clearHeight" placeholder="净高" />
							</uni-forms-item>
						</uni-forms>
					</view>
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<button class="uni-button" size="mini" type="primary" @click.stop="sureFunModel">确定</button>
						<button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
					</view>
				</view>
			</my-ming-pop>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import common_custom_panel_grid from '@/components/common-custom-panel/common-custom-panel-grid.vue';
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import * as Explore from '@/common/assess/Explore.key.js';

	const AssessDicKey = Explore.AssessDicKey;

	export default {
		data() {
			return {
				cardObj: null,
				batchDetail: null,
				DetailList: [],
				houseRoomList: [],
				houseRoomcompareList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				houseRoomResidence: false,
				houseRoomStore: false,
				houseRoomHotel: false,
				houseRoomProduction: false,
				houseRoomStorage: false,
				current: 0,
				centerFlag: false,
				activeColor: '#007aff',
				styleType: 'button',
				formData: {
					houseRoom: '',
					aeration: '',
					lighting: '',
					sunshine: '',
					soundInsulation: '',
					layerHeight: '',
					clearHeight: ''
				},
				//可滑动区域高度
				scrollHeight:'',
				//抽屉弹窗宽度
				drawerWidth:'100',
				rules: {
					houseRoom: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					aeration: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					lighting: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					sunshine: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					soundInsulation: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		onNavigationBarButtonTap(e) {
			let index = e.index;
			let cardObj = this.cardObj;
			if (index == 0) {
				var param = {
					cardJson: JSON.stringify(cardObj),
					id: 0
				};
				uni.navigateTo({
					url: "./basicHouseRoomEdit?" + utils.parseParam(param)
				});
			} else if (index == 1) {
				uni.showModal({
					title: "提示？",
					content: "确定当前操作",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							this.autoGenerateFun();
						}
					}
				});
			}
		},
		onBackPress() {
			let batchDetail = this.batchDetail;
			try {
				uni.getStorage({
					key: estateCommonUtils.childNavigationCacheKey(batchDetail.id),
					success: function(res) {
						let query = res.data;
						if (query) {
							let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
							uni.redirectTo({
								url: url
							});
							return true;
						} else {
							return false;
						}
					}
				});
			} catch (e) {
				return false;
			}
			console.log("拦截");
			return false;
		},
		onLoad(option) {
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
			this.setServerTab();

			let dataThis = this.$data;
			estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_status, function(
				resultData) {
				if (!resultData) {
					return false;
				}
				let arrNames = [];
				resultData.forEach(item => {
					let obj = {
						text: item.name,
						value: item.name
					};
					arrNames.push(obj);
				});
				dataThis.houseRoomcompareList = arrNames;
			});
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.paging.reload();
			});
		},
		computed: {
			fieldList: function() {
				let fieldList = [];
				let arr = [];
				let contentList = [];
				if (this.houseRoomResidence) {
					arr.push("通风");
					arr.push("采光");
					arr.push("日照");
					arr.push("隔音");
					arr.push("长度");
					arr.push("宽度");
					contentList = "aeration,lighting,sunshine,soundInsulation,length,width".split(",");
				}
				if (this.houseRoomStore) {
					arr.push("相邻位置描述");
					arr.push("方位");
					arr.push("开间");
					arr.push("进深");
					contentList = "adjacentPositionDescribe,orientationName,opening,depth".split(",");
				}
				if (this.houseRoomHotel) {
					arr.push("通风");
					arr.push("采光");
					arr.push("长度");
					arr.push("宽度");
					contentList = "aeration,lighting,length,width".split(",");
				}
				if (this.houseRoomProduction) {
					arr = "跨长,跨数,通风,采光,最大跨距,最小跨距,标准跨距".split(",");
					contentList = "spanLength,spanNum,aeration,lighting,maxSpan,minSpan,standardSpan".split(",");
				}
				if (this.houseRoomStorage) {
					arr = "计量标准,仓储要求".split(",");
					contentList = "standardMeasureName,storageRequestName".split(",");
				}
				arr.unshift("基础信息");
				arr.unshift("名称");

				contentList.unshift("baseTitle");
				contentList.unshift("name");

				for (let i = 0; i <= contentList.length - 1; i++) {
					let obj = {
						label: arr[i],
						field: contentList[i]
					};
					fieldList.push(obj);
				}
				console.log(fieldList);
				return fieldList;
			}
		},
		components: {
			"common-custom-panel-grid": common_custom_panel_grid,
			"my-ming-pop": myMingPop
		},
		methods: {
			queryPageList(pageNo, pageSize) {
				var _this = this;
				let dataThis = this.$data;
				var userInfo = _this.$helper.fetchLocalUser();
				if (!_this.batchDetail) {
					return false;
				}
				var data = {
					pageNum: pageNo,
					pageSize: pageSize,
					// creator: userInfo.userAccount,
					masterId: _this.batchDetail.tableId
					// fullName: _this.searchValue
				};
				if (!data.masterId) {
					return false;
				}
				if (_this.cardObj.childType) {
					data.childType = _this.cardObj.childType;
				}
				let option = {
					url: _this.cardObj.pageUrl,
					query: data,
					successCallback: function(resultData) {
						let rows = resultData.rows;
						rows.forEach(row => {
							let baseTitle = _this.getBaseTitle(row);
							row.baseTitle = baseTitle;
						})
						dataThis.houseRoomList = estateCommonUtils.checkboxTransformBaseDic(resultData.rows);
						_this.$refs.paging.complete(rows);
					}
				};
				//请求方法
				utils.requestDefault(option);
			},
			setServerTab() {
				let batchDetail = this.batchDetail;
				this.$myRequest.pmccRequest({
					method: "POST",
					urlParam: true,
					data: {
						id: batchDetail.tableId
					},
					url: "/app.assess/basicHouseHuxing/getHuxingByHouseId?id=" + batchDetail.tableId
				}).then(res => {
					if (res.data.ret) {
						let data = res.data.data;
						let tenementType = data.tenementType;
						if (tenementType) {
							return this.$myRequest.pmccRequest({
								method: "POST",
								urlParam: true,
								data: {
									name: tenementType
								},
								url: "/app.assess/public/toMobileColumnsPrefixBasicTenement?name=" +
									tenementType
							});
						} else {
							uni.showToast({
								title: '请先选择户型的物业类型!'
							});
						}
					}
				}).then(res => {
					if (!res) {
						return false;
					}
					if (res.data.ret) {
						let data = res.data.data;
						let basedata = this.$data;
						basedata[data] = true;
					}
				});
			},
			deleteItem(item) {
				var _this = this;
				var query = {
					id: item.id
				};
				let option = {
					url: _this.cardObj.deleteUrl + "?" + utils.parseParam(query),
					query: query,
					notParam: true,
					successCallback: function() {
						uni.showToast({
							title: '删除成功',
							success() {
								uni.hideLoading();
								_this.$refs.paging.reload();
							}
						});
					}
				};
				uni.showModal({
					title: "确定删除当前数据？",
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
				});
			},
			getBaseTitle(row) {
				var s = "";
				if (row.houseShape) {
					s += "房间形状:" + row.houseShape;
					s += ";";
				}
				if (row.shapeRemark) {
					s += "形状说明:" + row.shapeRemark;
					s += ";";
				}
				if (row.area) {
					s += "面积:" + row.area;
					s += "m²;";
				}
				if (row.layerHeight) {
					s += "层高:" + row.layerHeight;
					s += "m;";
				}
				if (row.clearHeight) {
					s += "净高:" + row.clearHeight;
					s += "m;";
				}
				return s;
			},
			editItem(item) {
				let cardObj = this.cardObj;
				var param = {
					cardJson: JSON.stringify(cardObj),
					id: item.id
				};
				uni.navigateTo({
					url: "./basicHouseRoomEdit?" + utils.parseParam(param)
				});
			},
			onClickItem(eObj) {
				let current = eObj.currentIndex;
				this.current = current;
			},
			autoGenerateFun() {
				let _this = this;
				let houseId = _this.batchDetail.tableId;
				var userInfo = _this.$helper.fetchLocalUser();
				let userAccount = userInfo.userAccount;
				let data = {
					houseId: houseId,
					userAccount: userAccount
				};
				console.log(data);
				let option = {
					url: "/app.assess/basicHouseRoom/autoGenerate?" + utils.parseParam(data),
					query: data,
					notParam: true,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '自动生成数据成功',
							success() {
								_this.$refs.paging.reload();
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			getIndexShowName(itemData) {
				let text = "";
				const firstIndex = 2;
				let current = this.current;
				let contentList = this.contentList;
				if (current > firstIndex) {
					let index = current - firstIndex;
					let field = contentList[index];
					text = itemData[field];
					this.centerFlag = true;
				}
				return text;
			},
			getItemShowName(name) {
				return utils.getItemShowName(name);
			},
			onSearch(obj) {
				this.searchValue = obj.value;
				this.$refs.paging.reload();
			},
			onCancel() {
				this.searchValue = null;
				this.$refs.paging.reload();
			},
			sureFunModel() {
				// 手动提交表单
				var _this = this;
				let formData = this.formData;
				let arr = [];
				if (formData.houseRoom) {
					formData.houseRoom.forEach(id => {
						let obj = {
							id: id,
							aeration: formData.aeration,
							lighting: formData.lighting,
							sunshine: formData.sunshine,
							soundInsulation: formData.soundInsulation,
							layerHeight: formData.layerHeight,
							clearHeight: formData.clearHeight
						};
						arr.push(obj);
					});
				}
				console.log(arr);
				this.$refs.form.validate().then((res) => {
					let option = {
						method: 'POST',
						data: {
							formData: JSON.stringify(arr)
						},
						url: '/app.assess/basicHouseRoom/batchUpdateBasicHouseRoom',
						showLoading: true
					};
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							this.$refs.paging.reload();
							this.$refs.myMingPop.close();
							uni.showToast({
								title: '修改成功'
							});
						}
					}).catch(err => {
						uni.showModal({
							title: '错误提示',
							content: err.errMsg,
							showCancel: false
						});
					});
				});
			},
			batchUpdateHouseRoom() {
				this.openModel();
			},
			openModel() {
				this.$refs.myMingPop.show();
				this.formData.houseRoom = '';
				this.formData.aeration = '';
				this.formData.lighting = '';
				this.formData.sunshine = '';
				this.formData.soundInsulation = '';
				this.formData.layerHeight = '';
				this.formData.clearHeight = '';
			},
			closeModel() {
				this.$refs.myMingPop.close();
			},
			scrollH(){
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750/winWidth;
				let winHeight =parseInt(sys.windowHeight*winrate)
				this.drawerWidth = winWidth;
				this.scrollHeight = winHeight
			}
		},
		created() {
			this.scrollH();
		},
		
	}
</script>

<style>

</style>
