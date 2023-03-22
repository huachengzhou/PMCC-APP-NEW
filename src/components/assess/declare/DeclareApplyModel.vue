<template>
	<view>
		<view>
			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext">
				<uni-group mode="card">

					<view v-for="(fileInfo,index) in fieldNamesList">
						<uni-forms-item :name="fileInfo.fieldsName" :label="fileInfo.title" label-align="right">
							<common-image-picker ref="fileCpn" :dataObj="setImgFieldsName(fileInfo.fieldsName)">
							</common-image-picker>
						</uni-forms-item>
					</view>

					<uni-forms-item name="assessArea" label="上次评估面积" label-align="right">
						<uni-easyinput type="digit" v-model="formData.assessArea" placeholder="上次评估面积" />
					</uni-forms-item>

					<uni-forms-item name="assessMoney" label="上次评估金额" label-align="right">
						<uni-easyinput type="digit" v-model="formData.assessMoney" placeholder="上次评估金额" />
					</uni-forms-item>

					<uni-forms-item name="dateLimit" label="上次评估基准日" label-align="right">
						<uni-datetime-picker type="date" :value="formData.dateLimit"
							v-on:change="setFormValue('dateLimit',$event)"></uni-datetime-picker>
					</uni-forms-item>

					<uni-forms-item name="client" label="上次委托单位" label-align="right">
						<uni-easyinput type="text" v-model="formData.client" placeholder="上次委托单位" />
					</uni-forms-item>

					<uni-forms-item name="assessOrganization" label="上次评估机构" label-align="right">
						<uni-easyinput type="text" v-model="formData.assessOrganization" placeholder="上次评估机构" />
					</uni-forms-item>

					<uni-forms-item name="remark" label="备注" label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="备注">
						</uni-easyinput>
					</uni-forms-item>
				</uni-group>
				
				<uni-group mode="card" v-show="formData.id">
					<apply-detail-cpn ref="applyDetailCpn" :projectInfo="projectInfo" :declareId="formData.id">
					</apply-detail-cpn>
				</uni-group>
				
			</uni-forms>
		</view>
		<view>

		</view>
	</view>
</template>

<script>
	import DeclareApplyDetailModel from '@/components/assess/declare/DeclareApplyDetailModel.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
	import * as utils from "@/common/untils.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";
	import * as Explore from '@/common/assess/Explore.key.js';

	var AssessUploadKey = Explore.AssessUploadKey;
	var AssessDBKey = Explore.AssessDBKey;

	var declareCommon = declareCommonUtils.declareCommon;
	export default {
		props: {
			projectInfo: {
				type: [Object],
				default: function() {
					return {};
				}
			},
			projectPlanDetails: {
				type: [Object],
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {
				formData: {
					id: "",
					remark: "",
					assessOrganization: "",
					client: "",
					dateLimit: "",
					assessMoney: "",
					assessArea: "",
				},
				fieldNamesList: [{
					fieldsName: AssessUploadKey.ASSESS_REPORT_Enclosure,
					title: "评估报告（附件）"
				}],
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
		components: {
			"common-image-picker": commonImagePicker,
			"common-file-picker": commonFilePicker,
			"apply-detail-cpn": DeclareApplyDetailModel
		},
		methods: {
			getData() {
				let userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				formData.creator = userInfo.userAccount ;
				let data = {
					data: formData,
					itemList: []
				};
				return data;
			},
			initListData: function() {
				let data = this.$data;
				var _this = this;
				this.$nextTick(() => {
					this.$refs.applyDetailCpn.loadDataList() ;
					let files = this.$refs.fileCpn;
					files.forEach(cpn => {
						cpn.initFun() ;
					}) ;
				});
			},
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
			},
			setServerData: function() {
				let _this = this;
				let formData = this.formData;
				let projectPlanDetails = this.projectPlanDetails;
				let userInfo = this.$helper.fetchLocalUser();
				let option = {
					query: {
						planDetailsId: projectPlanDetails.id,
						projectId: projectPlanDetails.projectId,
						userAccount: userInfo.userAccount
					},
					url: "/app.assess/declare/declareApply/initAssessRpcDeclareApplyDto",
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
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
				this.$refs.form.setValue(dataInput, value);
			},
			setImgFieldsName(fieldsName) {
				let projectInfo = this.projectInfo;
				let obj = {
					fieldsName: fieldsName,
					tableId: projectInfo.id,
					tableName: AssessDBKey.ProjectInfo,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>
</style>
