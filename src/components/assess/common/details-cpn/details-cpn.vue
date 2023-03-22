<template>
	<view>
		<view class="goods-carts">
			<uni-goods-nav :options="footBars" :fill="true" :button-group="footButtonGroup" @click="footNavClick"
				@buttonClick="footNavClick" />
		</view>

		<view>
			<common-copower-approvalLog ref="approvalLogCpn" :dataId="projectPlanDetails.processInsId"
				appKey="pmcc-assess">
			</common-copower-approvalLog>
		</view>

		<view>
			<project-copower-approvalLog ref="projectLogCpn" :appInfo="appInfo">
			</project-copower-approvalLog>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import commonCopowerApprovalLog from '@/components/bpm/common-copower-approvalLog.vue';
	import projectCopowerApprovalLog from '@/components/assess/common/project-common-copower-approvalLog/project-common-copower-approvalLog.vue';

	export default {
		props: {
			taskInfo: {
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
		watch: {},
		components: {
			"common-copower-approvalLog": commonCopowerApprovalLog,
			"assess-picker": assessPicker,
			"project-copower-approvalLog": projectCopowerApprovalLog
		},
		computed: {
			appInfo: function() {
				let projectPlanDetails = this.projectPlanDetails;
				let obj = {
					appKey: "pmcc-assess",
					projectId: projectPlanDetails.projectId
				};
				return obj;
			}
		},
		data() {
			return {
				footCode: '',
				footBars: [],
				footButtonGroup: [{
						text: '流程日志',
						icon: 'info-filled',
						backgroundColor: '#FF0000',
						color: '#fff',
						code: 4
					},
					{
						text: '项目日志',
						icon: 'info-filled',
						backgroundColor: '#0000FF',
						color: '#fff',
						code: 3
					}
				]
			};
		},
		methods: {
			footNavClick(e) {
				let content = e.content;
				let code = content.code;
				this.footCode = code;
				console.log(this.projectPlanDetails);
				if (code == 4) {
					this.findProcessLogList();
					return false;
				}
				if (code == 3) {
					this.$refs.projectLogCpn.init();
					return false;
				}
				uni.showToast({
					title: '功能未开放!',
					duration: 1000,
					icon: "error",
					success() {}
				});
			},
			findProcessLogList() {
				let projectPlanDetails = this.projectPlanDetails;
				let processInsId = projectPlanDetails.processInsId;
				let flag = true;
				if (processInsId == '0') {
					flag = false;
				}
				if (!processInsId) {
					flag = false;
				}
				if (!flag) {
					uni.showToast({
						title: '无流程日志!',
						duration: 1000,
						icon: "error",
						success() {}
					});
					return false;
				}
				this.$refs.approvalLogCpn.init();
			}
		},
		created() {

		},
		mounted: function() {

		}
	}
</script>

<style>
</style>
