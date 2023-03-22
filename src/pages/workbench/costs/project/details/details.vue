<template>
    <view style="margin-top: 40px;">
        <view v-for="(phaseBaseGroup,groupIndex) in phaseGroupList" :key="groupIndex">
            <view v-show="groupProjectPhaseList(phaseBaseGroup).length > 0">
                <uni-section :title="phaseBaseGroup.className" type="line"></uni-section>
                <uni-list>
                    <view v-for="(phaseObj,index) in groupProjectPhaseList(phaseBaseGroup)" :key="index">
                        <uni-list-item :disabled="false" :show-extra-icon="true" :extra-icon="extraIcon" clickable
                                       @click="itemClick(phaseObj,$event)" :title="phaseObj.phaseName"/>
                    </view>
                </uni-list>
            </view>
        </view>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import inputAutocomplete from '@/components/input-autocomplete/input-autocomplete.vue';

    export default {
        data() {
            return {
                projectInfo: {},
                appKey: "",
                phaseGroupList: [{
                    "id": 1,
                    "className": "编制类",
                    "businessTypeCode": null,
                    "businessKey": "BZL",
                    "prentId": 0,
                    "displaySort": 1,
                    "bomStages": null
                }, {
                    "id": 38,
                    "className": "评审类",
                    "businessTypeCode": null,
                    "businessKey": "PSL",
                    "prentId": 0,
                    "displaySort": 2,
                    "bomStages": null
                }, {
                    "id": 5,
                    "className": "清标类",
                    "businessTypeCode": null,
                    "businessKey": null,
                    "prentId": 0,
                    "displaySort": 3,
                }, {
                    "id": 4,
                    "className": "结算类",
                    "businessTypeCode": null,
                    "businessKey": "JSL",
                    "prentId": 0,
                    "displaySort": 4,
                }, {
                    "id": 8,
                    "className": "鉴定类",
                    "businessTypeCode": null,
                    "businessKey": "JDL",
                    "prentId": 0,
                    "displaySort": 5,
                    "bomStages": null
                }, {
                    "id": 9,
                    "className": "跟踪类",
                    "businessTypeCode": null,
                    "businessKey": "THIRD",
                    "prentId": 0,
                    "displaySort": 6,
                    "bomStages": "change,visa,claim,measurement_payment"
                }],
                extraIcon: {
                    color: '#4cd964',
                    size: '22',
                    type: 'flag-filled'
                },
                extraIconDisable: {
                    color: '#4cd964',
                    size: '22',
                    type: 'flag'
                },
                eventChannel: null
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
                that.projectInfo = data.data;
                that.appKey = data.appKey;
                uni.setNavigationBarTitle({
                    title: data.data.projectName
                });
            });
        },
        onPullDownRefresh() {
            uni.showToast({
                title: "刷新中",
                icon: "loading",
                duration: 2000
            });
            //下拉刷新

            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        components: {
            "assess-picker": assessPicker,
            "input-autocomplete": inputAutocomplete
        },
        methods: {
            itemClick(item) {
                let url = "";
                let projectInfo = this.projectInfo;
                let appKey = this.appKey;


                switch (item.codeMark) {
                    case "sceneSurvey": {
                        url = "/pages/workbench/costs/project/imp/sceneSurveyPlanIndex/sceneSurveyPlanIndex";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                if (!url) {
                    return false;
                }
                uni.navigateTo({
                    url: url,
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('emitChildData', {
                            data: projectInfo,
                            projectInfo: projectInfo,
                            appKey: appKey
                        });
                    }
                });
            },
            groupProjectPhaseList(group) {
                let list = [];
                switch (group.businessKey) {
                    case  "JSL": {
                        list.push({phaseName: "现场查勘", codeMark: "sceneSurvey", mobileFlag: true});
                        break
                    }
                }
                return list;
            }
        }
    }
</script>

<style>
</style>
