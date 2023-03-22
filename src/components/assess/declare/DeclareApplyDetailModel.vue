<template>

	<view>
		<view>
			<button type="primary" size="mini" @click.stop="initFun()">
				多个附件字段
				<uni-icons color="'#0055ff'" type="cloud-upload-filled" size="16"></uni-icons>
			</button>
		</view>
		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view>
					<uni-title type="h4" title="添加附件" color="#60adfb"></uni-title>
				</view>
				<view>
					<uni-row :width="nvueWidth">
						<uni-col :span="6">
							<view class="tag-view" @click.stop="addData()">
								<uni-tag :circle="true" inverted="false" text="添加" type="primary" />
							</view>
						</uni-col>
						<uni-col :span="18">
							<view>
								<uni-data-checkbox mode="tag" v-model="tabIndex" :localdata="tabList">
								</uni-data-checkbox>
							</view>
						</uni-col>
					</uni-row>
				</view>
				<view v-for="(item,index) in dataList">
					<uni-forms v-show="tabIndex == index" :modelValue="formData" validate-trigger="bind"
						err-show-type="undertext">
						<uni-group mode="card">
							<uni-forms-item name="zoneProjectName" label="附件名称" label-align="right">
								<uni-easyinput type="text" v-model="item.name" placeholder="附件名称">
								</uni-easyinput>
							</uni-forms-item>
							<uni-forms-item name="fileName" label="文件" label-align="right">
								<common-image-picker :dataObj="getImgFieldsName(item)">
								</common-image-picker>
							</uni-forms-item>
							<view class="uni-flex uni-row">
								<view class=" uni-flex"
									style="-webkit-flex: 1;flex: 1;height: 200rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
									<button class="uni-button" size="mini" type="primary"
										@click.stop="removeInput(index)">移除</button>
								</view>
							</view>

						</uni-group>
					</uni-forms>
				</view>
				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<button class="uni-button" size="mini" type="primary" @click.stop="sureFn">确定</button>
					<button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
				</view>

			</my-ming-pop>
		</view>

	</view>
</template>

<script>
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
	import * as utils from "@/common/untils.js";
	import * as Explore from '@/common/assess/Explore.key.js';
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';

	const AssessDBKey = Explore.AssessDBKey;

	export default {
		components: {
			"my-ming-pop": myMingPop,
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker
		},
		computed: {
			tabList: function() {
				let arr = [];
				let dataList = this.dataList;
				if (dataList.length != 0) {
					for (var i = 0; i < dataList.length; i++) {
						let obj = {
							value: i,
							text: (i + 1) + "个"
						};
						arr.push(obj);
					}
				}
				return arr;
			}
		},
		props: {
			declareId: {
				type: [Number,String],
				default: function() {
					return '';
				}
			},
			projectInfo: {
				type: [Object],
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {
				nvueWidth: 730,
				dataList: [],
				formData: {},
				tabIndex: 0,
			}
		},
		watch: {},
		methods: {
			initFun() {
				this.loadDataList();
				this.$refs.myMingPop.show();
			},
			loadDataList() {
				let declareId = this.declareId;
				let option = {
					url: "/app.assess/declare/declareApplyDetail/getDeclareApplyDetailListByDeclareId?declareId=" +
						declareId,
					method: "POST",
					data: {
						declareId: declareId
					}
				};
				let reFun = this.$myRequest.pmccRequest(option);
				reFun.then(res => {
					if (res.data.ret) {
						this.dataList = res.data.data;
					}
				});
			},
			closeModel() {
				this.$refs.myMingPop.close();
			},
			sureFn() {
				let dataList = this.dataList;
				let option = {
					url: "/app.assess/declare/declareApplyDetail/batchUpdate",
					method: "POST",
					data: {
						formData: JSON.stringify(dataList)
					}
				};
				let reFun = this.$myRequest.pmccRequest(option);
				reFun.then(res => {
					if (res.data.ret) {
						this.closeModel();
						uni.showToast({
							title: '保存成功!'
						});
					}
				});
			},
			removeInput(index) {
				let dataList = this.dataList;
				let data = dataList[index];
				let option = {
					url: "/app.assess/declare/declareApplyDetail/removeById?id=" + data.id,
					method: "POST",
					data: {
						id: data.id
					}
				};
				let reFun = this.$myRequest.pmccRequest(option);
				reFun.then(res => {
					if (res.data.ret) {
						dataList.splice(index, 1);
						if (this.tabIndex != 0) {
							this.tabIndex = this.tabIndex - 1;
						}
					}
				});
			},
			addData() {
				let declareId = this.declareId;
				let projectInfo = this.projectInfo;
				let dataList = this.dataList;
				var userInfo = this.$helper.fetchLocalUser();
				let option = {
					url: "/app.assess/declare/declareApplyDetail/saveAndUpdate",
					method: "POST",
					data: {
						declareId: declareId,
						projectId: projectInfo.id,
						creator: userInfo.userAccount
					}
				};
				let reFun = this.$myRequest.pmccRequest(option);
				reFun.then(res => {
					if (res.data.ret) {
						dataList.push(res.data.data);
						this.tabIndex = dataList.length - 1;
					}
				});
			},
			getImgFieldsName(formData) {
				let projectInfo = this.projectInfo;
				let obj = {
					fieldsName: "other_Enclosure" + formData.id,
					tableId: formData.id,
					tableName: AssessDBKey.DeclareApplyExtension,
					appKey: projectInfo.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>
	.tag-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		margin: 10rpx 15rpx;
		justify-content: center;
	}
</style>
