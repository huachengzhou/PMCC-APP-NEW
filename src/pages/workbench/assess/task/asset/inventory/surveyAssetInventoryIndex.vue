<template>
	<view>

		<view>
			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
				:rules="rules">
				<uni-group title="清查业务" mode="card">

					<uni-forms-item required name="bisCheckOriginal" label="查看原件" label-align="right">
						<uni-data-checkbox @change="changeLoadData('bisCheckOriginal')" mode="tag"
							v-model="formData.bisCheckOriginal" :localdata="bisCheckOriginalList"></uni-data-checkbox>
					</uni-forms-item>

					<uni-forms-item v-show="!bisCheckOriginalFlag" name="findMethod" label="查看方法" label-align="right">
						<assess-picker :dataInput="'findMethod'" :dataList="findMethodList"
							:dataValue="formData.findMethod" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<uni-forms-item v-show="!bisCheckOriginalFlag" name="networkFindFile" label="查看结果附件"
						label-align="right">
						<common-image-picker :dataObj="getImgFieldsName('networkFindFile')">
						</common-image-picker>
					</uni-forms-item>

					<uni-forms-item v-show="!bisCheckOriginalFlag" name="networkRemark" label="查询说明"
						label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="formData.networkRemark" placeholder="查询说明">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item v-show="bisCheckOriginalFlag" name="checkDate" label="核对日期" label-align="right">
						<uni-datetime-picker type="date" :value="formData.checkDate"
							v-on:change="setFormValue('checkDate',$event)"></uni-datetime-picker>
					</uni-forms-item>

					<uni-forms-item v-show="bisCheckOriginalFlag" name="checkOriginalFile" label="证明文件"
						label-align="right">
						<common-image-picker :dataObj="getImgFieldsName('checkOriginalFile')">
						</common-image-picker>
					</uni-forms-item>

					<uni-forms-item v-show="bisCheckOriginalFlag" name="remark" label="说明" label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="formData.remark" placeholder="说明">
						</uni-easyinput>
					</uni-forms-item>

					<uni-forms-item v-show="findMethodFlag" name="networkAddress" label="查询的地址" label-align="right">
						<uni-easyinput type="text" v-model="formData.networkAddress" placeholder="查询的地址" />
					</uni-forms-item>

					<uni-forms-item required name="affected" label="影响对象" label-align="right">
						<uni-data-checkbox @change="changeLoadData('affected')" multiple v-model="formData.affected"
							:localdata="affectedList" />
					</uni-forms-item>

					<uni-forms-item required name="segmentationLimit" label="分割限制" label-align="right">
						<assess-picker :dataInput="'segmentationLimit'" :dataList="segmentationLimitList"
							:dataValue="formData.segmentationLimit" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<uni-forms-item required name="influenceFactor" label="影响要素" label-align="right">
						<uni-data-checkbox @change="changeLoadData('influenceFactor')" multiple
							v-model="formData.influenceFactor" :localdata="influenceFactorList" />
					</uni-forms-item>

					<influence-factor-remark-text-html ref="influenceFactorRemarkTextHtmlCpn"
						:dataValue="influenceFactorRemarkTextSettingValue()"
						@influenceFactorRemarkTextRemove="influenceFactorRemarkTextRemove"
						@influenceFactorRemarkTextSure="influenceFactorRemarkTextSure">
					</influence-factor-remark-text-html>

				</uni-group>

				<uni-group title="税费、工程、物管欠款调查" mode="card">

					<uni-forms-item name="paymentStatus" label="缴纳情况" label-align="right">
						<assess-picker :dataInput="'paymentStatus'" :dataList="paymentStatusList"
							:dataValue="formData.paymentStatus" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<uni-forms-item v-show="paymentStatusFlag" name="paymentStatusFile" label="附件" label-align="right">
						<common-image-picker :dataObj="getImgFieldsName('paymentStatusFile')">
						</common-image-picker>
					</uni-forms-item>

					<view v-show="paymentStatusFlag">
						<payment-status-add-item ref="paymentStatusAddItemCpn" :dataValue="formData.paymentContent"
							@removeFun="paymentStatusAddItemRemove" @sureFun="paymentStatusAddItemSure">
						</payment-status-add-item>
					</view>
				</uni-group>


				<uni-group title="损坏调查表" mode="card">

					<uni-forms-item name="rimIsNormal" :label="bisHouseStatus?'区位是否损坏':'土地是否管制'" label-align="right">
						<assess-picker :dataInput="'rimIsNormal'" :dataList="rimIsNormalList"
							:dataValue="formData.rimIsNormal" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<view v-show="rimIsNormalFlag">
						<entity-damage-cpn ref="entityDamageCpn" :dataValue="formData.entityDamage" :itemTitle="bisHouseStatus?'区位损坏':'土地管制'"
							@removeFun="entityDamageRemove" @sureFun="entityDamageSure" :itemData="formData"
							:projectInfo="projectInfo">
						</entity-damage-cpn>
					</view>

					<uni-forms-item name="entityIsDamage" label="实物状况是否损坏" label-align="right">
						<assess-picker :dataInput="'entityIsDamage'" :dataList="entityIsDamageList"
							:dataValue="formData.entityIsDamage" @dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<view v-show="entityIsDamageFlag">
						<zone-damage-cpn ref="zoneDamageCpn" :dataValue="formData.zoneDamage" :itemTitle="'实物状况'"
							@removeFun="zoneDamageRemove" @sureFun="zoneDamageSure" :itemData="formData"
							:projectInfo="projectInfo">
						</zone-damage-cpn>
					</view>

				</uni-group>

				<uni-group title="转让限制" mode="card">
					<uni-forms-item name="bisLimit" label="是否有转让限制" label-align="right">
						<assess-picker :dataInput="'bisLimit'" :dataList="bisLimitList" :dataValue="formData.bisLimit"
							@dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<uni-forms-item v-show="bisLimitFlag" name="transferLimit" label="转让限制" label-align="right">
						<uni-easyinput type="textarea" autoHeight v-model="formData.transferLimit" placeholder="转让限制">
						</uni-easyinput>
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
					临时保存
				</button>
			</view>
		</view>

	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import topTabbar from '@/components/top-tabbar/top-tabbar.vue';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import influenceFactorRemarkTextHtml from '@/components/assess/asset/influence-factor-remark-text-html.vue';
	import payment_status_add_item from '@/components/assess/asset/payment-status-add-item.vue';
	import zoneDamageCpn from '@/components/assess/asset/zone-damage-cpn';
	import entityDamageCpn from '@/components/assess/asset/entity_damage-cpn.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import * as Explore from '@/common/assess/Explore.key.js';
	import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";

	const AssessDBKey = Explore.AssessDBKey;
	const AssessDicKey = Explore.AssessDicKey;

	let ruleField = [
		':bisCheckOriginal',
		':segmentationLimit',
		':affected',
		':influenceFactor',
	];

	let rules = utils.getRules(ruleField);

	export default {
		components: {
			topTabbar,
			"assess-picker": assessPicker,
			"common-image-picker": commonImagePicker,
			"influence-factor-remark-text-html": influenceFactorRemarkTextHtml,
			"zone-damage-cpn": zoneDamageCpn,
			"entity-damage-cpn": entityDamageCpn,
			"payment-status-add-item": payment_status_add_item
		},
		data() {
			return {
				bisDetail: false,
				projectInfo: {},
				phase: {},
				projectPlanDetails: {},
				assetInfo: {},
				itemData: {},
				landCategoryId: '',
				houseCategoryId: '',
				findMethodFlag: false,
				bisCheckOriginalFlag: false,
				paymentStatusFlag: false,
				bisLimitFlag: false,
				entityIsDamageFlag: false,
				rimIsNormalFlag: false,
				formData: {
					id: "",
					bisCheckOriginal: "0",
					findMethod: "",
					networkRemark: "",
					checkDate: "",
					remark: "",
					networkAddress: "",
					segmentationLimit: "",
					affected: [],
					influenceFactor: [],
					paymentStatus: "",
					rimIsNormal: "",
					entityIsDamage: "",
					bisLimit: "",
					transferLimit: "",
					influenceFactorRemarkText: "",
					paymentContent: "",
					zoneDamage: "",
					entityDamage: "",
				},
				bisLimitList: [{
					id: "是",
					name: "是"
				}, {
					id: "否",
					name: "否"
				}],
				entityIsDamageList: [{
					id: "损坏",
					name: "损坏"
				}, {
					id: "未损坏",
					name: "未损坏"
				}],
				rimIsNormalList: [{
					id: "正常",
					name: "正常"
				}, {
					id: "不正常",
					name: "不正常"
				}],
				paymentStatusList: [{
					id: "正常",
					name: "正常"
				}, {
					id: "不正常",
					name: "不正常"
				}],
				influenceFactorList: [],
				affectedList: [],
				segmentationLimitList: [],
				findMethodList: [],
				bisCheckOriginalList: [{
					value: "0",
					text: "否"
				}, {
					value: "1",
					text: "是"
				}],
				rules: rules
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
			if (query.data.name) {
				uni.setNavigationBarTitle({
					title: query.data.name
				});
			}
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
		computed: {
			bisHouseStatus: function() {
				let status = true;
				let projectInfo = this.projectInfo;
				if (projectInfo.projectCategoryId == this.houseCategoryId) {
					status = true;
				}
				if (projectInfo.projectCategoryId == this.landCategoryId) {
					status = false;
				}
				return status;
			}
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
				var userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				let itemData = this.itemData;
				let affected = formData.affected;
				let influenceFactor = formData.influenceFactor;
				if(affected){
					formData.affected = affected.join(",");
				}
				if(influenceFactor){
					formData.influenceFactor = influenceFactor.join(",");
				}
				let data = {
					userAccount: userInfo.userAccount,
					assetInfoItemId: itemData.id,
					surveyAssetInventory: formData
				};
				let res = this.$myRequest.pmccRequest({
					showLoading: true,
					data: {
						formData: JSON.stringify(data)
					},
					method: "POST",
					url: "/app.assess/asset/surveyAssetInventory/saveServiceSurveyAssetInventory"
				});
				res.then(res => {
					if(this.formData.affected){
						if(utils.getType(this.formData.affected) == 'string'){
							this.formData.affected = this.formData.affected.split(",") ;
						}
					}
					if(this.formData.influenceFactor){
						if(utils.getType(this.formData.influenceFactor) == 'string'){
							this.formData.influenceFactor = this.formData.influenceFactor.split(",") ;
						}
					}
					uni.showToast({
						title: '保存成功',
						icon: "success",
						success() {
							if (commitFlag) {
								uni.navigateBack({
									delta: 1
								});
							}
						}
					});
				});
			},
			submitForm() {
				console.log(this.formData);
				this.$refs.form.validate().then(res => {
					this.submit(true);
				});
			},
			submitTempForm() {
				this.submit(false);
			},
			loadInitFunThen() {
				let data = this.$data;
				var _this = this;
				let projectInfo = this.projectInfo;
				let bisHouseStatus = this.bisHouseStatus;
				this.$nextTick(() => {

				});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectSurveyInventoryContentDefaultFindMethod,
					function(
						resultData) {
						if (!resultData) {
							return false;
						}
						data.findMethodList = resultData;
					});
				assessCommonUtils.loadAsyncDataDicByKey(AssessDicKey.projectSurveyInventoryContentDefaultAffected,
					function(
						resultData) {
						if (!resultData) {
							return false;
						}
						data.affectedList = assessCommonUtils.checkboxTransformBaseDic(resultData);
					});

				let segmentationLimitKey = bisHouseStatus ? AssessDicKey.project_survey_inventory_segmentationLimit_house :
					AssessDicKey.project_survey_inventory_segmentationLimit_land;
				assessCommonUtils.loadAsyncDataDicByKey(segmentationLimitKey,
					function(
						resultData) {
						if (!resultData) {
							return false;
						}
						data.segmentationLimitList = resultData;
					});
			},
			loadInitFun() {
				var userInfo = this.$helper.fetchLocalUser();
				let formData = this.formData;
				let itemData = this.itemData;
				let getOption = {
					method: "POST"
				};
				if (itemData.inventoryId) {
					getOption.url = "/app.assess/asset/surveyAssetInventory/getById?id=" + itemData.inventoryId;
					getOption.data = {
						id: itemData.inventoryId
					};
					getOption.urlParam = true;
				} else {
					getOption.url = "/app.assess/asset/surveyAssetInventory/initSurveyAssetInventory";
					getOption.data = {
						assetInfoItemId: itemData.id,
						userAccount: userInfo.userAccount
					};
				}
				let resOne = this.$myRequest.pmccRequest(getOption);
				resOne.then(res => {
					if (res.data.ret) {
						let serverData = res.data.data;
						console.log(serverData);
						var keys = Object.keys(formData);
						for (var i = 0; i < keys.length; i++) {
							var key = keys[i];
							if (!serverData[key]) {
								continue;
							}
							if (key == 'affected' || key == 'influenceFactor') {
								formData[key] = serverData[key].split(",");
							} else {
								formData[key] = "" + serverData[key] + "";
							}
							this.changeLoadData(key);
						}
						if (this.landCategoryId && this.houseCategoryId) {
							this.loadInitFunThen();
						} else {
							let resTwo = this.$myRequest.pmccRequest({
								url: "/app.assess/asset/surveyAssetInventory/getLandCategoryId",
								method: "POST",
								data: {}
							});
							return resTwo;
						}
					}
				}).then(res => {
					if (!res) {
						return false;
					}
					if (res.data.ret) {
						this.landCategoryId = res.data.data;
						let resThree = this.$myRequest.pmccRequest({
							url: "/app.assess/asset/surveyAssetInventory/getHouseCategoryId",
							method: "POST",
							data: {}
						});
						return resThree;
					}
				}).then(newRes => {
					if (!newRes) {
						return false;
					}
					if (newRes.data.ret) {
						this.houseCategoryId = newRes.data.data;
						this.loadInitFunThen();
					}
				});
			},
			changeLoadData(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					case "segmentationLimit": {
						assessCommonUtils.getDataDicListByPid(value, function(resultData) {
							data.influenceFactorList = assessCommonUtils.checkboxTransformBaseDic(resultData);
						});
						break;
					}
					case "bisLimit": {
						if (value) {
							this.bisLimitFlag = value == '是';
						}
						break;
					}
					case "entityIsDamage": {
						if (value) {
							this.entityIsDamageFlag = value == '损坏';
						}
						break;
					}
					case "rimIsNormal": {
						if (value) {
							this.rimIsNormalFlag = value == '不正常';
						}
						break;
					}
					case "paymentStatus": {
						if (value) {
							this.paymentStatusFlag = value == '不正常';
						}
						break;
					}
					case "findMethod": {
						if (value) {
							assessCommonUtils.getDataDicInfo(value, function(result) {
								if (result.fieldName == AssessDicKey
									.projectSurveyInventoryContentDefaultFindMethodNetwork) {
									_this.findMethodFlag = true;
								} else {
									_this.findMethodFlag = false;
								}
							});
						}
						break;
					}
					case "bisCheckOriginal": {
						this.bisCheckOriginalFlag = value == '1';
						break;
					}
				}
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
			setFormValue: function(name, value) {
				let formData = this.formData;
				formData[name] = value;
				this.formData = formData;
				this.$refs.form.setValue(name, value);
			},
			getImgFieldsName(fieldsName) {
				let projectInfo = this.projectInfo;
				let formData = this.formData;
				let obj = {
					fieldsName: fieldsName,
					tableId: formData.id,
					tableName: AssessDBKey.SurveyAssetInventory,
					appKey: projectInfo.appKey
				};
				return obj;
			},
			influenceFactorRemarkTextRemove(data) {
				let formData = this.formData;
				let arr = [];
				if (formData.influenceFactor) {
					formData.influenceFactor.forEach(id => {
						if (Number(id) != Number(data.id)) {
							arr.push(id);
						}
					});
				}
				this.formData.influenceFactor = arr;
				this.formData.influenceFactorRemarkText = data.value;
				let _this = this;
				this.$nextTick(() => {
					//虽然 预设组件加载完成  但是还是有可能出问题 ,influenceFactorRemarkTextSettingValue先设置值在子组件中
					setTimeout(function() {
						_this.$refs.influenceFactorRemarkTextHtmlCpn.loadDataList();
					}, 50);
				});
			},
			influenceFactorRemarkTextSure(value) {
				this.formData.influenceFactorRemarkText = value;
			},
			influenceFactorRemarkTextSettingValue() {
				let fieldName = "influenceFactorRemarkText";
				let formData = this.formData;
				let influenceFactor = formData.influenceFactor
				let influenceFactorRemarkText = "";
				let ids = [];
				let searceArr = [];
				if (formData.influenceFactorRemarkText) {
					influenceFactorRemarkText += formData.influenceFactorRemarkText;
					searceArr = influenceFactorRemarkText.split(",");
					for (let i = 0; i < searceArr.length; i++) {
						let str = searceArr[i];
						if (!str) {
							continue;
						}
						let newArr = str.split(":");
						if (newArr.length >= 1) {
							let id = newArr[0].replace(/[^0-9]/ig, "");
							ids.push(Number(id));
						}
					}
				}
				if (influenceFactor) {
					let arr = [];
					if(!utils.isArray(influenceFactor)){
						influenceFactor = influenceFactor.split(",") ;
					}
					if(utils.isArray(influenceFactor)){
						influenceFactor.forEach(id => {
							if (ids.length != 0) {
								if (ids.indexOf(Number(id)) == -1) {
									arr.push(fieldName + id + ":");
								}
							} else {
								arr.push(fieldName + id + ":");
							}
						});
					}
					searceArr = searceArr.concat(arr);
				}
				return searceArr.join(",");
			},
			paymentStatusAddItemRemove(list, index) {
				let arr = [];
				list.forEach(function(item, m) {
					if (index != m) {
						arr.push(item);
					}
				});
				this.formData.paymentContent = JSON.stringify(arr);
				let _this = this;
				this.$nextTick(() => {
					//虽然 预设组件加载完成  但是还是有可能出问题 ,延迟执行,由于vue子组件和父组件通信非异步所以延迟执行一定可行
					setTimeout(function() {
						_this.$refs.paymentStatusAddItemCpn.loadDataList();
					}, 50);
				});
			},
			paymentStatusAddItemSure(list) {
				this.formData.paymentContent = JSON.stringify(list);
			},
			zoneDamageRemove(list, index) {
				let arr = [];
				list.forEach(function(item, m) {
					if (index != m) {
						arr.push(item);
					}
				});
				this.formData.zoneDamage = JSON.stringify(arr);
				let _this = this;
				this.$nextTick(() => {
					//虽然 预设组件加载完成  但是还是有可能出问题 ,延迟执行,由于vue子组件和父组件通信非异步所以延迟执行一定可行
					setTimeout(function() {
						_this.$refs.zoneDamageCpn.loadDataList();
					}, 50);
				});
			},
			zoneDamageSure(list) {
				this.formData.zoneDamage = JSON.stringify(list);
			},
			entityDamageRemove(list, index) {
				let arr = [];
				list.forEach(function(item, m) {
					if (index != m) {
						arr.push(item);
					}
				});
				this.formData.entityDamage = JSON.stringify(arr);
				let _this = this;
				this.$nextTick(() => {
					//虽然 预设组件加载完成  但是还是有可能出问题 ,延迟执行,由于vue子组件和父组件通信非异步所以延迟执行一定可行
					setTimeout(function() {
						_this.$refs.entityDamageCpn.loadDataList();
					}, 50);
				});
			},
			entityDamageSure(list) {
				this.formData.entityDamage = JSON.stringify(list);
			}
		}
	}
</script>

<style>

</style>
