<template>
	<view>
		<view>
			<view class="select-Input picker-border  context">
				<view style="-webkit-flex: 1;flex: 1;">
					<uni-easyinput :clearable="true" :inputBorder="false" @input="inputValue" :value="resultText"
						placeholder="请输入内容"></uni-easyinput>
				</view>
				<view style="width: 30px;">
					<view @click.stop="openModel" style="width: 25px;" class=" select-Input-picker ">
						<uni-icons type="bars" size="25" style="color: #8f8f94;" />
					</view>
				</view>
			</view>
		</view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="true" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
					</view>

					<uni-group title="多选">
						<uni-data-checkbox multiple v-model="mulTextArr" :localdata="selectDatas"></uni-data-checkbox>
					</uni-group>

					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						<button class="uni-button" size="mini" type="primary" @click.stop="surePrimary()">确定</button>
						<button class="uni-button" size="mini" type="primary" @click.stop="mulAllSure()">全选</button>
						<button class="uni-button" size="mini" type="primary" @click.stop="mulAllNotSure()">全不选</button>

						<button class="uni-button" size="mini" type="warn"
							@click.stop="$refs.myMingPop.close()">关闭</button>
					</view>
				</view>
			</my-ming-pop>
		</view>


	</view>
</template>

<script>
	import myMingPop from "@/components/ming-pop/ming-pop.vue";


	export default {
		name: "select-Input-mul",
		props: {
			selectDatas: {
				type: Array,
				default: []
			},
			dataInput: {
				type: [String, Number],
				default: "name"
			},
			dataValue: {
				type: [String, Number],
				default: ""
			},
			otherInfo: {
				default: ""
			}
		},
		components: {
			"my-ming-pop": myMingPop
		},
		computed:{
			resultText : function () {
				let text = '' ;
				if (this.dataValue){
					text = this.dataValue ;
				}
				return text;
			}
		},
		data() {
			return {
				mulTextArr: []
			};
		},
		methods: {
			inputValue(e) {
				this.resultsData(e);
			},
			surePrimary() {
				let mulTextArr = this.mulTextArr;
				if (mulTextArr.length != 0) {
					this.resultsData(mulTextArr.join(","));
				}
				this.closeModel();
			},
			mulAllSure(){
				this.selectDatas.forEach(item => {
					this.mulTextArr.push(item.value) ;
				});
			},
			mulAllNotSure(){
				 this.mulTextArr = [];
			},
			resultsData(text) {
				let name = this.dataInput;
				let otherInfo = this.otherInfo;
				this.$emit("dataResult", {
					value: text,
					name: name,
					otherInfo: otherInfo
				});
				this.$emit("emitResult", text);
			},
			openModel() {
				this.$refs.myMingPop.show();
				this.mulTextArr = [];
			},
			closeModel() {
				this.$refs.myMingPop.close();
			}
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
</style>
