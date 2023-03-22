<template>
	<view>
		<!-- <view>
			<jm-glance :data="navList" @clickKeyword="navClick"></jm-glance>
		</view> -->
		<view class="uni-padding-wrap uni-common-mt">

			<uni-segmented-control :current="current" :values="damagedDegreeLableTab" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view v-if="navList.length > 0">
			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext">

				<!-- start -->
				<view v-show="basicEstate.id == step">
					<view v-for="(fieldDataObj,index_f) in estateFields">
						<uni-group :title="fieldDataObj.name" mode="card">
							<view v-for="(fieldData,index_f_a) in fieldDataObj.children">
								<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
									<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
										:dataObj="setImgFieldsName(fieldData.fieldName,basicEstate)">
									</common-file-picker>
								</uni-forms-item>
							</view>
						</uni-group>
					</view>


					<uni-group title="定位" mode="card">
						<assess-pick-regions ref="assessPickRegions" :provinceValue="basicEstate.province"
							:cityValue="basicEstate.city" :districtValue="basicEstate.district"
							@getRegion="handleGetRegion">
						</assess-pick-regions>
					</uni-group>

					<uni-group title="经纬度" mode="card">
						<view v-show="!bisDetail">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="useLocalPosition(basicEstate)">使用当前定位</button>
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="chooseLocation(basicEstate)">选择位置</button>
						</view>
						<view v-show="basicEstate.longitude">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="openLocation(basicEstate)">查看位置</button>
						</view>
						<view v-show="bisDetail">
							<view v-show="!basicEstate.longitude">
								<label>
									无标记
								</label>
							</view>
						</view>
					</uni-group>

					<uni-group title="街道附件" mode="card">
						<view v-if="street">
							<uni-forms-item name="estateStreetInfoObj" label="大门图" label-align="right">
								<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
									:dataObj="setImgFieldsName('estateStreetInfoObj',street)">
								</common-file-picker>
							</uni-forms-item>

							<uni-forms-item name="estateStreetInfoDoorplate" label="门牌号" label-align="right">
								<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
									:dataObj="setImgFieldsName('estateStreetInfoDoorplate',street)">
								</common-file-picker>
							</uni-forms-item>
						</view>
					</uni-group>
				</view>
				<!-- end -->


				<!-- start -->
				<view v-show="basicBuilding.id == step ">
					<uni-group title="图片上传" mode="card">
						<view v-for="(fieldData,index_f) in buildingFields">
							<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
								<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
									:dataObj="setImgFieldsName(fieldData.fieldName,basicBuilding)">
								</common-file-picker>
							</uni-forms-item>
						</view>
					</uni-group>
					<uni-group title="经纬度" mode="card">
						<view v-show="!bisDetail">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="useLocalPosition(basicBuilding)">使用当前定位</button>
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="chooseLocation(basicBuilding)">选择位置</button>
						</view>
						<view v-show="basicBuilding.longitude">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="openLocation(basicBuilding)">查看位置</button>
						</view>
						<view v-show="bisDetail">
							<view v-show="!basicBuilding.longitude">
								<label>
									无标记
								</label>
							</view>
						</view>
					</uni-group>
				</view>
				<!-- end -->




				<!-- start -->
				<view v-show="basicUnit.id == step ">
					<uni-group title="图片上传" mode="card">
						<view v-for="(fieldData,index_f) in unitFields">
							<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
								<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
									:dataObj="setImgFieldsName(fieldData.fieldName,basicUnit)">
								</common-file-picker>
							</uni-forms-item>
						</view>
					</uni-group>
					<uni-group title="经纬度" mode="card">
						<view v-show="!bisDetail">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="useLocalPosition(basicUnit)">使用当前定位</button>
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="chooseLocation(basicUnit)">选择位置</button>
						</view>
						<view v-show="basicUnit.longitude">
							<button class="mini-btn" type="primary" size="mini"
								@click.stop="openLocation(basicUnit)">查看位置</button>
						</view>
						<view v-show="bisDetail">
							<view v-show="!basicUnit.longitude">
								<label>
									无标记
								</label>
							</view>
						</view>
					</uni-group>
				</view>
				<!-- end -->


				<!-- start -->
				<view v-show="basicHouse.id == step ">
					<uni-group title="图片上传" mode="card">
						<view v-for="(fieldData,index_f) in houseFields">
							<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
								<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
									:dataObj="setImgFieldsName(fieldData.fieldName,basicHouse)">
								</common-file-picker>
							</uni-forms-item>
						</view>
					</uni-group>

					<uni-group title="户型数据" mode="card">
						<view v-if="huxing">
							<view v-for="(fieldData,index_f) in huxingFields">
								<uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
									<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
										:dataObj="setImgFieldsName(fieldData.fieldName,huxing)">
									</common-file-picker>
								</uni-forms-item>
							</view>

							<view v-show="!bisDetail" style="margin-bottom:50rpx;">
								<button v-for="(roomTypeData,indexHouseRoom) in houseRoomTypeLit" class="mini-btn"
									type="primary" size="mini"
									@click.stop="autoCreateHouseRoomData(roomTypeData,basicHouse)">{{roomTypeData.name}}</button>
							</view>

							<view v-show="!bisDetail">
								<uni-forms-item name="tenementType" label="物业类型" label-align="right">
									<!-- <select-input :dataValue="formData.tenementType" :dataInput="'tenementType'"
										:selectDatas="tenementTypeList" @dataResult="initFormInputSelectResult">
									</select-input> -->
									<assess-picker :dataInput="'tenementType'" :dataList="tenementTypeList"
										:dataValue="formData.tenementType" @dataResult="initFormPickerResult">
									</assess-picker>
								</uni-forms-item>
							</view>

							<button v-show="!bisDetail" class="mini-btn" type="primary" size="mini"
								@click.stop="createHuxingData(huxing)">户型创建</button>
							<assess-basic-huxing-edit-name ref="huxingName" :showInput="false"
								:huxingData="huxing.longData" :tenementType="formData.tenementType"
								@dataResult="huxingAutoResult">
							</assess-basic-huxing-edit-name>

							<view v-show="!bisDetail">
								<view v-show="huxing.longData">
									<button class="mini-btn" type="primary" size="mini"
										@click.stop="createHuxingHouseRoomData(basicHouse)">房间自动创建</button>
								</view>
							</view>

						</view>
					</uni-group>

					<uni-group title="房间图片" mode="card" v-show="houseRoomLit.length > 0">
						<view v-for="(roomData,index) in houseRoomLit">
							<view v-for="(fieldData,index_f) in houseRoomFields">
								<uni-forms-item :name="fieldData.fieldName" :label="roomData.name" label-align="right">
									<common-file-picker :bisImgFlag="bisImgFlag" :bisDeleteFlag="!bisDetail"
										:dataObj="setImgFieldsName(fieldData.fieldName,roomData)">
									</common-file-picker>

									<button v-show="!bisDetail" class="mini-btn" type="primary" size="mini"
										@click.stop="editHouseRoomData(roomData)">编辑</button>
									<button v-show="!bisDetail" class="mini-btn" type="warn" size="mini"
										@click.stop="deleteHouseRoomData(roomData)">删除</button>
								</uni-forms-item>
							</view>
						</view>
					</uni-group>
				</view>
				<!-- end -->
			</uni-forms>
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view style="margin-top:20rpx;">
						<view>
							<uni-title type="h3" align="center" title="附件模型"></uni-title>
						</view>
					</view>
					<view>
						<uni-forms :modelValue="formData" ref="formRoom" validate-trigger="bind"
							err-show-type="undertext" :rules="rules">
							<uni-group mode="card">
								<uni-forms-item required name="name" label="名称" label-align="right">
									<uni-easyinput type="text" v-model="formData.name" placeholder="名称">
									</uni-easyinput>
								</uni-forms-item>
							</uni-group>
						</uni-forms>
					</view>
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<button class="uni-button" size="mini" type="primary" @click.stop="sureFunModel">确定</button>
						<button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
					</view>
				</view>
			</my-ming-pop>
		</view>
		<!-- 高度强制不能删除 删除会有空白 遮住按钮  -->
		<view style="height:70px;">

		</view>
		<view v-show="!bisDetail">
			<view class="goods-carts" v-show="navList.length > 0">
				<uni-goods-nav :options="footBars" :fill="true" :button-group="footButtonGroup" @click="footNavClick"
					@buttonClick="footNavClick" />
			</view>
		</view>

		<!-- <common-map ref="mapCpn"></common-map> -->

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import jmGlance from "@/components/jm-glance/jm-glance.vue";
	import commonFilePicker from '@/components/common-file-picker/file-cpn-picker.vue';
	import assessPickRegions from '@/components/assess/common/regions/assess-pick-regions.vue';
	import selectInput from '@/components/select-Input/select-input-new.vue';
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import assessBasicHuxingEditName from '@/components/assess/assess-basic-huxing-edit-name/assess-basic-huxing-edit-name.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import common_map_cpn from '@/components/common-map/map-cpn.vue';
	import * as Explore from '@/common/assess/Explore.key.js';
	const AssessDBKey = Explore.AssessDBKey;
	const AssessDicKey = Explore.AssessDicKey;

	export default {
		data() {
			return {
				option: {},
				navList: [],
				damagedDegreeLableTab: [],
				standardTables: [AssessDBKey.BasicEstate, AssessDBKey.BasicBuilding,
					AssessDBKey.BasicUnit, AssessDBKey.BasicHouse
				],
				basicEstate: {},
				basicBuilding: {},
				basicUnit: {},
				basicHouse: {},
				estateFields: [],
				buildingFields: [],
				unitFields: [],
				houseFields: [],
				huxingFields: [],
				houseRoomFields: [],
				appKey: "",
				title: "",
				bisDetail: false,
				bisImgFlag: true,
				id: '',
				tenementTypeList: [],
				houseRoomLit: [],
				houseRoomTypeLit: [{
					name: '卧室',
					count: 0
				}, {
					name: '客厅',
					count: 0
				}, {
					name: '卫生间',
					count: 0
				}, {
					name: '厨房',
					count: 0
				}, {
					name: '阳台',
					count: 0
				}, {
					name: '花园',
					count: 0
				}, {
					name: '洗浴间',
					count: 0
				}],
				formData: {
					tenementType: '住宅'
				},
				street: null,
				huxing: null,
				step: 0,
				current: 0,
				activeColor: '#007aff',
				styleType: 'text',
				footBars: [],
				footButtonGroup: [{
					text: '取消',
					icon: 'plus',
					backgroundColor: '#FF0000',
					color: '#fff',
					code: 1
				}, {
					text: '保存',
					icon: 'plus',
					backgroundColor: '#ffa200',
					color: '#fff',
					code: 3
				}, {
					text: '保存并返回',
					icon: 'plus',
					backgroundColor: '#0000ff',
					color: '#fff',
					code: 2
				}],
				formData: {
					name: '',
					id: ''
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		components: {
			"common-map": common_map_cpn,
			"jm-glance": jmGlance,
			"assess-picker": assessPicker,
			"assess-pick-regions": assessPickRegions,
			"select-input": selectInput,
			"assess-basic-huxing-edit-name": assessBasicHuxingEditName,
			"my-ming-pop": myMingPop,
			"common-file-picker": commonFilePicker
		},
		onPullDownRefresh() {
			this.loadNavDataList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			//目的是防止多次点击还在同一页面
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let delta = 0;
			for (let i = 0; i < pages.length; i++) {
				let page = pages[i];
				if (page.route == nowPage.route) {
					delta = i;
					break;
				}
			}
			delta = pages.length - delta;
			console.log("totalSize:" + pages.length + " delta:" + delta + " route:" + nowPage.route);
			uni.navigateBack({
				delta: delta
			});
			return true;
		},
		onLoad(option) {
			if (option.appKey.indexOf("fix") != -1) {
				this.appKey = option.appKey;
			} else {
				this.appKey = 'fix_' + option.appKey;
			}
			this.id = option.id;
			this.title = option.title;
			let bisDetail = option.bisDetail;
			if (bisDetail == 'true') {
				this.bisDetail = true;
			} else if (bisDetail == 'false') {
				this.bisDetail = false;
			}
			this.loadNavDataList();
			uni.setNavigationBarTitle({
				title: option.title + "查勘图片"
			});
			this.option = option;
		},
		methods: {
			//加载导航 数据
			loadNavDataList() {
				let id = this.id;
				let that = this;
				var _this = this;
				let data = this.$data;
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/getBasicApplyBatchFileModelList",
					showLoading: false,
					data: {
						pid: id
					}
				}).then(res => {
					if (res.data.ret) {
						let arr = res.data.data;
						let nameList = [];
						arr.forEach(item => {
							item.title = item.name;
							nameList.push(item.name);
							if (this.standardTables[0] == item.tableName) {
								this.basicEstate = item;
							}
							if (this.standardTables[1] == item.tableName) {
								this.basicBuilding = item;
							}
							if (this.standardTables[2] == item.tableName) {
								this.basicUnit = item;
							}
							if (this.standardTables[3] == item.tableName) {
								this.basicHouse = item;
							}
						});
						this.navList = arr;
						this.damagedDegreeLableTab = nameList;
						this.step = arr[0].id;
						this.$nextTick(() => {
							let cpns = this.$refs.assessPickRegions;
							if (utils.isArrayNotEmpty(cpns)) {
								cpns.forEach(cpn => {
									cpn.init();
								});
							} else {
								if (cpns) {
									cpns.init();
								}
							}

						});
						this.loadChildDataList();
						this.otherDataList();
					}
				});
				//动态获取服务端 字段
				assessCommonUtils.loadAllChildDataDicList("basicEstate", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let newData = that.toTransactTree(resultData);
					console.log(newData);
					// data.estateFields = resultData;
					data.estateFields = newData;
				});
				assessCommonUtils.loadAllChildDataDicList("basicBuilding", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.buildingFields = resultData;
					assessCommonUtils.loadAllChildDataDicList('basicBuildingBase', function(
						resultData) {
						if (!resultData) {
							return false;
						}
						data.buildingFields = data.buildingFields.concat(resultData);
					});
				});

				assessCommonUtils.loadAllChildDataDicList("basicUnit", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.unitFields = resultData;
				});
				assessCommonUtils.loadAllChildDataDicList("houseFilePart", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.houseFields = resultData;
				});
				assessCommonUtils.loadAllChildDataDicList("houseHuxingFilePart", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.huxingFields = resultData;
				});
				assessCommonUtils.loadAllChildDataDicList("houseRoomFilePart", function(
					resultData) {
					if (!resultData) {
						return false;
					}
					data.houseRoomFields = resultData;
				});
			},
			toTransactTree(data) {
				let result = []
				if (!Array.isArray(data)) {
					return result
				}
				data.forEach(item => {
					delete item.children;
				});
				let map = {};
				data.forEach(item => {
					map[item.id] = item;
				});
				data.forEach(item => {
					let parent = map[item.pid];
					if (parent) {
						(parent.children || (parent.children = [])).push(item);
					} else {
						result.push(item);
					}
				});
				return result;
			},
			otherDataList() {
				let data = this.$data;
				var _this = this;
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examineHouseTenementType, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.push({
							id: item.name,
							name: item.name
						});
					});
					// data.tenementTypeList = arr;
					data.tenementTypeList = arr;
				});
			},
			loadChildDataList() {
				let navList = this.navList;
				let standardTables = this.standardTables;
				if (navList.length == 0) {
					return false;
				}
				let streetParent = null;
				let huxingParent = null;
				navList.forEach(item => {
					if (item.tableName == standardTables[0]) {
						streetParent = item;
					}
					if (item.tableName == standardTables[3]) {
						huxingParent = item;
					}
				});
				let option = {
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/getBasicApplyBatchFileModelList",
					data: {}
				};
				if (streetParent) {
					option.data.pid = streetParent.id;
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							let arr = res.data.data;
							this.street = arr[0];
						}
					});
				}
				if (huxingParent) {
					option.data.pid = huxingParent.id;
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							let arr = res.data.data;
							this.huxing = arr[0];
							this.loadHouseRoomList();
						}
					});
				}
			},
			loadHouseRoomList() {
				let navList = this.navList;
				let standardTables = this.standardTables;
				if (navList.length == 0) {
					return false;
				}
				let huxing = this.huxing;
				let huxingParent = null;
				let houseRoomTypeLit = this.houseRoomTypeLit;
				navList.forEach(item => {
					if (item.tableName == standardTables[3]) {
						huxingParent = item;
					}
				});
				let option = {
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/getBasicApplyBatchFileModelList",
					data: {
						pid: huxingParent.id
					}
				};
				this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						let arr = [];
						res.data.data.forEach(item => {
							let flag = true;
							if (huxing) {
								if (huxing.id == item.id) {
									flag = false;
								}
							}
							if (flag) {
								arr.push(item);
							}
						});
						this.houseRoomLit = arr;

						//统计字符串  数量
						houseRoomTypeLit.forEach(houseRoomType => {
							let count = 0;
							res.data.data.forEach(item => {
								if (item.name) {
									if (item.name.indexOf(houseRoomType.name) !== -1) {
										count++;
									}
								}
							});
							houseRoomType.count = count;
						});
					}
				});
			},
			//最底部按钮事件
			footNavClick(control) {
				let index = control.content.code;
				if (index == 1) {
					uni.navigateBack();
				}
				let huxing = this.huxing;
				let navList = this.navList;
				let arr = [];
				navList.forEach(item => {
					arr.push(item);
				});
				if (huxing) {
					arr.push(huxing);
				}
				let formData = JSON.stringify(arr);
				let option = {
					url: "/app.assess/basicApplyBatchFileModel/batchUpdateBasicApplyBatchFileModel",
					method: 'POST',
					data: {
						formData: formData
					},
					showLoading: true
				};
				if (index == 2) {
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							uni.showToast({
								title: '保存成功'
							});
							this.finishFun();
							uni.navigateBack();
						}
					}).catch(err => {
						uni.showModal({
							title: '错误提示',
							content: err.errMsg,
							showCancel: false
						});
					});
				}
				if (index == 3) {
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							uni.showToast({
								title: '保存成功'
							});
							this.finishFun();
						}
					}).catch(err => {
						uni.showModal({
							title: '错误提示',
							content: err.errMsg,
							showCancel: false
						});
					});
				}
			},
			finishFun() {
				let dataId = this.id;
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/finish",
					data: {
						id: dataId
					},
					showLoading: true
				}).then(res => {
					if (res.data.ret) {

					}
				});
			},
			//选择定位
			chooseLocation(data) {
				let huxing = this.huxing;
				let navList = this.navList;
				let arr = [];
				// this.$myRequest.pmccRequest({
				// 	url: "/app.assess/basicApplyBatchFileModel/batchUpdateBasicApplyBatchFileModel",
				// 	method: 'POST',
				// 	data: {
				// 		formData: JSON.stringify(arr)
				// 	}
				// });
				let index = this.getNavIndex(data);
				let option = this.option;
				let redirectTo = "/pages/workbench/assess/basic/surveyExploreFileItem?" + utils.parseParam(option);
				let that = this;
				uni.navigateTo({
					url: "/pages/map/map",
					events: {
						// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						emitParentData: function(res) {
							data.longitude = res.longitude;
							data.latitude = res.latitude;
							navList[index] = data;
							navList.forEach(item => {
								arr.push(item);
							});
							if (huxing) {
								arr.push(huxing);
							}
							that.$myRequest.pmccRequest({
								url: "/app.assess/basicApplyBatchFileModel/batchUpdateBasicApplyBatchFileModel",
								method: 'POST',
								data: {
									formData: JSON.stringify(arr)
								}
							});
							uni.showToast({
								title: '操作成功'
							});
						}
					},
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						let obj = {
							test: 'test data',
							redirectTo: redirectTo
						};
						if (data.longitude) {
							obj.longitude = data.longitude;
						}
						if (data.latitude) {
							obj.latitude = data.latitude;
						}
						res.eventChannel.emit('emitChildData', obj);
					}
				});
			},
			//使用当前位置
			useLocalPosition(data) {
				uni.showToast({
					title: '定位开始',
					duration: 2300
				});
				let index = this.getNavIndex(data);
				let that = this;
				let flagPosition = 1;
				try {
					wx.getLocation({
						type: "gcj02",
						success: function(res) {
							data.longitude = res.longitude;
							data.latitude = res.latitude;
							that.navList[index] = data;
							if (flagPosition == 1) {
								uni.showToast({
									title: '定位完成!',
									duration: 2300
								});
								flagPosition = 0;
							}
						}
					});
				} catch (e) {
					//TODO handle the exception
				}

				uni.getLocation({
					type: 'gcj02',
					// altitude :true,
					geocode: true, //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						data.longitude = res.longitude;
						data.latitude = res.latitude;
						that.navList[index] = data;
						if (flagPosition == 1) {
							uni.showToast({
								title: '定位完成!',
								duration: 2300
							});
							flagPosition = 0;
						}
					}
				});
			},
			//位置查看
			openLocation(data) {
				uni.openLocation({
					longitude: Number(data.longitude),
					latitude: Number(data.latitude),
					name: data.name
				});
			},
			getNavIndex(data) {
				let navList = this.navList;
				let index = 0;
				for (var i = 0; i < navList.length; i++) {
					if (data.id == navList[i].id) {
						index = i;
					}
				}
				return index;
			},
			createHuxingData(huxing) {
				let tenementType = this.formData.tenementType;
				if (!tenementType) {
					uni.showToast({
						title: '物业类型选择才能创建户型数据'
					});
					return false;
				}
				this.$nextTick(() => {
					let cpns = this.$refs.huxingName;
					if (utils.isArrayNotEmpty(cpns)) {
						cpns.forEach(cpn => {
							cpn.openModelFunction(tenementType);
						});
					} else {
						if (cpns) {
							cpns.openModelFunction(tenementType);
						}
					}
				});
			},
			editHouseRoomData(item) {
				this.openModel();
				this.formData.name = item.name;
				this.formData.id = item.id;
			},
			deleteHouseRoomData(item) {
				uni.showModal({
					title: "确定删除当前数据？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							this.$myRequest.pmccRequest({
								method: 'POST',
								url: "/app.assess/basicApplyBatchFileModel/deleteById",
								data: {
									id: item.id
								},
								showLoading: true
							}).then(res => {
								if (res.data.ret) {
									uni.showToast({
										title: '删除成功'
									});
									this.loadHouseRoomList();
								}
							});
						}
					}
				});
			},
			autoCreateHouseRoomData(roomData, data) {
				let userInfo = this.$helper.fetchLocalUser();
				let name = roomData.name + (roomData.count + 1);
				let serverData = {
					pid: data.id,
					name: name,
					creator: userInfo.userAccount,
					tableName: AssessDBKey.BasicHouseRoom
				};
				let option = {
					url: "/app.assess/basicApplyBatchFileModel/addAssessBasicApplyBatchFileModelDto",
					method: 'POST',
					data: serverData,
					showLoading: true
				};
				this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '新增成功'
						});
						this.loadHouseRoomList();
					}
				}).catch(err => {
					uni.showModal({
						title: '错误提示',
						content: err.errMsg,
						showCancel: false
					});
				});
			},
			//自动创建房间
			createHuxingHouseRoomData(data) {
				let huxing = this.huxing;
				let userInfo = this.$helper.fetchLocalUser();
				let option = {
					url: "/app.assess/basicApplyBatchFileModel/autoGenerate",
					method: 'POST',
					data: {
						pid: data.id,
						userAccount: userInfo.userAccount,
						huxingData: huxing.longData
					},
					showLoading: true
				};
				this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '创建成功'
						});
						this.loadHouseRoomList();
					}
				}).catch(err => {
					uni.showModal({
						title: '错误提示',
						content: err.errMsg,
						showCancel: false
					});
				});
			},
			huxingAutoResult(result) {
				let huxing = this.huxing;
				let jsonArray = result.huxingData;
				huxing.name = result.value;
				huxing.longData = JSON.stringify(jsonArray);
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
			},
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;
				console.log(this.formData[dataInput]);
			},
			//行政区域  定位
			handleGetRegion(regions) {
				if (!regions) {
					return false;
				}
				let navList = this.navList;
				let standardTables = this.standardTables;
				let data = null;
				let index = 0;
				navList.forEach(function(item, k) {
					if (item.tableName == standardTables[0]) {
						data = item;
						index = k;
					}
				});
				if (!data) {
					return false;
				}
				if (regions.province) {
					data.province = regions.province;
				}
				if (regions.city) {
					data.city = regions.city;
				}
				if (regions.district) {
					data.district = regions.district;
				}
				this.navList[index] = data;
			},
			//附件参数
			setImgFieldsName(fieldsName, data) {
				let appKey = this.appKey;
				let obj = {
					fieldsName: fieldsName,
					tableId: data.id,
					tableName: data.tableName,
					appKey: appKey
				};
				return obj;
			},
			//选项卡切换事件
			navClick(item) {
				this.step = item.key;
			},
			onClickItem(eObj) {
				let navList = this.navList;
				let current = eObj.currentIndex;
				this.current = current;
				this.step = navList[current].id;
			},
			sureFunModel() {
				// 手动提交表单
				var _this = this;
				//特殊处理一些兼容性东西
				let userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				let data = {
					name: formData.name,
					id: formData.id
				};
				this.$refs.formRoom.validate().then((res) => {
					let option = {
						method: 'POST',
						data: data,
						url: "/app.assess/basicApplyBatchFileModel/updateBasicApplyBatchFileModel",
						showLoading: true
					};
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							this.loadHouseRoomList();
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
			openModel() {
				this.$refs.myMingPop.show();
				this.formData.name = '';
				this.formData.id = '';
			},
			closeModel() {
				this.$refs.myMingPop.close();
				this.formData.name = '';
				this.formData.id = '';
			}
		}
	}
</script>

<style>

</style>
