<template>
    <view>
        <picker :disabled="disabled" @change="bindRangeChange($event)" :value="indexAssess" :range="itemList"
                :range-key="'text'">
            <view :class="usePickerBorder?'uni-input picker-border':'uni-input'">
                {{selectName}}
            </view>
        </picker>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    //text 和 value属性是uniapp 这个组件自带的

    export default {
        name: 'assess-picker',
        model: {
            prop: 'dataValue', // 默认是value
            event: 'emitResult', // 默认是input
        },
        props: {
            dataList: {
                type: Array,
                default: []
            },
            dataName: {
                type: [String, Number],
                default: "name"
            },
            dataId: {
                type: [String, Number],
                default: "id"
            },
            dataInput: {
                type: [String, Number],
                default: ""
            },
            dataValue: {
                type: [String, Number, Boolean],
                default: ""
            },
            otherValue: {
                default: ""
            },
            disabled: {
                default: false
            },
            usePickerBorder: {
                type: [Boolean],
                default: function () {
                    return true;
                }
            }
        },
        data() {
            return {}
        },
        computed: {
            itemList: function () {
                //将传入的列表  变为 组件所需要的列表
                let _this = this;
                var resultData = this.dataList;
                var result = [];
                resultData.forEach(function (item) {
                    if (_this.dataName) {
                        item.text = item[_this.dataName];
                    }
                    if (_this.dataId) {
                        item.value = item[_this.dataId];
                    }
                    result.push(item);
                });
                let tempobj = {};
                tempobj[_this.dataId] = '';
                tempobj[_this.dataName] = '未选择';
                tempobj.text = '未选择';
                tempobj.dataId = '';
                result.unshift(tempobj);
                return result;
            },
            indexAssess: function () {
                //计算index
                let index = '';
                let itemList = this.itemList;
                let dataValue = this.dataValue;
                if (dataValue != null && dataValue != undefined && utils.isNotEmptyString(dataValue + '')) {
                    for (let i = 0; i < itemList.length; i++) {
                        let resultValue = itemList[i].value;
                        if (utils.isNumber(dataValue)) {
                            if (Number(resultValue) == Number(dataValue)) {
                                index = i;
                            }
                        }
                        if (!utils.isNumber(dataValue)) {
                            if (resultValue == dataValue) {
                                index = i;
                            }
                        }
                    }
                }
                return index;
            },
            selectName: function () {
                //计算  名称
                let indexAssess = this.indexAssess;
                let arr = this.itemList;
                let text = '';
                if (indexAssess != '') {
                    text = arr[indexAssess].text;
                }
                return text;
            }
        },
        methods: {
            bindRangeChange: function (e) {
                let _this = this;
                let listData = this.itemList;
                let item = listData[e.detail.value];
                let dataValue = item[_this.dataId];
                let id = this.dataId;
                let dataName = _this.dataName;
                let pack = {
                    dataList: _this.dataList,
                    dataName: _this.dataName,
                    dataId: _this.dataId,
                    dataInput: _this.dataInput,
                    otherValue: _this.otherValue
                };
                let obj = {
                    item: item,
                    pack: pack
                };
                this.$emit("dataResult", obj);
                this.$emit("emitResult", dataValue);
            }
        }
    }
</script>

<style scoped>

</style>
