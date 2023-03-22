<template>
	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="" mode="card">

				<uni-forms-item required name="startTime" label="计划开始时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.startTime"
						v-on:change="setFormValue('startTime',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item required name="endTime" label="计划结束时间" label-align="right">
					<uni-datetime-picker type="date" :value="formData.endTime"
						v-on:change="setFormValue('endTime',$event)"></uni-datetime-picker>
				</uni-forms-item>

				<uni-forms-item required name="userNames" label="勘察人员" label-align="right">
					<employees-picker :currOrg="true" ref="employees" :multiple="true" :inputValue="userValue"
						@getResults="getUsers">
					</employees-picker>
				</uni-forms-item>

				<uni-forms-item required name="actualHours" label="实际工时" label-align="right">
					<uni-easyinput :maxlength="30" type="digit" v-model="formData.actualHours" placeholder="实际工时">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="taskRemarks" label="成果描述" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.taskRemarks" placeholder="成果描述">
					</uni-easyinput>
				</uni-forms-item>

			</uni-group>
		</uni-forms>

		<view class="example">
			<button @click.stop="submitForm()">提交</button>
		</view>

	</view>
</template>

<script>
	import employeesPicker from '@/components/employees-picker/employees-picker.vue';
	import projectPicker from '@/components/project-picker/project-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import * as utils from "@/common/untils.js";

	let defaultDate = new Date();

	export default {
		data() {
			return {
				eventChannel: null,
				userValue: [],
				projectInfo: {},
				appKey:'',
				formData: {
					id: '',
					projectId: '',
					planDetailsId: '',
					startTime: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					endTime: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					userAccounts: '',
					userNames: '',
					processInsId: '',
					status: '',
					created: '',
					creator: '',
					taskSubmitUser: '',
					taskSubmitTime: '',
					taskRemarks: '',
					actualHours: '',
					submitCount: '',
					fileIds: '',
					formData: '',

				},
				rules: {
					startTime: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					endTime: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					},
					userNames: {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					}
				}
			}
		},
		components: {
			"assess-picker": assessPicker,
			"employees-picker": employeesPicker,
		},
		onLoad(option) {
			let eventChannel = null;
			// #ifdef APP-NVUE
			eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
			// #endif
			// #ifndef APP-NVUE
			eventChannel = this.getOpenerEventChannel();
			// #endif
			this.eventChannel = eventChannel;
			let that = this;
			eventChannel.on('emitChildData', function(data) {
				that.projectInfo = data.data;
				that.appKey = data.appKey;
				console.log(data)
			});
		},
		methods: {
			async submit(data) {
				var _this = this;
				let query = {
					formData: JSON.stringify(data)
				};
				let option = {
					url: "/app.costs.project/costsRpcProjectSceneSurveyPlan/saveSceneSurveyPlanDto",
					method: 'POST',
					showLoading: true,
					data: query,
				};
				await this.$myRequest.pmccRequest(option).then(res => {
					uni.showToast({
						title: '保存成功',
						success() {
							console.log(res);
							let timer = setTimeout(() => {
								uni.navigateBack({
									delta: 1,
									success: function(res) {
										uni.$emit('updateBackData',{appKey:_this.appKey}) ;
									}
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
				let projectInfo = this.projectInfo;
				this.$refs.form.validate().then((res) => {
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(_this.formData, {
						planDetailsId: '0',
						creator: userInfo.userAccount,
						projectId: projectInfo.id,
						formData:{}
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
			},
			getUsers(users) {
				this.userValue = users;
				let userAccount = [];
				let userName = [];
				if (utils.isArray(users) && users.length >= 1) {
					users.forEach(item => {
						userName.push(item.userName);
						userAccount.push(item.userAccount);
					});
				}
				this.formData.userAccounts = userAccount.join(",");
				this.formData.userNames = userName.join(",");
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
