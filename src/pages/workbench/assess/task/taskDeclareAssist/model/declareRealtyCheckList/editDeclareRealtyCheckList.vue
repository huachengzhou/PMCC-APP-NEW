<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item name="district" label="所在区" label-align="right">
					<uni-easyinput type="text" v-model="formData.district" placeholder="所在区" />
				</uni-forms-item>
				<uni-forms-item name="houseNumber" label="门牌号" label-align="right">
					<uni-easyinput type="text" v-model="formData.houseNumber" placeholder="门牌号" />
				</uni-forms-item>
				<uni-forms-item required name="streetNumber" label="街道" label-align="right">
					<uni-easyinput type="text" v-model="formData.streetNumber" placeholder="街道" />
				</uni-forms-item>
				<uni-forms-item name="attachedNumber" label="附号" label-align="right">
					<uni-easyinput type="text" v-model="formData.attachedNumber" placeholder="附号" />
				</uni-forms-item>
				<uni-forms-item required name="buildingNumber" label="栋号" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingNumber" placeholder="栋号" />
				</uni-forms-item>
				<uni-forms-item name="unit" label="单元" label-align="right">
					<uni-easyinput type="text" v-model="formData.unit" placeholder="单元" />
				</uni-forms-item>
				<uni-forms-item name="floor" label="楼层" label-align="right">
					<uni-easyinput type="text" v-model="formData.floor" placeholder="楼层" />
				</uni-forms-item>
				<uni-forms-item name="roomNumber" label="房号" label-align="right">
					<uni-easyinput type="text" v-model="formData.roomNumber" placeholder="房号" />
				</uni-forms-item>
				<uni-forms-item name="certUse" label="用途" label-align="right">
					<uni-easyinput type="text" v-model="formData.certUse" placeholder="用途" />
				</uni-forms-item>
				<uni-forms-item name="floorArea" label="房屋建筑面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.floorArea" placeholder="房屋建筑面积" />
				</uni-forms-item>
				<uni-forms-item name="apportionmentArea" label="分摊面积" label-align="right">
					<uni-easyinput type="digit" v-model="formData.apportionmentArea" placeholder="分摊面积" />
				</uni-forms-item>
				<uni-forms-item name="housingStructure" label="结构" label-align="right">
					<uni-easyinput type="text" v-model="formData.housingStructure" placeholder="结构" />
				</uni-forms-item>
			</uni-group>
		</uni-forms>

		<view class="uni-flex uni-row " style="width: 100%;">
			<view style="-webkit-flex: 1;flex: 1;" class="assessbutton">
				<button @click.stop="submitForm()">
					提交
				</button>
			</view>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as Explore from '@/common/assess/Explore.key.js';

	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';

	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

	const AssessDicKey = Explore.AssessDicKey;
	const AssessDBKey = Explore.AssessDBKey;

	let ruleField = [
		'district',
		'houseNumber',
		':streetNumber',
		'attachedNumber',
		':buildingNumber',
		'unit',
		'floor',
		'roomNumber',
		'certUse',
		'floorArea',
		'apportionmentArea',
		'housingStructure',
	];

	let rules = utils.getRules(ruleField);
	let formDataFields = utils.getFormDataField(ruleField);
	Object.assign(formDataFields, {});

	export default {
		data() {
			return {
				data: {},
				formData: {
					id: "",
					marsterId: "",
					planDetailsId: "",
					district: "",
					houseNumber: "",
					streetNumber: "",
					attachedNumber: "",
					buildingNumber: "",
					unit: "",
					floor: "",
					roomNumber: "",
					certUse: "",
					floorArea: "",
					apportionmentArea: "",
					housingStructure: "",
				},
				rules: rules
			};
		},
		computed: {},
		watch: {
			formData: {
				handler(newValue, oldValue) {
					let data = this.$data;
					var _this = this;
				},
				deep: true //true 深度监听
			}
		},
		onLoad(option) {
			let data = JSON.parse(option.json);
			this.data = data;
			this.formData = utils.assignObj(this.formData, data);
			this.setServerData();
			if (this.data.id) {
				uni.setNavigationBarTitle({
					title: "不动产清单修改"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "不动产清单添加"
				});
			}
		},
		onShow() {

		},
		onReady() {
			// 需要在onReady中设置规则
			// this.$refs.form.setRules(this.rules);
		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"common-image-picker": commonImagePicker,
			"select-input": selectInput,
			"common-file-picker": commonFilePicker,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			submit(data) {
				var _this = this;
				let option = {
					url: "/app.assess/declare/declareRealtyCheckList/saveAndUpdate",
					showLoading: true,
					query: data,
					successCallback: function(resultData) {
						uni.showToast({
							title: '保存成功',
							success() {
								uni.navigateBack({
									delta: 1
								});
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				this.$refs.form.validate().then((res) => {
					//特殊处理一些兼容性东西
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(_this.formData, {
						creator: userInfo.userAccount,
					});
					_this.submit(data, true);
				});
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
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
			setServerData: function() {
				let _this = this;
				let data = this.data;
				let formData = this.formData;
				let query = {
					id: data.id
				};
				if (!data.id) {
					return false;
				}
				let option = {
					query: query,
					notParam: true,
					url: "/app.assess/declare/declareRealtyCheckList/getById?" + utils.parseParam(query),
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
					}
				};
				utils.requestDefault(option);
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
			}
		}
	}
</script>

<style>

</style>
