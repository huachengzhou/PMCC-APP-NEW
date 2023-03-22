<template>
	<picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="handleValueChange"
		@columnchange="handleColumnChange">
		<slot></slot>
	</picker>
</template>

<script>
	import * as utils from "@/common/untils.js";

	// const CHINA_REGIONS = require('./regions.json');
	export default {
		props: {
			defaultRegions: {
				type: Array,
				default () {
					return []
				}
			},
			defaultRegionCode: {
				type: String
			},
			defaultRegion: [String, Array]
		},
		data() {
			return {
				cityArr: [],
				districtArr: [],
				multiIndex: [0, 0, 0],
				isInitMultiArray: true,
				CHINA_REGIONS: []
			}
		},
		watch: {
			defaultRegion: {
				handler(region, oldRegion) {
					if (Array.isArray(region)) {
						// 避免传的是字面量的时候重复触发
						oldRegion = oldRegion || []
						if (region.join('') !== oldRegion.join('')) {
							this.handleDefaultRegion(region)
						}
					} else if (region && region.length == 6) {
						this.handleDefaultRegion(region)
					} else {
						console.warn('defaultRegion非有效格式')
					}
				},
				immediate: true,
			}
		},
		computed: {
			multiArray() {
				return this.pickedArr.map(arr => arr.map(item => item.name))
			},
			pickedArr() {
				let CHINA_REGIONS = this.CHINA_REGIONS;
				if (CHINA_REGIONS.length != 0) {
					// 进行初始化
					if (this.isInitMultiArray) {
						return [
							CHINA_REGIONS,
							CHINA_REGIONS[0].children,
							CHINA_REGIONS[0].children[0].children
						]
					}
					return [CHINA_REGIONS, this.cityArr, this.districtArr];
				} else {
					return [];
				}

			}
		},
		methods: {
			init() {
				let data = {
					selectALL: true
				};
				let option = {
					url: "/app.public/getProvinceList",
					method: "POST",
					data: data
				};
				this.$myRequest.pmccRequest(option).then(res => {
					if (res.data.ret) {
						let areaList = res.data.data;
						// console.log(areaList);
						this.CHINA_REGIONS = areaList;
						this.cityArr = this.CHINA_REGIONS[0].children;
						this.districtArr = this.CHINA_REGIONS[0].children[0].children;

						let tempRegions = this.defaultRegions;
						let indexArr = [];
						if (tempRegions) {
							for (let i = 0; i < areaList.length; i++) {
								let Region = areaList[i];
								if (tempRegions.length >= 1) {
									this.recursionFindValue(indexArr, Region, tempRegions[0], i, 0, areaList);
								}
								if (tempRegions.length >= 2) {
									this.recursionFindValue(indexArr, Region, tempRegions[1], i, 1, areaList);
								}
								if (tempRegions.length >= 3) {
									this.recursionFindValue(indexArr, Region, tempRegions[2], i, 2, areaList);
								}
							}
							this.multiIndex = indexArr;
							if (tempRegions.length >= 2) {
								this.handleColumnChange({
									detail: {
										column: 1,
										value: indexArr[1]
									}
								});
							}
							if (tempRegions.length >= 3) {
								this.handleColumnChange({
									detail: {
										column: 2,
										value: indexArr[2]
									}
								});
							}
						}
					}
				});
			},
			recursionFindValue(indexArr, item, value, i, code, list) {
				if (!item || !value) {
					return false;
				}
				if (item.name == value) {
					indexArr.push(i);
					if (code == 1) {
						this.cityArr = list;
					}
					if (code == 2) {
						this.districtArr = list;
					}
					
					return false;
				}
				let children = item.children;
				if (children.length != 0) {
					for (let k = 0; k < children.length; k++) {
						let obj = children[k];
						this.recursionFindValue(indexArr, obj, value, k, code, children);
					}
				}
			},
			handleColumnChange(e) {
				// console.log( e.detail);
				let CHINA_REGIONS = this.CHINA_REGIONS;
				if (CHINA_REGIONS.length == 0) {
					return false;
				}
				this.isInitMultiArray = false;
				const that = this;
				let col = e.detail.column;
				let row = e.detail.value;
				that.multiIndex[col] = row;
				try {
					switch (col) {
						case 0:
							if (CHINA_REGIONS[that.multiIndex[0]].children.length == 0) {
								that.cityArr = that.districtArr = [CHINA_REGIONS[that.multiIndex[0]]]
								break;
							}
							that.cityArr = CHINA_REGIONS[that.multiIndex[0]].children
							that.districtArr = CHINA_REGIONS[that.multiIndex[0]].children[that.multiIndex[1]].children
							break;
						case 1:
							that.districtArr = CHINA_REGIONS[that.multiIndex[0]].children[that.multiIndex[1]].children
							break;
						case 2:
							break;
					}
				} catch (e) {
					// console.log(e);
					if(CHINA_REGIONS[that.multiIndex[0]]){
						that.districtArr = CHINA_REGIONS[that.multiIndex[0]].children[0].children;
					}
				}

			},
			handleValueChange(e) {
				// 结构赋值
				let [index0, index1, index2] = e.detail.value;
				let [arr0, arr1, arr2] = this.pickedArr;
				let address = [arr0[index0], arr1[index1], arr2[index2]];
				// console.log(address);
				this.$emit('getRegion', address);
			},
			handleDefaultRegion(region) {
				let CHINA_REGIONS = this.CHINA_REGIONS;
				if (CHINA_REGIONS.length == 0) {
					return false;
				}
				const isCode = !Array.isArray(region)
				this.isInitMultiArray = false;
				let children = CHINA_REGIONS
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < children.length; j++) {
						let condition = isCode ? children[j].code == region.slice(0, (i + 1) * 2) : children[j].name
							.includes(region[i]);
						if (condition) {
							// 匹配成功进行赋值
							// console.log(i,j,children.length-1);
							children = children[j].children;
							if (i == 0) {
								this.cityArr = children
							} else if (i == 1) {
								this.districtArr = children
							}
							this.$set(this.multiIndex, i, j)
							// console.log(this.multiIndex);
							break;
						} else {
							// 首次匹配失败就用默认的初始化
							// console.log(i,j,children.length-1);
							if (i == 0 && j == (children.length - 1)) {
								this.isInitMultiArray = true;
							}
						}
					}
				}
			}
		},
	}
</script>
