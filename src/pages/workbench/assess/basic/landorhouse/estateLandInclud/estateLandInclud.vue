<template>

    <view style="margin-top: 40px;">

        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
            <uni-group title="基本信息" mode="card">
                                    <uni-forms-item required name="name" label="名称" label-align="right">
    <uni-easyinput style="width: 90%;" type="text" v-model="formData.name" placeholder="名称" />
</uni-forms-item>
            </uni-group>
        </uni-forms>

        <uni-group title="其它信息" mode="card">
        </uni-group>

        <assess-submit-button @submit="submitForm" :loading="loading">
            提交
        </assess-submit-button>

    </view>
</template>

<script>
    import * as utils from "../../../../../../common/untils.js";
    import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";
    import * as Explore from '../../../../../../common/assess/Explore.key.js';

    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
    import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
    import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';

    const AssessDicKey = Explore.AssessDicKey;
    const AssessDBKey = Explore.AssessDBKey;

    // 多选框 必须包含 text和value
    let thisViewData = {
        transferId : '' ,
        cardObj: null,
        batchDetail: {},
        formData: {
            id: '0',
            name :  "" ,
        },
        loading: false,
        firstIndex: 0,
        rules: {
        name : {
            rules: [{
                required: true,
                errorMessage: '请输入数据'
            }]
        },
        }
    };

    export default {
        data() {
            return thisViewData;
        },
        computed: {

        },
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
                console.log(cardObj);
            }
            if(option.transferId) {
                this.transferId = option.transferId ;
            }
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
            "common-file-picker": commonFilePicker
        },
        methods: {
            submit(data) {
                var _this = this;
                let option = {
                    url: _this.cardObj.saveAndUpdateUrl,
                    query: data,
                    successCallback: function(resultData) {
                        uni.showToast({
                            title: '保存成功',
                            success() {
                                let transferId = _this.transferId;
                                if(! transferId) {
                                    transferId = _this.batchDetail.id ;
                                }
                                let query = {
                                    id: transferId,
                                    applyBatchId: _this.batchDetail.applyBatchId
                                };
                                let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
                                uni.redirectTo({
                                    url: url
                                });
                            }
                        });
                    }
                };
                utils.requestDefault(option);
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
                    estateUtils.getBasicEstateLandStateByEstateId(data.id, function(estateLand) {
                        let infoData = {
                            basicEstate: data,
                            basicEstateLandState: estateLand
                        };
                        let coreData = {
                            applyBatchDetailId: batchDetail.id,
                            formData: JSON.stringify(infoData),
                            formClassify: batchDetail.type,
                            planDetailsId: batchDetail.planDetailsId
                        };
                        _this.submit(coreData);
                    });
                });
            },
            initListData: function() {
                let data = this.$data;
                var _this = this;
                // this.changeLoadData("province");
                // this.changeLoadData("city");
                // estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_infrastructureCompleteness, function(
                //     resultData) {
                //     if (!resultData) {
                //         return false;
                //     }
                //     data.infrastructureCompletenessList = resultData;
                // });
            },
            setFormValue: function(name, value) {
                let formData = this.formData;
                formData[name] = value;
                this.formData = formData;
            },
            changeLoadData: function(name) {
                let data = this.$data;
                let _this = this;
                let formData = data.formData;
                switch (name) {


                    default: {
                        break;
                    }
                }
            },
            setServerData: function(url) {
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
                    query: query,
                    notParam: true,
                    url: url + "?" + utils.parseParam(query),
                    successCallback: function(resultData) {
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
                // this.$refs.form.setValue(dataInput,value) ;
            },
            setImgFieldsName(fieldsName) {
                let batchDetail = this.batchDetail;
                let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
                let obj = {
                    fieldsName: fieldsName,
                    tableId: batchDetail.tableId,
                    tableName: AssessDBKey.BasicEstate,
                    appKey: appCacheKey
                };
                return obj;
            },
            openMapView() {
                let batchDetail = this.batchDetail;
                let param = {
                    batchDetailJson: JSON.stringify(batchDetail)
                };
                uni.navigateTo({
                    url: "../../common/basicMap/mapMarker" + "?" + utils.parseParam(param)
                });
            }
        }
    }
</script>

<style>

</style>
