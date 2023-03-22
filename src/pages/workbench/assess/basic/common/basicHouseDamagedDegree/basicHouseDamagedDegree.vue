<template>
	<view>

		<view class="uni-padding-wrap uni-common-mt">

			<uni-segmented-control :current="current" :values="damagedDegreeLableTab" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>

		<view v-for="(itemData,index) in selectList">
			<uni-forms :modelValue="itemData" ref="form" validate-trigger="bind" err-show-type="undertext">
				<assess-uni-group :title="itemData.categoryName" mode="card" margin-top="20">
					<button @click.stop="clickDamagedDegreeDetail(itemData)" v-if="itemData.hasChildren" slot="button"
						class="mini-btn" type="primary" size="mini">明细内容</button>

					<uni-forms-item name="entityConditionContent" label="状况内容" label-align="right">
						<uni-easyinput type="textarea" v-model="itemData.entityConditionContent" placeholder="状况内容" />
					</uni-forms-item>

					<uni-forms-item name="entityCondition" label="实例状况" label-align="right">
						<assess-picker :otherValue="index" :dataInput="'entityCondition'"
							:dataList="entityConditionList" :dataValue="itemData.entityCondition"
							@dataResult="initFormPickerResult">
						</assess-picker>
					</uni-forms-item>

					<uni-forms-item name="standardScore" label="得分参考" label-align="right">
						<uni-row >
							<uni-col :span="10">
								<uni-tag :text="showText(itemData.standardScore)" type="primary"  />
							</uni-col>
							<uni-col :span="14">
								<uni-tag :text="showValidMaxValueText(itemData)" type="error"  />
							</uni-col>
						</uni-row>
					</uni-forms-item>

					<uni-forms-item name="score" label="分数" label-align="right">
						<uni-easyinput type="digit" @blur="inputValidMaxValue($event,itemData,index)"
							v-model="itemData.score" placeholder="分数" />
					</uni-forms-item>

				</assess-uni-group>
			</uni-forms>
		</view>

		<assess-submit-button v-show="damagedDegreeList.length > 0" @submit="submitForm" :loading="loading">
			当前页面保存
		</assess-submit-button>


	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";
	import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";

	import selectInput from '@/components/select-Input/select-Input.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
	import assessUniGroup from '@/components/assess/assess-uni-group/assess-uni-group.vue';

	export default {
		data() {
			return {
				cardObj: null,
				tempParms: '',
				loading: false,
				batchDetail: null,
				damagedDegreeList: [],
				damagedDegreeTab: [],
				damagedDegreeLableTab: [],
				selectList: [],
				entityConditionList: [{
						id: "intact",
						name: "完好"
					},
					{
						id: "basicallyIntact",
						name: "基本完好"
					},
					{
						id: "generalDamage",
						name: "一般损坏"
					},
					{
						id: "seriousDamage",
						name: "严重损坏"
					}
				],
				current: 0,
				activeColor: '#007aff',
				styleType: 'button'
			}
		},
		onLoad(option) {
			this.tempParms = option;
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let batchDetail = {};
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.cardObj = cardObj;
			this.batchDetail = batchDetail;
			this.initServerData();
			console.log(batchDetail);
			console.log(cardObj);
		},
		onBackPress() {
			let batchDetail = this.batchDetail;
			try {
				uni.getStorage({
					key: estateCommonUtils.childNavigationCacheKey(batchDetail.id),
					success: function(res) {
						let query = res.data;
						if (query) {
							let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
							uni.redirectTo({
								url: url
							});
							return true;
						} else {
							return false;
						}
					}
				});
			} catch (e) {
				return false;
			}
			console.log("拦截");
			return false;
		},
		onShow() {
			this.$nextTick(() => {
				this.initServerData();
			});
		},
		computed: {

		},
		components: {
			"assess-picker": assessPicker,
			"assess-submit-button": assessSubmitButton,
			"select-input": selectInput,
			"assess-uni-group": assessUniGroup,
		},
		methods: {
			clickDamagedDegreeDetail(data) {
				this.submitFormServer();
				console.log(data);
				let cardObj = {
					pageUrl: "/app.assess/basicHouseDamagedDegreeDetail/getPageResult",
					deleteUrl: "/app.assess/basicHouseDamagedDegreeDetail/removeById",
					saveAndUpdateUrl: "/app.assess/basicHouseDamagedDegreeDetail/saveAndUpdate",
					getUrl: "/app.assess/basicHouseDamagedDegreeDetail/getById",
					masterId: data.id,
					masterType: null,
					title: "房屋完好度",
					tableName: null,
					bisParent: false,
					checkExist: true,
					childType: null
				};
				let batchDetail = this.batchDetail;
				let tempParms = this.tempParms;
				let param = {
					cardJson: JSON.stringify(cardObj),
					batchDetailJson: JSON.stringify(batchDetail),
					tempParms: JSON.stringify(tempParms),
					masterData: JSON.stringify(data),
				};
				uni.navigateTo({
					url: "../assessBasicHouseDamagedDegreeDetail/assessBasicHouseDamagedDegreeDetail" + "?" + utils
						.parseParam(param)
				});
			},
			initServerData() {
				let houseId = this.cardObj.masterId;
				let _this = this;
				this.$myRequest.pmccRequest({
					method: "POST",
					urlParam: true,
					data: {
						houseId: houseId
					},
					url: "/app.assess/basicHouseDamagedDegree/getDamagedDegreeList?houseId=" + houseId
				}).then(res => {
					if (res.data.ret) {
						_this.damagedDegreeList = res.data.data;
						_this.assemblyGroupData();
						_this.initContent(_this.current);
					}
				});
			},
			assemblyGroupData() {
				let _this = this;
				let arr = [];
				let nameList = [];
				let damagedDegreeList = this.damagedDegreeList;
				damagedDegreeList.forEach(function(item) {
					if (!nameList.includes(item.typeName)) { //includes检测数组是否有某个值 内部调用Object.is()利用判断NaN
						nameList.push(item.typeName);
					}
				});
				nameList.forEach(function(typeName) {
					var newArr = damagedDegreeList.filter(function(current, index, array) {
						return current.typeName == typeName;
					});
					let obj = {
						label: typeName,
						list: newArr
					};
					arr.push(obj);
				});
				_this.damagedDegreeTab = arr;
				_this.damagedDegreeLableTab = nameList;
			},
			onClickItem(eObj) {
				let current = eObj.currentIndex;
				this.initContent(current);
				this.current = current;
			},
			initContent(current) {
				let damagedDegreeTab = this.damagedDegreeTab;
				let objData = damagedDegreeTab[current];
				let list = objData.list;
				this.selectList = list;
			},
			initFormPickerResult(result) {
				let selectList = this.selectList;
				let item = result.item;
				let pack = result.pack;
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let index = pack.otherValue;
				let value = item[dataId];
				let formData = selectList[index];
				formData[dataInput] = value;
				formData.entityConditionContent = formData[value];
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
			},
			showText(value) {
				if (value) {
					return " 标准得分:" + value + " ";
				}
				return " 标准得分:" + "0";
			},
			submitForm() {
				this.submitFormServer(function() {
					uni.showToast({
						title: '保存成功',
						success() {

						}
					});
				});
			},
			submitFormServer(successCallback) {
				let damagedDegreeList = this.damagedDegreeList;
				var _this = this;
				let option = {
					query: {
						formData: JSON.stringify(damagedDegreeList)
					},
					showLoading: true,
					url: _this.cardObj.saveAndUpdateUrl,
					successCallback: successCallback
				};
				utils.requestDefault(option);
			},
			inputValidMaxValue(event, itemData, index) {
				let max = 0,
					min = 0,
					score = event.detail.value;
				if (!score) {
					return false;
				}
				if (!itemData.entityCondition) {
					return false;
				}
				score = parseFloat(score);
				switch (itemData.entityCondition) {
					case 'intact': {
						max = itemData.standardScore;
						min = parseFloat(itemData.standardScore * 0.8).toFixed(2);
						break;
					}
					case 'basicallyIntact': {
						min = parseFloat(itemData.standardScore * 0.6).toFixed(2);
						max = parseFloat(itemData.standardScore * 0.79).toFixed(2);
						break;
					}
					case 'generalDamage': {
						min = parseFloat(itemData.standardScore * 0.40).toFixed(2);
						max = parseFloat(itemData.standardScore * 0.59).toFixed(2);
						break;
					}
					case 'seriousDamage': {
						max = parseFloat(itemData.standardScore * 0.39).toFixed(2);
						break;
					}
				}
				if (score < max && score >= min) {

				} else {
					this.selectList[index].score = 0;
					uni.showToast({
						title: min + "~" + max + "范围间",
						duration: 3000,
						icon: "error"
					});
				}
			},
			showValidMaxValueText(itemData) {
				let name = "范围" ;
				if (!itemData.entityCondition) {
					return '';
				}
				let entityConditionList = this.entityConditionList ;
				entityConditionList.forEach(item => {
					if(item.id == itemData.entityCondition){
						name = item.name + name;
					}
				});
				let max = 0,
					min = 0;
				switch (itemData.entityCondition) {
					case 'intact': {
						max = itemData.standardScore;
						min = parseFloat(itemData.standardScore * 0.8).toFixed(2);
						break;
					}
					case 'basicallyIntact': {
						min = parseFloat(itemData.standardScore * 0.6).toFixed(2);
						max = parseFloat(itemData.standardScore * 0.79).toFixed(2);
						break;
					}
					case 'generalDamage': {
						min = parseFloat(itemData.standardScore * 0.40).toFixed(2);
						max = parseFloat(itemData.standardScore * 0.59).toFixed(2);
						break;
					}
					case 'seriousDamage': {
						max = parseFloat(itemData.standardScore * 0.39).toFixed(2);
						break;
					}
				}
				return name+' : ' + min + "~" + max;
			}

		}
	}
</script>

<style>

</style>
