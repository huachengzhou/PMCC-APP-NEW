<template>
	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="" mode="card">

				<uni-forms-item required name="name" label="楼盘名称" label-align="right">
					<view v-if="formData.id">
						<uni-easyinput type="text" v-model="formData.name" placeholder="楼盘名称" />
					</view>
					<view v-else>
						<input-autocomplete class="assess-unit-item__input" v-model="formData.name" placeholder="名称"
							highlightColor="#FF0000" :loadData="loadAutocompleteData" v-on:selectItem=""
							:debounce="1000">
						</input-autocomplete>
					</view>
				</uni-forms-item>

				<uni-forms-item required name="classify" label="大类" label-align="right">
					<assess-picker :dataInput="'classify'" :dataList="classifyList" :dataValue="formData.classify"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="type" label="类型" label-align="right">
					<assess-picker :dataInput="'type'" :dataList="typeList" :dataValue="formData.type"
						@dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<uni-forms-item required name="buildingStatus" label="建筑状态" label-align="right">
					<assess-picker :dataInput="'buildingStatus'" :dataList="buildingStatusList"
						:dataValue="formData.buildingStatus" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>

				<view v-show=" ! formData.id">
					<uni-forms-item name="bindFlag" label="是否一并绑定项目">
						<switch :checked="bindFlag" @change="bindProjectFun('bindFlag', $event.detail.value)" />
					</uni-forms-item>
				</view>


				<view v-show="bindFlag">
					<uni-forms-item required name="modelPhoneType" label="工作事项" label-align="right">
						<assess-picker :dataInput="'modelPhoneType'" :dataList="modelPhoneTypeList"
							:dataValue="formData.modelPhoneType" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>
					<uni-forms-item required name="taskName" label="任务名称" label-align="right">
						<uni-easyinput type="text" v-model="formData.taskName" placeholder="名称" />
					</uni-forms-item>
					<uni-forms-item required name="projectId" label="绑定项目" label-align="right">
						<assess-basic-select-project ref="myProject" @getResults="getProjectsNew">
						</assess-basic-select-project>
					</uni-forms-item>
					
					<uni-forms-item required name="executeUserAccountName" label="责任人" label-align="right">
						<employees-picker :currOrg="true" ref="employees" :multiple="false" :inputValue="userValue"
							@getResults="getUsers">
						</employees-picker>
					</uni-forms-item>

					<uni-forms-item required name="planStartDate" label="开始时间" label-align="right">
						<uni-datetime-picker type="date" :value="formData.planStartDate"
							v-on:change="setFormValue('planStartDate',$event)"></uni-datetime-picker>
					</uni-forms-item>

					<uni-forms-item required name="planEndDate" label="结束时间" label-align="right">
						<uni-datetime-picker type="date" :value="formData.planEndDate"
							v-on:change="setFormValue('planEndDate',$event)"></uni-datetime-picker>
					</uni-forms-item>

					<uni-forms-item name="planRemarks" label="说明" label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="formData.planRemarks" placeholder="说明">
						</uni-easyinput>
					</uni-forms-item>
				</view>

			</uni-group>
		</uni-forms>

		<view class="example">
			<button @click.stop="submitForm()" :loading="loading">提交</button>
		</view>

	</view>
</template>

<script>
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
	import employeesPicker from '@/components/employees-picker/employees-picker.vue';
	import projectPicker from '@/components/project-picker/project-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessBasicSelectProject from '@/components/assess/assess-basic-select-project/assess-basic-select-project.vue';
	import * as utils from "@/common/untils.js";

	let defaultDate = new Date();

	export default {
		data() {
			return {
				firstIndex: 0,
				planDetailsId: null,
				loading: false,
				userValue: [],
				modelPhoneTypeList: [],
				appKey: "",
				classifyList: [],
				typeList: [],
				buildingStatusList: [],
				dataItemList: [],
				bindFlag: false,
				formData: {
					id: '',
					name: '',
					type: '',
					buildingStatus: '',
					classify: '',
					projectId: '',
					taskName: '',
					executeUserAccountName: '',
					executeUserAccount: '',
					planStartDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planEndDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planRemarks: '',
					modelPhoneType: ''

				},
				typeData: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					type: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					buildingStatus: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					classify: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					projectId: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					taskName: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					executeUserAccount: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					planRemarks: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					},
					modelPhoneType: {
						rules: [{
							required: false,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		components: {
			"employees-picker": employeesPicker,
			"project-picker": projectPicker,
			"assess-picker": assessPicker,
			"assess-basic-select-project": assessBasicSelectProject,
			"input-autocomplete": inputAutocomplete
		},
		onLoad(option) {
			this.appKey = option.appKey;
			let formData = this.formData;
			let _this = this;
			if (option.dataJson) {
				let data = JSON.parse(option.dataJson);
				formData.id = data.id;
				formData.name = data.estateName;
				formData.type = data.type;
				formData.buildingStatus = data.buildingStatus;
				formData.classify = data.classify;
				_this.formData = formData;
				console.log(_this.formData);
			}
			if (this.formData.id) {
				uni.setNavigationBarTitle({
					title: "案例修改"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "案例添加"
				});
			}
			this.initServerData();
		},
		methods: {
			async submit(data) {
				var _this = this;
				let query = {
					formData: JSON.stringify(data)
				};
				let option = {
					url: "/app.assess/basicApplyBatch/saveBasicApplyBatchBaseFormDto",
					method: 'POST',
					showLoading: true,
					data: data,
				};
				await this.$myRequest.pmccRequest(option).then(res => {
					uni.showToast({
						title: '保存成功',
						success() {
							console.log(res) ;
							let timer = setTimeout(() => {
								uni.redirectTo({
									url: "surveyExploreNewIndex"
								});
							}, 1000);
							timer = null;
						}
					});
				}).catch(err => {
					uni.showModal({
						title: '错误提示',
						content: err.errMsg,
						showCancel: false
					});
				});
			},
			submitForm(form) {
				// 手动提交表单
				var _this = this;
				this.$refs.form.validate().then((res) => {
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(_this.formData, {
						creator: userInfo.userAccount
					});
					// if (_this.formData.id) {
					// 	data.id = _this.formData.id;
					// }
					console.log(data);
					_this.submit(data);
				});
			},
			initServerData() {
				let _this = this;
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getFormClassifyAllList`,
					query: {},
					notParam: true,
					successCallback: function(classifyList) {
						_this.classifyList = classifyList;
					}
				});
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getExamineFormTypeList`,
					query: {},
					notParam: true,
					successCallback: function(typeList) {
						let arr = [];
						typeList.forEach(function(typeData) {
							arr.push({
								id: Number(typeData.key),
								name: typeData.value
							});
						});
						_this.typeList = arr;
					}
				});
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getBuildingStatusList`,
					query: {},
					notParam: true,
					successCallback: function(buildingStatusList) {
						_this.buildingStatusList = buildingStatusList;
					}
				});
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getTaskAssessModelPhoneTypeList`,
					query: {},
					notParam: true,
					successCallback: function(list) {
						let arr = [];
						list.forEach(function(item) {
							arr.push({
								id: item.key,
								name: item.value
							});
						});
						_this.modelPhoneTypeList = arr;
						console.log(arr);
					}
				});
			},
			getProjectsNew(projects) {
				let project = null;
				if (utils.isArray(projects) && projects.length >= 1) {
					project = projects[0];
				} else {
					project = projects;
				}
				if (!project) {
					return false;
				}
				this.formData.projectId = project.id;
				this.changeLoadData("projectId");
			},
			getUsers(users) {
				let user = null;
				if (utils.isArray(users) && users.length >= 1) {
					user = users[0];
				} else {
					user = users;
				}
				if (!user) {
					return false;
				}
				this.formData.executeUserAccount = user.userAccount;
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
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					case "modelPhoneType": {
						if (!value) {
							return false;
						}
						let arr = _this.modelPhoneTypeList;
						let vName = "";
						arr.forEach(function(item) {
							if (item.id == value) {
								vName = item.name;
							}
						});
						if (!_this.formData.name) {
							_this.formData.name = vName;
						}
						break;
					}
					default: {
						break;
					}
				}
			},
			async loadAutocompleteData(name) {
				var availableTags = [];
				let option = {
					data: {
						estateName: name
					},
					method: "POST",
					url: "/app.assess/basicApplyBatch/inputAutocomplete"
				};
				if (!name) {
					return Promise.resolve(availableTags);
				}
				await this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						this.dataItemList = res.data.data;
						this.dataItemList.forEach(function(item) {
							let label = item.estateName + "(" + item.creatorName + ")";
							availableTags.push(label);
						});
					}
				});
				return Promise.resolve(availableTags);
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
			},
			bindProjectFun(name, value) {
				this[name] = value;
				let rules = this.rules;
				let arr = ["taskName", "projectId", "planEndDate", "planStartDate", "modelPhoneType",
					"executeUserAccount"
				];
				for (let i = 0; i < arr.length; i++) {
					let field = arr[i];
					rules[field] = {
						rules: [{
							required: value,
							errorMessage: '请输入数据'
						}]
					};
					if (!value) {
						this.formData[field] = '' ;
						this.userValue = [] ;
					}
				}
				this.$nextTick(() => {
					this.$refs.myProject.clear();
					this.$refs.form.setRules(this.rules)
				});
				console.log(this.formData);
			}
		}

	}
</script>

<style>
	.example-default-box {
		border: 1px solid #E5E5E5;
		border-radius: 1px;
		padding: 0px 0px;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		line-height: 75rpx;
		cursor: pointer;
		/* #endif */
	}

	.example {
		padding: 0 11px 11px;
		color: #a5a5a5;
		line-height: 100rpx;
		flex: 0 0 100rpx;
	}
</style>
