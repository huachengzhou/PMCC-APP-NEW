<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="基本信息" mode="card">
				<uni-forms-item required name="certificateNumber" label="证书编号" label-align="right">
					<uni-easyinput type="text" v-model="formData.certificateNumber" placeholder="证书编号" />
				</uni-forms-item>
				<uni-forms-item required name="salesUnit" label="售房单位" label-align="right">
					<uni-easyinput type="text" v-model="formData.salesUnit" placeholder="售房单位" />
				</uni-forms-item>
				<uni-forms-item required name="legalRepresentative" label="法定代表人" label-align="right">
					<uni-easyinput type="text" v-model="formData.legalRepresentative" placeholder="法定代表人" />
				</uni-forms-item>
				<uni-forms-item name="beLocated" label="项目坐落" label-align="right">
					<uni-easyinput type="text" v-model="formData.beLocated" placeholder="项目坐落" />
				</uni-forms-item>
				<uni-forms-item name="name" label="项目名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.name" placeholder="项目名称" />
				</uni-forms-item>
				<uni-forms-item name="preSaleScope" label="预售范围" label-align="right">
					<uni-easyinput type="text" v-model="formData.preSaleScope" placeholder="预售范围" />
				</uni-forms-item>
				<uni-forms-item name="preSaleArea" label="预售面积(数字)" label-align="right">
					<uni-easyinput type="digit" v-model="formData.preSaleArea" placeholder="预售面积(数字)" />
				</uni-forms-item>
				<uni-forms-item name="housingUse" label="房屋用途" label-align="right">
					<uni-easyinput type="text" v-model="formData.housingUse" placeholder="房屋用途" />
				</uni-forms-item>
				<uni-forms-item name="buildingStructure" label="建筑结构" label-align="right">
					<uni-easyinput type="text" v-model="formData.buildingStructure" placeholder="建筑结构" />
				</uni-forms-item>
				<uni-forms-item name="preSaleSupervisionInformation" label="预售款监管信息" label-align="right">
					<uni-easyinput type="text" v-model="formData.preSaleSupervisionInformation" placeholder="预售款监管信息" />
				</uni-forms-item>
				<uni-forms-item name="issuingOrgan" label="发证机关" label-align="right">
					<uni-easyinput type="text" v-model="formData.issuingOrgan" placeholder="发证机关" />
				</uni-forms-item>
				<uni-forms-item name="date" label="日期" label-align="right">
					<uni-datetime-picker type="date" :value="formData.date" v-on:change="setFormValue('date',$event)">
					</uni-datetime-picker>
				</uni-forms-item>
				<uni-forms-item name="mortgageSituation" label="在建工程抵押情况" label-align="right">
					<uni-easyinput type="text" v-model="formData.mortgageSituation" placeholder="在建工程抵押情况" />
				</uni-forms-item>
				<uni-forms-item name="remark" label="备注" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="备注">
					</uni-easyinput>
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
		':certificateNumber',
		':salesUnit',
		':legalRepresentative',
		'beLocated',
		'name',
		'preSaleScope',
		'preSaleArea',
		'housingUse',
		'buildingStructure',
		'preSaleSupervisionInformation',
		'issuingOrgan',
		'date',
		'mortgageSituation',
		'remark',
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
					masterId: "",
					planDetailsId: "",
					certificateNumber: "",
					salesUnit: "",
					legalRepresentative: "",
					beLocated: "",
					name: "",
					preSaleScope: "",
					preSaleArea: "",
					housingUse: "",
					buildingStructure: "",
					preSaleSupervisionInformation: "",
					issuingOrgan: "",
					date: "",
					mortgageSituation: "",
					remark: "",
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
					title: "商品房预售许可证修改"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "商品房预售许可证添加"
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
					url: "/app.assess/declare/declarePreSalePermit/saveAndUpdate",
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
					url: "/app.assess/declare/declarePreSalePermit/getById?" + utils.parseParam(query),
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
