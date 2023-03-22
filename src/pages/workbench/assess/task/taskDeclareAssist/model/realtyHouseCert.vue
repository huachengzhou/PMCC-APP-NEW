<template>
	<view>
		<view>
			<house-model @submit="submit" ref="houseModel" :dataId="data.id" :bisCenter="bisCenter"
				:controlParam="controlParam" :bisDetail="bisDetail">
				<uni-group title="附件" mode="card" slot="foot">
					<uni-forms-item name="declareRealtyHouseCertFileId" label="房产证" label-align="right">
						<common-image-picker ref="certFileCpn" :dataObj="setImgFieldsName('declareRealtyHouseCertFileId')">
						</common-image-picker>
					</uni-forms-item>
				</uni-group>
			</house-model>
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
				projectPlanDetails: {},
				bisCenter: true,
				query: {}
			}
		},
		components: {
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
			"house-model": houseModel
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
			if (query.data) {
				this.data = query.data;
				if (this.bisDetail) {
					uni.setNavigationBarTitle({
						title: "申报房产证详情"
					});
				} else {
					uni.setNavigationBarTitle({
						title: "申报房产证修改"
					});
				}
			} else {
				uni.setNavigationBarTitle({
					title: "申报房产证添加"
				});
			}

			this.$nextTick(() => {
				//模态框 设置数据,并且初始化
				this.$refs.houseModel.setServerData();
				this.$refs.certFileCpn.initFun();
			});
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
