<template>
    <view style="margin-top: 40px;">

        <uni-forms validate-trigger="bind" err-show-type="undertext">


            <view v-for="(dynamicForms,index) in dynamicFormList">
                <uni-group :title="dynamicForms.formCnName" mode="card"
                           v-if="dynamicForms.dynamicFormFieldList && dynamicForms.dynamicFormFieldList.length > 0">

                    <costs-dynamic-form :ref="'sonFrom'" :formItems="dynamicForms.dynamicFormFieldList" :bisDeleteFlag="projectPlanDetails.status != 'finish'"
                                        @validateDynamicFrom='checkValidateDynamicFrom'
                                        @getResults="getDynamicFromData">
                    </costs-dynamic-form>

                    <uni-forms-item name="files" label="附件" label-align="right">
                        <common-file-picker :dataObj="getImgFieldsName()" :bisDeleteFlag="projectPlanDetails.status != 'finish'">
                        </common-file-picker>
                    </uni-forms-item>

                </uni-group>
            </view>

            <uni-group title="其他信息" mode="card" stype="margin-bottom:30px;">
                <button type="primary" size="mini" @click="openConductSelectiveExaminationView">抽查点信息</button>
            </uni-group>

        </uni-forms>



        <view style="height:30px;">

        </view>


        <view class="uni-flex uni-row " style="width: 100%;" v-show="projectPlanDetails.status != 'finish'">
            <view style="-webkit-flex: 1;flex: 1;" class="assessbtnLeft">
                <button @click.stop="submitFormVaild(true)">
                    提交
                </button>
            </view>
            <view style="-webkit-flex: 1;flex: 1;" class="assessbtnRight">
                <button @click.stop="submitFormVaild(false)">
                    临时保存
                </button>
            </view>
        </view>

    </view>
</template>

<script>
    import costs_dynamic_form from '@/components/dynamic-form/costs-dynamic-form.vue';
    import commonFilePicker from '@/components/common-file-picker/file-cpn-picker.vue';
    import employeesPicker from '@/components/employees-picker/employees-picker.vue';
    import projectPicker from '@/components/project-picker/project-picker.vue';
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import myMingPop from "@/components/ming-pop/ming-pop.vue";
    import * as utils from "@/common/untils.js";

    let defaultDate = new Date();

    export default {
        data() {
            return {
                eventChannel: null,
                userValue: [],
                projectInfo: {},
                projectPlanDetails: {},
                appKey: '',
                dynamicFormList: [],
                customTableTypeList: [],
                validateDynamicFrom: false,
                commitFlag: false,
                formData: {
                    id: '',
                    projectId: '',
                    planDetailsId: '',
                    startTime: utils.formatTime(defaultDate, "YYYY-MM-DD"),
                    endTime: utils.formatTime(defaultDate, "YYYY-MM-DD"),
                    userAccounts: '',
                    userNames: '',
                    processInsId: '',
                    status: '',
                    created: '',
                    creator: '',
                    taskSubmitUser: '',
                    taskSubmitTime: '',
                    taskRemarks: '',
                    actualHours: '',
                    submitCount: '',
                    fileIds: '',
                    formData: '',
                }
            }
        },
        components: {
            "assess-picker": assessPicker,
            "employees-picker": employeesPicker,
            "costs-dynamic-form": costs_dynamic_form,
            "common-file-picker": commonFilePicker,
            "my-ming-pop": myMingPop
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
                that.projectInfo = data.projectInfo;
                that.projectPlanDetails = data.data;
                that.appKey = data.appKey;
                console.log(data)
                that.initServerData();
            });
        },
        methods: {
            async submit(data) {
                var _this = this;
                let commitFlag = this.commitFlag;
                let query = {
                    formData: JSON.stringify(data)
                };
                let option = {
                    url: commitFlag ? "/app.costs.project/costsRpcProjectSceneSurveyPlan/submitProjectSceneSurveyPlan" : "/app.costs.project/costsRpcProjectSceneSurveyPlan/saveSceneSurveyPlanDto",
                    method: 'POST',
                    showLoading: true,
                    data: query,
                };
                await this.$myRequest.pmccRequest(option).then(res => {
                    uni.showToast({
                        title: '保存成功',
                        success() {
                            console.log(res);
                            if (commitFlag) {
                                let timer = setTimeout(() => {
                                    uni.navigateBack({
                                        delta: 1,
                                        success: function (res) {
                                            uni.$emit('updateBackData', {appKey: _this.appKey});
                                        }
                                    });
                                }, 1000);
                                timer = null;
                            } else {
                                uni.$emit('updateBackData', {appKey: _this.appKey});
                            }
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
            checkValidateDynamicFrom(data) {
                let _this = this;
                this.validateDynamicFrom = data;
                if (data) {
                    let userInfo = this.$helper.fetchLocalUser();
                    let data = utils.assignObj(this.formData, {
                        creator: userInfo.userAccount,
                    });
                    console.log(data);
                    this.submit(data);
                }
            },
            getDynamicFromData(data) {
                this.formData.formData = JSON.stringify(data);
            },
            submitFormVaild(commitFlag) {
                this.commitFlag = commitFlag;
                let cpn = this.$refs["sonFrom"];
                if (!cpn) {
                    uni.showModal({
                        title: '提示',
                        content: "没有配置动态表单",
                        showCancel: false
                    });
                    return false;
                }
                if (utils.isArray(cpn)) {
                    //会执行验证 和 向父组件传送结果
                    cpn[0].getFormData();
                } else {
                    //会执行验证 和 向父组件传送结果
                    cpn.getFormData();
                }
                console.log(cpn);

            },
            initServerData() {
                let _this = this;
                let projectInfo = this.projectInfo;
                let projectPlanDetails = this.projectPlanDetails;

                //赋值
                let formData = this.formData;
                var keys = Object.keys(formData);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    formData[key] = projectPlanDetails[key];
                }


                this.$myRequest.pmccRequest({
                    url: "/app.public/getDynamicFormsCustomSetType",
                    method: 'GET',
                    showLoading: false,
                }).then(res => {
                    this.customTableTypeList = res.data.data;
                });
                this.$myRequest.pmccRequest({
                    url: "/app.costs/project/getFormDynamicFields?projectId=" + projectInfo.id,
                    method: 'GET',
                    showLoading: true,
                    data: {
                        projectId: projectInfo.id
                    },
                }).then(res => {
                    if (projectPlanDetails.formData) {
                        let obj = JSON.parse(projectPlanDetails.formData);
                        //这里是给动态字段赋值 默认值 字段是fieldValue
                        res.data.data.forEach(dynamicForm => {
                            if (dynamicForm.dynamicFormFieldList && dynamicForm.dynamicFormFieldList.length > 0) {
                                dynamicForm.dynamicFormFieldList.forEach(dynamicFormField => {
                                    dynamicFormField.fieldValue = obj[dynamicFormField.formField]
                                });
                            }
                        });
                    }
                    this.dynamicFormList = res.data.data;
                    console.log(res.data.data);
                });
            },
            setFormValue: function (name, value) {
                let formData = this.formData;
                formData[name] = value;
                this.formData = formData;
            },
            openConductSelectiveExaminationView() {
                var param = {
                    appKey: this.appKey,
                    projectInfo: this.projectInfo,
                    projectPlanDetails: this.projectPlanDetails
                };
                uni.navigateTo({
                    url: "/pages/workbench/costs/project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExaminationChild",
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        try {
                            res.eventChannel.emit('emitChildData', param);
                        } catch (e) {
                            console.log(e) ;
                        }
                    }
                });
            },
            getImgFieldsName() {
                let formData = this.formData;
                let appKey = this.appKey;
                let projectInfo = this.projectInfo;
                let obj = {
                    fieldsName: 'files',
                    projectId: projectInfo.id,
                    tableId: formData.id ? formData.id : '0',
                    tableName: 'tb_project_scene_survey_plan',
                    appKey: appKey
                };
                return obj;
            }
        }
    }
</script>

<style>
    .example-default-box {
        border: 1px solid #E5E5E5;
        border-radius: 1px;
        padding: 0px 0px;
        /* #ifndef APP-NVUE */
        box-sizing: border-box;
        line-height: 75 rpx;
        cursor: pointer;
        /* #endif */
    }

    .example {
        padding: 0 11px 11px;
        color: #a5a5a5;
        line-height: 100 rpx;
        flex: 0 0 100 rpx;
    }
</style>
