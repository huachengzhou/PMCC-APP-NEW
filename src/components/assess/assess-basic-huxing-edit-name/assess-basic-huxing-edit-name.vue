<template>
	<view>
		<view>
			<view class="select-Input picker-border  context" v-show="showInput">
				<view style="-webkit-flex: 1;flex: 1;">
					<uni-easyinput :clearable="true" :inputBorder="false" @input="inputValue" v-model="resultText"
						placeholder="请输入内容"></uni-easyinput>
				</view>
				<view style="width: 30px;" @click.stop="focus('draw')">
					<view style="width: 25px;" class=" select-Input-picker ">
						<uni-icons type="settings" size="25" style="color: #8f8f94;" />
					</view>
				</view>
			</view>
		</view>

		<uni-drawer ref="draw" mode="right" mask :width="drawerWidth">
			<view>
				<view style="margin-top:20rpx;">
					<view class="uni-box-head">
						<uni-title type="h3" align="center" title="户型"></uni-title>
					</view>
				</view>
				<scroll-view :scroll-y="true" class=" workgroup-box work-list">
					<uni-group title="配置" mode="card">

						<uni-forms-item name="type" label="专有部分" label-align="right">
							<assess-picker :dataInput="'type'" :dataList="typeList" :dataValue="formData.type"
								@dataResult="initFormPickerResult">
							</assess-picker>
						</uni-forms-item>

						<uni-forms-item v-show="categoryList.length > 0" name="category" label="专有部分(类别)"
							label-align="right">
							<assess-picker :dataInput="'category'" :dataList="categoryList"
								:dataValue="formData.category" @dataResult="initFormPickerResult">
							</assess-picker>
						</uni-forms-item>

						<uni-forms-item name="commonPart" label="公共部分" label-align="right">
							<select-input :dataValue="formData.commonPart" :dataInput="'commonPart'"
								:selectDatas="commonPartList" @dataResult="initFormInputSelectResult">
							</select-input>
						</uni-forms-item>

						<uni-forms-item name="method" label="作用区域" label-align="right">
							<uni-data-checkbox multiple v-model="formData.method" :localdata="methodList" />
						</uni-forms-item>

					</uni-group>

					<uni-group title="个数" mode="card">
						<assess-multiple-input-group ref="number" :label="'个数'" :values="dataInputList"
							@updateResult="updateFormData" @rmoveResult="removeInput">
						</assess-multiple-input-group>
					</uni-group>
				</scroll-view>
			</view>

			<view class="text" style="margin-top:30rpx;">
				<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					<button @click="abandon('draw')" class="mini-btn" type="primary" size="mini"> 关闭
					</button>
					<button @click="confirm('draw')" class="mini-btn" type="primary" size="mini"> 保存
					</button>
				</view>
				
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import assessMultipleInputObjectGroup from '@/components/assess/assess-multiple-input-group/assess-multiple-input-object-group.vue';
	import selectInput from '@/components/select-Input/select-Input.vue';
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import * as estateCommonUtils from "../../../common/assess/basic/examine.common.js";
	import * as Explore from "../../../common/assess/Explore.key.js";

	const AssessDicKey = Explore.AssessDicKey;

	export default {
		name: "assess-basic-huxing-edit-name",
		props: {
			dataInput: {
				type: [String, Number],
				default: "name"
			},
			dataValue: {
				type: [String, Number],
				default: ""
			},
			huxingData: {
				type: [String, Number],
				default: ""
			},
			showInput: {
				type: [Boolean],
				default: true
			},
			tenementType: {
				default: ""
			},
			otherInfo: {
				default: ""
			}
		},
		watch: {},
		components: {
			"assess-multiple-input-group": assessMultipleInputObjectGroup,
			"assess-picker": assessPicker,
			"select-input": selectInput,
		},
		data() {
			return {
				resultText: '',
				tenementTypeOld: '',
				//可滑动区域起始位置
				scrollTop: 0,
				//可滑动区域高度
				scrollHeight: '',
				//抽屉弹窗宽度
				drawerWidth: '',
				typeList: [],
				categoryList: [],
				dataInputList: [],
				methodList: [{
					text: "公共",
					value: "公共"
				}, {
					text: "独立",
					value: "独立"
				}, {
					text: "公用",
					value: "公用"
				}],
				commonPartList: ['卫生间', '洗浴间', '厨房', '阳台', '花园', '车库', '楼梯间', '电梯间', '过道', '门厅', '大厅', '管理用房'],
				formData: {
					category: '',
					type: '',
					method: '',
					commonPart: ''
				}
			};

		},
		methods: {
			removeInput(index) {
				let arr = this.dataInputList;
				arr.splice(index, 1);
				this.dataInputList = arr;
			},
			updateFormData(obj) {
				let arr = this.dataInputList;
				let item = arr[obj.index];
				item.value = obj.value;
			},
			initFun: function() {
				this.resultText = this.dataValue;
			},
			inputValue(e) {
				this.resultsData(e);
			},
			resultsData(text) {
				let name = this.dataInput;
				let otherInfo = this.otherInfo;
				this.$emit("dataResult", {
					value: text,
					name: name,
					otherInfo: otherInfo
				});
			},
			changeLoadData: function(name) {
				let data = this.$data;
				let _this = this;
				let formData = data.formData;
				let value = formData[name];
				switch (name) {
					case "type": {
						let arr = _this.typeList;
						let children = "";
						arr.forEach(function(item) {
							if (item.value == value) {
								children = item.children;
							}
						});
						if (children) {
							children.split(",").forEach(function(text) {
								_this.categoryList.push({
									id: text,
									name: text
								});
							});
						}
						break;
					}
					default: {
						break;
					}
				}
				let source = "";
				if (name == 'type') {
					let typeList = _this.typeList;
					typeList.forEach(n => {
						if (value == n.id) {
							source = n.name;
						}
					});
				}
				let methods = this.formData.method;
				let arr = this.dataInputList;
				console.log(arr);
				if (methods.length > 0) {
					methods.forEach(function(method) {
						arr.push({
							text: method + value,
							value: "",
							source: source
						});
					});
				} else {
					arr.push({
						text: value,
						value: "",
						source: source
					});
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
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.formData[dataInput] = value;
				this.changeLoadData(dataInput, false);
			},
			initListData() {
				let data = this.$data;
				var _this = this;
				let tenementType = this.tenementType;
				let tenementTypeOld = this.tenementTypeOld;
				let tenementTypValue = tenementType?tenementType:tenementTypeOld;
				let huxingData = this.huxingData;
				let option = {
					url: "/app.assess/public/toNewOptionsBasicTenement?name=" + tenementTypValue,
					method: "POST",
					data: {
						name: tenementTypValue
					},
					urlParam: true
				};
				if (tenementTypValue) {
					this.$myRequest.pmccRequest(option).then(res => {
						if (res.data.ret) {
							let arr = res.data.data;
							arr.forEach(function(item) {
								item.id = item.value;
								item.source = item.value;
								item.name = item.text;
								let desc = item.desc;
								if (desc) {
									item.id = desc;
								}
							});
							_this.typeList = arr;
						}
					});
				}
				if(huxingData){
					try{
						let list = JSON.parse(huxingData) ;
						if(list){
							let arr = [] ;
							list.forEach(function(item) {
								let tempObj = {
									value: item.value,
									text: item.explain
								};
								if(item.key){
									tempObj.text = item.key ;
									tempObj.source = item.key ;
								}
								if(item.explain){
									tempObj.text = item.explain ;
								}
								arr.push(tempObj) ;
							});
							this.dataInputList = arr ;
						}
					}catch(e){
						//TODO handle the exception
					}
				}
			},
			confirm(e) {
				let arr = this.dataInputList;
				let tempArr = [];
				let huxingData = [];
				arr.forEach(function(item) {
					let text = item.value + item.text;
					tempArr.push(text);
					let tempObj = {
						value: item.value,
						explain: item.text,
						key: item.text
					};
					if(item.source){
						tempObj.key = item.source ;
					}
					huxingData.push(tempObj);
				});
				let name = this.dataInput;
				let otherInfo = this.otherInfo;
				this.$emit("dataResult", {
					value: tempArr.join(""),
					name: name,
					otherInfo: otherInfo,
					huxingData:huxingData
				});
				this.$refs[e].close();
			},
			abandon(e) {
				this.$refs[e].close();
			},
			openModelFunction(tenementTypeOld){
				this.tenementTypeOld = tenementTypeOld;
				this.focus('draw') ;
			},
			//计算手机窗口的高度
			focus(e) {
				let _this = this;
				_this.$refs[e].open();
				this.dataInputList = [];
				this.typeList = [];
				this.initListData();
				//手动关闭软键盘
				// uni.hideKeyboard();
			},
			scrollH() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate)
				this.drawerWidth = winWidth;
				this.scrollHeight = winHeight
			},
		},
		created() {
			this.scrollH();
		}
	}
</script>

<style>
	.context {
		display: flex;
		flex-direction: row;
	}

	.select-Input {
		height: 70rpx;
		padding: 0rpx 0rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		background: #FFF;
		flex: 1;
	}

	.select-Input-picker {
		height: 50rpx;
		padding: 10rpx 0rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		background: #FFF;
		flex: 1;
	}


	.work-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.workgroup-box {
		width: 90%;
		margin-left: 5%;
		height: 900upx;
	}

	.worker-bar {
		width: 200upx;
		display: flex;
		flex-direction: row;
	}
</style>
