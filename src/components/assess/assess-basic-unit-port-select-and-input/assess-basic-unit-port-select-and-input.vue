<template>
	<view>
		<select-input :dataValue="dataValue" :dataInput="dataInput" :selectDatas="dataList"
			@dataResult="initFormInputSelectResult">
		</select-input>
	</view>
</template>

<script>
	import * as utils from "../../../common/untils.js";
	import selectInput from '@/components/select-Input/select-Input.vue';

	export default {
		name: 'assess-basic-unit-port-select-and-input',
		props: {
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
			},
			masterId: {
				type: [Number],
				default: ""
			},
			filterName: {
				type: [String],
				default: ""
			}
		},
		data() {
			return {
				resultText: "",
				dataList: []
			}
		},
		watch: {

		},
		computed: {},
		components: {
			"select-input": selectInput
		},
		methods: {
			initFun: function() {
				this.resultText = this.dataValue;
				let masterId = this.masterId;
				let option = {
					url: "/app.assess/basicUnitCommonPart/getPageResult",
					method: "POST",
					data: {
						pageNum: 1,
						pageSize: 50,
						masterId: masterId
					}
				};
				let _this = this;
				let filterName = this.filterName;
				if (masterId) {
					this.$myRequest.pmccRequest(option).then(res => {
						let dataAll = [];
						if (res.data.ret) {
							dataAll = res.data.data.rows;
						}
						var unitCommonParts = [];
						dataAll.forEach(function(data) {
							var resultData = [];
							if (data.unitLocationSource) {
								try {
									resultData = JSON.parse(data.unitLocationSource);
								} catch (e) {}
							}
							resultData.forEach(function(item) {
								var name = item.name + item.index;
								if (filterName) {
									if (item.name && item.name.indexOf(filterName) > -1) {
										unitCommonParts.push(item.name);
									}
								} else {
									unitCommonParts.push(item.name);
								}
							});
						});
						if (unitCommonParts.length != 0) {
							_this.dataList = _this.uniq(unitCommonParts);
						} else {
							uni.showToast({
								title: '请在公共部分选择部位楼梯间添加部位记录'
							});
						}
					});
				}
			},
			initList: function() {

			},
			uniq(array) {
				var temp = []; //一个新的临时数组
				for (var i = 0; i < array.length; i++) {
					if (temp.indexOf(array[i]) == -1) {
						temp.push(array[i]);
					}
				}
				return temp;
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
			initFormInputSelectResult(result) {
				let dataInput = result.name;
				let value = result.value;
				this.resultsData(value);
			}
		},
		mounted: function() {
			// this.initFun();
			// this.initList();
		},
		updated: function() {
			// this.initFun();
		}
	}
</script>

<style>
</style>
