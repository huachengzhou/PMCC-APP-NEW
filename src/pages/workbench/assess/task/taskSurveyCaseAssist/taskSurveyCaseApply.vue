<template>
	<view>

		<view style="margin-top:2px;">
			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
				:rules="rules">
				<uni-group title="表单基础信息" mode="card">

					<uni-forms-item required name="estateName" label="楼盘名称" label-align="right">
						<uni-easyinput type="text" v-model="formData.estateName" placeholder="楼盘名称" />
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

					<uni-forms-item required name="bisReal" label="可进案例库" label-align="right">
						<assess-picker :dataInput="'bisReal'" :dataList="bisRealList"
							:dataValue="formData.bisReal" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>
				</uni-group>
			</uni-forms>
		</view>

		<uni-group title="操作" mode="card">
			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<view v-show="formData.id"><button type="primary" size="mini"
						@click.stop="updateApplyBatchForm()">修改</button></view>
				<view v-show="!formData.id"><button type="primary" size="mini"
						@click.stop="initApplyBatchForm()">初始化</button></view>
				<view v-show="formData.id"><button type="primary" size="mini"
						@click.stop="itemNodeHandle()">{{homeHandleTitle}}</button></view>
			</view>
		</uni-group>
		
		<uni-group mode="card" v-show="formData.id">
			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
		
		
				<view v-show="formData.id">
					<button type="primary" size="mini" @click.stop="$refs.assess_basic_alternative_modal.onFocus()">
						备选案例
						<!-- <uni-icons color="'#d7d7dc'" type="smallcircle" size="15"></uni-icons> -->
					</button>
				</view>
		
				<view v-show="formData.id">
					<button type="primary" size="mini" @click.stop="$refs.assess_basic_case_storehouse.onFocus()">
						案例库案例
						<!-- <uni-icons color="'#d7d7dc'" type="home" size="15"></uni-icons> -->
					</button>
				</view>
		
		
				<view v-show="formData.id">
					<button type="primary" size="mini" @click.stop="$refs.assessBasicApplyBatchFileModel.onFocus()">
						查勘图片
						<!-- <uni-icons color="'#d7d7dc'" type="images" size="15"></uni-icons> -->
					</button>
				</view>
		
		
			</view>
		</uni-group>
		
		<view>
			
			<assess-basic-file-model ref="assessBasicApplyBatchFileModel"
				@getResults="getAssessBasicApplyBatchFileModel">
			</assess-basic-file-model>
			
			<assess-basic-case-storehouse :dataValue="formData.id" :projectPlanDetails="projectPlanDetails"
				ref="assess_basic_case_storehouse" @getResults="loadInitFun">
			</assess-basic-case-storehouse>
			
			<assess-basic-alternative-modal ref="assess_basic_alternative_modal"
				@getResults="sureBasicHouseCaseSummaryFun">
			</assess-basic-alternative-modal>
			
			<approve-cpn ref="approve_cpn" :projectPlanDetails="projectPlanDetails" @sumitApproveFun="sumitApproveFun"></approve-cpn>
		</view>

	</view>
</template>

<script>
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as utils from "@/common/untils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';
	import custom_paging from '@/components/assess/common/custom-paging/custom-paging.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import approveCpn from '@/components/assess/common/approve-cpn/approve-project-cpn.vue';
	
	import assess_basic_file_model from '@/components/assess/assess-basic-file-model/assess-basic-file-model.vue';
	import assess_basic_case_storehouse from '@/components/assess/basic/assess-basic-case-storehouse/assess-basic-case-storehouse.vue';
	import assess_basic_alternative_modal from '@/components/assess/basic/assess-basic-alternative-modal/assess-basic-alternative-modal.vue';

	const AssessDBKey = Explore.AssessDBKey;

	export default {
		components: {
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-image-picker": commonImagePicker,
			"approve-cpn": approveCpn,
			"assess-basic-file-model": assess_basic_file_model,
			"assess-basic-case-storehouse": assess_basic_case_storehouse,
			"assess-basic-alternative-modal": assess_basic_alternative_modal,
			"custom-paging": custom_paging
		},
		data() {
			return {
				homeHandleTitle:estateCommonUtils.homeHandleTitle,
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				classifyList: [],
				typeList: [],
				buildingStatusList: [],
				bisRealList: [{id:true,name:'是'},{id:false,name:'否'}],
				formData: {
					id: '',
					referenceApplyBatchId: '',
					estateName: '',
					type: '',
					buildingStatus: '',
					classify: '',
					bisReal:false
				},
				rules: {
					estateName: {
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
					}
				}
			}
		},
		onLoad(option) {
			let query = {};
			try {
				query = JSON.parse(option.json);
			} catch (e) {
				try {
					query = uni.getStorageSync(option.keyCacheId);
				} catch (e) {
					uni.showToast({
						title: "参数错误",
						icon: "error",
						duration: 2000
					});
					return false ;
				}
			}
			this.phase = query.phase;
			this.projectInfo = query.projectInfo;
			this.projectPlanDetails = query.projectPlanDetails;
			//第一次加载
			this.loadInitFun();
		},
		onShow() {
			this.$nextTick(() => {
				//第一次加载
				this.loadInitFun();
			});
		},
		onNavigationBarButtonTap() {

		},
		onPullDownRefresh() {
			uni.showToast({
				title: "刷新中",
				icon: "loading",
				duration: 2000
			});
			//下拉刷新
			this.loadInitFun();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			loadInitFun() {
				let _this = this;
				let projectPlanDetails = this.projectPlanDetails;
				//  加载  页面数据
				this.$nextTick(() => {
					this.$refs.approve_cpn.initAutoGetServerData();
				});
				this.$myRequest.pmccRequest({
					data: {
						planDetailsId: projectPlanDetails.id
					},
					method: "POST",
					urlParam: true,
					url: "/app.assess/basicApplyBatch/getBasicApplyBatchDtoByPlanDetailsId?planDetailsId=" +
						projectPlanDetails.id
				}).then(res => {
					if (res.data.ret) {
						_this.formData = res.data.data;
					}
					console.log(_this.formData);
				});
				utils.requestDefault({
					url: `/app.assess/basicApplyBatch/getFormClassifyHouseList`,
					query: {},
					notParam: true,
					successCallback: function(classifyList) {
						_this.classifyList = classifyList;
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
			},
			//进入 节点页面
			itemNodeHandle() {
				let projectPlanDetails = this.projectPlanDetails;
				let projectInfo = this.projectInfo;
				let formData = this.formData;
				let query = {
					projectId: projectInfo.id,
					type: formData.type,
					applyBatchId: formData.id,
					modelPhoneType: formData.modelPhoneType,
					planDetailsId: projectPlanDetails.id
				};
				uni.navigateTo({
					url: "../../basic/home/surveyExploreHome?" + utils.parseParam(query)
				});
			},
			updateApplyBatchForm() {
				var _this = this;
				this.$refs.form.validate().then((res) => {
					console.log(_this.formData);
					this.$myRequest.pmccRequest({
						showLoading: true,
						data: _this.formData,
						url: "/app.assess/basicApplyBatch/updateBasicApplyBatch",
						method: "POST"
					}).then(res => {
						if (res.data.ret) {
							this.formData = res.data.data;
							uni.showToast({
								title: '修改成功',
								icon: "success"
							});
						}
					});
				});
			},
			initApplyBatchForm() {
				var _this = this;
				let projectPlanDetails = this.projectPlanDetails;
				let projectInfo = this.projectInfo;
				this.$refs.form.validate().then((res) => {
					let userInfo = _this.$helper.fetchLocalUser();
					let data = utils.assignObj(_this.formData, {
						creator: userInfo.userAccount,
						projectId: projectInfo.id,
						planDetailsId: projectPlanDetails.id
					});
					this.$myRequest.pmccRequest({
						showLoading: true,
						data: data,
						url: "/app.assess/basicApplyBatch/initBasicApplyBatchInfo",
						method: "POST"
					}).then(res => {
						if (res.data.ret) {
							this.formData = res.data.data;
							uni.showToast({
								title: '初始化成功!',
								icon: "success"
							});
						}
					});
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
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					default: {
						break;
					}
				}
			},
			sureBasicHouseCaseSummaryFun(arr) {
				let _this = this;
				let projectPlanDetails = this.projectPlanDetails;
				let projectInfo = this.projectInfo;
				var userInfo = _this.$helper.fetchLocalUser();
				let targetApplyBatchId = this.formData.id;
				let query = {
					planDetailsId: projectPlanDetails.id,
					projectId: projectInfo.id,
					sourceApplyBatchNodeId: arr[0].batchDetailId,
					targetApplyBatchId:targetApplyBatchId,
					userAccount: userInfo.userAccount
				};
				this.$myRequest.pmccRequest({
					method: "POST",
					data: query,
					url: "/app.assess/basicApplyBatch/copyBasicApplyBatchChildInfo",
					showLoading: true
				}).then(res => {
					uni.showToast({
						title: '引用成功!',
						icon: "success"
					});
					this.loadInitFun();
				});
			},
			getAssessBasicApplyBatchFileModel(obj) {
				let applyBatchId = this.formData.id;
				let dataId = null;
				if (utils.isArray(obj)) {
					dataId = obj[0].id;
				} else {
					dataId = obj.id;
				}
				this.$myRequest.pmccRequest({
					method: 'POST',
					url: "/app.assess/basicApplyBatchFileModel/bind",
					data: {
						id: dataId,
						applyBatchId: applyBatchId
					},
					showLoading: true
				}).then(res => {
					if (res.data.ret) {
						uni.showToast({
							title: '操作成功'
						});
					}
				});
			},
			sumitApproveFun(code) {
				if (code == 1) {
					uni.showToast({
						title: '取消成功!',
						success() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				} else {
					uni.showToast({
						title: '提交成功!',
						success() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				}
			}
		}

	}
</script>

<style>

</style>
