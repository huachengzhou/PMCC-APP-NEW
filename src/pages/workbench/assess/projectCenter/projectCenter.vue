<template>
	<view style="margin-top: 40px;">
		<view v-for="(phaseList,index) in phaseGroupList" :key="index">
			<view v-show="getListFlag(phaseList)">
				<uni-section :title="phaseList[0].workStageName" type="line"></uni-section>
				<uni-list>
					<view v-for="(phaseObj,index) in phaseList">
						<view v-if="phaseObj.mobileFlag">
							<uni-list-item :disabled="false" :show-extra-icon="true" :extra-icon="extraIcon" clickable
								@click="itemClick(phaseObj,$event)" :title="phaseObj.projectPhaseName" />
						</view>
						<view v-if="!phaseObj.mobileFlag">
							<!-- <uni-list-item :disabled="true" :show-extra-icon="true" :extra-icon="extraIconDisable"
								clickable @click="itemClick(phaseObj,$event)" :title="phaseObj.projectPhaseName" /> -->
						</view>
					</view>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

	export default {
		data() {
			return {
				projectInfo: {},
				phaseGroupList: [],
				extraIcon: {
					color: '#4cd964',
					size: '22',
					type: 'flag-filled'
				},
				extraIconDisable: {
					color: '#4cd964',
					size: '22',
					type: 'flag'
				}
			}
		},
		onLoad(option) {
			this.projectInfo = option;
			if (option.projectName) {
				uni.setNavigationBarTitle({
					title: option.projectName
				});
			}
			this.groupProjectPhaseList();
		},
		onPullDownRefresh() {
			uni.showToast({
				title: "刷新中",
				icon: "loading",
				duration: 2000
			});
			//下拉刷新
			this.groupProjectPhaseList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		components: {
			"assess-picker": assessPicker,
			"input-autocomplete": inputAutocomplete
		},
		methods: {
			itemClick(item) {
				let info = this.projectInfo;
				let query = {
					phase: item,
					projectInfo: info
				};
				if (!item.mobileFlag) {
					uni.showToast({
						title: "工作事项不开放",
						icon: "error",
						duration: 1000
					});
					return false;
				}
				uni.navigateTo({
					url: "./projectPlanDetails?json=" + JSON.stringify(query)
				});
			},
			groupProjectPhaseList() {
				let info = this.projectInfo;
				let _this = this;
				let option = {
					url: "/app.assess/public/getGroupProjectPhaseDtoList",
					method: 'POST',
					data: {
						projectId: info.id
					},
					showLoading: false
				};
				//第一次 请求 以最快速度得到 事项，让用户提前看到()
				this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						this.phaseGroupList = res.data.data;
						//第二次  事项任务 中包含对事项的状态
						option.data = {
							projectId: info.id,
							state: 'true'
						};
						option.showLoading = true;
						_this.$myRequest.pmccRequest(option).then(res => {
							if (res.data.ret) {
								_this.phaseGroupList = res.data.data;
							}
						});
					}
				});
			},
			getListFlag(list) {
				let count = 0;
				if(list){
					list.forEach(phaseObj => {
						if(phaseObj.mobileFlag){
							count++;
						}
					})
				}
				return count != 0;
			}
		}
	}
</script>

<style>
</style>
