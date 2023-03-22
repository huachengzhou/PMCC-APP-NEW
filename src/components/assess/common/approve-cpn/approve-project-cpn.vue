<template>
    <view>


        <view class="goods-carts" v-show="!useTaskApproval">
            <uni-goods-nav :options="footBars" :fill="true" :button-group="footButtonGroup" @click="footNavClick"
                           @buttonClick="footNavClick"/>
        </view>

        <view v-if="useTaskApproval">
            <common-copower-approve :taskInfo="taskInfo" @submit="newSubmit" v-show="!editApprovalFlag"
                                    :bisProjectFlag="bisProjectFlag">
            </common-copower-approve>


            <common-copower-approve-edit :taskInfo="taskInfo" @submit="newSubmit" v-show="editApprovalFlag"
                                         :bisProjectFlag="bisProjectFlag">
            </common-copower-approve-edit>
        </view>


    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import commonCopowerApprovalLog from '@/components/bpm/common-copower-approvalLog.vue';
    import commonCopowerApprove from '@/components/bpm/assess-copower-approve.vue';
    import commonCopowerApproveEdit from '@/components/bpm/assess-copower-approveEdit.vue';
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';

    export default {
        props: {
            projectPlanDetails: {
                type: [Object],
                default: function () {
                    return {};
                }
            }
        },
        watch: {},
        computed: {},
        components: {
            "common-copower-approvalLog": commonCopowerApprovalLog,
            "common-copower-approve": commonCopowerApprove,
            "common-copower-approve-edit": commonCopowerApproveEdit,
            "assess-picker": assessPicker,
        },
        data() {
            return {
                bisProjectFlag: true,
                editApprovalFlag: false,
                useTaskApproval: false,
                taskTempInfo: {},
                taskInfo: {},
                currDate: new Date(),
                footCode: '',
                footBars: [],
                footButtonGroup: [{
                    text: '取消',
                    icon: 'plus',
                    backgroundColor: '#FF0000',
                    color: '#fff',
                    code: 1
                }, {
                    text: '直接提交',
                    icon: 'plus',
                    backgroundColor: '#ffa200',
                    color: '#fff',
                    code: 2
                }, {
                    text: '提交审批',
                    icon: 'plus',
                    backgroundColor: '#0000FF',
                    color: '#fff',
                    code: 3
                }]

            };
        },
        methods: {
            newSubmit() {
                uni.showToast({
                    title: '操作成功',
                    mask: true,
                    success() {
                        uni.setStorageSync("isDoBacklogRefresh", 1);
                        uni.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            initAutoGetServerData() {
                let detailData = this.projectPlanDetails;
                let useTaskApproval = false;
                let editApprovalFlag = false;
                let query = {};
                let taskInfo = {};
                if (detailData.excuteUrl) {
                    if (detailData.excuteUrl.indexOf('/ProjectTask/projectTaskApproval') != -1) {
                        query = this.getQueryString(detailData.excuteUrl);
                        this.taskTempInfo = query;
                        useTaskApproval = true;
                    } else if (detailData.excuteUrl.indexOf('/ProjectTask/projectTaskEdit') != -1) {
                        query = this.getQueryString(detailData.excuteUrl);
                        this.taskTempInfo = query;
                        useTaskApproval = true;
                        editApprovalFlag = true;
                    }
                }
                let appKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey);
                // console.log(detailData) ;
                if (useTaskApproval) {
                    let option = {
                        data: query,
                        method: "POST",
                        url: "/app.bpm/getApprovalProcessParameterDto",
                        showLoading: true
                    };
                    this.$myRequest.pmccRequest(option).then(res => {
                        if (res.data.ret) {
                            let data = res.data.data;
                            this.useTaskApproval = useTaskApproval;
                            this.editApprovalFlag = editApprovalFlag;
                            taskInfo.projectId = detailData.projectId;
                            taskInfo.taskId = data.taskId;
                            taskInfo.boxId = data.boxId;
                            taskInfo.processInsId = data.processInsId;
                            taskInfo.appKey = appKey;
                            taskInfo.reActivityId = data.activityId;
                            taskInfo.currActivity = data.reActivityName;
                            taskInfo.agentUserAccount = query.agentUserAccount;

                            this.taskInfo = taskInfo;

                            // console.log(data);
                            // console.log(taskInfo);
                        }
                    });
                }

            },
            footNavClick(e) {
                let content = e.content;
                let code = content.code;
                this.footCode = code;
                if (this.footCode == 3) {
                    this.submitProjectTask(code, true);
                    return false;
                }
                if (this.footCode == 2) {
                    this.submitProjectTask(code, false);
                    return false;
                }
                if (this.footCode == 1) {
                    this.$emit("sumitApproveFun", code);
                    return false;
                }
            },
            submitProjectTask(code, mustUseBox) {
                var userInfo = this.$helper.fetchLocalUser();
                let projectPlanDetails = this.projectPlanDetails;
                let responsibilityId = projectPlanDetails.responsibilityId;
                let _this = this;
                var formData = {};
                formData.declareId = '';
                formData.projectId = projectPlanDetails.projectId;
                formData.planDetailsId = projectPlanDetails.id;
                let data = {
                    userAccount: userInfo.userAccount,
                    projectId: projectPlanDetails.projectId,
                    projectDetailsId: projectPlanDetails.id,
                    formData: JSON.stringify(formData),
                    mustUseBox: mustUseBox,
                    actualHours: _this.getDiffHours()
                };
                if (responsibilityId) {
                    data.responsibilityId = responsibilityId;
                }
                console.log(data);
                let option = {
                    data: data,
                    method: "POST",
                    url: "/app.assess/basic/public/submitProjectTask",
                    showLoading: true
                };
                this.$myRequest.pmccRequest(option).then(res => {
                    if (res.data.ret) {
                        uni.showToast({
                            title: '提交成功',
                            duration: 1000,
                            success() {
                                _this.$emit("sumitApproveFun", code);
                            }
                        });
                    }
                });
            },
            getDiffHours() {
                var ms = new Date().getTime() - this.currDate.getTime();
                if (ms < 0) return 0;
                return (ms / 1000 / 60 / 60).toFixed(4);
            },
            getQueryString(url) {
                function getCaption(obj, state) {
                    var index = obj.lastIndexOf("?");
                    if (state == 0) {
                        obj = obj.substring(0, index);
                    } else {
                        obj = obj.substring(index + 1, obj.length);
                    }
                    return obj;
                }

                let query = {};
                if (url.indexOf("?") != -1) {
                    const str = getCaption(url, 1);
                    const pairs = str.split("&");
                    for (let i = 0; i < pairs.length; i++) {
                        const pair = pairs[i].split("=");
                        query[pair[0]] = pair[1];
                    }
                } else {
                    const pairs = url.split("&");
                    for (let i = 0; i < pairs.length; i++) {
                        const pair = pairs[i].split("=");
                        query[pair[0]] = pair[1];
                    }
                }
                return query;
            }
        },
        created() {

        },
        mounted: function () {

        }
    }
</script>

<style>
</style>
