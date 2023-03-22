<template>
    <view style="margin-top: 40px;">

        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
            <uni-group title="" mode="card">
                <!-- <uni-forms-item required name="name" label="土地名称" label-align="right">
                    <uni-easyinput type="text" v-model="formData.name" placeholder="土地名称" />
                </uni-forms-item> -->
                <uni-forms-item required name="eastToName" label="四至(1)" label-align="right">
                    <select-input :dataValue="formData.eastToName" :dataInput="'eastToName'"
                                  :selectDatas="eastToNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item required name="eastTo" label="四至(1)名称" label-align="right">
                    <uni-easyinput type="text" v-model="formData.eastTo" placeholder="四至(1)名称"/>
                </uni-forms-item>
                <uni-forms-item required name="southToName" label="四至(2)" label-align="right">
                    <select-input :dataValue="formData.southToName" :dataInput="'southToName'"
                                  :selectDatas="southToNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item required name="southTo" label="四至(2)名称" label-align="right">
                    <uni-easyinput type="text" v-model="formData.southTo" placeholder="四至(2)名称"/>
                </uni-forms-item>
                <uni-forms-item required name="westToName" label="四至(3)" label-align="right">
                    <select-input :dataValue="formData.westToName" :dataInput="'westToName'"
                                  :selectDatas="westToNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item required name="westTo" label="四至(3)名称" label-align="right">
                    <uni-easyinput type="text" v-model="formData.westTo" placeholder="四至(3)名称"/>
                </uni-forms-item>
                <uni-forms-item required name="northToName" label="四至(4)" label-align="right">
                    <select-input :dataValue="formData.northToName" :dataInput="'northToName'"
                                  :selectDatas="northToNameList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item required name="northTo" label="四至(4)名称" label-align="right">
                    <uni-easyinput type="text" v-model="formData.northTo" placeholder="四至(4)名称"/>
                </uni-forms-item>
                <uni-forms-item required name="landAreaUnit" label="土地面积单位" label-align="right">
                    <select-input :dataValue="formData.landAreaUnit" :dataInput="'landAreaUnit'"
                                  :selectDatas="landAreaUnitList" @dataResult="initFormInputSelectResult">
                    </select-input>
                </uni-forms-item>
                <uni-forms-item required name="shapeState" label="土地形状" label-align="right">
                    <assess-picker :dataInput="'shapeState'" :dataList="shapeStateList" :dataValue="formData.shapeState"
                                   @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>

                <uni-forms-item required name="planeness" label="地形" label-align="right">
                    <assess-picker :dataInput="'planeness'" :dataList="planenessList" :dataValue="formData.planeness"
                                   @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>

                <uni-forms-item required name="topographicTerrain" label="地势" label-align="right">
                    <assess-picker :dataInput="'topographicTerrain'" :dataList="topographicTerrainList"
                                   :dataValue="formData.topographicTerrain" @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>


                <uni-forms-item required name="shapeStateRemark" label="土地形状说明" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.shapeStateRemark" placeholder="土地形状说明">
                    </uni-easyinput>
                </uni-forms-item>


                <uni-forms-item required name="developmentDegree" label="土地开发程度" label-align="right">
                    <assess-picker :dataInput="'developmentDegree'" :dataList="developmentDegreeList"
                                   :dataValue="formData.developmentDegree" @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>


                <uni-forms-item v-show="developmentDegreeName == '熟地'" name="developmentDegreeContent" label="内基础设施">
                    <uni-data-checkbox multiple v-model="formData.developmentDegreeContent"
                                       :localdata="developmentDegreeContentList"/>
                </uni-forms-item>

                <uni-forms-item required name="presentSituationLandUse" label="土地利用现状" label-align="right">
                    <uni-easyinput type="text" v-model="formData.presentSituationLandUse" placeholder="土地利用现状"/>
                </uni-forms-item>

                <uni-forms-item v-show="developmentDegreeName == '生地'" name="developmentDegreeRemark" label="土地开发程度备注"
                                label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.developmentDegreeRemark"
                                   placeholder="土地开发程度备注">
                    </uni-easyinput>
                </uni-forms-item>


                <uni-forms-item name="currentSituation" label="宗地内现状"
                                label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.currentSituation"
                                   placeholder="宗地内现状">
                    </uni-easyinput>
                </uni-forms-item>

                <uni-forms-item name="buildingHeightLimit" label="建筑限高" label-align="right">
                    <uni-easyinput type="digit" v-model="formData.buildingHeightLimit" placeholder="建筑限高"/>
                </uni-forms-item>

                <uni-forms-item  name="compatibleRatioType" label="兼容比例类型" label-align="right">
                    <uni-easyinput type="text" v-model="formData.compatibleRatioType" placeholder="兼容比例类型"/>
                </uni-forms-item>


            </uni-group>

            <uni-group title="土壤" mode="card">
                <uni-forms-item required name="contaminated" label="污染" label-align="right">
                    <assess-picker :dataInput="'contaminated'" :dataList="contaminatedList"
                                   :dataValue="formData.contaminated" @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>


                <uni-forms-item required name="ph" label="酸碱度" label-align="right">
                    <assess-picker :dataInput="'ph'" :dataList="phList" :dataValue="formData.ph"
                                   @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>


                <uni-forms-item required name="holdOn" label="稳定性" label-align="right">
                    <assess-picker :dataInput="'holdOn'" :dataList="holdOnList" :dataValue="formData.holdOn"
                                   @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>

                <uni-forms-item required name="bearingCapacity" label="承载力" label-align="right">
                    <assess-picker :dataInput="'bearingCapacity'" :dataList="bearingCapacityList"
                                   :dataValue="formData.bearingCapacity" @dataResult="initFormPickerResult">
                    </assess-picker>
                </uni-forms-item>
            </uni-group>

            <uni-group title="补充信息" mode="card">
                <uni-forms-item name="plotRatio" label="容积率" label-align="right">
                    <uni-easyinput type="text" v-model="formData.plotRatio" placeholder="容积率"/>
                </uni-forms-item>

                <uni-forms-item name="plotRatioRemark" label="容积率说明" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.plotRatioRemark" placeholder="容积率说明">
                    </uni-easyinput>
                </uni-forms-item>

                <uni-forms-item name="buildingDensity" label="建筑密度" label-align="right">
                    <uni-easyinput type="text" v-model="formData.buildingDensity" placeholder="建筑密度"/>
                </uni-forms-item>
                <uni-forms-item name="greenSpaceRate" label="绿地率" label-align="right">
                    <uni-easyinput type="text" v-model="formData.greenSpaceRate" placeholder="绿地率"/>
                </uni-forms-item>
                <uni-forms-item name="compatibleRatio" label="兼容比例" label-align="right">
                    <uni-easyinput type="text" v-model="formData.compatibleRatio" placeholder="兼容比例"/>
                </uni-forms-item>
            </uni-group>

        </uni-forms>


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
        <assess-submit-button v-show="commitFlag">
            {{commitTitle}}
        </assess-submit-button>

    </view>
</template>

<script>
    import * as utils from "../../../../../../common/untils.js";
    import * as estateUtils from "../../../../../../common/assess/basic/examine.estate.js";
    import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";
    import * as Explore from '../../../../../../common/assess/Explore.key.js';

    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
    import selectInput from '@/components/select-Input/select-Input.vue';


    let ruleField = [
        'id', ':name', 'eastToName', 'eastTo', 'southToName', 'southTo', 'westToName', 'westTo', 'northToName',
        'northTo',
        'landAreaUnit', 'shapeState', 'planeness', 'topographicTerrain', 'shapeStateRemark', 'developmentDegree', 'currentSituation', 'buildingHeightLimit',
        'developmentDegreeContent', 'presentSituationLandUse', 'contaminated', 'ph', 'holdOn','compatibleRatioType',
        'developmentDegreeRemark',
        'bearingCapacity', 'plotRatio', 'plotRatioRemark', 'buildingDensity', 'greenSpaceRate', 'compatibleRatio'
    ];


    const AssessDicKey = Explore.AssessDicKey;
    let rules = utils.getRules(ruleField);
    let formDataFields = utils.getFormDataField(ruleField);
    Object.assign(formDataFields, {
        developmentDegreeContent: []
    });


    // 多选框 必须包含 text和value
    const thisViewData = {
        initMapSize: 0,
        transferId: '',
        eastToNameList: ['东至', '东南', '东北'],
        southToNameList: ['南至', '东南', '西南'],
        westToNameList: ['西至', '西南', '西北'],
        northToNameList: ['东北', '西北', '北至'],
        landAreaUnitList: ['平方米', '亩'],
        shapeStateList: [],
        planenessList: [],
        topographicTerrainList: [],
        developmentDegreeList: [],
        developmentDegreeContentList: [],
        contaminatedList: [],
        phList: [],
        holdOnList: [],
        bearingCapacityList: [],
        cardObj: null,
        homeParam: {},
        batchDetail: null,
        commitFlag: false,
        commitTitle: estateCommonUtils.runBasicCheckWriteTitle,
        formData: formDataFields,
        loading: false,
        firstIndex: 0,
        rules: rules
    };

    export default {
        data() {
            return thisViewData;
        },
        onLoad(option) {
            if (option.cardJson) {
                let cardObj = JSON.parse(option.cardJson);
                this.cardObj = cardObj;
                console.log(cardObj);
            }
            if (option.batchDetailJson) {
                let batchDetail = JSON.parse(option.batchDetailJson);
                this.batchDetail = batchDetail;
                this.setServerData();
            }
            if (option.homeParam) {
                this.homeParam = JSON.parse(option.homeParam);
            }
            estateCommonUtils.runBasicCheckWriteContent(this.homeParam.applyBatchId, this.$helper.fetchLocalUser(), this
                .$data);
            console.log(this.homeParam);
        },
        onShow() {

        },
        components: {
            "assess-picker": assessPicker,
            "assess-submit-button": assessSubmitButton,
            "select-input": selectInput,
        },
        watch: {},
        computed: {
            developmentDegreeName: function () {
                let developmentDegreeList = this.developmentDegreeList;
                let developmentDegree = this.formData.developmentDegree;
                let text = "";
                if (utils.isArrayNotEmpty(developmentDegreeList) && utils.isNotEmptyString(developmentDegree)) {
                    if (utils.isNumber(developmentDegree)) {
                        developmentDegree = Number(developmentDegree);
                        developmentDegreeList.forEach(function (item) {
                            if (item.id == developmentDegree) {
                                text = item.name;
                            }
                        });
                    }
                }
                console.log(text);
                return text;
            }
        },
        methods: {
            submit(data, commitFlag) {
                var _this = this;
                let option = {
                    url: "/app.assess/basicApplyBatchDetail/saveAndUpdateByFormData",
                    showLoading: true,
                    query: data,
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
                    creator: userInfo.userAccount
                });
                estateCommonUtils.getBasicgetNodeByFormData(batchDetail.tableId, batchDetail.type, function (
                    estate) {
                    estate.creator = userInfo.userAccount;
                    let infoData = {
                        basicEstate: estate,
                        basicEstateLandState: data
                    };
                    let coreData = {
                        applyBatchDetailId: batchDetail.id,
                        formData: JSON.stringify(infoData),
                        formClassify: batchDetail.type,
                        planDetailsId: batchDetail.planDetailsId
                    };
                    console.log(infoData);
                    console.log(coreData);
                    _this.submit(coreData, false);
                });
            },
            submitForm(form) {
                // 手动提交表单
                var _this = this;
                let batchDetail = this.batchDetail;
                this.$refs.form.validate().then((res) => {
                    //特殊处理一些兼容性东西
                    if (utils.isArray(res.developmentDegreeContent)) {
                        res.developmentDegreeContent = res.developmentDegreeContent.join(",");
                    }
                    let userInfo = _this.$helper.fetchLocalUser();
                    let data = utils.assignObj(res, {
                        creator: userInfo.userAccount,
                        id: _this.formData.id
                    });
                    console.log('表单返回得值：', data);
                    estateCommonUtils.getBasicgetNodeByFormData(batchDetail.tableId, batchDetail.type, function (
                        estate) {
                        estate.creator = userInfo.userAccount;
                        let infoData = {
                            basicEstate: estate,
                            basicEstateLandState: data
                        };
                        let coreData = {
                            applyBatchDetailId: batchDetail.id,
                            formData: JSON.stringify(infoData),
                            formClassify: batchDetail.type,
                            planDetailsId: batchDetail.planDetailsId
                        };
                        _this.submit(coreData, true);
                    });
                });
            },
            loadInitData: function () {
                let data = this.$data;
                this.changeLoadData("developmentDegree");
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estatePlaneness, function (
                    resultData) {
                    data.planenessList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateDevelopment_degree, function (
                    resultData) {
                    data.developmentDegreeList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateShapehouseShape, function (
                    resultData) {
                    data.shapeStateList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateTopographic_terrain, function (
                    resultData) {
                    data.topographicTerrainList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandContaminated, function (
                    resultData) {
                    data.contaminatedList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandPh, function (
                    resultData) {
                    data.phList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandFertility, function (
                    resultData) {
                    data.fertilityList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandBearingCapacity, function (
                    resultData) {
                    data.bearingCapacityList = resultData;
                });
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estateLandBearingHoldOn, function (
                    resultData) {
                    data.holdOnList = resultData;
                });
            },
            bindPickerChange: function (name, e) {
                this.setFormValue(name, e.detail.value);
            },
            setFormValue: function (name, value) {
                let formData = this.formData;
                formData[name] = value;
                this.formData = formData;
            },
            bindRangeChange: function (listData, name, id, e) {
                let index = e.detail.value;
                let _this = this;
                index = e.detail.value;
                var item = listData[index];
                _this.formData[name] = item[id];
                _this.changeLoadData(name);
            },
            changeLoadData: function (name) {
                let data = this.$data;
                let _this = this;
                let formData = data.formData;
                switch (name) {
                    case "developmentDegree": {
                        estateCommonUtils.getDataDicListByPid(formData.developmentDegree, function (resultData) {
                            _this.developmentDegreeContentList = estateCommonUtils.checkboxTransformBaseDic(
                                resultData);
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
            getRangeChange: function (listData, name, value, showName) {
                let tempValue = "";
                listData.forEach((item, index, array) => {
                    if (item[name] == value) {
                        tempValue = item[showName];
                    }
                });
                return tempValue;
            },
            bindCboxChange: function (listData, name, id, e) {
                let _this = this;
                this.firstIndex = e.detail.value;
                var item = listData[this.firstIndex];
                _this.formData[name] = item[id];
            },
            setServerData: function () {
                let _this = this;
                let batchDetail = this.batchDetail;
                let formData = this.formData;
                if (!batchDetail.tableId) {
                    return false;
                }
                estateUtils.getBasicEstateLandStateByEstateId(batchDetail.tableId, function (resultData) {
                    if (!resultData) {
                        return false;
                    }
                    var keys = Object.keys(formData);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = formData[key];
                        formData[key] = resultData[key];
                    }
                    _this.formData = formData;
                    // console.log(resultData);
                    if (_this.formData.developmentDegreeContent) {
                        let tempArr = _this.formData.developmentDegreeContent.split(",");
                        _this.formData.developmentDegreeContent = tempArr;
                    } else {
                        _this.formData.developmentDegreeContent = [];
                    }
                    _this.loadInitData();
                });
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
            initFormInputSelectResult(result) {
                let dataInput = result.name;
                let value = result.value;
                this.formData[dataInput] = value;
                this.changeLoadData(dataInput, false);
                this.$refs.form.setValue(dataInput, value);
            }
        }
    }
</script>

<style>

</style>
