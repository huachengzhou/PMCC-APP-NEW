<template>
	<view>
		<view>
			<button class="mini-btn" type="primary" size="mini" @click.stop="initFun()">影响要素描述</button>
		</view>
		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view>
					<uni-row :width="nvueWidth">
						<uni-col :span="24">
							<view>
								<uni-data-checkbox mode="tag" v-model="tabIndex" :localdata="tabList">
								</uni-data-checkbox>
							</view>
						</uni-col>
					</uni-row>
				</view>
				<uni-group mode="card">
					<view v-for="(item,index) in dataList">
						<view v-show="tabIndex == index">
							<uni-row :gutter="gutter" :width="nvueWidth">
								<uni-col :span="22">
									<uni-forms-item :name="item.name" :label="item.label" label-align="right">
										<uni-easyinput type="textarea" autoHeight v-model="item.value"
											:placeholder="item.label" />
									</uni-forms-item>
								</uni-col>
								<uni-col :span="2">
									<view style="padding-bottom:50rpx;" @click.stop="removeInput(item.id,index)">
										<uni-icons color="'#8f8f94'" type="clear" size="30"></uni-icons>
									</view>
								</uni-col>
							</uni-row>
						</view>
					</view>
				</uni-group>


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
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	export default {
		components: {
			"my-ming-pop": myMingPop
		},
		computed: {
			tabList: function() {
				let arr = [];
				let dataList = this.dataList;
				if (dataList.length != 0) {
					for (var i = 0; i < dataList.length; i++) {
						let obj = {
							value: i,
							text: dataList[i].label
						};
						arr.push(obj);
					}
				}
				return arr;
			}
		},
		props: {
			dataValue: {
				type: String,
				default: function() {
					return '';
				}
			}
		},
		data() {
			return {
				dataList: [],
				baseList: [],
				fieldName: "influenceFactorRemarkText",
				gutter: 0,
				tabIndex: 0,
				nvueWidth: 730
			}
		},
		watch: {},
		methods: {
			initFun() {
				if (!this.dataValue) {
					uni.showToast({
						title: "影响要素(无)",
						icon: "error",
						duration: 2000
					});
					return false;
				}
				this.loadDataList();
				this.$refs.myMingPop.show();
			},
			loadDataList() {
				let _this = this;
				let arr = [];
				if (!this.dataValue) {
					this.dataList = arr;
					return false;
				}
				let tempArr = this.dataValue.split(",");
				let fieldName = this.fieldName;
				let ids = [];
				for (let i = 0; i < tempArr.length; i++) {
					let str = tempArr[i];
					if (!str) {
						continue;
					}
					let newArr = str.split(":");
					let value = "";
					let name = "";
					let id = "";
					if (newArr.length >= 1) {
						name = newArr[0];
						id = name.replace(/[^0-9]/ig, "");
					}
					if (newArr.length >= 2) {
						value = newArr[1];
					}
					let obj = {
						id: id,
						name: name,
						value: value,
						sort: i,
						label: ""
					};
					ids.push(id);
					arr.push(obj);
				}
				assessCommonUtils.getDataDicListByIds(ids.join(","), function(baseList) {
					_this.baseList = baseList
					arr.forEach(item => {
						baseList.forEach(n => {
							if (Number(item.id) == n.id) {
								item.label = n.name;
							}
						})
					})
					_this.dataList = arr;
				});
			},
			closeModel() {
				this.$refs.myMingPop.close();
			},
			sureFn() {
				this.closeModel();
				let value = this.collectResult();
				this.$emit("influenceFactorRemarkTextSure", value);
			},
			removeInput(id, index) {
				let value = this.collectResult(index);
				this.$emit("influenceFactorRemarkTextRemove", {
					id: id,
					index: index,
					value: value
				});
			},
			collectResult(index) {
				let dataList = this.dataList;
				if (dataList.length == 0) {
					return "";
				}
				let numberFlag = utils.isNumber(index);
				let arr = [];
				dataList.forEach(function(item, m) {
					let text = item.name + ":" + item.value;
					if (numberFlag) {
						if (index != m) {
							arr.push(text);
						}
					} else {
						arr.push(text);
					}
				});
				return arr.join(",");
			}
		}
	}
</script>

<style>
</style>
