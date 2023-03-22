<template>
    <view class="content">
        <view>
            <z-paging ref="paging" :fixed="true" @query="queryPageList" v-model="DetailList">

                <!-- <view slot="top">
                    <uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
                </view> -->
                <view style="margin-top:10px;margin-bottom:10px;">
                </view>

                <uni-group v-for="(dataInfo,index) in DetailList" mode="card">
                    <view class="evan-form-show">
                        <evan-form :hide-required-asterisk="false" ref="forms">
                            <evan-form-item label="工程节点：" prop="projectNodeName">

                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{getProjectNodeName(dataInfo.projectTreeId)}}
                                </view>

                            </evan-form-item>

                            <evan-form-item label="抽查事项：" prop="checkParts">
                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{dataInfo.checkParts}}
                                </view>
                            </evan-form-item>

                            <evan-form-item label="抽查内容及要求：" prop="content">
                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{dataInfo.content}}
                                </view>
                            </evan-form-item>

                            <evan-form-item label="现场查勘情况：" prop="realityContent">
                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{dataInfo.realityContent}}
                                </view>
                            </evan-form-item>

                            <evan-form-item label="天气状况：" prop="weather">
                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{'天气:'+dataInfo.weather+';温度:'+dataInfo.temperature}}
                                </view>
                            </evan-form-item>


                            <evan-form-item label="详细地址：" prop="address">
                                <view :class="dataInfo.bisEnable+'' == 'true'?'form-input':'textDecoration form-input'"
                                      placeholder-class="form-input-placeholder">
                                    {{dataInfo.address}}
                                </view>
                            </evan-form-item>

                            <evan-form-item  v-show="dataInfo.delRemark" label="删除说明：" prop="delRemark">
                                <view class="form-input" style="font-size: 12px;color: red;"
                                      placeholder-class="form-input-placeholder">
                                    {{dataInfo.delRemark}}
                                </view>
                            </evan-form-item>


                            <evan-form-item label="附件：" prop="files">
                                <common-image-picker :dataObj="getImgFieldsName(dataInfo)" :bisDeleteFlag="false">
                                </common-image-picker>
                            </evan-form-item>


                            <evan-form-item label="操作：" prop="address">
                                <view class="form-input" placeholder-class="form-input-placeholder">
                                    <button type="primary" size="mini" @click="openLocation(dataInfo)">位置查看</button>
                                    <button v-show="dataInfo.bisEnable+'' == 'true'" type="primary" size="mini"
                                            @click="dataEdit(dataInfo)">编辑
                                    </button>
                                    <button v-show="dataInfo.bisEnable+'' == 'true'" type="primary" size="mini"
                                            @click="dataRemoveBefore(dataInfo)">删除
                                    </button>
                                </view>
                            </evan-form-item>
                        </evan-form>
                    </view>

                </uni-group>
            </z-paging>

            <!--<view v-show="false">-->
            <!--<project-audit-plan-tree :projectId="projectInfo.id" @emitParentResult="getProjectNodeList">-->
            <!--</project-audit-plan-tree>-->
            <!--</view>-->


            <my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
                         height="fit-content" :maskFun="true">
                <view style="margin-top: 20rpx;" class="uni-container">

                    <uni-forms :modelValue="delData" ref="form" validate-trigger="bind" err-show-type="undertext"
                               :rules="rules">
                        <uni-forms-item name="delRemark" label="删除原因" label-align="right">
                            <uni-easyinput required type="textarea" autoHeight v-model="delData.delRemark"
                                           placeholder="删除原因">
                            </uni-easyinput>
                        </uni-forms-item>

                    </uni-forms>

                    <view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
                        <button class="uni-button" size="mini" type="primary"
                                @click.stop="dataRemove()">确定
                        </button>
                        <button class="uni-button" size="mini" type="warn"
                                @click.stop="$refs.myMingPop.close()">关闭
                        </button>
                    </view>
                </view>
            </my-ming-pop>


        </view>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as commonKey from "@/common/commonKey.js";
    import project_audit_plan_tree from '@/components/costs/project-audit-plan-tree/project-audit-plan-tree.vue';
    import commonImagePicker from '@/components/common-file-picker/common-file-picker.vue';
    import myMingPop from "@/components/ming-pop/ming-pop.vue";
    import evanFormItem from '@/components/evan-form-item/evan-form-item.vue';
    import evanForm from '@/components/evan-form/evan-form.vue';

    export default {
        data() {
            return {
                delData: {},
                projectNodeList: [],
                DetailList: [],
                searchValue: null,
                projectInfo: {},
                projectPlanDetails: {},
                centerParam: {},
                appKey: '',
                total: 0,
                pulldownLoad: false,
                top: '30px',
                extraIcon: {
                    color: '#4cd964',
                    size: '22',
                    type: 'smallcircle'
                },
                eventChannel: null,
                rules: {
                    delRemark: {
                        rules: [{
                            required: true,
                            errorMessage: '请输入数据'
                        }]
                    }
                }
            }
        },
        components: {
            "project-audit-plan-tree": project_audit_plan_tree,
            "common-image-picker": commonImagePicker,
            "evan-form-item": evanFormItem,
            "evan-form": evanForm,
            "my-ming-pop": myMingPop
        },
        onNavigationBarButtonTap() {
            let that = this;
            try {
                if (this.centerParam.data) {
                    delete this.centerParam.data;
                }
            } catch (e) {
            }
            uni.navigateTo({
                url: "/pages/workbench/costs/project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExaminationAddChild",
                success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    try {
                        res.eventChannel.emit('emitChildData', that.centerParam);
                    } catch (e) {
                        console.log(e);
                    }

                }
            });
        },
        onShow() {
            let that = this;
            let appKey = this.appKey;
            uni.$on('updateBackData', function (data) {
                if (data.appKey == appKey) {
                    that.$nextTick(() => {
                        if (that.$refs.paging) {
                            that.$refs.paging.reload();
                        }
                    });
                }
            })
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
                that.projectPlanDetails = data.projectPlanDetails;
                that.centerParam = data;
                that.appKey = data.appKey;
                console.log(data)
                that.$nextTick(() => {
                    that.$refs.paging.reload();
                });


                that.$myRequest.pmccRequest({
                    url: "/app.costs/project/getProjectAuditPlanTreeAllotDto?projectId=" + that.projectInfo.id,
                    method: 'get',
                    data: {projectId: that.projectInfo.id},
                    urlParam: true
                }).then(res => {
                    if (res.data.ret) {
                        that.projectNodeList = res.data.data;
                    }
                });
            });
        },
        methods: {
            queryPageList(pageNo, pageSize) {
                var _this = this;
                var userInfo = this.$helper.fetchLocalUser();
                var data = {
                    pageNum: pageNo,
                    pageSize: pageSize,
                    userAccount: userInfo.userAccount,
                    projectId: _this.projectInfo.id,
                    pid: _this.projectPlanDetails.id,
                    search: _this.searchValue,
                    appKey: _this.appKey,
                };
                let option = {
                    url: "/app.costs.project/costsRpcProjectSceneSurveyPlan/getProjectSceneSurveyPlanPartsDto?",
                    method: 'POST',
                    data: data
                };
                _this.$myRequest.pmccRequest(option).then(res => {
                    if (res.data.ret) {
                        _this.$refs.paging.complete(res.data.data.rows);
                    }
                });
            },
            itemClick(item) {

            },
            OnSearch(obj) {
                this.searchValue = obj.value;
                this.$refs.paging.reload();
            },
            onCancel() {
                this.searchValue = null;
                this.$refs.paging.reload();
            },
            dataRemoveBefore(data) {
                this.delData = data;
                this.delData.delRemark = '';
                var _this = this;
                _this.$refs.myMingPop.show();
            },
            dataRemove() {
                let data = this.delData;
                var _this = this;
                data.bisEnable = false;
                let option = {
                    url: "/app.costs.project/costsRpcProjectSceneSurveyPlan/deleteProjectSceneSurveyPlanParts",
                    query: {
                        formData: JSON.stringify(data)
                    },
                    successCallback: function () {
                        uni.showToast({
                            title: '删除成功',
                            success() {
                                uni.hideLoading();
                                _this.$refs.paging.reload();
                                _this.$refs.myMingPop.close()
                            }
                        });
                    }
                };

                this.$refs.form.validate().then((res) => {

                    uni.showLoading({
                        title: '加载中',
                        mask: true
                    });
                    utils.requestDefault(option);
                });

            },
            dataEdit(data) {
                let that = this;
                let centerParam = this.centerParam;
                centerParam.data = data;
                uni.navigateTo({
                    url: "/pages/workbench/costs/project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExaminationAddChild",
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('emitChildData', centerParam);
                    }
                });
            },
            getImgFieldsName(formData) {
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
            openLocation(data) {
                uni.openLocation({
                    longitude: Number(data.longitude),
                    latitude: Number(data.latitude),
                    name: data.projectNodeName ? data.projectNodeName : data.checkParts
                });
            },
            getProjectNodeName(id) {
                if (this.projectNodeList.length > 0) {
                    for (let i = 0; i < this.projectNodeList.length; i++) {
                        if (this.projectNodeList[i].id == id) {
                            return utils.getItemShowName(this.projectNodeList[i].name, 12);
                        }
                    }
                }
            },
            getProjectNodeList(list) {
                this.projectNodeList = list;
            },
            getBisEnableNum(dataInfo) {
                let count = 0;
                if (dataInfo.bisEnable + '' == 'true') {

                }
            }
        }
    }
</script>

<style>
    @import url("@/components/evan-form/myStyle.css");

    .textDecoration {
        color: rgba(151, 158, 151, 0.97);
        text-decoration: line-through;
    }
</style>
