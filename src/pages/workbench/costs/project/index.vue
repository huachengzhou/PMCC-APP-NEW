<template>
    <view class="content">
        <view>
            <z-paging ref="paging" :fixed="true" @query="queryPageList" v-model="DetailList">


                <view slot="top" class="">
                    <uni-row>
                        <uni-col :span="18">
                            <uni-search-bar @confirm="OnSearch" @cancel="onCancel"></uni-search-bar>
                        </uni-col>
                        <uni-col :span="6">
                            <assess-picker style="padding-top:10rpx;" :dataInput="'bisFollow'" :dataList="bisFollowList"
                                           :usePickerBorder="false"
                                           v-model:dataValue="bisFollow">
                            </assess-picker>
                        </uni-col>

                    </uni-row>
                </view>

                <view style="margin-top:10px;margin-bottom:10px;">
                </view>
                <uni-list>
                    <uni-list-item v-for="(detailData,index) in DetailList" :extra-icon="extraIcon"
                                   :show-extra-icon="true" :ellipsis="1" :title="detailData.projectName" showArrow
                                   :rightText="detailData.pmName" :note="getNote(detailData)?getNote(detailData):'加载中'"
                                   clickable
                                   @click="itemClick(detailData,$event)"/>
                </uni-list>
            </z-paging>
        </view>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as commonKey from "@/common/commonKey.js";
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';


    export default {
        data() {
            return {
                bisFollowList: [{
                    id: '-1',
                    name: '全部'
                }, {
                    id: '1',
                    name: '关注'
                }],
                DetailList: [],
                searchValue: null,
                bisFollow: '-1',
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
            var _this = this;

        },
        watch: {
            bisFollow: {
                handler(newValue, oldValue) {
                    let data = this.$data;
                    var _this = this;

                    this.$nextTick(() => {
                        this.$refs.paging.reload();
                    });
                    console.log('newValue:' + newValue + ' ; oldValue:' + oldValue)
                },
                deep: true //true 深度监听
            }
        },
        components: {
            "assess-picker": assessPicker,
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
            eventChannel.on(commonKey.keys.emitWorkBenchKey, function (data) {
                console.log(data)
            });
            this.appKey = option.appKey;
            this.$nextTick(() => {
                this.$refs.paging.reload();
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
                            search: _this.searchValue,
                            bisFollow: _this.bisFollow == '-1' ? '' : _this.bisFollow,
                            bisState: bisState
                        };
                        let option = {
                            url: "/app.costs/project/getCostsRpcProjectList",
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
                item.appKey = this.appKey;
                uni.navigateTo({
                    url: "/pages/workbench/costs/project/details/details?",
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('emitChildData', {
                            data: item,
                            projectInfo: item,
                            appKey: item.appKey
                        });
                    }
                });
            },
            OnSearch(obj) {
                this.searchValue = obj.value;
                this.$refs.paging.reload();
            },
            onCancel() {
                this.searchValue = null;
                this.bisFollow = null;
                this.$refs.paging.reload();
            },
            showDate(date) {
                if (date) {
                    return utils.formatTime(date, "YYYY-MM-DD");
                }
                return "";
            },
            getNote(obj) {
                let arr = [];
                if (obj.typeName) {
                    arr.push(obj.typeName);
                }
                if (obj.categoryName) {
                    arr.push(obj.categoryName);
                }
                return arr.join("——");
            }
        }
    }
</script>

<style scoped>

</style>
