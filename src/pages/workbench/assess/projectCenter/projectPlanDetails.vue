<template>

    <view class="content">
        <view>
            <z-paging ref="paging" :fixed=true @query="queryPageList" v-model="DetailList">
                <view slot="top">
                    <!-- 基本用法 -->
                    <uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
                </view>
                <view style="margin-top:10px;margin-bottom:10px;">
                </view>

                <uni-group mode="card" v-for="(detailData,index) in DetailList">
                    <uni-row :gutter="gutter" :width="nvueWidth">
                        <uni-col :span="18">
                            <view>
                                {{ getItemShowName(detailData.projectPhaseName)}}

                                <uni-tag v-show="detailData.status == 'running'" text="进行中" type="primary" size="small"  style="margin-left:20px;"/>
                                <uni-tag v-show="detailData.status == 'finish'" text="已完成" type="royal" size="small"  style="margin-left:20px;"/>

                            </view>
                            <view style="margin-top:20rpx;font-size: 24rpx;color: #0B877F;">
                                {{getNote(detailData)}}
                            </view>
                        </uni-col>
                        <uni-col :span="6">
                            <view v-show="getCanReplayStatus(detailData)">
                                <button type="primary" size="mini" @click.stop="itemReplayClick(detailData)">
                                    <uni-icons color="'#8f8f94'" type="undo-filled" size="14"></uni-icons>
                                </button>
                            </view>

                            <view v-show="detailData.excuteUrl">
                                <view v-show="detailData.status != 'finish'">
                                    <button :type="getExcuteUrlType(detailData) == 'a'?'default':'primary'" size="mini"
                                            @click.stop="itemClick(detailData,true)">
                                        <uni-icons :color="getExcuteUrlType(detailData) == 'a'?'#000000':'#FFFFFF'"  type="arrowthinright" size="14"></uni-icons>
                                    </button>
                                </view>
                            </view>

                            <view v-show="detailData.displayUrl">

                            </view>

                            <button type="default" size="mini" @click.stop="itemClick(detailData,false)">
                                <uni-icons color="'#ceced4'" type="search" size="14"></uni-icons>
                            </button>

                        </uni-col>
                    </uni-row>
                </uni-group>
            </z-paging>
        </view>

        <my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
                     height="fit-content" :maskFun="true">
            <view>
                <view class="uni-box-head">
                    <uni-title type="h1" align="center" title="重启任务"></uni-title>
                </view>
                <uni-forms :modelValue="projectTaskReturnRecord" ref="form" validate-trigger="bind"
                           err-show-type="undertext">
                    <uni-forms-item required name="reason" label="重启原因" label-align="right">
                        <uni-easyinput type="textarea" autoHeight v-model="projectTaskReturnRecord.reason"
                                       placeholder="重启原因">
                        </uni-easyinput>
                    </uni-forms-item>
                </uni-forms>

                <view class="uni-flex uni-row " style="width: 100%;">
                    <view style="-webkit-flex: 1;flex: 1;" class="assessbutton">
                        <button @click.stop="sureReplayForm()">
                            提交
                        </button>
                    </view>
                </view>
            </view>
        </my-ming-pop>
    </view>

</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as assessCommonUtils from "@/common/assess/assessCommonUtils.js";
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';
    import myMingPop from "@/components/ming-pop/ming-pop.vue";


    export default {
        data() {
            return {
                DetailList: [],
                searchValue: null,
                total: 0,
                pulldownLoad: false,
                projectInfo: {},
                phase: {},
                gutter: 0,
                nvueWidth: 730,
                extraIcon: {
                    color: '#4cd964',
                    size: '22',
                    type: 'info-filled'
                },
                projectTaskReturnRecord: {}
            }
        },
        onNavigationBarButtonTap() {
            let phase = this.phase;
            var param = {
                phase: phase,
                projectInfo: this.projectInfo
            };
            let url = "./addProjectPlanDetails?json=" + JSON.stringify(param);
            if (!phase.bisTask) {
                uni.showModal({
                    title: "阶段任务未完成或未提交",
                    content: "是否继续创建任务",
                    confirmText: "确定",
                    cancelText: "取消",
                    cancelColor: "#DD524D",
                    confirmColor: "#4CD964",
                    success: (res) => {
                        if (res.confirm) {
                            uni.navigateTo({
                                url: url
                            });
                        }
                    }
                });
                return false;
            }
            uni.navigateTo({
                url: url
            });
        },
        onShow() {
            this.$nextTick(() => {
                this.$refs.paging.reload();
            });
        },
        onLoad(option) {
            let query = JSON.parse(option.json);
            this.phase = query.phase;
            this.projectInfo = query.projectInfo;
            this.$nextTick(() => {
                this.$refs.paging.reload();
            });
            if (this.projectInfo.projectName) {
                uni.setNavigationBarTitle({
                    title: this.phase.workStageName + "-" + this.projectInfo.projectName
                });
            }
        },
        components: {
            "assess-picker": assessPicker,
            "my-ming-pop": myMingPop,
            "input-autocomplete": inputAutocomplete
        },
        methods: {
            queryPageList(pageNo, pageSize) {
                var _this = this;
                let userInfo = _this.$helper.fetchLocalUser();
                var data = {
                    pageNum: pageNo,
                    pageSize: pageSize,
                    projectPhaseName: _this.searchValue,
                    projectPhaseIds: _this.phase.id,
                    userAccount: userInfo.userAccount,
                    projectId: _this.projectInfo.id
                };
                let option = {
                    url: "/app.assess/public/getProjectPlanDetailsList",
                    method: 'POST',
                    data: data
                };
                this.$myRequest.pmccRequest(option).then(res => {
                    if (res.data.ret) {
                        _this.$refs.paging.complete(res.data.data.rows);
                    }
                }).catch(err => {
                    uni.showModal({
                        title: '错误提示',
                        content: err.errMsg,
                        showCancel: false
                    });
                });
            },
            itemReplayClick(item) {
                let phase = this.phase;
                let phaseForm = phase.phaseForm;
                if (!phaseForm) {
                    uni.showToast({
                        title: "移动端无法处理此事项!",
                        icon: "error",
                        duration: 3000
                    });
                    return false;
                }
                let userInfo = this.$helper.fetchLocalUser();
                this.$refs.myMingPop.show();
                this.projectTaskReturnRecord.planDetailsId = item.id;
                this.projectTaskReturnRecord.creator = userInfo.userAccount;
                this.projectTaskReturnRecord.userAccount = userInfo.userAccount;
                console.log(item);
            },
            sureReplayForm() {
                // 手动提交表单
                var _this = this;
                let projectTaskReturnRecord = this.projectTaskReturnRecord;
                if (!projectTaskReturnRecord.reason) {
                    uni.showToast({
                        title: "原因必填!",
                        icon: "error",
                        duration: 3000
                    });
                    return false;
                }
                uni.showToast({
                    title: "提交中",
                    icon: "loading",
                    duration: 2000
                });
                this.$myRequest.pmccRequest({
                    data: projectTaskReturnRecord,
                    url: "/app.assess/public/replyProjectPlanDetails",
                    method: "POST"
                }).then(res => {
                    uni.showToast({
                        title: "重启成功!",
                        icon: "success",
                        duration: 3000,
                        success: function () {
                            _this.$refs.paging.reload();
                            _this.$refs.myMingPop.close();
                            _this.projectTaskReturnRecord = {};
                        }
                    });
                }).catch(res => {
                    uni.showToast({
                        title: "异常!",
                        icon: "error",
                        duration: 3000
                    });
                })
            },
            itemClick(item, codeFlag) {
                let phase = this.phase;
                let phaseForm = phase.phaseForm;
                if (!phaseForm) {
                    uni.showToast({
                        title: "移动端无法处理此事项!",
                        icon: "error",
                        duration: 3000
                    });
                    return false;
                }
                var param = {
                    phase: phase,
                    projectInfo: this.projectInfo,
                    projectPlanDetails: item
                };
                let keyCacheId = assessCommonUtils.navigationCacheKey(item.id);
                uni.setStorageSync(keyCacheId, param);
                var parEl = "keyCacheId=" + keyCacheId + "&json=" + JSON.stringify(param);
                switch (phaseForm) {
                    //土地申报
                    case "projectTaskDeclareLandPureAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskLandDeclareAssist/taskDeclareApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskLandDeclareAssist/taskDeclareDetail?" + parEl
                            });
                        }
                        break;
                    }
                    //房产申报 key 是评估系统里面的spring bean
                    case "projectTaskDeclareAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskDeclareAssist/taskDeclareApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskDeclareAssist/taskDeclareDetail?" + parEl
                            });
                        }
                        break;
                    }
                    //房产  现场查勘
                    case "projectTaskSurveyAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskSurveyAssist/taskSurveyApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskSurveyAssist/taskSurveyDetail?" + parEl
                            });
                        }
                        break;
                    }
                    //房产 交易案例 现场查勘
                    case "projectTaskCaseAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskSurveyCaseAssist/taskSurveyCaseApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskSurveyCaseAssist/taskSurveyCaseDetail?" + parEl
                            });
                        }
                        break;
                    }
                    //土地 现场查勘
                    case "projectTaskSurveyLandAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskSurveyLandAssist/taskSurveyApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskSurveyLandAssist/taskSurveyDetail?" + parEl
                            });
                        }
                        break;
                    }
                    //土地 交易案例 现场查勘
                    case "projectTaskCaseLandAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/taskSurveyLandCaseAssist/taskSurveyCaseApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/taskSurveyLandCaseAssist/taskSurveyCaseDetail?" + parEl
                            });
                        }
                        break;
                    }
                    case "surveyAssetInfoAssist": {
                        if (codeFlag) {
                            uni.navigateTo({
                                url: "../task/asset/houseAssetInfoAssist/taskAssetInfoApply?" + parEl
                            });
                        } else {
                            uni.navigateTo({
                                url: "../task/asset/houseAssetInfoAssist/taskAssetInfoDetail?" + parEl
                            });
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
            getNote(obj) {
                let arr = [];
                if (obj.executeUserName) {
                    arr.push(obj.executeUserName);
                }
                if (obj.planStartDate && obj.planEndDate) {
                    let str = utils.formatTime(obj.planStartDate, "YYYY-MM-DD") + "至" + utils.formatTime(obj.planEndDate,
                        "YYYY-MM-DD");
                    arr.push(str);
                }
                return arr.join("——");
            },
            getItemShowName(name) {
                return utils.getItemShowName(name, 24);
            },
            OnSearch(obj) {
                this.searchValue = obj.value;
                this.$refs.paging.reload();
            },
            onCancel() {
                this.searchValue = null;
                this.$refs.paging.reload();
            },
            getCanReplayStatus(row) {
                // console.log(row) ;
                if (row.canReplay && !row.excuteUrl) {
                    return true;
                }
                if (row.canReplay && !row.excuteUrl){

                }
                return false;
            },
            getExcuteUrlType(detailData) {
                let type = 'a';
                if (/processInsId/.test(detailData.excuteUrl)) {
                    type = 'b';
                }
                return type;
            }
        }
    }
</script>

<style>

</style>
