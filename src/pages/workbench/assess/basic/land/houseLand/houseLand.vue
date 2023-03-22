<template>

    <view style="margin-top: 40px;">

        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
            <uni-group title="基本信息" mode="card">


                <uni-forms-item required name="landUseType" label="土地用途类型" label-align="right">
                    <select-input :dataValue="formData.landUseType" :dataInput="'landUseType'"
                                  :selectDatas="landUseTypeNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>


                <uni-forms-item required name="landUseCategory" label="土地用途类别" label-align="right">
                    <select-input :dataValue="formData.landUseCategory" :dataInput="'landUseCategory'"
                                  :selectDatas="landUseCategoryNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item name="landLevelRemark" label="土地级别说明" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.landLevelRemark" placeholder="土地级别说明">
                    </uni-easyinput>
                </uni-forms-item>
                <uni-forms-item required name="acquisitionTime" label="土地取得时间" label-align="right">
                    <uni-datetime-picker type="date" :value="formData.acquisitionTime"
                                         v-on:change="setFormValue('acquisitionTime',$event)"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item name="terminationData" label="土地终止日期" label-align="right">
                    <uni-datetime-picker type="date" :value="formData.terminationData"
                                         v-on:change="setFormValue('terminationData',$event)"></uni-datetime-picker>
                </uni-forms-item>


                <uni-forms-item name="landUseYearType" label="法定年限" label-align="right">
                    <select-input :dataValue="formData.landUseYearType" :dataInput="'landUseYearType'"
                                  :selectDatas="landUseYearTypeList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>


                <uni-forms-item name="landUseYear" label="法定年限" label-align="right">
                    <uni-easyinput type="text" v-model="formData.landUseYear" placeholder="法定年限"/>
                </uni-forms-item>

                <uni-forms-item name="legalYearDesc" label="法定年限说明" label-align="right">
                    <uni-easyinput type="text" v-model="formData.legalYearDesc" placeholder="法定年限说明"/>
                </uni-forms-item>
                <uni-forms-item name="developTime" label="开发时间" label-align="right">
                    <uni-datetime-picker type="date" :value="formData.developTime"
                                         v-on:change="setFormValue('developTime',$event)"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item name="plotRatio" label="容积率" label-align="right">
                    <uni-easyinput type="text" v-model="formData.plotRatio" placeholder="容积率"/>
                </uni-forms-item>
                <uni-forms-item name="landShape" label="土地形状" label-align="right">
                    <uni-easyinput type="text" v-model="formData.landShape" placeholder="土地形状"/>
                </uni-forms-item>
                <uni-forms-item name="buildingDensity" label="建筑密度" label-align="right">
                    <uni-easyinput type="text" v-model="formData.buildingDensity" placeholder="建筑密度"/>
                </uni-forms-item>
                <uni-forms-item name="greeningRate" label="绿地率" label-align="right">
                    <uni-easyinput type="text" v-model="formData.greeningRate" placeholder="绿地率"/>
                </uni-forms-item>
                <uni-forms-item name="compatibilityType" label="兼容类型" label-align="right">
                    <uni-easyinput type="text" v-model="formData.compatibilityType" placeholder="兼容类型"/>
                </uni-forms-item>
                <uni-forms-item name="compatibilityRate" label="兼容比例" label-align="right">
                    <uni-easyinput type="text" v-model="formData.compatibilityRate" placeholder="兼容比例"/>
                </uni-forms-item>
                <uni-forms-item name="heightPermitted" label="建筑限高" label-align="right">
                    <uni-easyinput type="text" v-model="formData.heightPermitted" placeholder="建筑限高"/>
                </uni-forms-item>

                <view v-for="(fieldData,index_f) in tableFields">
                    <uni-forms-item :name="fieldData.fieldName" :label="fieldData.name" label-align="right">
                        <common-image-picker
                                :dataObj="setImgFieldsName(fieldData.fieldName)">
                        </common-image-picker>
                    </uni-forms-item>
                </view>
            </uni-group>
        </uni-forms>


        <assess-basic-house-foot-nav ref="houseFootNav" :dataId="batchDetail.pid" :batchDetail="batchDetail"
                                     @renderFun="serverRenderingThisView">
        </assess-basic-house-foot-nav>


        <view v-if="!commitFlag">
            <view class="uni-flex uni-row " style="width: 100%;">
                <view style="-webkit-flex: 1;flex: 1;" class="assessbtnLeft">
                    <button @click.stop="submitForm()">
                        提交
                    </button>
                </view>
                <view style="-webkit-flex: 1;flex: 1;" class="assessbtnRight">
                    <button @click.stop="submitTempForm()">
                        临时保存
                    </button>
                </view>
            </view>


        </view>
        <assess-submit-button v-show="commitFlag" style="margin-top:50px;">
            {{commitTitle}}
        </assess-submit-button>


    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
    import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
    import * as Explore from '@/common/assess/Explore.key.js';

    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
    import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
    import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';
    import selectInput from '@/components/select-Input/select-Input.vue';

    import assessBasicHouseFootNav
        from '@/components/assess/basic/assess-basic-house-foot-nav/assess-basic-house-foot-nav.vue';
    import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

    const AssessDicKey = Explore.AssessDicKey;
    const AssessDBKey = Explore.AssessDBKey;

    let ruleField = [
        'id',
        ':landUseType',
        ':landUseCategory',
        'landLevelRemark',
        ':acquisitionTime',
        'terminationData',
        'legalYearDesc',
        'developTime',
        'plotRatio',
        'landShape',
        'buildingDensity',
        'greeningRate',
        'compatibilityType',
        'compatibilityRate',
        'heightPermitted',
        'landUseYearType',
        'landUseYear',
    ];

    let rules = utils.getRules(ruleField);
    let formDataFields = utils.getFormDataField(ruleField);
    Object.assign(formDataFields, {});

    // 多选框 必须包含 text和value
    let thisViewData = {
        transferId: '',
        tableFields: [],
        cardObj: null,
        homeParam: {},
        landUseTypeList: [],
        landUseTypeNameList: [],
        landUseCategoryList: [],
        landUseCategoryNameList: [],
        landUseYearTypeList: ['法定', '其他'],
        commitFlag: false,
        commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
        batchDetail: {},
        formData: formDataFields,
        rules: rules
    };

    export default {
        data() {
            return thisViewData;
        },
        computed: {},
        watch: {
            formData: {
                handler(newValue, oldValue) {
                    let data = this.$data;
                    var _this = this;
                },
                deep: true //true 深度监听
            }
        },
        onLoad(option) {
            if (option.batchDetailJson) {
                let batchDetail = JSON.parse(option.batchDetailJson);
                this.batchDetail = batchDetail;
                console.log(batchDetail);
            }
            if (option.cardJson) {
                let cardObj = JSON.parse(option.cardJson);
                this.cardObj = cardObj;
                if (cardObj.getUrl) {
                    this.setServerData(cardObj.getUrl);
                }
            }
            if (option.homeParam) {
                this.homeParam = JSON.parse(option.homeParam);
            }
            //提交按钮控制
            estateCommonUtils.runBasicCheckWriteContent(this.homeParam.applyBatchId, this.$helper.fetchLocalUser(), this
                .$data);
            console.log(this.homeParam);
        },
        onShow() {

        },
        onReady() {
            // 需要在onReady中设置规则
            // this.$refs.form.setRules(this.rules);
        },
        components: {
            "assess-picker": assessPicker,
            "assess-submit-button": assessSubmitButton,
            "common-image-picker": commonImagePicker,
            "select-input": selectInput,
            "common-file-picker": commonFilePicker,
            "assess-basic-house-foot-nav": assessBasicHouseFootNav,
            "input-autocomplete": inputAutocomplete
        },
        methods: {
            submit(data, commitFlag) {
                let query = {
                    formData: JSON.stringify(data)
                };
                console.log(query);
                var _this = this;
                let option = {
                    url: "/app.assess/basicEstateLandCategoryInfo/saveAndUpdateServer",
                    showLoading: true,
                    query: query,
                    // notParam: true,
                    successCallback: function (resultData) {
                        uni.showToast({
                            title: '保存成功',
                            success() {
                                let query = _this.homeParam;
                                query.transferId = _this.batchDetail.id;
                                let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
                                if (commitFlag) {
                                    uni.redirectTo({
                                        url: url
                                    });
                                }
                            }
                        });
                    }
                };
                utils.requestDefault(option);
            },
            submitTempForm() {
                var _this = this;
                let batchDetail = this.batchDetail;
                let res = this.formData;
                let userInfo = _this.$helper.fetchLocalUser();
                let data = utils.assignObj(res, {
                    //特殊处理一些兼容性东西
                    creator: userInfo.userAccount,
                    id: _this.formData.id
                });
                console.log('表单返回得值：', data);

                _this.submit(data, false);
            },
            submitForm(form) {
                // 手动提交表单
                var _this = this;
                let batchDetail = this.batchDetail;
                this.$refs.form.validate().then((res) => {
                    //特殊处理一些兼容性东西
                    let userInfo = _this.$helper.fetchLocalUser();
                    let data = utils.assignObj(res, {
                        creator: userInfo.userAccount,
                        id: _this.formData.id
                    });
                    console.log('表单返回得值：', data);

                    _this.submit(data, true);
                });
            },
            initListData: function () {
                let data = this.$data;
                var _this = this;
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_total_land_use, function (
                    resultData) {
                    if (!resultData) {
                        return false;
                    }
                    data.landUseTypeList = resultData;
                    let arr = [];
                    resultData.forEach(function (item) {
                        arr.unshift(item.name);
                    });
                    data.landUseTypeNameList = arr;
                    _this.changeLoadData("landUseType");
                });

                assessCommonUtils.loadAllChildDataDicList('estateLandUseCategory', function(
                    resultData) {
                    if (!resultData) {
                        return false;
                    }
                    data.tableFields = resultData;
                });
            },
            setFormValue: function (name, value) {
                let formData = this.formData;
                formData[name] = value;
                this.formData = formData;
            },
            changeLoadData: function (name) {
                let data = this.$data;
                let _this = this;
                let formData = data.formData;
                let value = formData[name];
                switch (name) {
                    case "landUseType": {
                        let list = this.landUseTypeList;
                        let tempId = "";
                        if (utils.isNotEmptyString(value)) {
                            list.forEach(function (item) {
                                if (item.name == value) {
                                    tempId = item.id;
                                }
                            });
                        }
                        if (!tempId) {
                            return false;
                        }
                        estateCommonUtils.getDataDicListByPid(tempId, function (resultData) {
                            if (!resultData) {
                                return false;
                            }
                            data.landUseCategoryList = resultData;
                            let arr = [];
                            resultData.forEach(function (item) {
                                arr.unshift(item.name);
                            });
                            data.landUseCategoryNameList = arr;
                        });
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
            serverRenderingThisView(batchDetail) {
                this.batchDetail = batchDetail;
                let cardObj = this.cardObj;
                this.cardObj = cardObj;
                if (cardObj.getUrl) {
                    this.setServerData(cardObj.getUrl);
                }
            },
            initFormInputSelectResult(result) {
                let dataInput = result.name;
                let value = result.value;
                this.formData[dataInput] = value;
                this.changeLoadData(dataInput, false);
                this.$refs.form.setValue(dataInput, value);
            },
            setServerData: function () {
                let _this = this;
                let batchDetail = this.batchDetail;
                let formData = this.formData;
                let query = {
                    formClassify: batchDetail.type,
                    tableId: batchDetail.tableId
                };
                if (!batchDetail.tableId) {
                    return false;
                }
                let option = {
                    query: {
                        houseId: batchDetail.tableId
                    },
                    notParam: true,
                    url: "/app.assess/basicEstateLandCategoryInfo/getBasicEstateLandCategoryInfoByHouseId?houseId=" +
                        batchDetail.tableId,
                    successCallback: function (resultData) {
                        if (!resultData) {
                            return false;
                        }
                        console.log(resultData);
                        var keys = Object.keys(formData);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            var value = formData[key];
                            formData[key] = resultData[key];
                        }
                        _this.formData = formData;
                        _this.initListData();
                    }
                };
                utils.requestDefault(option);
            },
            initFormPickerResult(result) {
                let item = result.item;
                let pack = result.pack;
                let dataId = pack.dataId;
                let dataInput = pack.dataInput;
                let value = item[dataId];
                this.formData[dataInput] = value;
                this.changeLoadData(dataInput);
                this.$refs.form.setValue(dataInput, value);
            },
            setImgFieldsName(fieldsName) {
                let batchDetail = this.batchDetail;
                let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey);
                let obj = {
                    fieldsName: fieldsName,
                    tableId: batchDetail.tableId,
                    tableName: batchDetail.tableName,
                    appKey: appCacheKey
                };
                return obj;
            }

        }
    }
</script>

<style>

</style>
