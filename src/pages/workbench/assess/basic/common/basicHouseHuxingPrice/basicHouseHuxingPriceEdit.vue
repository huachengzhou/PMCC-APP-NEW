<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">

			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="houseNumber" label="房号" label-align="right">
					<uni-easyinput type="text" v-model="formData.houseNumber" placeholder="房号" />
				</uni-forms-item>

				<uni-forms-item required name="floor" label="楼层" label-align="right">
					<uni-easyinput type="text" v-model="formData.floor" placeholder="楼层" />
				</uni-forms-item>

				<uni-forms-item required name="seat" label="坐落" label-align="right">
					<uni-easyinput type="text" v-model="formData.seat" placeholder="坐落" />
				</uni-forms-item>

				<uni-forms-item required name="houseShape" label="房间形状" label-align="right">
					<select-input :dataValue="formData.houseShape" :dataInput="'houseShape'"
						:selectDatas="houseShapeList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item name="shapeRemark" label="形状说明" label-align="right">
					<uni-easyinput type="text" v-model="formData.shapeRemark" placeholder="形状说明" />
				</uni-forms-item>

				<uni-forms-item required name="area" label="使用面积(m²)" label-align="right">
					<uni-easyinput type="text" v-model="formData.area" placeholder="使用面积(m²)" />
				</uni-forms-item>

				<uni-forms-item required name="layerHeight" label="层高(m)" label-align="right">
					<select-input :dataValue="formData.layerHeight" :dataInput="'layerHeight'"
						:selectDatas="layerHeightList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>


				<uni-forms-item name="specialFactors" label="特殊因素" label-align="right">
					<uni-easyinput type="text" v-model="formData.specialFactors" placeholder="特殊因素" />
				</uni-forms-item>


			</uni-group>

			<uni-group title="住宅、办公" mode="card" v-if="houseRoomFlag == 'houseRoomResidence'">
				<uni-forms-item name="aeration" label="通风" label-align="right">
					<select-input :dataValue="formData.aeration" :dataInput="'aeration'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="lighting" label="采光" label-align="right">
					<select-input :dataValue="formData.lighting" :dataInput="'lighting'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="sunshine" label="日照" label-align="right">
					<select-input :dataValue="formData.sunshine" :dataInput="'sunshine'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="soundInsulation" label="隔音" label-align="right">
					<select-input :dataValue="formData.soundInsulation" :dataInput="'soundInsulation'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="length" label="长度" label-align="right">
					<uni-easyinput type="text" v-model="formData.length" placeholder="长度" />
				</uni-forms-item>
				<uni-forms-item name="width" label="宽度" label-align="right">
					<uni-easyinput type="text" v-model="formData.width" placeholder="宽度" />
				</uni-forms-item>
			</uni-group>

			<uni-group title="商铺、商场、车位" mode="card" v-if="houseRoomFlag == 'houseRoomStore'">
				<uni-forms-item name="opening" label="开间" label-align="right">
					<uni-easyinput type="text" v-model="formData.opening" placeholder="开间" />
				</uni-forms-item>

				<uni-forms-item name="depth" label="进深" label-align="right">
					<uni-easyinput type="text" v-model="formData.depth" placeholder="进深" />
				</uni-forms-item>

				<uni-forms-item name="adjacentPositionDescribe" label="相邻位置描述" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.adjacentPositionDescribe"
						placeholder="相邻位置描述">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="orientation" label="方位" label-align="right">
					<assess-picker :dataInput="'orientation'" :dataList="orientationList"
						:dataValue="formData.orientation" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

			</uni-group>


			<uni-group title="酒店餐饮" mode="card" v-if="houseRoomFlag == 'houseRoomHotel'">
				<uni-forms-item name="aeration" label="通风" label-align="right">
					<select-input :dataValue="formData.aeration" :dataInput="'aeration'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="lighting" label="采光" label-align="right">
					<select-input :dataValue="formData.lighting" :dataInput="'lighting'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="length" label="长度" label-align="right">
					<uni-easyinput type="text" v-model="formData.length" placeholder="长度" />
				</uni-forms-item>
				<uni-forms-item name="width" label="宽度" label-align="right">
					<uni-easyinput type="text" v-model="formData.width" placeholder="宽度" />
				</uni-forms-item>
			</uni-group>

			<uni-group title="生产" mode="card" v-if="houseRoomFlag == 'houseRoomProduction'">
				<uni-forms-item name="spanLength" label="跨长" label-align="right">
					<uni-easyinput type="text" v-model="formData.spanLength" placeholder="跨长" />
				</uni-forms-item>

				<uni-forms-item name="spanNum" label="跨数" label-align="right">
					<uni-easyinput type="text" v-model="formData.spanNum" placeholder="跨数" />
				</uni-forms-item>

				<uni-forms-item name="aeration" label="通风" label-align="right">
					<select-input :dataValue="formData.aeration" :dataInput="'aeration'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>
				<uni-forms-item name="lighting" label="采光" label-align="right">
					<select-input :dataValue="formData.lighting" :dataInput="'lighting'"
						:selectDatas="houseRoomcompareList" @dataResult="initFormInputSelectResult">
					</select-input>
				</uni-forms-item>

				<uni-forms-item name="maxSpan" label="最大跨距" label-align="right">
					<uni-easyinput type="text" v-model="formData.maxSpan" placeholder="最大跨距" />
				</uni-forms-item>

				<uni-forms-item name="minSpan" label="最小跨距" label-align="right">
					<uni-easyinput type="text" v-model="formData.minSpan" placeholder="最小跨距" />
				</uni-forms-item>

				<uni-forms-item name="standardSpan" label="标准跨距" label-align="right">
					<uni-easyinput type="text" v-model="formData.standardSpan" placeholder="标准跨距" />
				</uni-forms-item>

			</uni-group>

			<uni-group title="仓储" mode="card" v-if="houseRoomFlag == 'houseRoomStorage'">

				<uni-forms-item name="standardMeasure" label="计量标准" label-align="right">
					<assess-picker :dataInput="'standardMeasure'" :dataList="standardMeasureList"
						:dataValue="formData.standardMeasure" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item name="storageRequest" label="仓储要求" label-align="right">
					<assess-picker :dataInput="'storageRequest'" :dataList="storageRequestList"
						:dataValue="formData.storageRequest" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>



			</uni-group>



		</uni-forms>

		<assess-submit-button @submit="submitForm" :loading="loading">
			提交
		</assess-submit-button>
	</view>
</template>

<script>
	import * as utils from "../../../../../../common/untils.js";
	import * as estateUtils from "../../../../../../common/assess/basic/examine.estate.js";
	import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";
	import * as Explore from '../../../../../../common/assess/Explore.key.js';


	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	const houseShapeList = ['矩形',
		'正方形',
		'L型',
		'方形弧形组合',
		'规则多边形',
		'不规则'
	];


	export default {
		data() {
			return {
				cardObj: null,
				id: 0,
				huxingId: 0,
				loading: false,
				houseRoomFlag: '',
				houseShapeList: houseShapeList,
				nameList: [],
				orientationList: [],
				standardMeasureList: [],
				storageRequestList: [],
				layerHeightList :[2.8 , 3, 3.2 , 2.6 ,4.2 , 4.8,6 ,7.2] ,
				houseRoomcompareList: [] ,
				formData: {
					id: '',
					houseNumber: "",
					floor: "",
					seat: "",
					depth: "",
					opening: "",
					houseShape: "",
					shapeRemark: "",
					area: "",
					layerHeight: "",
					specialFactors: "",
					aeration: "",
					lighting: "",
					sunshine: "",
					soundInsulation: "",
					length: "",
					width: "",
					adjacentPositionDescribe: "",
					orientation: "",
					standardMeasure: "",
					storageRequest: "",
					spanLength: "",
					spanNum: "",
					maxSpan: "",
					minSpan: "",
					standardSpan: "",
				},
				rules: {
					houseNumber: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					floor: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					seat: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					houseShape: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					shapeRemark: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					area: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					layerHeight: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},

					specialFactors: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					aeration: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					lighting: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					sunshine: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					soundInsulation: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					length: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					width: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
				}
			}
		},
		onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let id = 0;
			if (utils.isNotEmptyString(option.id)) {
				id = option.id;
			}
			this.cardObj = cardObj;
			this.id = id;
			this.setServerData(cardObj.getUrl);
		},
		onShow() {

		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker,
			"select-input": selectInput,
		},
		methods: {
			submit(data) {
				console.log('处理值：', data);
				var _this = this;
				let option = {
					query: data,
					url: _this.cardObj.saveAndUpdateUrl,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '保存成功',
							success() {
								uni.setStorageSync("isDoRefresh", 1);
								uni.navigateBack({
									delta: 1
								});
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitForm() {
				// 手动提交表单
				var _this = this;
				//特殊处理一些兼容性东西

				let userInfo = _this.$helper.fetchLocalUser();
				this.$refs.form.validate().then((res) => {
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						id: _this.formData.id,
						huxingId: _this.huxingId,
						houseId: _this.cardObj.masterId,
					});
					console.log('表单返回得值：', data);
					_this.submit(utils.filterEmptyData(data));
				});
			},
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput);
				this.$refs.form.setValue(dataInput, value);
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
				this.$refs.form.setValue(dataInput, value);
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				switch (name) {
					default: {
						break;
					}
				}
			},
			setServerData(url) {
				let _this = this;
				let formData = this.formData;
				let query = {
					id: _this.id
				};
				if (query.id == 0 || query.id == undefined || query.id == '' || query.id == 'undefined') {
					_this.initListData();
					return false;
				}
				let option = {
					query: query,
					notParam: true,
					url: url + "?" + utils.parseParam(query),
					successCallback: function(resultData) {
						if (!resultData) {
							return false;
						}
						var keys = Object.keys(formData);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							var value = formData[key];
							formData[key] = resultData[key];
						}
						_this.formData = formData;
						_this.initListData();
						console.log(formData);
						console.log(resultData);
					}
				};
				utils.requestDefault(option);
			},
			initListData() {
				let data = this.$data;
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let _this = this;
				this.setServerTab();
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_names, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [];
					resultData.forEach(function(item) {
						arr.push(item.name);
					});
					_this.nameList = arr;
				});
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_orientation, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					_this.orientationList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_standard_measure, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					_this.standardMeasureList = resultData;
				});

				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_storage_request, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					_this.storageRequestList = resultData;
				});
				
				estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.examine_house_room_status, function(
					resultData) {
					if (!resultData) {
						return false;
					}
					let arr = [] ;
					resultData.forEach((item,index,array)=>{
					    arr.push(item.name);
					});
					_this.houseRoomcompareList = arr;
				});


				uni.showToast({
					title: '加载完成'
				});
				uni.hideLoading();
			},
			setServerTab() {
				let masterId = this.cardObj.masterId;
				this.$myRequest.pmccRequest({
					method: "POST",
					urlParam: true,
					data: {
						id: masterId
					},
					url: "/app.assess/basicHouseHuxing/getHuxingByHouseId?id=" + masterId
				}).then(res => {
					if (res.data.ret) {
						let data = res.data.data;
						let tenementType = data.tenementType;
						this.huxingId = data.id;
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
					if (res.data.ret) {
						let flag = res.data.data;
						let basedata = this.$data;
						basedata.houseRoomFlag = flag;
					}
				});
			}

		}
	}
</script>

<style>

</style>
