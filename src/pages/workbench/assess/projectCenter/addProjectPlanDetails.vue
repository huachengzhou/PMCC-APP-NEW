<template>
	<view style="margin-top: 40px;">

		<view>
			<text style="margin-left:15rpx;">
				工作事项
			</text>
			<uni-tag :text="phase.projectPhaseName" type="primary" style="margin-left:45rpx;" />
		</view>

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="" mode="card">

				<uni-forms-item required name="projectPhaseName" label="任务名称" label-align="right">
					<uni-easyinput type="text" v-model="formData.projectPhaseName" placeholder="名称" />
				</uni-forms-item>

				<uni-forms-item required name="executeUserAccountName" label="责任人" label-align="right">
					<employees-picker :currOrg="true" ref="employees" :multiple="false" :inputValue="userValue"
						@getResults="getUsers">
					</employees-picker>
				</uni-forms-item>

				<uni-forms-item name="planStartDate" label="开始时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.planStartDate"
						v-on:change="setFormValue('planStartDate',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item name="planEndDate" label="结束时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.planEndDate"
						v-on:change="setFormValue('planEndDate',$event)"></uni-datetime-picker>
				</uni-forms-item>


				<uni-forms-item name="planRemarks" label="说明" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.planRemarks" placeholder="说明">
					</uni-easyinput>
				</uni-forms-item>

			</uni-group>
		</uni-forms>

		<view class="example">
			<button type="default" @click.stop="submitForm()" :loading="loading">提交</button>
		</view>

	</view>
</template>

<script>
	import employeesPicker from '@/components/employees-picker/employees-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import * as utils from "@/common/untils.js";

	let defaultDate = new Date();

	export default {
		data() {
			return {
				loading: false,
				projectInfo: {},
				phase: {},
				userValue: [],
				formData: {
					projectPhaseName: '',
					projectId: '',
					projectPhaseId: '',
					projectWorkStageId: '',
					planId: '',
					executeUserAccountName: '',
					executeUserAccount: '',
					planStartDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planEndDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planRemarks: '',
					creator: ''
				},
				rules: {
					projectPhaseName: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					planStartDate: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					planEndDate: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					executeUserAccount: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					planRemarks: {
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
			"assess-picker": assessPicker
		},
		onLoad(option) {
			let query = JSON.parse(option.json);
			this.phase = query.phase;
			this.projectInfo = query.projectInfo;
		},
		methods: {
			submit(data) {
				var _this = this;
				console.log(data) ;
				let option = {
					url: "/app.assess/public/addPlanDetailsTask",
					query: data,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '创建项目任务成功',
							success() {
								let params = {
									phase: _this.phase,
									projectInfo: _this.projectInfo
								};
								uni.redirectTo({
									url: "./projectPlanDetails?json="+JSON.stringify(params)
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
				if (!this.formData.executeUserAccount) {
					uni.showToast({
						title: "责任人未选择!",
						icon: "error",
						duration: 3000
					});
					return false;
				}
				this.$refs.form.validate().then((res) => {
					let userInfo = _this.$helper.fetchLocalUser();
					_this.formData.creator = userInfo.userAccount;
					_this.formData.projectId = _this.projectInfo.id;
					_this.formData.planId = _this.phase.planId;
					_this.formData.projectWorkStageId = _this.phase.workStageId;
					_this.formData.projectPhaseId = _this.phase.id;
					_this.submit(_this.formData);
				});
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
				this.formData.executeUserAccountName = user.userName;
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
					case "projectId": {
						break;
					}
					default: {
						break;
					}
				}
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
			}
		}

	}
</script>

<style>
</style>
