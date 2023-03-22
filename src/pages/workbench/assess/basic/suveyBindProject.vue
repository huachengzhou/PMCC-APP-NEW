<template>
	<view style="margin-top: 40px;">

		<view>
			<text style="margin-left:15rpx;">
				绑定楼盘
			</text>
			<uni-tag :text="bindData.estateName" type="primary" style="margin-left:45rpx;" />
		</view>

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="" mode="card">
				<uni-forms-item required name="modelPhoneType" label="工作事项" label-align="right">
					<assess-picker :dataInput="'modelPhoneType'" :dataList="modelPhoneTypeList"
						:dataValue="formData.modelPhoneType" @dataResult="initFormPickerResult">
					</assess-picker>
				</uni-forms-item>
				<uni-forms-item required name="taskName" label="任务名称" label-align="right">
					<uni-easyinput  type="text" v-model="formData.taskName" placeholder="名称" />
				</uni-forms-item>
				<uni-forms-item required name="projectId" label="绑定项目" label-align="right">
					<assess-basic-select-project @getResults="getProjectsNew">
					</assess-basic-select-project>
				</uni-forms-item>
				<uni-forms-item required name="executeUserAccountName" label="责任人" label-align="right">
					<employees-picker :currOrg="true"  ref="employees" :multiple="false" :inputValue="userValue" @getResults="getUsers" @getdrawType="getEmployeesDrawType">
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
				
				<!-- <uni-forms-item required name="planDatetimeRange" label="开始时间-结束时间" label-align="right">
					<uni-date-picker @change="timeChange('planDatetimeRange',$event)"
						v-model="formData.planDatetimeRange" type="daterange" rangeSeparator="至" />
				</uni-forms-item> -->
				<uni-forms-item name="planRemarks" label="说明" label-align="right">
					<uni-easyinput type="textarea" autoHeight v-model="formData.planRemarks" placeholder="说明">
					</uni-easyinput>
				</uni-forms-item>

			</uni-group>
		</uni-forms>

		<view class="example">
			<button type="default"  @click.stop="submitForm()" :loading="loading">提交</button>
		</view>

	</view>
</template>

<script>
	import employeesPicker from '@/components/employees-picker/employees-picker.vue';
	import projectPicker from '@/components/project-picker/project-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessBasicSelectProject from '@/components/assess/assess-basic-select-project/assess-basic-select-project.vue';
	import * as utils from "../../../../common/untils.js";
	
	let defaultDate = new Date() ;

	export default {
		data() {
			return {
				firstIndex: 0,
				showpdraw:false,
				showpdraw1:false,
				showedraw:false,
				showedraw1:false,
				planDetailsId: null,
				loading: false,
				userValue: [],
				projectValue: [],
				modelPhoneTypeList: [],
				appKey: "",
				bindData: {},
				formData: {
					id: '',
					taskName: '',
					projectId: '',
					executeUserAccountName: '',
					executeUserAccount: '',
					// planDatetimeRange: '',
					planDatetimeRange: [utils.formatTime(defaultDate, "YYYY-MM-DD"),utils.formatTime(defaultDate, "YYYY-MM-DD")],
					planStartDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planEndDate: utils.formatTime(defaultDate, "YYYY-MM-DD"),
					planRemarks: '',
					modelPhoneType: '',
				},
				typeData: [],
				rules: {
					taskName: {
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
					planDatetimeRange: {
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
					},
					modelPhoneType: {
						rules: [{
							required: true,
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
			"assess-basic-select-project": assessBasicSelectProject
		},
		onLoad(option) {
			this.appKey = option.appKey;
			if (option.dataJson) {
				this.bindData = JSON.parse(option.dataJson);
			}
			this.initListData();
			console.log(this.bindData);
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if (this.showpdraw1) {
				this.$refs.project.closedraw('draw1')
				return true
			}else{
				if(this.showpdraw){
					this.$refs.project.closedraw('draw')
					return true
				}
			}
			
			if (this.showedraw1) {
				this.$refs.employees.closedraw('draw1')
				return true
			}else{
				if(this.showedraw){
					this.$refs.employees.closedraw('draw')
					return true
				}
			}
			
		},
		methods: {
			submit(data) {
				var _this = this;
				let option = {
					url: "/app.assess/basicApplyBatch/bindProjectIdBasicApplyBatchFormDto",
					query: data,
					showLoading: true,
					successCallback: function() {
						uni.showToast({
							title: '绑定项目并且创建项目任务成功',
							success() {
								uni.redirectTo({
									url: "surveyExploreNewIndex"
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
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(res, {
						creator: userInfo.userAccount,
						planStartString: _this.formData.planStartDate,
						planEndString: _this.formData.planEndDate,
						executeUserAccount: _this.formData.executeUserAccount,
						id :_this.bindData.id ,
						type :_this.bindData.type ,
						classify :_this.bindData.classify ,
						buildingStatus :_this.bindData.buildingStatus ,
					});
					delete data.planStartDate;
					delete data.planEndDate;
					console.log(data);
					_this.submit(data);
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
			timeChange(name, times) {
				let planStartDate = times[0];
				let planEndDate = times[1];
				this.formData.planStartDate = planStartDate;
				this.formData.planEndDate = planEndDate;
			},
			bindRangeChange: function(listData, name, id, e) {
				let index = e.detail.value;
				let _this = this;
				index = e.detail.value;
				var item = listData[index];
				_this.formData[name] = item[id];
				_this.changeLoadData(name);
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
			getRangeChange: function(listData, name, value, showName) {
				let tempValue = "";
				listData.forEach((item, index, array) => {
					if (item[name] == value) {
						tempValue = item[showName];
					}
				});
				return tempValue;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name] ;
				switch (name) {
					case "projectId": {

						break;
					}
					case "modelPhoneType" :{
						if(! value) {
							return false;
						}
						let arr = _this.modelPhoneTypeList;
						let vName = "" ;
						arr.forEach(function(item){
							if(item.id == value){
								vName = item.name ;
							}
						}) ;
						if(! _this.formData.name){
							_this.formData.name = vName;
						}
						break;
					}
					default: {
						break;
					}
				}
			},
			initListData() {
				let _this = this;
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getTaskAssessModelPhoneTypeList`,
					query: {},
					notParam: true,
					successCallback: function(list) {
						let arr = [] ;
						list.forEach(function(item){
							arr.push({id:item.key,name:item.value}) ;
						}) ;
						_this.modelPhoneTypeList = arr;
						console.log(arr);
					}
				});
			},
			getEmployeesDrawType(e){
				this.showedraw1 = e.showdraw1;
				this.showedraw = e.showdraw;
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
