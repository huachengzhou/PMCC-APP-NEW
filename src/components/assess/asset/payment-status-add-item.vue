<template>

	<view>
		<view>
			<button type="primary" size="mini" @click.stop="initFun()">
				明细新增
				<uni-icons color="'#8f8f94'" type="plus-filled" size="16"></uni-icons>
			</button>
		</view>
		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-bottom:20rpx;">
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
							<uni-forms-item name="projectName" label="项目" label-align="right">
								<uni-easyinput type="text" v-model="item.projectName" placeholder="项目">
								</uni-easyinput>
							</uni-forms-item>

							<uni-forms-item name="remark" label="类型" label-align="right">
								<uni-data-checkbox mode="tag" v-model="item.remark" :localdata="remarkList">
								</uni-data-checkbox>


								<!-- <assess-picker :dataInput="'remark'" :dataList="remarkList" :dataValue="item.remark"
									:otherValue="index" @dataResult="initFormPickerResult">
								</assess-picker> -->
							</uni-forms-item>

							<uni-forms-item name="money" label="金额" label-align="right">
								<uni-easyinput type="digit" v-model="item.money" placeholder="金额">
								</uni-easyinput>
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
	import myMingPop from "@/components/ming-pop/ming-pop.vue";
	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';

	export default {
		components: {
			"my-ming-pop": myMingPop,
			"assess-picker": assessPicker,
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
			dataValue: {
				type: String,
				default: function() {
					return '';
				}
			}
		},
		data() {
			return {
				nvueWidth: 730,
				dataList: [],
				formData: {},
				tabIndex: 0,
				remarkList: [{
					text: "未缴",
					value: "未缴"
				}, {
					text: "欠缴",
					value: "欠缴"
				}, {
					text: "应缴",
					value: "应缴"
				}]
			}
		},
		watch: {},
		methods: {
			initFun() {
				this.loadDataList();
				this.$refs.myMingPop.show();
			},
			loadDataList() {
				let value = this.dataValue;
				if (!value) {
					this.dataList = [];
					return false;
				}
				this.dataList = JSON.parse(value);
				console.log(this.dataList);
			},
			closeModel() {
				this.$refs.myMingPop.close();
			},
			sureFn() {
				this.closeModel();
				let dataList = this.dataList;
				this.$emit("sureFun", dataList);
			},
			removeInput(index) {
				let dataList = this.dataList;
				this.$emit("removeFun", dataList, index);
				if (this.tabIndex != 0) {
					this.tabIndex = this.tabIndex - 1;
				}
			},
			addData() {
				let dataList = this.dataList;
				dataList.push({
					money: '',
					remark: '',
					projectName: ""
				});
				this.tabIndex = dataList.length - 1;
			},
			initFormPickerResult(result) {
				let dataList = this.dataList;
				let item = result.item;
				let pack = result.pack;
				let index = pack.otherValue;
				let formData = dataList[index];
				let dataId = pack.dataId;
				let dataInput = pack.dataInput;
				let value = item[dataId];
				this.formData[dataInput] = value;
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
