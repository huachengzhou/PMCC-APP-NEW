<template>
	<view>
		<view v-if="values.length > 0">
			<view class="assess-multiple-input-group-class   context" v-for="(item,index) in values">
				<view style="-webkit-flex: 1;flex: 1;">
					<view class="content-box">
						<uni-forms-item :label="label" label-align="right">
							<uni-easyinput @input="changeInputValue($event,index)" type="text" :value="item"
								:placeholder="label" />
						</uni-forms-item>
					</view>
				</view>
				<view style="width: 30px;">
					<view @click="removeInput(index)">
						<uni-icons type="closeempty" size="25" style="color: #8f8f94;" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "../../../common/untils.js";

	export default {
		name: 'assess-multiple-input-group',
		props: {
			label: {
				type: String,
				default: ''
			},
			values: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				name: "assess_multiple_input_group_default_name"
			}
		},
		watch: {},
		computed: {},
		methods: {
			changeInputValue(value, index) {
				let obj = {
					index: index,
					value: value
				};
				this.$emit("updateResult", obj);
			},
			removeInput: function(index) {
				this.$emit("rmoveResult", index);
			}
		}
	}
</script>

<style>
	.context {
		display: flex;
		flex-direction: row;
	}

	.assess-multiple-input-group-class {
		height: 70rpx;
		padding: 0rpx 0rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		background: #FFF;
		flex: 1;
		margin-top: 25rpx;
		margin-bottom:20rpx;
	}

	
</style>
