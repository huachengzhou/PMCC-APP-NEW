<template>
	<view>
		<view>
			<data-cnpm-model @submit="submit" ref="houseModel" :dataId="houseData.id" :bisCenter="bisCenter"
				:controlParam="controlParam" :bisDetail="bisDetail">
				<uni-group title="附件" mode="card" slot="foot">
					<uni-forms-item name="declareRealtyLandCert_declareRealtyLandCert_HouseCert_FileId" label="房产证"
						label-align="right">
						<common-image-picker ref="houseFileCPN"
							:dataObj="setImgFieldsName('declareRealtyLandCert_declareRealtyLandCert_HouseCert_FileId')">
						</common-image-picker>
					</uni-forms-item>
				</uni-group>
			</data-cnpm-model>
		</view>
	</view>
</template>

<script>
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as utils from "@/common/untils.js";
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import houseModel from '@/components/assess/declare/houseModel.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';

	var declareCommon = declareCommonUtils.declareCommon;
	const AssessDBKey = Explore.AssessDBKey;
	export default {
		data() {
			return {
				projectInfo: {},
				phase: {},
				data: {},
				houseData: {},
				projectPlanDetails: {},
				bisCenter: false,
				query: {}
			}
		},
		components: {
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
			"data-cnpm-model": houseModel
		},
		computed: {
			controlParam: function() {
				let data = this.data;
				let obj = {
					enable: declareCommon.branchData,
					autoInitNumber:data.autoInitNumber
				};
				let projectPlanDetails = this.projectPlanDetails;
				if (projectPlanDetails) {
					obj.planDetailsId = projectPlanDetails.id;
				}
				return obj;
			},
			bisDetail: function() {
				let bisDetail = true;
				let query = this.query;
				let dataType = utils.getType(query.bisDetail);
				if (dataType == 'boolean') {
					bisDetail = query.bisDetail;
				}
				return bisDetail;
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
					return false;
				}
			}
			this.phase = query.phase;
			this.projectInfo = query.projectInfo;
			this.projectPlanDetails = query.projectPlanDetails;
			this.query = query;
			this.data = query.data;
			let data = query.data;
			if (this.bisDetail) {
				uni.setNavigationBarTitle({
					title: "申报土地证-房产证详情"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "申报土地证-房产证"
				});
			}
			if (data.centerId) {
				let _this = this;
				let option = {
					url: "/app.assess/declare/declareBuildEngineeringAndEquipmentCenter/getById?id=" + data
						.centerId,
					query: {
						id: data.centerId
					},
					notParam: true,
					successCallback: function(resultData) {
						if (resultData) {
							console.log(resultData);
							if (resultData.houseId) {
								_this.houseData = {
									id: resultData.houseId
								};
							}
							_this.$nextTick(() => {
								//模态框 设置数据,并且初始化
								_this.$refs.houseModel.setServerData();
								_this.$refs.houseFileCPN.initFun();
							});
						}
					}
				};
				utils.requestDefault(option);
			} else {
				uni.showToast({
					title: "数据异常!",
					icon: "success",
					duration: 1000
				});
			}
			console.log(query);
		},
		methods: {
			submit(option) {
				let data = this.data;
				let houseData = option.data;
				let commitFlag = option.commitFlag;
				let query = this.query;
				if (data.centerId) {
					let _this = this;
					let option = {
						url: "/app.assess/declare/declareBuildEngineeringAndEquipmentCenter/saveAndUpdate",
						query: {
							id: data.centerId,
							houseId: houseData.id
						},
						successCallback: function(resultData) {
							if (resultData) {
								console.log(resultData);
							}
						}
					};
					utils.requestDefault(option);
				}
				console.log(houseData);
				if (commitFlag) {
					//正式提交 回到列表页,这里需要判定是回到申请页还是详情页
					if (query.bisDetail) {
						uni.redirectTo({
							url: "../taskDeclareDetail?json=" + JSON.stringify(query)
						});
					} else {
						uni.redirectTo({
							url: "../taskDeclareApply?json=" + JSON.stringify(query)
						});
					}
				} else {
					//临时提交(当作草稿处理)
					this.houseData = houseData;
				}
			},
			setImgFieldsName(fieldsName) {
				let tableId = 0;
				let projectInfo = this.projectInfo;
				if (this.houseData.id) {
					tableId = this.houseData.id;
				}
				let obj = {
					fieldsName: fieldsName,
					tableId: tableId,
					tableName: AssessDBKey.DeclareRealtyHouseCert,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
