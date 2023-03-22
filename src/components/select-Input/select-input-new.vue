<template>
	<view>
		<view>
			<view class="select-Input picker-border  context">
				<view style="-webkit-flex: 1;flex: 1;">
					<uni-easyinput :clearable="true" :inputBorder="false" @input="inputValue" :value="resultText"
						placeholder="请输入内容"></uni-easyinput>
				</view>
				<view style="width: 30px;">
					<picker @change="pickerChange" :value="pickerIndex" :range="selectDatas">
						<view style="width: 25px;" class=" select-Input-picker ">
							<uni-icons type="list" size="25" style="color: #8f8f94;" />
						</view>
					</picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "select-Input",
		model: {
			prop: 'dataValue', // 默认是value
			event: 'emitResult', // 默认是input
		},
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
			otherInfo :{
				default: ""
			}
		},
		data() {
			return {
				pickerIndex: 0
			};
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
		methods: {
			initFun: function() {

			} ,
			inputValue(e) {
				this.resultsData(e);
			},
			pickerChange(e) {
				this.pickerIndex = e.detail.value;
				let text = this.selectDatas[this.pickerIndex];
				this.resultsData(text);
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
