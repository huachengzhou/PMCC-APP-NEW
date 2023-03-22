<template>
    <view style="margin-top: 40px;">

        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">

            <uni-group title="基本信息" mode="card">

                <uni-forms-item required name="projectTreeId" label="工程节点" label-align="right">
                    <project-audit-plan-tree ref="projectTree" :projectId="projectInfo.id"
                                             v-model:dataValue="formData.projectTreeId">
                    </project-audit-plan-tree>
                </uni-forms-item>


                <uni-forms-item required name="checkParts" label="抽查事项" label-align="right">
                    <uni-easyinput type="text" v-model="formData.checkParts" placeholder="抽查事项"/>
                </uni-forms-item>

                <uni-forms-item name="content" label="抽查内容及要求" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.content" placeholder="抽查内容及要求">
                    </uni-easyinput>
                </uni-forms-item>

                <uni-forms-item name="realityContent" label="现场查勘情况" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.realityContent" placeholder="现场查勘情况">
                    </uni-easyinput>
                </uni-forms-item>

                <uni-forms-item name="files" label="附件" label-align="right">
                    <common-image-picker :dataObj="getImgFieldsName()">
                    </common-image-picker>
                </uni-forms-item>
            </uni-group>

            <uni-group title="地理信息" mode="card">
                <uni-forms-item name="weather" label="天气" label-align="right">
                    <uni-easyinput type="text" v-model="formData.weather" placeholder="天气"/>
                </uni-forms-item>


                <uni-forms-item name="temperature" label="温度" label-align="right">
                    <uni-easyinput type="text" v-model="formData.temperature" placeholder="温度"/>
                </uni-forms-item>

                <uni-forms-item name="address" label="详细地址" label-align="right">
                    <uni-easyinput type="textarea" autoHeight v-model="formData.address" placeholder="详细地址">
                    </uni-easyinput>
                </uni-forms-item>

                <button class="mini-btn" type="primary" size="mini"
                        @click.stop="chooseLocation()">位置选择
                </button>

                <button type="primary" size="mini" @click="getLocation">地理信息获取</button>
            </uni-group>

        </uni-forms>

        <common-map-poi-search v-show="false" ref="mapCpn"></common-map-poi-search>

        <assess-submit-button @submit="submitForm">
            提交
        </assess-submit-button>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";

    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
    import commonImagePicker from '@/components/common-file-picker/common-file-picker.vue';
    import common_map_poi_search from '@/components/common-map/common-map-poi-search.vue';
    import project_audit_plan_tree from '@/components/costs/project-audit-plan-tree/project-audit-plan-tree.vue';


    export default {
        data() {
            return {
                projectInfo: {},
                projectPlanDetails: {},
                centerParam: {},
                appKey: '',
                formData: {
                    id: '',
                    projectId: '',
                    planDetailsId: '',
                    pid: '',
                    projectTreeId: '',
                    projectNodeName: '',
                    checkParts: '',
                    created: '',
                    creator: '',
                    partAddType: '',
                    bisEnable: '',
                    delRemark: '',
                    fileIds: '',
                    longitude: '',
                    latitude: '',
                    address: '',
                    weather: '',
                    temperature: '',
                    qdItems: '',
                    content: '',
                    realityContent: ''
                },
                rules: {
                    projectTreeId: {
                        rules: [{
                            required: true,
                            errorMessage: '请输入数据'
                        }]
                    },
                    checkParts: {
                        rules: [{
                            required: true,
                            errorMessage: '请输入数据'
                        }]
                    }
                }
            }
        },
        onLoad(option) {
            let eventChannel = null;
            // #ifdef APP-NVUE
            eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
            // #endif
            // #ifndef APP-NVUE
            eventChannel = this.getOpenerEventChannel();
            // #endif
            this.eventChannel = eventChannel;
            let that = this;
            eventChannel.on('emitChildData', function (data) {
                that.settingParam(data);
            });
        },
        onShow() {

        },
        components: {
            "assess-picker": assessPicker,
            "assess-submit-button": assessSubmitButton,
            "common-map-poi-search": common_map_poi_search,
            "project-audit-plan-tree": project_audit_plan_tree,
            "common-image-picker": commonImagePicker
        },
        methods: {
            settingParam(data) {
                this.projectInfo = data.projectInfo;
                this.projectPlanDetails = data.projectPlanDetails;
                this.centerParam = data;
                this.appKey = data.appKey;

                if (data.data) {
                    //赋值
                    let formData = this.formData;
                    var keys = Object.keys(formData);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        formData[key] = data.data[key];

                    }
                }
                console.log(data);
                this.$nextTick(() => {
                    this.initListData();
                    if (this.$refs.projectTree) {
                        this.$refs.projectTree.initFun();
                    }
                });
            },
            submit(data, commit) {
                console.log('处理值：', data);
                var _this = this;
                let query = {
                    formData: JSON.stringify(data)
                };
                let option = {
                    url: "/app.costs.project/costsRpcProjectSceneSurveyPlan/saveProjectSceneSurveyPlanParts",
                    method: 'POST',
                    showLoading: true,
                    data: query,
                };
                this.$myRequest.pmccRequest(option).then(res => {
                    uni.showToast({
                        title: '保存成功',
                        success() {
                            console.log(res);
                            let timer = setTimeout(() => {
                                uni.navigateBack({
                                    delta: 1,
                                    success: function (res) {
                                        uni.$emit('updateBackData', {appKey: _this.appKey});
                                    }
                                });
                            }, 1000);
                            timer = null;
                        }
                    });
                }).catch(err => {
                    uni.showModal({
                        title: '错误提示',
                        content: err.errMsg,
                        showCancel: false
                    });
                });
            },
            submitForm() {
                // 手动提交表单
                var _this = this;
                //特殊处理一些兼容性东西
                let formData = this.formData;
                let userInfo = _this.$helper.fetchLocalUser();
                this.$refs.form.validate().then((res) => {
                    let data = utils.assignObj(formData, {
                        creator: userInfo.userAccount,
                        projectId: _this.projectInfo.id,
                        planDetailsId: _this.projectPlanDetails.planDetailsId,
                        pid: _this.projectPlanDetails.id,

                    });
                    console.log('表单返回得值：', data);
                    _this.submit(utils.filterEmptyData(data));
                });
            },
            initListData() {
                let data = this.$data;

            },
            getImgFieldsName() {
                let formData = this.formData;
                let appKey = this.appKey;
                let projectInfo = this.projectInfo;
                let obj = {
                    fieldsName: 'files',
                    projectId: projectInfo.id,
                    tableId: formData.id ? formData.id : '0',
                    tableName: 'tb_project_scene_survey_plan_parts',
                    appKey: appKey
                };
                return obj;
            },
            getLocation() {
                let _this = this;

                function settingParam(res) {
                    console.log(res);
                    if (res.longitude && res.latitude) {
                        _this.formData.longitude = res.longitude;
                        _this.formData.latitude = res.latitude;
                    }
                    if (res.address) {
                        let addressList = [];
                        let address = res.address;
                        if (address.country) {
                            addressList.push(address.country);
                        }
                        if (address.province) {
                            addressList.push(address.province);
                        }
                        if (address.city) {
                            addressList.push(address.city);
                        }
                        if (address.district) {
                            addressList.push(address.district);
                        }
                        if (address.street) {
                            addressList.push(address.street);
                        }
                        if (address.streetNum) {
                            addressList.push(address.streetNum);
                        }
                        if (address.poiName) {
                            addressList.push(address.poiName);
                        }
                        _this.formData.address = addressList.join("-");
                    }
                    if (res.weather) {
                        let weather = res.weather;
                        if (weather.temperature) {
                            //确保  百分之百是数字温度
                            let temperature = weather.temperature.replace(/[^\d]/g, " ");
                            _this.formData.temperature = parseInt(temperature);
                        }
                        if (weather.weather) {
                            _this.formData.weather = weather.weather;
                        }
                    }
                }

                this.$nextTick(() => {
                    if (_this.formData.longitude && _this.formData.latitude) {
                        _this.$refs.mapCpn.getUseCenterFullLocation(_this.formData, function (res) {
                            settingParam(res);
                        });
                    } else {
                        _this.$refs.mapCpn.getCenterFullLocation(function (res) {
                            settingParam(res);
                        });
                    }
                });
            },
            chooseLocation() {
                let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
                let currentRoute = currentRoutes[currentRoutes.length - 1].route;//获取当前页面路由
                let currentParam = currentRoutes[currentRoutes.length - 1].options; //获取路由参数
                let centerParam = this.centerParam;

                let that = this;
                // uni.navigateTo({
                //     url: "/pages/map/map",
                //     events: {
                //         // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //         emitParentData: function (res) {
                //             that.settingParam(res.sourceData);
                //             that.formData.longitude = res.longitude;
                //             that.formData.latitude = res.latitude;
                //             uni.showToast({
                //                 title: '操作成功'
                //             });
                //             console.log('res', res);
                //         }
                //     },
                //     success: function (res) {
                //         // 通过eventChannel向被打开页面传送数据
                //         let obj = {redirectTo: '/' + currentRoute, sourceData: centerParam};
                //         if (that.formData.longitude) {
                //             obj.longitude = that.formData.longitude;
                //         }
                //         if (that.formData.latitude) {
                //             obj.latitude = that.formData.latitude;
                //         }
                //         res.eventChannel.emit('emitChildData', obj);
                //     }
                // });


                uni.chooseLocation({
                    success: function (res) {
                        that.formData.longitude = res.longitude;
                        that.formData.latitude = res.latitude;
                        uni.showToast({
                            title: '操作成功'
                        });
                        console.log('位置名称：' + res.name);
                        console.log('详细地址：' + res.address);
                        console.log('纬度：' + res.latitude);
                        console.log('经度：' + res.longitude);
                    }
                });
            }
        }
    }
</script>

<style>

</style>
