<template>
	<view>
		<view v-if="values.length > 0">

			<view v-for="(item,index) in values">
				<uni-group :title="getTitle(index)" mode="card">

					<uni-forms-item name="name" label="名称" label-align="right">
						<uni-easyinput type="text" @input="changeInputValue($event,item,index,'name')"
							:value="item.name" placeholder="名称" />
					</uni-forms-item>

					<uni-forms-item name="unitLocation" label="所在位置" label-align="right">
						<select-input :otherInfo="index" :dataValue="item.unitLocation" :dataInput="'unitLocation'"
							:selectDatas="locationDataList" @dataResult="initFormInputSelectResult">
						</select-input>
					</uni-forms-item>

					<uni-forms-item name="description" label="描述" label-align="right">
						<select-input :otherInfo="index" :dataValue="item.description" :dataInput="'description'"
							:selectDatas="descriptionList" @dataResult="initFormInputSelectResult">
						</select-input>
					</uni-forms-item>

					<view>
						<button @click="removeInput(index)" class="mini-btn" type="primary" size="mini">
							<uni-icons color="'#8f8f94'" type="clear" size="15"></uni-icons>
							移除
						</button>
					</view>


				</uni-group>
			</view>

		</view>
	</view>
</template>

<script>
	import * as utils from "../../../common/untils.js";
	import selectInput from '@/components/select-Input/select-Input.vue';

	export default {
		name: 'assess-basic-unit-common-part',
		props: {
			values: {
				type: Array,
				default: function(){
					return [];
				}
			},
			locationDataList: {
				type: Array,
				required: false,
				default: function() {
					return ['室外左倾', '室内右倾', '中间'];
				}
			},
			descriptionList: {
				type: Array,
				required: false,
				default: function() {
					return ['无', '未知'];
				}
			}
		},
		data() {
			return {
				name: "assess-basic-unit-common-part_default_name"
			}
		},
		watch: {},
		computed: {},
		components: {
			"select-input": selectInput
		},
		methods: {
			changeInputValue(value, item, index, name) {
				let obj = {
					index: index,
					item: item,
					value: value,
					name: name
				};
				this.$emit("updateResult", obj);
			},
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				let index = result.otherInfo;
				index = Number(index);
				let list = this.values;
				let item = list[index];
				this.changeInputValue(value, item, index, dataInput);

			},
			removeInput: function(index) {
				this.$emit("rmoveResult", index);
			},
			getTitle(index) {
				return "记录" + (index + 1);
			}
		}
	}
</script>

<style>

</style>
