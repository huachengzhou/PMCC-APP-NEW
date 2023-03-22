<template>
	<view>
		
		<view v-show="bisNotCert">
			<data-cnpm-model @submit="submit" ref="realtyRealEstateModel" :bisShowBeLocated="false" :dataId="data.id" :bisCenter="bisCenter"
				:controlParam="controlParam" :bisDetail="bisDetail">
				<uni-group title="附件" mode="card" slot="foot">
					<uni-forms-item name="declareRealtyRealEstateCertNewFileId" label="权证附件" label-align="right">
						<common-image-picker ref="certFileCpn" :dataObj="setImgFieldsName('declareRealtyRealEstateCertNewFileId')">
						</common-image-picker>
					</uni-forms-item>
				</uni-group>
			</data-cnpm-model>
		</view>
		
		<view v-show="!bisNotCert">
			<data-cnpm-NotCert-model @submit="submit" ref="realtyRealEstateNotCertModel" :dataId="data.id" :bisCenter="bisCenter"
				:controlParam="controlParam" :bisDetail="bisDetail">
				<uni-group title="附件" mode="card" slot="foot">
					<uni-forms-item name="declareRealtyRealEstateCertNewFileId" label="批文附件" label-align="right">
						<common-image-picker ref="certFileCpn2" :dataObj="setImgFieldsName('declareRealtyRealEstateCertNewFileId')">
						</common-image-picker>
					</uni-forms-item>
				</uni-group>
			</data-cnpm-NotCert-model>
		</view>

	</view>
</template>

<script>
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as utils from "@/common/untils.js";
	import * as declareCommonUtils from "@/common/assess/declare/declareCommonUtils.js";
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import realtyRealEstateModel from '@/components/assess/declare/realtyRealEstateModel.vue';
	import realtyRealEstateNotCertModel from '@/components/assess/declare/realtyRealEstateNotCertModel.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';

	var declareCommon = declareCommonUtils.declareCommon;
	const AssessDBKey = Explore.AssessDBKey;
	const AssessDicKey = Explore.AssessDicKey;
	
	export default {
		data() {
			return {
				projectInfo: {},
				phase: {},
				data: {},
				projectPlanDetails: {},
				bisCenter: true,
				query: {},
				landCertGetYes: {},
				landCertGetNot: {},
				bisNotCert:true ,
			}
		},
		components: {
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
			"data-cnpm-model": realtyRealEstateModel,
			"data-cnpm-NotCert-model": realtyRealEstateNotCertModel,
		},
		computed: {
			controlParam: function() {
				let obj = {
					enable: declareCommon.masterData
				};
				let projectPlanDetails = this.projectPlanDetails;
				if (projectPlanDetails) {
					obj.planDetailsId = projectPlanDetails.id;
				}
				if(this.bisNotCert) {
					obj.landCertGetQuestion = this.landCertGetYes.id ;
				}else {
					obj.landCertGetQuestion = this.landCertGetNot.id ;
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
			this.bisNotCert = query.bisNotCert;
			if (query.data) {
				this.data = query.data;
				if (this.bisDetail) {
					uni.setNavigationBarTitle({
						title: "申报不动产详情"
					});
				} else {
					uni.setNavigationBarTitle({
						title: "申报不动产修改"
					});
				}
			} else {
				uni.setNavigationBarTitle({
					title: "申报不动产添加"
				});
			}
			
			assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectDeclareCertificateIsnull,
				(resultData => {
					if (resultData) {
						for (var i = 0; i < resultData.length; i++) {
							let item = resultData[i];
							if (AssessDicKey.projectDeclareCertificate_YES == item.fieldName) {
								this.landCertGetYes = item;
							}
							if (AssessDicKey.projectDeclareCertificate_NO == item.fieldName) {
								this.landCertGetNot = item;
							}
						}
						console.log(this.landCertGetYes);
						console.log(this.landCertGetNot);
						
						this.$nextTick(() => {
							//模态框 设置数据,并且初始化
							this.$refs.realtyRealEstateModel.setServerData();
							this.$refs.realtyRealEstateNotCertModel.setServerData();
							this.$refs.certFileCpn.initFun();
							this.$refs.certFileCpn2.initFun();
						});
					}
				}));

			
			console.log(query);
		},
		methods: {
			submit(option) {
				let data = option.data;
				let commitFlag = option.commitFlag;
				let query = this.query;
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
					this.data = data;
				}
			},
			setImgFieldsName(fieldsName) {
				let tableId = 0;
				let projectInfo = this.projectInfo;
				if (this.data.id) {
					tableId = this.data.id;
				}
				let obj = {
					fieldsName: fieldsName,
					tableId: tableId,
					tableName: AssessDBKey.DeclareRealtyRealEstateCert,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
