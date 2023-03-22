<template>
	<view>

		<view>
			<!-- <uni-group :title="'选项卡('+tabBarNames.length+')'" mode="card">
				<view class="uni-flex uni-row">
					<view v-show="!bisDetail"	style="width: 200rpx;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
						<button class="mini-btn" type="primary" size="mini"
							@click="reinitializeContentFun">重新初始化</button>
					</view>
					<view style="-webkit-flex: 1;flex: 1;">
						<assess-picker :dataInput="'tabIndex'" :dataList="tabBarNames" :dataValue="tabIndex"
							@dataResult="onSegmentedClick">
						</assess-picker>
					</view>
				</view>
			</uni-group> -->
		</view>

		<view>
			<uni-group mode="card">
				<view class="tag-view" @click.stop="reinitializeContentFun()">
					<uni-tag :circle="true" inverted="false" text="重新初始化" type="primary" />
				</view>
			</uni-group>
			<uni-row :width="nvueWidth">
				<uni-col :span="23" :offset="1">
					<view>
						<uni-data-checkbox mode="tag" v-model="tabIndex" :localdata="tabBarNames">
						</uni-data-checkbox>
					</view>
				</uni-col>
			</uni-row>
		</view>



		<view v-for="(itemObj,index) in contentList">

			<uni-forms v-show="tabIndex == index" :modelValue="itemObj" ref="form" validate-trigger="bind"
				err-show-type="undertext">
				<uni-group mode="card">

					<uni-forms-item name="areConsistent" label="是否一致" label-align="right">
						<uni-data-checkbox mode="tag" @change="areConsistentEvent" v-model="itemObj.areConsistent"
							:localdata="areConsistentList"></uni-data-checkbox>
					</uni-forms-item>

					<!-- <uni-forms-item name="一致性内容" label="一致性内容" label-align="right">
						<uni-easyinput disabled type="text" v-model="itemObj.inventoryContentName" placeholder="一致性内容">
						</uni-easyinput>
					</uni-forms-item> -->

					<uni-forms-item required name="registration" label="登记" label-align="right">
						<uni-easyinput type="text" v-model="itemObj.registration" placeholder="登记">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item required name="actual" label="实际" label-align="right">
						<uni-easyinput type="text" v-model="itemObj.actual" placeholder="实际">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item :required="areConsistentEvent(itemObj,index)"
						v-show="areConsistentEvent(itemObj,index)" name="differenceReason" label="差异原因"
						label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="itemObj.differenceReason" placeholder="差异原因">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item :required="areConsistentEvent(itemObj,index)"
						v-show="areConsistentEvent(itemObj,index)" name="credential" label="证明文件" label-align="right">
						<uni-easyinput type="text" v-model="itemObj.credential" placeholder="证明文件">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item :required="areConsistentEvent(itemObj,index)"
						v-show="areConsistentEvent(itemObj,index)" name="credentialAccessory" label="证明文件附件"
						label-align="right">
						<common-image-picker :dataObj="getImgFieldsName(itemObj)">
						</common-image-picker>
					</uni-forms-item>

					<uni-forms-item :required="areConsistentEvent(itemObj,index)"
						v-show="areConsistentEvent(itemObj,index)" name="voucher" label="证明人" label-align="right">
						<uni-easyinput type="text" v-model="itemObj.voucher" placeholder="证明人">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item :required="areConsistentEvent(itemObj,index)"
						v-show="areConsistentEvent(itemObj,index)" name="surveyTime" label="调查时间" label-align="right">
						<uni-datetime-picker type="date" :value="itemObj.surveyTime"
							v-on:change="setFormValue('surveyTime',index,$event)"></uni-datetime-picker>
					</uni-forms-item>

					<uni-forms-item v-show="areConsistentEvent(itemObj,index)" name="sureConsistent" label="确认一致"
						label-align="right">
						<assess-picker :otherValue="index" :dataInput="'sureConsistent'" :dataList="sureConsistentList"
							:dataValue="itemObj.sureConsistent" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

				</uni-group>
			</uni-forms>

		</view>

		<view v-show="!bisDetail" class="uni-flex uni-row " style="width: 100%;">
			<view style="-webkit-flex: 1;flex: 1;" class="assessbtnLeft">
				<button @click.stop="submitForm()">
					提交
				</button>
			</view>
			<view style="-webkit-flex: 1;flex: 1;" class="assessbtnRight">
				<button @click.stop="submitTempForm()">
					保存
				</button>
			</view>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import topTabbar from '@/components/top-tabbar/top-tabbar.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import * as Explore from '@/common/assess/Explore.key.js';

	const AssessDBKey = Explore.AssessDBKey;



	export default {
		components: {
			topTabbar,
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
		},
		computed: {},
		data() {
			return {
				nvueWidth: 730,
				bisDetail: false,
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				assetInfo: {},
				itemData: {},
				contentList: [],
				areConsistentList: [{
					value: "一致",
					text: "一致"
				}, {
					value: "不一致",
					text: "不一致"
				}],
				sureConsistentList: [{
					id: "一致",
					name: "一致"
				}, {
					id: "不一致",
					name: "不一致"
				}],
				loading: false,
				tabIndex: 0,
				activeColor: '#007aff',
				styleType: 'text',
				tabBarNames: [],
				dynamicRules: {

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
					return false;
				}
			}
			this.projectInfo = query.projectInfo;
			this.projectPlanDetails = query.projectPlanDetails;
			this.assetInfo = query.assetInfo;
			this.itemData = query.data;
			this.bisDetail = query.bisDetail;
			console.log(query);
			//第一次加载
			this.loadInitFun();
		},
		onShow() {
			this.$nextTick(() => {
				//第一次加载
				// this.loadInitFun();
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
			submit(commitFlag) {
				let contentList = this.contentList;
				var userInfo = this.$helper.fetchLocalUser();
				var _this = this;
				let option = {
					url: "/app.assess/asset/surveyAssetInfoItem/batchUpdateContent",
					showLoading: true,
					query: {
						formData: JSON.stringify(contentList),
						groupId: 0,
						userAccount: userInfo.userAccount
					},
					successCallback: function(resultData) {
						uni.showToast({
							title: '保存成功',
							success() {
								if (commitFlag) {
									uni.navigateBack({
										delta: 1
									});
								}
							}
						});
					}
				};
				utils.requestDefault(option);
			},
			submitForm() {
				let that = this;
				this.validateFun(function() {
					that.submit(true);
				});
			},
			submitTempForm() {
				this.submit(false);
			},
			validateFun(callback) {
				let len = this.contentList.length;
				let count = 0;
				let errorCount = 0;
				let refArr = this.$refs.form;
				let contentList = this.contentList;
				let tabBarNames = this.tabBarNames;
				let errors = [];
				for (var i = 0; i < len; i++) {
					let message = tabBarNames[i].name;
					let refItem = refArr[i];
					refItem.setRules(this.getCustomRules(contentList[i]));
					refItem.validate().then((res) => {
						count++;
						if (count == len) {
							callback();
						}
					}).catch(err => {
						errorCount++;
						errors.push(message);
						if (errorCount + count == len) {
							uni.showModal({
								title: '共' + errorCount + '项校验未通过',
								content: errors.join("-"),
								showCancel: true
							});
						}
					});
				}
			},
			onSegmentedClick(result) {
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = '';
				try {
					value = item[dataId];
				} catch (e) {
					//TODO handle the exception
				}
				this.tabIndex = value;
			},
			loadInitFun() {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				let itemData = this.itemData;
				this.$myRequest.pmccRequest({
					data: {
						userAccount: userInfo.userAccount,
						groupId: "0",
						id: itemData.id
					},
					method: "POST",
					url: "/app.assess/asset/surveyAssetInventoryContent/initContentByInfoItem"
				}).then(res => {
					if (res.data.ret) {
						let list = res.data.data;
						this.contentList = list;
						// this.tabIndex = list[0].id;
						this.tabIndex = 0;
						let tabBarNames = [];
						for (var i = 0; i < list.length; i++) {
							tabBarNames.push({
								name: list[i].inventoryContentName,
								text: list[i].inventoryContentName,
								id: i,
								value: i
							});
						}
						this.tabBarNames = tabBarNames;
						console.log(this.contentList);
					}
				});
			},
			getImgFieldsName(item) {
				let projectInfo = this.projectInfo;
				let obj = {
					fieldsName: "credentialAccessory" + item.id,
					tableId: item.id,
					tableName: AssessDBKey.SurveyAssetInventoryContent,
					appKey: projectInfo.appKey
				};
				return obj;
			},
			setFormValue(name, index, value) {
				let contentList = this.contentList;
				let formData = contentList[index];
				formData[name] = value;
				let refArr = this.$refs.form;
				let refItem = refArr[index];
				refItem.setValue(name, value);
			},
			initFormPickerResult(result) {
				let contentList = this.contentList;
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let index = pack.otherValue;
				let formData = contentList[index];
				let value = '';
				try {
					value = item[dataId];
				} catch (e) {
					//TODO handle the exception
				}
				formData[dataInput] = value;
				let refArr = this.$refs.form;
				let refItem = refArr[index];
				refItem.setValue(dataInput, value);
			},
			areConsistentEvent(data, index) {
				let contentList = this.contentList;
				if (data.areConsistent) {
					let flag = data.areConsistent != '一致';
					if (!flag) {
						contentList[index].differenceReason = '';
						contentList[index].credential = '';
						contentList[index].voucher = '';
						contentList[index].surveyTime = '';
						contentList[index].sureConsistent = '';
					}
					return flag;
				}
				return true;
			},
			getCustomRules(data) {
				let rules = {};
				let flag = data.areConsistent != '一致';
				let arr = ['registration', 'actual'];
				if (flag) {
					arr.push("differenceReason");
					arr.push("credential");
					arr.push("voucher");
					arr.push("surveyTime");
				}
				for (let i = 0; i < arr.length; i++) {
					let field = arr[i];
					rules[field] = {
						rules: [{
							required: true,
							errorMessage: '请输入数据'
						}]
					};
				}
				return rules;
			},
			reinitializeContentFun() {
				let _this = this;
				var userInfo = this.$helper.fetchLocalUser();
				let itemData = this.itemData;
				this.$myRequest.pmccRequest({
					data: {
						userAccount: userInfo.userAccount,
						groupId: "0",
						itemId: itemData.id
					},
					method: "POST",
					url: "/app.assess/asset/surveyAssetInfoItem/reinitializeContentList"
				}).then(res => {
					if (res.data.ret) {
						this.loadInitFun();
						uni.showToast({
							title: '初始化成功!',
							icon: "success"
						});
					}
				});
			}
		}
	}
</script>

<style>

</style>
