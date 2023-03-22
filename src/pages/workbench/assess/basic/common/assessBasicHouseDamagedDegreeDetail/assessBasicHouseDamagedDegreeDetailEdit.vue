<template>
	<view style="margin-top: 40px;">
		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">


				<uni-forms-item required name="type" label="类型" label-align="right">
					<assess-picker :dataInput="'type'" :dataList="typeList" :dataValue="formData.type"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>


				<uni-forms-item required name="entityCondition" label="实体状况" label-align="right">
					<assess-picker :dataInput="'entityCondition'" :dataList="entityConditionList"
						:dataValue="formData.entityCondition" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="entityConditionContent" label="状况内容" label-align="right">
					<uni-easyinput type="textarea" v-model="formData.entityConditionContent" placeholder="状况内容" />
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

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				masterData: {},
				id: 0,
				loading: false,
				typeList: [],
				typeData: {},
				entityConditionList: [{
						id: "intact",
						name: "完好"
					},
					{
						id: "basicallyIntact",
						name: "基本完好"
					},
					{
						id: "generalDamage",
						name: "一般损坏"
					},
					{
						id: "seriousDamage",
						name: "严重损坏"
					}
				],
				formData: {
					id: '',
					type: "",
					entityCondition: "",
					entityConditionContent: "",
				},
				rules: {
					type: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					entityCondition: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					entityConditionContent: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
				}
			}
		},
		onLoad(option) {
			let cardObj = {};
			let masterData = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			if (utils.isNotEmptyString(option.masterData)) {
				masterData = JSON.parse(option.masterData);
			}
			let id = 0;
			if (utils.isNotEmptyString(option.id)) {
				id = option.id;
			}
			this.cardObj = cardObj;
			this.masterData = masterData;
			this.id = id;
			this.setServerData(cardObj.getUrl);
			console.log(id, cardObj);
			console.log(masterData);
		},
		onShow() {

		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker
		},
		methods: {
			submit(data) {
				console.log('处理值：', data);
				var _this = this;
				let option = {
					query: data,
					showLoading: true,
					url: _this.cardObj.saveAndUpdateUrl,
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
						damagedDegreeId: _this.cardObj.masterId,
						houseId: _this.masterData.houseId
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
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					case "type": {
						if (!value) {
							break;
						}
						let typeData = {};
						let typeList = this.typeList;
						typeList.forEach(function(item) {
							if (item.id == value) {
								typeData = item;
							}
						});
						this.typeData = typeData;
						break;
					}
					case "entityCondition": {
						if (!value) {
							break;
						}
						let typeData = this.typeData;
						if (typeData) {
							let entityConditionContent = typeData[value];
							formData.entityConditionContent = entityConditionContent;
						}
						break;
					}
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
				let masterData = this.masterData;
				let category = masterData.category;
				if (category) {
					this.$myRequest.pmccRequest({
						url: "/app.assess/basicHouseDamagedDegree/getCacheAssessDataDamagedDegreeListByPid?pid=" +
							category,
						method: "POST",
						urlParam: true,
						data: {
							pid: category
						}
					}).then(res => {
						if (res.data.ret) {
							let data = res.data.data;
							this.typeList = data;
						}
					});
				}
				uni.showToast({
					title: '加载完成'
				});
				uni.hideLoading();
			}
		}
	}
</script>

<style>

</style>
