<template>
	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="" mode="card">

				
				<uni-forms-item required name="type" label="类型" label-align="right">
					<assess-picker :dataInput="'type'" :dataList="typeData" :dataValue="formData.type"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				
				<uni-forms-item required name="name" label="名称" label-align="right">
					<!-- <uni-easyinput  type="text" v-model="formData.name" placeholder="名称" /> -->
				
					<input-autocomplete class="assess-unit-item__input" v-model="formData.name" placeholder="名称"
						highlightColor="#FF0000" :loadData="loadAutocompleteData" v-on:selectItem="" :debounce="1000">
					</input-autocomplete>
				</uni-forms-item>

				<uni-forms-item v-if="declareRecordFlag" name="declareRecordId" label="权证" label-align="right">
					<assess-picker :dataInput="'declareRecordId'" :dataList="declareRecordIdList"
						:dataValue="formData.declareRecordId" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

			</uni-group>
		</uni-forms>

		<view class="example">
			<button @click.stop="submitForm()" :loading="loading">提交</button>
		</view>

		<!-- 提交信息 -->

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

	export default {
		data() {
			return {
				firstIndex: 0,
				autocompleteStringList: [
					
				],
				pid: 0,
				basicApplyBatchType: '',
				id: 0,
				applyBatchId: 0,
				projectId: 0,
				modelPhoneType: '',
				declareRecordIdList: [],
				planDetailsId: '',
				loading: false,
				homeParam: {},
				formData: {
					id: '',
					name: '',
					type: '',
					declareRecordId: '',
					declareRecordName: '',
				},
				typeData: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入名称'
						}]
					},
					type: {
						rules: [{
							required: true,
							errorMessage: "类型不能为空",
						}]
					},
					declareRecordId: {
						rules: [{
							required: false,
							errorMessage: "数据不能为空",
						}]
					},
					declareRecordName: {
						rules: [{
							required: false,
							errorMessage: "数据不能为空",
						}]
					}
				}
			}
		},
		onLoad(option) {
			if (option.typeData) {
				let typeData = JSON.parse(option.typeData);
				this.typeData = typeData;
			}
			this.applyBatchId = option.applyBatchId;
			this.pid = option.pid;
			this.id = option.id;
			this.planDetailsId = option.planDetailsId;

			this.basicApplyBatchType = option.basicApplyBatchType;
			this.projectId = option.projectId;
			this.modelPhoneType = option.modelPhoneType;

			this.formData.name = option.name;
			this.formData.type = option.type;
			this.formData.declareRecordId = option.declareRecordId;
			this.initListData();
			if (option.homeParam) {
				this.homeParam = JSON.parse(option.homeParam);
			}
			console.log(this.homeParam);
		},
		computed: {
			declareRecordFlag: function() {
				if (utils.isNumber(this.modelPhoneType)) {
					if (this.modelPhoneType == 4) {
						if (this.formData.type == 'house') {
							return true;
						}
						if (this.formData.type == 'house.land') {
							return true;
						}
					}
				}
				return false;
			}
		},
		components: {
			"assess-picker": assessPicker,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				this.$refs.form.validate().then((res) => {
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						declareRecordName: _this.formData.declareRecordName
					});
					data.pid = _this.pid;
					data.id = _this.id;
					data.applyBatchId = _this.applyBatchId;
					if (_this.planDetailsId && _this.planDetailsId != "null") {
						data.planDetailsId = _this.planDetailsId;
					}
					let url = `/app.assess/basicApplyBatchDetail/saveAndUpdateComplete`;
					if (data.id) {
						url = `/app.assess/basicApplyBatchDetail/updateItemData`;
					}
					if(data.declareRecordId && data.declareRecordId == "null") {
						delete data.declareRecordId ;
					}
					data = utils.filterEmptyData(data) ;
					console.log('表单返回得值：', data);
					let option = {
						url: url,
						query: data,
						successCallback: function(resultData) {
							let param = {
								applyBatchId: _this.applyBatchId,
								type: _this.basicApplyBatchType,
								projectId: _this.projectId,
								modelPhoneType: _this.modelPhoneType,
							};
							let query = _this.homeParam;
							query.transferId = resultData.id;
							uni.showToast({
								title: '保存成功',
								success() {
									// uni.redirectTo({
									// 	url: "./surveyExploreHome" + "?" + utils.parseParam(param)
									// });
									uni.redirectTo({
										url: "./surveyExploreHome" + "?" + utils.parseParam(query)
									});
								}
							});
						}
					};
					utils.requestDefault(option);
				});

			},
			initFormPickerResult(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;

				this.$refs.form.setValue(dataInput, value);
				let _this = this;
				if (dataInput == "declareRecordId") {
					let declareRecordIdList = this.declareRecordIdList;
					if (utils.isArrayNotEmpty(declareRecordIdList)) {
						declareRecordIdList.forEach(function(item) {
							if (item.id == value) {
								_this.formData.declareRecordName = item.name;
							}
						});
					}
				}
			},
			initListData() {
				let projectId = this.projectId;
				let _this = this;
				let option = {
					url: "/app.assess/basicApplyBatch/getDeclareRecordDtoListByProjectId?projectId=" + projectId,
					method: 'POST',
					data: {
						projectId: projectId
					},
					urlParam: true
				};
				if (utils.isNumber(projectId)) {
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							let result = res.data.data;
							_this.declareRecordIdList = result;
						}
					});

				}
			},
			loadAutocompleteData(value) {
				var availableTags = [];
				let id = this.id;
				let formData = this.formData;
				let type = formData.type;
				let typeList = this.typeData;
				if (id) {
					return Promise.resolve([]);
				}
				if (!type) {
					return Promise.resolve([]);
				}

				if (type && type.indexOf('building') >= 0) {
					var a = "栋",
						b = "幢",
						c = "楼";
					availableTags.push(value + a);
					availableTags.push(value + b);
					availableTags.push(value + c);
				} else if (type && type.indexOf('unit') >= 0) {
					var d = "单元",
						e = "区";
					availableTags.push(value + d);
					availableTags.push(value + e);
				} else {
					if (type && typeList) {
						let name = "";
						typeList.forEach(function(obj) {
							if (obj.id == type) {
								name = obj.name;
							}
						});
						if (name) {
							// availableTags.push(value + name);
						}
					}
				}
				return Promise.resolve(availableTags);
			}
		}

	}
</script>

<style>
	.example {
		padding: 0 11px 11px;
		color: #a5a5a5;
		line-height: 100rpx;
		flex: 0 0 100rpx;
	}


	
</style>
