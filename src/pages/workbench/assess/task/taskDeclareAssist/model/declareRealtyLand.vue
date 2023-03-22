<template>
	<view>
		<view>
			<data-cnpm-model @submit="submit" ref="declareRealtyLandModel" :dataId="landData.id" :bisCenter="bisCenter"
				:controlParam="controlParam" :bisDetail="bisDetail">
				<uni-group title="附件" mode="card" slot="foot">
					<uni-forms-item name="declareRealtyHouseCert_land_FileId" label="土地证" label-align="right">
						<common-image-picker ref="landFileCPN"
							:dataObj="setImgFieldsName('declareRealtyHouseCert_land_FileId')">
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
	import declareRealtyLandModel from '@/components/assess/declare/declareRealtyLandModel.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';

	var declareCommon = declareCommonUtils.declareCommon;
	const AssessDBKey = Explore.AssessDBKey;
	export default {
		data() {
			return {
				projectInfo: {},
				phase: {},
				data: {},
				landData: {},
				projectPlanDetails: {},
				bisCenter: false,
				query: {}
			}
		},
		components: {
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
			"data-cnpm-model": declareRealtyLandModel
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
					title: "申报房产证-土地证详情"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "申报房产证-土地证"
				});
			}
			var itemLand = {
				centerId: data.centerId,
				autoInitNumber: data.autoInitNumber,
				beLocated: data.beLocated,
				streetNumber: data.streetNumber,
				attachedNumber: data.attachedNumber,
				buildingNumber: data.buildingNumber,
				unit: data.unit,
				roomNumber: data.roomNumber,
				floor: data.floor,
				province: data.province,
				city: data.city,
				district: data.district,
				landRightNature: data.landAcquisition,
				registrationAuthority: data.registrationAuthority,
				apportionmentArea: data.apportionmentArea,
				terminationDate: data.useEndDate,
				ownership: data.ownership,
				publicSituation: data.publicSituation
			};
			this.$nextTick(() => {
				//模态框 设置数据,并且初始化
				this.$refs.declareRealtyLandModel.setServerValue(itemLand);
			});
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
							if (resultData.landId) {
								_this.landData = {
									id: resultData.landId
								};
							}
							_this.$nextTick(() => {
								//模态框 设置数据,并且初始化
								_this.$refs.declareRealtyLandModel.setServerData();
								_this.$refs.landFileCPN.initFun();
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
				let landData = option.data;
				let commitFlag = option.commitFlag;
				let query = this.query;
				if (data.centerId) {
					let _this = this;
					let option = {
						url: "/app.assess/declare/declareBuildEngineeringAndEquipmentCenter/saveAndUpdate",
						query: {
							id: data.centerId,
							landId: landData.id
						},
						successCallback: function(resultData) {
							if (resultData) {
								console.log(resultData);
							}
						}
					};
					utils.requestDefault(option);
				}
				console.log(landData);
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
					this.landData = landData;
				}
			},
			setImgFieldsName(fieldsName) {
				let tableId = 0;
				let projectInfo = this.projectInfo;
				if (this.landData.id) {
					tableId = this.landData.id;
				}
				let obj = {
					fieldsName: fieldsName,
					tableId: tableId,
					tableName: AssessDBKey.DeclareRealtyLandCert,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
