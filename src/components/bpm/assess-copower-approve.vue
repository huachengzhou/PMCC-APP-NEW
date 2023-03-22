<template>
    <view>

        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
            <uni-group title="审批意见" mode="card">
                <uni-forms-item v-if="bisSelectUser === '1' && ApproverList.length > 0" required name="ApproverUser"
                                label="审批人" label-align="right">

                    <assess-picker :dataId="'userAccount'" :dataName="'userName'" :dataInput="'ApproverUser'"
                                   :dataList="ApproverList"
                                   :dataValue="formData.ApproverUser" @dataResult="initFormPickerResult">
                    </assess-picker>

                </uni-forms-item>
                <uni-forms-item required name="approvalOpinions" label="审批意见" label-align="right">
                    <uni-easyinput type="textarea" v-model="formData.approvalOpinions" placeholder="请输入内容"/>
                </uni-forms-item>
            </uni-group>
        </uni-forms>

        <view class="approve-button-box">
            <view class="approve-button-left">
                <common-copower-approvalLog :dataId="taskInfo.processInsId" :appKey="taskInfo.appKey">
                    <button type="default" size="mini">审批日志</button>
                </common-copower-approvalLog>
            </view>
            <view class="approve-button">
                <button @click="submitBack('back',$event)" type="warn" size="mini">退回申请人</button>
            </view>
            <view class="approve-button">
                <button @click="submitBack('decline',$event)" type="warn"
                        size="mini">退回上一级
                </button>
            </view>
            <view class="approve-button-right">
                <button @click="submit('approval',$event)" type="primary"
                        size="mini">同意
                </button>
            </view>
            <uni-popup id="popupMessage" ref="popupMessage" type="message" @change="popupchange">
                <uni-popup-message :type="msgType" :message="message" :duration="2500"></uni-popup-message>
            </uni-popup>
        </view>

    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import commonCopowerApprovalLog from '@/components/bpm/common-copower-approvalLog.vue';
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';

    export default {
        props: {
            taskInfo: {
                type: [Object],
                default: ""
            },
            bisProjectFlag: {
                type: [Boolean],
                default: false
            }
        },
        watch: {},
        components: {
            "common-copower-approvalLog": commonCopowerApprovalLog,
            "assess-picker": assessPicker,
        },
        data() {
            return {
                type: 'top',
                msgType: 'error',
                message: '这是一条错误消息提示',
                gutter: 0,
                nvueWidth: 730,
                ApproverIndex: 0,
                ApproverList: [],
                bisSelectUser: '',
                dataList: [],
                formData: {
                    ApproverUser: '',
                    approvalOpinions: ''
                },
                rules: {
                    ApproverUser: {
                        rules: [{
                            required: true,
                            errorMessage: "审批人不能为空",
                        }]
                    },
                    approvalOpinions: {
                        rules: [{
                            required: true,
                            errorMessage: "审批意见不能为空",
                        }]
                    }
                }
            };

        },
        methods: {
            submitBack(conclusion, e) {
                var _this = this;
                var userInfo = _this.$helper.fetchLocalUser();
                let taskInfo = this.taskInfo;
                let res = {
                    approvalOpinions: _this.formData.approvalOpinions,
                    ApproverUser: _this.formData.ApproverUser
                };
                var data = {
                    boxId: taskInfo.boxId,
                    projectId: taskInfo.projectId,
                    processInsId: taskInfo.processInsId,
                    taskId: taskInfo.taskId,
                    appKey: taskInfo.appKey,
                    conclusion: conclusion,
                    activityId: taskInfo.reActivityId,
                    activityKey: taskInfo.currActivity,
                    agentUserAccount: taskInfo.agentUserAccount,
                    opinions: res.approvalOpinions,
                    currUserAccount: userInfo.userAccount,
                    appointUserAccount: (_this.bisSelectUser === '1' && _this.ApproverList.length >
                        0) ? res.ApproverUser : ''
                };
                // console.log(data);
                _this.sumitServer(data);
            },
            submit(conclusion, e) {
                this.$refs.form.validate().then(async (res) => {
                    console.log("res:" + JSON.stringify(res));
                    var _this = this;
                    var userInfo = _this.$helper.fetchLocalUser();
                    let taskInfo = this.taskInfo;
                    var data = {
                        boxId: taskInfo.boxId,
                        processInsId: taskInfo.processInsId,
                        taskId: taskInfo.taskId,
                        projectId: taskInfo.projectId,
                        appKey: taskInfo.appKey,
                        conclusion: conclusion,
                        activityId: taskInfo.reActivityId,
                        activityKey: taskInfo.currActivity,
                        agentUserAccount: taskInfo.agentUserAccount,
                        opinions: res.approvalOpinions,
                        currUserAccount: userInfo.userAccount,
                        appointUserAccount: (_this.bisSelectUser === '1' && _this.ApproverList.length >
                            0) ? res.ApproverUser : ''
                    };
                    // console.log(data);
                    _this.sumitServer(data);
                })
            },
            sumitServer(data) {
                var _this = this;
                //普通提交
                let webUrl = "/app.assess/basic/public/taskApprovalSubmit";
                if (this.bisProjectFlag) {
                    //走项目提交
                    webUrl = "/app.assess/basic/public/submitProjectTaskApproval";
                }
                _this.$myRequest.pmccRequest({
                    url: webUrl,
                    method: 'POST',
                    data: data,
                    showLoading: true
                }).then(result => {
                    if (result.data.ret) {
                        _this.$emit("submit");
                    } else {
                        this.msgType = 'error';
                        this.message = result.data.errmsg;
                        this.$refs.popupMessage.open();
                    }
                });
            },
            init() {
                var _this = this;
                var userInfo = _this.$helper.fetchLocalUser();
                var data = {
                    currUserAccount: userInfo.userAccount,
                    processInsId: this.taskInfo.processInsId,
                    boxId: this.taskInfo.boxId,
                    taskId: this.taskInfo.taskId
                }
                if (this.taskInfo.agentUserAccount) {
                    data.agentUserAccount = this.taskInfo.agentUserAccount;
                }
                console.log(this.taskInfo);
                this.$myRequest.pmccRequest({
                    url: '/app.myTaskInfo/approvalProcessList',
                    method: 'POST',
                    data: data
                }).then(res => {
                    if (res.data.ret) {
                        _this.ApproverList = res.data.data.approverList;
                        _this.bisSelectUser = res.data.data.bisSelectUser;
                    } else {
                        uni.showToast({
                            title: res.data.errmsg,
                            mask: true,
                            duration: 1000
                        });
                    }
                })
            },
            popupchange(e) {
                console.log('popup ' + e.type + ' 状态', e.show)
            },
            showDate(date) {
                if (date) {
                    return utils.formatTime(date, "YYYY-MM-DD");
                }
                return "";
            },
            initFormPickerResult(result) {
                let item = result.item;
                let pack = result.pack;
                let dataId = pack.dataId;
                let dataInput = pack.dataInput;
                let value = '';
                try {
                    value = item[dataId];
                } catch (e) {
                    //TODO handle the exception
                }
                this.formData[dataInput] = value;
                this.$refs.form.setValue(dataInput, value);
            }
        },
        created() {

        },
        mounted: function () {
            // console.group('mounted 挂载结束状态===============》');
            this.init();
        }
    }
</script>

<style>
</style>
