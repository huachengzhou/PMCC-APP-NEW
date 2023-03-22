<template>
	<view>

		<view style="margin-top:20rpx;">
			<view class="uni-flex uni-row" style="-webkit-flex-wrap: wrap;flex-wrap: wrap;">
				<view v-for="(item,index) in batchDetailParents" style="display:flex;">
					<text v-on:click="setCards(item)" style="color: #0000FF;font-size: 30rpx;">
						{{getItemParentShowName(item,index,batchDetailParents)}}
					</text>
				</view>
			</view>

			<view class="uni-flex uni-row">
				<view>
					<assess-basic-picker-tree ref="basicPickerTree" @getResults="selectFun" :multiple="false"
						:dataTreeList="dataTreeList">
					</assess-basic-picker-tree>
				</view>
			</view>
		</view>

		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger" />

		<view class="uni-flex uni-row" style="height: 100rpx;margin-top:20rpx;background-color: #11fdee;">
			<view class="text" style=" width:500rpx;margin-top:30rpx;font-size: 28rpx;">
				<uni-icons color="'#8f8f94'" type="navigate-filled" size="20"></uni-icons> {{batchDetail.name}}
				{{'(' + batchDetail.executorName+')'}}
			</view>
			<view @click.stop="setItemStatus()" class="text" style="-webkit-flex: 1;flex: 1;margin-top:30rpx;">
				<uni-icons color="'#8f8f94'" type="refresh" size="20"></uni-icons>
			</view>
		</view>

		<!-- <uni-section :title="batchDetail.name +'(' + batchDetail.executorName+')'" type="line"></uni-section> -->

		<uni-list v-for="(itemData,index) in itemList">

			<view @click="clickCard(itemData)" class="uni-flex uni-row" style="margin-top:20rpx;margin-bottom: 20rpx;">
				<view class="text" style="width: 200rpx;margin-left:15rpx;">
					<view class="slot-image" v-show="checkExistFun(itemData)">
						<uni-icons color="'#8f8f94'" type="checkbox-filled" size="25"></uni-icons>
					</view>
					<view class="slot-image" v-show="! checkExistFun(itemData)">
						<uni-icons color="'#8f8f94'" type="checkbox" size="25"></uni-icons>
					</view>
				</view>
				<view class="text" style="-webkit-flex: 1;flex: 1;">
					{{itemData.title}}
				</view>

				<view class="text" style="width: 100rpx;">
					<uni-icons color="'#d7d7dc'" type="forward" size="25"></uni-icons>
				</view>
			</view>

		</uni-list>

		<view style="height:60px;">
		</view>

		<view class="goods-carts">
			<uni-goods-nav :options="footBars" :fill="true" :button-group="footButtonGroup" @click="footNavClick"
				@buttonClick="footNavClick" />
		</view>



		<assess-basic-file-model ref="assessBasicApplyBatchFileModel" @getResults="getAssessBasicApplyBatchFileModel">
		</assess-basic-file-model>

		<assess-basic-alternative-modal ref="assess_basic_alternative_modal" @getResults="sureBasicHouseCaseSummaryFun">
		</assess-basic-alternative-modal>

		<assess-basic-case-storehouse :dataValue="applyBatchId" :projectPlanDetails="projectPlanDetails"
			ref="assess_basic_case_storehouse" @getResults="initFun">
		</assess-basic-case-storehouse>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import AssessBasicPickerTree from '@/components/assess/assess-basic-picker-tree/assess-basic-picker-tree.vue';
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import assess_basic_file_model from '@/components/assess/assess-basic-file-model/assess-basic-file-model.vue';
	import assess_basic_alternative_modal from '@/components/assess/basic/assess-basic-alternative-modal/assess-basic-alternative-modal.vue';
	import assess_basic_case_storehouse from '@/components/assess/basic/assess-basic-case-storehouse/assess-basic-case-storehouse.vue';

	export default {
		data() {
			return {
				loadingFlag: false,
				// 每页数据量
				pageSize: 6,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				searchValue: '',
				//表格选中数据
				footCode: '',
				footBars: [{
						icon: 'pengyouquan',
						text: '节点复制',
						code: 1
					},
					{
						icon: 'smallcircle',
						text: '备选案例',
						code: 2
					},
					{
						icon: 'images',
						text: '查勘图片',
						code: 5
					},
					{
						text: '添加到备选案例',
						icon: 'plus',
						backgroundColor: '#ffa200',
						color: '#fff',
						code: 4
					}
				],
				footButtonGroup: [],
				batchDetail: {}, //选项卡  选中数据
				batchDetailParents: {}, //选项卡  选中数据
				projectPlanDetails: {},
				homeParam: '',
				basicApplyBatchType: '',
				modelPhoneType: '',
				batchDetailArray: {},
				vError: '',
				itemList: [],
				applyBatchId: 0,
				referenceApplyBatchId: '',
				planDetailsId: 0,
				projectId: 0,
				transferId: 0,
				dataTreeList: [],
				horizontal: 'right',
				vertical: 'top',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
				},
				content: [{
						iconPath: '/static/operating/delete.png',
						selectedIconPath: '/static/operating/deleteselected.png',
						text: '删除',
						active: false,
						code: "delete"
					},
					{
						iconPath: '/static/operating/edit.png',
						selectedIconPath: '/static/operating/editselected.png',
						text: '编辑',
						active: false,
						code: "edit"
					},
					{
						iconPath: '/static/operating/add.png',
						selectedIconPath: '/static/operating/addselected.png',
						text: '添加',
						active: false,
						code: "add"
					},
					{
						iconPath: '/static/operating/setting.png',
						selectedIconPath: '/static/operating/setting.png',
						text: '节点选择',
						active: false,
						code: "setting"
					}
				]
			}
		},
		computed: {
			keyList: function() {
				let arr = [];
				let batchDetailArray = this.batchDetailArray;
				for (let i = 0; i < batchDetailArray.length; i++) {
					let data = batchDetailArray[i];
					data.title = data.displayName ? data.displayName : data.name;
					arr.push(data);
				}
				return arr;
			},
			itemGroupList: function() {
				var resultData = this.itemList;
				var groupIndex = 3; //分成3个一组
				var result = [];
				for (var k = 0, len = resultData.length; k < len; k += groupIndex) {
					result.push(resultData.slice(k, k + groupIndex));
				}
				return result;
			}
		},
		onLoad(option) {
			var _this = this;
			if (option.transferId) {
				this.transferId = option.transferId;
			}
			this.settingTreeParam(option);
		},
		onPullDownRefresh() {
			this.initFun();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {},
		components: {
			"assess-basic-picker-tree": AssessBasicPickerTree,
			"assess-basic-file-model": assess_basic_file_model,
			"assess-basic-alternative-modal": assess_basic_alternative_modal,
			"assess-basic-case-storehouse": assess_basic_case_storehouse,
			"my-ming-pop": myMingPop
		},
		methods: {
			footNavClick(e) {
				let content = e.content;
				let code = content.code;
				this.footCode = code;
				this.pageCurrent = 1;
				this.total = 0;
				switch (code) {
					case 1: {
						let _this = this;
						let batchDetail = this.batchDetail;
						let type = batchDetail.type;
						batchDetail.basicApplyBatchType = this.basicApplyBatchType;
						let param = {
							batchDetailJson: JSON.stringify(batchDetail),
							homeParam: _this.homeParam
						};
						uni.navigateTo({
							url: "./settingSuveyExplore" + "?" + utils.parseParam(param)
						});
						break;
					}
					case 2: {
						this.$refs.assess_basic_alternative_modal.onFocus();
						break;
					}
					case 4: {
						uni.showModal({
							title: "是否确认添加到备选案例!",
							content: "添加后不可删除",
							confirmText: "确定",
							cancelText: "取消",
							cancelColor: "#DD524D",
							confirmColor: "#4CD964",
							success: (res) => {
								if (res.confirm) {
									this.addBasicToAlternative();
								}
							}
						});
						break;
					}
					case 5: {
						this.$refs.assessBasicApplyBatchFileModel.onFocus();
						break;
					}
					default: {
						break;
					}
				}
				console.log(content);
			},
			trigger(e) {
				let item = e.item;
				if (!item) {
					return false;
				}
				let code = item.code;
				if (!code) {
					return false;
				}
				switch (code) {
					case "edit": {
						this.editNode();
						break;
					}
					case "add": {
						this.appendNode();
						break;
					}
					case "delete": {
						this.deleteNode();
						break;
					}
					case "setting": {
						this.settingNode();
						break;
					}
					default: {
						break;
					}
				}
				this.$refs.fab.close();
			},
			settingTreeParam(option) {
				var _this = this;
				let homeParam = {
					applyBatchId: option.applyBatchId,
					type: option.type,
					projectId: option.projectId,
					planDetailsId: option.planDetailsId,
					modelPhoneType: option.modelPhoneType
				};
				this.applyBatchId = homeParam.applyBatchId;
				this.planDetailsId = homeParam.planDetailsId;
				this.basicApplyBatchType = homeParam.type;
				this.projectId = homeParam.projectId;
				this.modelPhoneType = homeParam.modelPhoneType;
				this.homeParam = JSON.stringify(homeParam);
				this.projectPlanDetails = {
					id: option.planDetailsId,
					projectId: option.projectId
				};
				//赋值必须在前
				this.initFun();
			},
			//编辑node
			editNode() {
				let node = this.batchDetail;
				var query = {
					type: node.type
				};
				let _this = this;
				let promise = this.$myRequest.pmccRequest({
					url: `/app.assess/basicApplyBatch/getTableTypeName?` + utils.parseParam(query),
					data: query,
					urlParam: true,
					method: "POST"
				});
				promise.then(res => {
					if (res.data.ret) {
						let resultData = res.data.data;
						var typeData = [{
							value: resultData,
							name: resultData,
							key: node.type,
							id: node.type,
						}];
						var json = JSON.stringify(typeData);
						var queryNew = {
							id: node.id,
							pid: node.pid,
							name: node.name,
							type: node.type,
							declareRecordId: node.declareRecordId,
							applyBatchId: node.applyBatchId,
							typeData: json,
							planDetailsId: node.planDetailsId,
							basicApplyBatchType: _this.basicApplyBatchType,
							projectId: _this.projectId,
							modelPhoneType: _this.modelPhoneType,
							homeParam: _this.homeParam
						};

						var param = utils.parseParam(queryNew);
						uni.navigateTo({
							url: "./addSurveyExplore" + "?" + param
						});
					}
				});
			},
			//删除 node
			deleteNode() {
				let batchDetail = this.batchDetail;
				let _this = this;
				if (batchDetail.pid == 0) {
					uni.showToast({
						title: "根节点不允许删除",
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let query = {
					id: batchDetail.id
				};
				let option = {
					url: `/app.assess/basicApplyBatchDetail/deleteBasicApplyBatchDetailByIds?` + utils.parseParam(
						query),
					query: query,
					notParam: true,
					successCallback: function() {
						_this.initFun();
						uni.showToast({
							title: '删除成功'
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
				console.log(batchDetail);
			},
			//添加node
			appendNode() {
				let node = this.batchDetail;
				var query = {
					type: node.type
				};
				let _this = this;
				let promise = this.$myRequest.pmccRequest({
					url: `/app.assess/basicApplyBatch/getTableTypeList?` + utils.parseParam(query),
					data: query,
					urlParam: true,
					method: "POST"
				});
				promise.then(res => {
					if (res.data.ret) {
						let typeData = res.data.data;
						if (typeData.length == 0) {
							uni.showToast({
								title: "已经不能往下添加节点了",
								duration: 3000
							});
							return false;
						}
						let arr = [];
						typeData.forEach(function(typeItem) {
							arr.push({
								id: typeItem.key,
								name: typeItem.value
							});
						});
						var json = JSON.stringify(arr);
						var queryNew = {
							pid: node.id,
							id: "",
							name: "",
							declareRecordId: "",
							applyBatchId: node.applyBatchId,
							typeData: json,
							planDetailsId: node.planDetailsId,
							basicApplyBatchType: _this.basicApplyBatchType,
							projectId: _this.projectId,
							modelPhoneType: _this.modelPhoneType,
							homeParam: _this.homeParam
						};
						var param = utils.parseParam(queryNew);
						uni.navigateTo({
							url: "./addSurveyExplore" + "?" + param
						});
					}
				});
			},
			//选择node
			settingNode() {
				this.$refs.basicPickerTree.initEvent();
			},
			initFun() {
				this.setBatchDetailArray();
				this._showTimer && clearTimeout(this._showTimer);
			},
			selectFun(result) {
				let list = this.batchDetailArray;
				if (utils.isArrayNotEmpty(result)) {
					let data = result[0];
					var itemArr = list.filter(obj => data.id == obj.id);
					if (utils.isArrayNotEmpty(itemArr)) {
						this.setCards(itemArr[0]);
						this.transferId = itemArr[0].id;
					}
				}
			},
			selectTreeNodeFun() {
				let list = this.batchDetailArray;
				if (list.length == 0) {
					uni.showToast({
						title: "数据未完全渲染请等待!"
					});
					return false;
				}
				//1:找出pid = 0;
				//2:第二步 递归列表
				let firstData = {};
				list.forEach(function(item) {
					if (item.pid == 0) {
						firstData = item;
					}
				});
				let viewName = firstData.name + "(" + firstData.executorName + ")";
				if (firstData.executorName) {
					viewName = firstData.name + "(" + firstData.creatorName + ")";
				}
				let obj = Object.assign({
					id: firstData.id,
					pid: firstData.pid,
					viewName: viewName,
					name: firstData.name,
					children: []
				}, firstData);
				this.traverseFun(obj, list);
				this.dataTreeList = [obj];
			},
			traverseFun(root, list) {
				let that = this;
				var newArr = list.filter(item => root.id == item.pid);
				if (newArr.length == 0) {
					return;
				} else {
					list.forEach(function(item) {
						if (root.id == item.pid) {
							let viewName = item.name + "(" + item.executorName + ")";
							if (item.executorName) {
								viewName = item.name + "(" + item.creatorName + ")";
							}
							let obj = Object.assign({
								id: item.id,
								pid: item.pid,
								viewName: viewName,
								name: item.name,
								children: []
							}, item);
							that.traverseFun(obj, list);
							root.children.push(obj);
						}
					});
				}
			},
			checkExistFun(item) {
				if (item.checkExist != null && item.checkExist != undefined && item.checkExist != '') {
					if (item.checkExist) {
						return true;
					}
				}
				return false;
			},
			//设置  查勘卡片
			setCards(batchDetail) {
				var _this = this;
				this.batchDetail = batchDetail;
				var query = {
					key: batchDetail.type
				};
				if (this.basicApplyBatchType != null && this.basicApplyBatchType != undefined) {
					query.type = this.basicApplyBatchType;
				}
				_this.itemList = [];
				let option = {
					url: `/app.assess/basicApplyBatch/getCards?` + utils.parseParam(query),
					query: query,
					notParam: true,
					successCallback: function(resultData) {
						_this.itemList = resultData;
						_this.setItemStatus();
					}
				};
				utils.requestDefault(option);
				_this.batchDetailParents = [];
				let list = this.batchDetailArray;
				let batchDetailParents = [];
				let parentDetail = null;
				let count = 0;
				do {
					if (parentDetail == null) {
						parentDetail = batchDetail;
					} else {
						for (let i = 0; i <= list.length - 1; i++) {
							let obj = list[i];
							if (obj.id == parentDetail.pid) {
								parentDetail = obj;
								break;
							}
						}
					}
					if (count >= 1000) {
						break;
					}
					count++;
					batchDetailParents.push(parentDetail);
				} while (parentDetail.pid != 0);
				_this.batchDetailParents = batchDetailParents.reverse();
			},
			setItemStatus() {
				var _this = this;
				let batchDetail = this.batchDetail;
				let type = "0";
				if (this.basicApplyBatchType) {
					type = this.basicApplyBatchType;
				}
				var query = {
					key: batchDetail.type,
					masterId: batchDetail.tableId,
					type: type
				};
				let option = {
					url: `/app.assess/basicApplyBatch/getCardStatus?` + utils.parseParam(query),
					query: query,
					notParam: true,
					successCallback: function(resultData) {
						_this.itemList = resultData;
						_this.hideLoading();
					}
				};
				this.showLoading();
				utils.requestDefault(option);
			},
			//获取查勘树节点
			setBatchDetailArray() {
				var _this = this;
				let applyBatchId = this.applyBatchId;
				this.setBatchDetailCoreArray(applyBatchId);
				utils.requestDefault({
					query: {
						id: applyBatchId
					},
					url: '/app.assess/basicApplyBatch/getBasicApplyBatchById?id=' + applyBatchId,
					successCallback: function(resultData) {
						if (!resultData) {
							return false;
						}
						if (resultData.referenceApplyBatchId) {
							_this.setBatchDetailCoreArray(resultData.referenceApplyBatchId);
							_this.referenceApplyBatchId = resultData.referenceApplyBatchId;
						}
					}
				});
			},
			setBatchDetailCoreArray(applyBatchId) {
				var _this = this;
				var query = {
					applyBatchId: applyBatchId,
				};
				let transferId = this.transferId;
				let option = {
					query: query,
					url: '/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailTreeData',
					successCallback: function(resultData) {
						if (!resultData) {
							return false;
						}
						if (utils.isArrayEmpty(resultData)) {
							return false;
						}
						resultData.sort(function(a, b) {
							return b.id - a.id;
						});
						_this.batchDetailArray = resultData;
						_this.selectTreeNodeFun();
						let tempNode = resultData[0];

						if (transferId) {
							resultData.forEach(function(item) {
								if (transferId == item.id) {
									tempNode = item;
								}
							});
						}
						_this.setCards(tempNode);
						_this.vError = '';
					}
				};
				utils.requestDefault(option);
			},
			clickCard(card) {
				let _this = this;
				let batchDetail = this.batchDetail;
				let type = batchDetail.type;
				card.host = `${this.$config.server.host}`;
				batchDetail.basicApplyBatchType = this.basicApplyBatchType;
				let param = {
					cardJson: JSON.stringify(card),
					batchDetailJson: JSON.stringify(batchDetail),
					homeParam: _this.homeParam
				};
				if (card.bisParent) {
					this.openParentView(param, card, type);
				} else {
					try {
						let childParamCache = JSON.parse(_this.homeParam);
						childParamCache.transferId = batchDetail.id;
						uni.setStorage({
							key: estateCommonUtils.childNavigationCacheKey(batchDetail.id),
							data: childParamCache,
							success: function() {}
						});
						uni.setStorageSync(estateCommonUtils.childNavigationCacheKey(batchDetail.id), childParamCache);
					} catch (e) {
						console.log(e);
					}
					this.openChildView(param, card, type);
				}
			},
			getAssessBasicApplyBatchFileModel(obj) {
				let applyBatchId = this.applyBatchId;
				let dataId = null;
				if (utils.isArray(obj)) {
					dataId = obj[0].id;
				} else {
					dataId = obj.id;
				}
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/bind",
					data: {
						id: dataId,
						planDetailsId: this.planDetailsId,
						applyBatchDetailId:this.batchDetail.id,
						applyBatchId: applyBatchId
					},
					showLoading: true
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '操作成功'
						});
					}
				});
			},
			openParentView(param, card, type) {
				switch (type) {
					case "estate": {
						uni.navigateTo({
							url: "../realEstate/estate/estate" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "building": {
						uni.navigateTo({
							url: "../realEstate/building/building" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "building.monolayer": {
						uni.navigateTo({
							url: "../realEstate/buildingMonolayer/buildingMonolayer" + "?" + utils.parseParam(
								param)
						});
						break;
					}
					case "building.base": {
						uni.navigateTo({
							url: "../realEstate/buildingBase/buildingBase" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "building.difference": {
						uni.navigateTo({
							url: "../realEstate/buildingDifference/buildingDifference" + "?" + utils.parseParam(
								param)
						});
						break;
					}
					case "unit": {
						uni.navigateTo({
							url: "../realEstate/unit/unit" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "unit.residence": {
						uni.navigateTo({
							url: "../realEstate/unitResidence/unitResidence" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "house": {
						uni.navigateTo({
							url: "../realEstate/house/house" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "estate.land": {
						uni.navigateTo({
							url: "../land/estateLand/estateLand" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "house.land": {
						uni.navigateTo({
							url: "../land/houseLand/houseLand" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "estate.land.includ": {
						uni.navigateTo({
							url: "../landorhouse/estateLandInclud/estateLandInclud" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "building.land.includ": {
						uni.navigateTo({
							url: "../landorhouse/buildingLandInclud/buildingLandInclud" + "?" + utils.parseParam(
								param)
						});
						break;
					}
					case "unit.land.includ": {
						uni.navigateTo({
							url: "../landorhouse/unitLandInclud/unitLandInclud" + "?" + utils.parseParam(param)
						});
						break;
					}
					case "house.land.includ": {
						uni.navigateTo({
							url: "../landorhouse/houseLandInclud/houseLandInclud" + "?" + utils.parseParam(param)
						});
						break;
					}
					default: {
						break;
					}
				}
			},
			openChildView: function(param, card, type) {
				let baseName = card.baseName;
				switch (baseName) {
					case "basicEstateStreetInfo": {
						uni.navigateTo({
							url: "../common/basicEstateStreetInfo/basicEstateStreetInfo" + "?" + utils
								.parseParam(param)
						});
						break;
					}
					case "basicEstateNetwork": {
						uni.navigateTo({
							url: "../common/basicEstateNetwork/basicEstateNetwork" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicEstateSupplyEstateSupplyWater": {
						uni.navigateTo({
							url: "../common/basicEstateSupplyEstateSupplyWater/basicEstateSupplyEstateSupplyWater" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicEstateSupplyEstateDrainWater": {
						uni.navigateTo({
							url: "../common/basicEstateSupplyEstateDrainWater/basicEstateSupplyEstateDrainWater" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicEstateSupplyEstateSupplyPower": {
						uni.navigateTo({
							url: "../common/basicEstateSupplyEstateSupplyPower/basicEstateSupplyEstateSupplyPower" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicEstateSupplyEstateSupplyHeating": {
						uni.navigateTo({
							url: "../common/basicEstateSupplyEstateSupplyHeating/basicEstateSupplyEstateSupplyHeating" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicEstateSupplyEstateSupplyGas": {
						uni.navigateTo({
							url: "../common/basicEstateSupplyEstateSupplyGas/basicEstateSupplyEstateSupplyGas" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingEnvironment": {
						uni.navigateTo({
							url: "../common/basicMatchingEnvironment/basicMatchingEnvironment" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicEstateParking": {
						uni.navigateTo({
							url: "../common/basicEstateParking/basicEstateParking" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicMatchingTrafficTransit": {
						uni.navigateTo({
							url: "../common/basicMatchingTrafficTransit/basicMatchingTrafficTransit" + "?" +
								utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingTrafficMetro": {
						uni.navigateTo({
							url: "../common/basicMatchingTrafficMetro/basicMatchingTrafficMetro" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicMatchingTrafficTrafficHub": {
						uni.navigateTo({
							url: "../common/basicMatchingTrafficTrafficHub/basicMatchingTrafficTrafficHub" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingTrafficMainRoad": {
						uni.navigateTo({
							url: "../common/basicMatchingTrafficMainRoad/basicMatchingTrafficMainRoad" + "?" +
								utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingTrafficMainConversion": {
						uni.navigateTo({
							url: "../common/basicMatchingTrafficMainConversion/basicMatchingTrafficMainConversion" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingFinance": {
						uni.navigateTo({
							url: "../common/basicMatchingFinance/basicMatchingFinance" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicMatchingEducation": {
						uni.navigateTo({
							url: "../common/basicMatchingEducation/basicMatchingEducation" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicMatchingMedical": {
						uni.navigateTo({
							url: "../common/basicMatchingMedical/basicMatchingMedical" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicMatchingMaterial": {
						uni.navigateTo({
							url: "../common/basicMatchingMaterial/basicMatchingMaterial" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicMatchingLeisurePlaceMatchingRecreation": {
						uni.navigateTo({
							url: "../common/basicMatchingLeisurePlaceMatchingRecreation/basicMatchingLeisurePlaceMatchingRecreation" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingLeisurePlaceMatchingRestaurant": {
						uni.navigateTo({
							url: "../common/basicMatchingLeisurePlaceMatchingRestaurant/basicMatchingLeisurePlaceMatchingRestaurant" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingLeisurePlaceMatchingMarket": {
						uni.navigateTo({
							url: "../common/basicMatchingLeisurePlaceMatchingMarket/basicMatchingLeisurePlaceMatchingMarket" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicBuildingFunction": {
						uni.navigateTo({
							url: "../common/basicBuildingFunction/basicBuildingFunction" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicBuildingOutfit": {
						uni.navigateTo({
							url: "../common/basicBuildingOutfit/basicBuildingOutfit" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicBuildingMaintenance": {
						uni.navigateTo({
							url: "../common/basicBuildingMaintenance/basicBuildingMaintenance" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicBuildingSurface": {
						uni.navigateTo({
							url: "../common/basicBuildingSurface/basicBuildingSurface" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicBuildingPropertyServiceItem": {
						uni.navigateTo({
							url: "../common/basicBuildingPropertyServiceItem/basicBuildingPropertyServiceItem" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicUnitCommonPart": {
						uni.navigateTo({
							url: "../common/basicUnitCommonPart/basicUnitCommonPart" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicUnitDecorate": {
						uni.navigateTo({
							url: "../common/basicUnitDecorate/basicUnitDecorate" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicUnitElevator": {
						uni.navigateTo({
							url: "../common/basicUnitElevator/basicUnitElevator" + "?" + utils.parseParam(
								param)
						});
						break;
					}

					case "basicUnitHuxing": {
						uni.navigateTo({
							url: "../common/basicUnitHuxing/basicUnitHuxing" + "?" + utils.parseParam(param)
						});
						break;
					}

					case "basicUnitStairs": {
						uni.navigateTo({
							url: "../common/basicUnitStairs/basicUnitStairs" + "?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseRoom": {
						uni.navigateTo({
							url: "../common/basicHouseRoom/basicHouseRoom" + "?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseRoomDecorate": {
						uni.navigateTo({
							url: "../common/basicHouseRoomDecorate/basicHouseRoomDecorate" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicHouseCorollaryEquipment": {
						uni.navigateTo({
							url: "../common/basicHouseCorollaryEquipment/basicHouseCorollaryEquipment" + "?" +
								utils.parseParam(param)
						});
						break;
					}

					case "basicHouseEquipmentHouseNewWind": {
						uni.navigateTo({
							url: "../common/basicHouseEquipmentHouseNewWind/basicHouseEquipmentHouseNewWind" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseEquipmentHouseAirConditioner": {
						uni.navigateTo({
							url: "../common/basicHouseEquipmentHouseAirConditioner/basicHouseEquipmentHouseAirConditioner" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseEquipmentHouseHeating": {
						uni.navigateTo({
							url: "../common/basicHouseEquipmentHouseHeating/basicHouseEquipmentHouseHeating" +
								"?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseFaceStreet": {
						uni.navigateTo({
							url: "../common/basicHouseFaceStreet/basicHouseFaceStreet" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicHouseHuxingPrice": {
						uni.navigateTo({
							url: "../common/basicHouseHuxingPrice/basicHouseHuxingPrice" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicHouseIntelligent": {
						uni.navigateTo({
							url: "../common/basicHouseIntelligent/basicHouseIntelligent" + "?" + utils
								.parseParam(param)
						});
						break;
					}


					case "basicHouseWaterDrain": {
						uni.navigateTo({
							url: "../common/basicHouseWaterDrain/basicHouseWaterDrain" + "?" + utils
								.parseParam(param)
						});
						break;
					}

					case "basicHouseWater": {
						uni.navigateTo({
							url: "../common/basicHouseWater/basicHouseWater" + "?" + utils.parseParam(param)
						});
						break;
					}

					case "basicHouseHuxing": {
						uni.navigateTo({
							url: "../realEstate/house/huxing" + "?" + utils.parseParam(param)
						});
						break;
					}

					case "basicMatchingEnvironmentHouse": {
						uni.navigateTo({
							url: "../common/basicMatchingEnvironmentHouse/basicMatchingEnvironmentHouse" +
								"?" + utils.parseParam(param)
						});
						break;
					}
					case "basicHouseDamagedDegree": {
						uni.navigateTo({
							url: "../common/basicHouseDamagedDegree/basicHouseDamagedDegree" + "?" + utils
								.parseParam(param)
						})
						break;
					}
					case "basicEstateSurveyRecord": {
						uni.navigateTo({
							url: "../common/basicEstateSurveyRecord/basicEstateSurveyRecord" + "?" + utils
								.parseParam(param)
						})
						break;
					}
					case "declareRecord": {
						uni.navigateTo({
							url: "../common/basicHouseDeclareRecord/basicHouseDeclareRecord" + "?" + utils
								.parseParam(param)
						})
						break;
					}
					default: {
						break;
					}
				}
				console.log("card", card);
				console.log("type", type);
				//特殊情况
				switch (type) {
					case "estate": {
						if (baseName == "basicEstateLandState") {
							uni.navigateTo({
								url: "../realEstate/estate/landState" + "?" + utils.parseParam(param)
							});
						}
						break;
					}
					case "house": {
						if (baseName == "basicHouseTrading") {
							uni.navigateTo({
								url: "../realEstate/house/basicHouseTrading/basicHouseTrading" + "?" + utils
									.parseParam(param)
							});
						}
						break;
					}
					case "estate.land": {
						if (baseName == "basicEstateLandState") {
							uni.navigateTo({
								url: "../land/estateLand/estateLandState" + "?" + utils.parseParam(param)
							});
						}

						break;
					}
					case "house.land": {
						if (baseName == "basicHouseTrading") {
							uni.navigateTo({
								url: "../land/houseLand/basicHouseTrading" + "?" + utils.parseParam(param)
							});
						}
						break;
					}
					case "estate.land.includ": {
						// uni.navigateTo({
						// 	url: "../landorhouse/estateLandInclud/estateLandInclud" + "?" + utils.parseParam(param)
						// });
						break;
					}
					case "house.land.includ": {
						// uni.navigateTo({
						// 	url: "../landorhouse/houseLandInclud/houseLandInclud" + "?" + utils.parseParam(param)
						// });
						break;
					}
					default: {
						break;
					}
				}
			},
			showLoading: function() {
				uni.showLoading({
					title: 'loading'
				});

				// #ifdef MP-ALIPAY
				this._showTimer && clearTimeout(this._showTimer);
				this._showTimer = setTimeout(() => {
					this.hideLoading();
				}, 3000)
				// #endif
			},
			hideLoading: function() {
				uni.hideLoading();
			},
			sureBasicHouseCaseSummaryFun(arr) {
				let _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				
				let query = {
					planDetailsId: _this.planDetailsId,
					projectId: _this.projectId,
					sourceApplyBatchNodeId: arr[0].batchDetailId,
					targetApplyBatchId:_this.applyBatchId,
					userAccount: userInfo.userAccount
				};
				this.$myRequest.pmccRequest({
					method: "POST",
					data: query,
					url: "/app.assess/basicApplyBatch/copyBasicApplyBatchChildInfo",
					showLoading: true
				}).then(res => {
					uni.showToast({
						title: '引用成功!',
						icon: "success"
					});
					this.initFun();
				});
			},
			//需要更正,type暂时写死
			addBasicToAlternative() {
				let _this = this;
				var userInfo = _this.$helper.fetchLocalUser();
				let node = this.batchDetail;
				var data = {};
				data.type = 'house';
				data.businessId = node.id;
				data.businessKey = node.type;
				data.creator = userInfo.userAccount;
				data.batchDetailId = node.id;
				this.$myRequest.pmccRequest({
					method: "POST",
					data: data,
					url: "/app.assess/public/addMobileBasicAlternativeCase",
					showLoading: true
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: "添加备选案例成功!",
							duration: 2400
						});
					}
				});
			},
			getItemShowName(name) {
				return utils.getItemShowName(name, 24);
			},
			getItemParentShowName(item, index, list) {
				if (index != list.length - 1) {
					return item.name + "  ->  ";
				} else {
					return item.name;
				}
			}
		}
	}
</script>

<style>
	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 30rpx;
	}

	.demoList {
		text-align: center;
		line-height: 100upx;
	}

	.textV {
		margin: 5rpx 8rpx;
		padding: 0 2rpx;
		background-color: #FFFFFF;
		height: 50rpx;
		line-height: 70rpx;
		text-align: center;
		color: #000000;
		font-size: 26rpx;
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}

	.uni-link {
		word-break: break-all;
	}
</style>
