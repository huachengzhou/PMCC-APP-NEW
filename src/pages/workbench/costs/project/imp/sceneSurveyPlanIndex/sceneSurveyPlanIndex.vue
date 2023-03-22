<template>
    <view class="content">
        <view>
            <z-paging ref="paging" :fixed="true" @query="queryPageList" v-model="DetailList">
                <view slot="top">
                    <uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
                </view>
                <view style="margin-top:10px;margin-bottom:10px;">
                </view>
                <uni-list>
                    <uni-list-item v-for="(detailData,index) in DetailList" :extra-icon="extraIcon"
                                   :show-extra-icon="true" :ellipsis="1" :title="'现场查勘'" showArrow
                                   :rightText="detailData.userNames"
                                   :note="getNote(detailData)?getNote(detailData):'加载中'"
                                   clickable @click="itemClick(detailData,$event)"/>

                    <!-- <uni-list-item v-for="(detailData,index) in distinctObj(DetailList)" :extra-icon="extraIcon"
                        :show-extra-icon="true" :ellipsis="1" :title="'现场查勘'" showArrow
                        :rightText="detailData.userNames" :note="getNote(detailData)?getNote(detailData):'加载中'"
                        clickable @click="itemClick(detailData,$event)" /> -->
                </uni-list>
            </z-paging>
        </view>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as commonKey from "@/common/commonKey.js";

    export default {
        data() {
            return {
                DetailList: [],
                searchValue: null,
                projectInfo: {},
                total: 0,
                pulldownLoad: false,
                top: '30px',
                appKey: "",
                extraIcon: {
                    color: '#4cd964',
                    size: '22',
                    type: 'smallcircle'
                },
                eventChannel: null
            }
        },
        onNavigationBarButtonTap() {
            var param = {
                appKey: this.appKey,
                projectInfo: this.projectInfo
            };
            uni.navigateTo({
                url: "/pages/workbench/costs/project/imp/sceneSurveyPlanIndex/addSceneSurveyPlan",
                success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('emitChildData', {
                        data: param.projectInfo,
                        appKey: param.appKey
                    });
                }
            });
        },
        watch: {},
        components: {},
        onShow() {
            let that = this;
            let appKey = this.appKey;
            uni.$on('updateBackData', function (data) {
                if (data.appKey == appKey) {
                    that.$nextTick(() => {
                        if (that.$refs.paging) {
                            console.log(that.$refs.paging);
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
                console.log(data)
                that.projectInfo = data.data;
                that.appKey = data.appKey;
                that.$nextTick(() => {
                    that.$refs.paging.reload();
                });
            });
        },
        methods: {
            queryPageList(pageNo, pageSize) {
                var _this = this;
                var userInfo = this.$helper.fetchLocalUser();
                let objFun = {
                    run: function (bisState, callback) {
                        var data = {
                            pageNum: pageNo,
                            pageSize: pageSize,
                            userAccount: userInfo.userAccount,
                            projectId: _this.projectInfo.id,
                            search: _this.searchValue,
                            appKey: _this.appKey,
                            bisState: bisState
                        };
                        let option = {
                            url: "/app.costs.project/costsRpcProjectSceneSurveyPlan/getProjectSceneSurveyPlanDto?",
                            method: 'POST',
                            data: data
                        };
                        _this.$myRequest.pmccRequest(option).then(res => {
                            if (res.data.ret) {
                                if (bisState) {
                                    let arr = res.data.data.rows;
                                    let newArr = [];
                                    if (arr.length != 0) {
                                        for (let i = 0; i < _this.DetailList.length; i++) {
                                            let objData = _this.DetailList[i];
                                            let filterData = null;
                                            arr.forEach(item => {
                                                if (objData.id == item.id) {
                                                    filterData = item;
                                                }
                                            });
                                            if (filterData) {
                                                newArr.push(filterData);
                                            } else {
                                                newArr.push(objData);
                                            }
                                        }
                                        _this.DetailList = newArr;
                                    }
                                } else {
                                    _this.$refs.paging.complete(res.data.data.rows);
                                }
                                if (callback) {
                                    callback();
                                }
                            }
                        }).catch(err => {
                            uni.showModal({
                                title: '错误提示',
                                content: err.errMsg,
                                showCancel: false
                            });
                        });
                    }
                };
                uni.showToast({
                    title: "加载中",
                    icon: "loading",
                    duration: 2000
                });
                objFun.run(false, function () {
                    objFun.run(true);
                    uni.showToast({
                        title: "加载完成",
                        icon: "success",
                        duration: 1000
                    });
                });

            },
            itemClick(item) {
                var param = {
                    appKey: this.appKey,
                    projectInfo: this.projectInfo
                };
                uni.navigateTo({
                    url: "/pages/workbench/costs/project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExamination?",
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('emitChildData', {
                            data: item,
                            projectInfo: param.projectInfo,
                            appKey: param.appKey
                        });
                    }
                });
            },
            distinctObj(arr) {
                //reduce第一个参数是遍历需要执行的函数，第二个参数是item的初始值
                var obj = {};
                arr = arr.reduce(function (item, next) {
                    obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                    return item;
                }, []);
                return arr;
            },
            OnSearch(obj) {
                this.searchValue = obj.value;
                this.$refs.paging.reload();
            },
            onCancel() {
                this.searchValue = null;
                this.$refs.paging.reload();
            },
            getNote(obj) {
                let arr = [];
                let tempArr = [];
                if (obj.executeUserName) {
                    arr.push(obj.executeUserName);
                }
                if (obj.formCode) {
                    arr.push(obj.formCode);
                }
                if (obj.startTime) {
                    tempArr.push(utils.formatTime(obj.startTime, "YYYY-MM-DD"));
                }
                if (obj.endTime) {
                    tempArr.push(utils.formatTime(obj.endTime, "YYYY-MM-DD"));
                }
                arr.push(tempArr.join("-"));
                return arr.join("  ");
            }
        }
    }
</script>

<style scoped>

</style>
