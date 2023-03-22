<template>
	<view>

		<view style="margin-top:2px;">
			<uni-group title="表单基础信息" mode="card">
				<view class="evan-form-show">
					<evan-form :hide-required-asterisk="false" ref="forms">
						<evan-form-item label="楼盘名称：" prop="estateName">
							<view class="form-input" placeholder-class="form-input-placeholder">
								{{dataInfo.estateName}}
							</view>
						</evan-form-item>

						<evan-form-item label="大类：" prop="classifyName">
							<view class="form-input" placeholder-class="form-input-placeholder">
								{{dataInfo.classifyName}}
							</view>
						</evan-form-item>

						<evan-form-item label="类型：" prop="typeName">
							<view class="form-input" placeholder-class="form-input-placeholder">
								{{dataInfo.typeName}}
							</view>
						</evan-form-item>

						<evan-form-item label="建筑状态：" prop="buildingStatusName">
							<view class="form-input" placeholder-class="form-input-placeholder">
								{{dataInfo.buildingStatusName}}
							</view>
						</evan-form-item>
					</evan-form>
				</view>
			</uni-group>
		</view>

		<uni-group title="操作" mode="card">
			<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
				<view v-show="formData.id"><button type="primary" size="mini"
						@click.stop="itemNodeHandle()">{{homeHandleTitle}}</button></view>
			</view>
		</uni-group>
		<view>
			<details-cpn :projectPlanDetails="projectPlanDetails"></details-cpn>
		</view>

	</view>
</template>

<script>
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as utils from "@/common/untils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';
	import custom_paging from '@/components/assess/common/custom-paging/custom-paging.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import detailsCpn from '@/components/assess/common/details-cpn/details-cpn.vue';
	import evanFormItem from '@/components/evan-form-item/evan-form-item.vue';
	import evanForm from '@/components/evan-form/evan-form.vue';

	const AssessDBKey = Explore.AssessDBKey;

	export default {
		components: {
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-image-picker": commonImagePicker,
			"details-cpn": detailsCpn,
			"evan-form-item": evanFormItem,
			"evan-form": evanForm,
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
				formData: {
					id: '',
					estateName: '',
					type: '',
					buildingStatus: '',
					classify: ''
				},
				rules: {}
			}
		},
		computed: {
			dataInfo: function() {
				let formData = this.formData;
				let typeList = this.typeList;
				let buildingStatusList = this.buildingStatusList;
				let classifyList = this.classifyList;
				let info = {
					typeName: '',
					buildingStatusName: '',
					classifyName: '',
					estateName: formData.estateName
				};
				if (classifyList) {
					classifyList.forEach(item => {
						if (formData.classify == item.id) {
							info.classifyName = item.name;
						}
					});
				}
				if (typeList) {
					typeList.forEach(item => {
						if (formData.type == item.id) {
							info.typeName = item.name;
						}
					});
				}
				if (buildingStatusList) {
					buildingStatusList.forEach(item => {
						if (formData.buildingStatus == item.id) {
							info.buildingStatusName = item.name;
						}
					});
				}
				return info;
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
						this.formData = res.data.data;
					}
					console.log(this.formData);
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
			}
		}

	}
</script>

<style >
	@import url("@/components/evan-form/myStyle.css");
</style>
