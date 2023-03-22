<template>
    <view>
        <view v-if="renderFlag">
            <common-map :longitude="longitude" :latitude="latitude" :findMap="bisFind" :addMarker="addMarker"
                        ref="mapCpn" @getLngLatResult="getLngLatResult"></common-map>
        </view>
    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import * as estateUtils from "@/common/assess/basic/examine.estate.js";
    import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
    import * as Explore from '@/common/assess/Explore.key.js';
    import gcoord from '@/common/assess/gcoord.js';
    import common_map_cpn from '@/components/common-map/map-cpn.vue';
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
    import assessSubmitButton from '@/components/assess/assess-submit-button/assess-submit-button.vue';
    import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';


    const AssessDicKey = Explore.AssessDicKey;
    const AssessDBKey = Explore.AssessDBKey;

    export default {
        data() {
            return {
                eventChannel: null,
                redirectTo:"" ,
                renderFlag: false, //延迟渲染标识  (必须)
                addMarker: 'y', //默认地图可以操作
                bisFind: 'n', //默认标记
                id: 0, // 使用 marker点击事件 需要填写id
                title: '',
                latitude: '',
                longitude: '',
                center: '',
                markers: [],
                loading: false,
                batchDetail: {},
                mapStyle: {
                    width: "100%",
                    height: "450px"
                },
                resultTableName: '',
                num: '',
                formData: {
                    id: '',
                    tableId: '',
                    lng: '',
                    lat: '',
                    name: '',
                    type: '',
                    creator: ''
                },
                option: {}
            }
        },
        components: {
            "assess-picker": assessPicker,
            "assess-submit-button": assessSubmitButton,
            "common-image-picker": commonImagePicker,
            "common-map": common_map_cpn
        },
        onBackPress(options) {
            let redirectTo = this.redirectTo;
            if(redirectTo){
                uni.redirectTo({
                    url: redirectTo
                });
                console.log("拦截");
                return true;
            }
            return false;
        },
        onLoad(option) {
            let batchDetail = {};
            if (option.num) {
                this.num = option.num;
            }
            if (option.resultTableName) {
                this.resultTableName = option.resultTableName;
            }
            if (utils.isNotEmptyString(option.batchDetailJson)) {
                batchDetail = JSON.parse(option.batchDetailJson);
            }
            this.batchDetail = batchDetail;
            this.setServerData();
            this.option = option;
            this.setHeight();
            let that = this;
            setTimeout(function () {
                if (!that.renderFlag) {
                    that.renderFlag = true;
                }
            }, 2000);


            let eventChannel = null;
            // #ifdef APP-NVUE
            eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
            // #endif
            // #ifndef APP-NVUE
            eventChannel = this.getOpenerEventChannel();
            // #endif
            this.eventChannel = eventChannel;

            // 监听emitChildData事件，获取上一页面通过eventChannel传送到当前页面的数据
            eventChannel.on('emitChildData', function(data) {
                if (data.redirectTo) {
                    that.redirectTo = data.redirectTo;
                }
                console.log(data)
            });
        },
        onShow() {

        },
        methods: {
            setHeight() {
                let _this = this;
                uni.getSystemInfo({
                    success: function (res) { // res - 各种参数
                        if (res.screenHeight) {
                            _this.mapStyle.height = (Number(res.screenHeight) - 100) + "px";
                            console.log((Number(res.screenHeight) - 100));
                        }
                    }
                });
            },
            getPrevNodeCenter() {
                let _this = this;
                if (!_this.num) {
                    this.renderFlag = true;
                    return false;
                }
                let batchDetail = this.batchDetail;
                estateCommonUtils.getPrevMapCenter(batchDetail.tableId, _this.num, function (resultData) {
                    if (!resultData) {
                        _this.renderFlag = true;
                        return false;
                    }
                    if (utils.isArrayEmpty(resultData)) {
                        _this.renderFlag = true;
                        return false;
                    }
                    let tempData = resultData[0];
                    if (utils.isNotEmptyString(tempData.lat)) {
                        let lat = parseFloat(tempData.lat);
                        lat = lat.toFixed(5);
                        lat = parseFloat(lat);
                        tempData.lat = lat;
                    }
                    if (utils.isNotEmptyString(tempData.lng)) {
                        let lng = parseFloat(tempData.lng);
                        lng = lng.toFixed(5);
                        lng = parseFloat(lng);
                        tempData.lng = lng;
                    }
                    var arr = [tempData.lng, tempData.lat];
                    _this.center = JSON.stringify(arr);
                    _this.title = "未标记(定位上个节点位置)";
                    _this.renderFlag = true;
                });
            },
            setServerData() {
                let url = "/app.assess/basicEstateTagging/getBasicEstateTaggingDtoListByWhere";
                let batchDetail = this.batchDetail;
                let _this = this;
                let formData = this.formData;
                let query = {
                    tableId: batchDetail.tableId,
                    type: batchDetail.type
                };
                formData.tableId = batchDetail.tableId;
                formData.type = batchDetail.type;
                uni.showLoading({
                    title: '加载中',
                    mask: true
                });
                let option = {
                    query: query,
                    url: url + "?" + utils.parseParam(query),
                    successCallback: function (resultData) {
                        uni.showToast({
                            title: '加载完成',
                            success() {
                                uni.hideLoading();
                            }
                        });
                        if (!resultData) {
                            _this.getPrevNodeCenter();
                            return false;
                        }
                        if (utils.isArrayEmpty(resultData)) {
                            _this.getPrevNodeCenter();
                            return false;
                        }
                        let len = resultData.length - 1;
                        let tempData = resultData[len];
                        if (utils.isNotEmptyString(tempData.lat)) {
                            let lat = parseFloat(tempData.lat);
                            lat = lat.toFixed(5);
                            lat = parseFloat(lat);
                            tempData.lat = lat;
                        }
                        if (utils.isNotEmptyString(tempData.lng)) {
                            let lng = parseFloat(tempData.lng);
                            lng = lng.toFixed(5);
                            lng = parseFloat(lng);
                            tempData.lng = lng;
                        }

                        var keys = Object.keys(formData);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            var value = formData[key];
                            formData[key] = tempData[key];
                        }

                        _this.formData = formData;
                        _this.latitude = tempData.lat;
                        _this.longitude = tempData.lng;
                        _this.title = tempData.name;
                        _this.setMarkers();
                        _this.renderFlag = true;
                    }
                };
                utils.requestDefault(option);
            },
            getLngLatResult(res) {
                console.log(res);
                let _this = this;
                let formData = this.formData;
                let option = this.option;
                formData.lng = res.longitude;
                formData.lat = res.latitude;
                formData.name = res.name;
                // _this.longitude = res.longitude;
                // _this.latitude = res.latitude;
                _this.title = res.name;
                // _this.title = res.address;
                _this.updateMarker();
                _this.setMarkers();
                // uni.showToast({
                //     title: '操作成功'
                // });
            },
            chooseLocation() {
                let _this = this;
                let formData = this.formData;
                let option = this.option;
                let redirectTo = "/pages/workbench/assess/basic/common/basicMap/mapMarker?" + utils.parseParam(option);
                // uni.chooseLocation({
                // 	success: (res) => {
                // 		console.log(res);
                // 		formData.lng = res.longitude;
                // 		formData.lat = res.latitude;
                // 		formData.name = res.name;
                // 		_this.longitude = res.longitude;
                // 		_this.latitude = res.latitude;
                // 		_this.title = res.name;
                // 		// _this.title = res.address;
                // 		_this.updateMarker();
                // 		_this.setMarkers();
                // 	}
                // });
                uni.navigateTo({
                    url: "/pages/map/map",
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        emitParentData: function (res) {
                            console.log(res);
                            formData.lng = res.longitude;
                            formData.lat = res.latitude;
                            formData.name = res.name;
                            _this.longitude = res.longitude;
                            _this.latitude = res.latitude;
                            _this.title = res.name;
                            // _this.title = res.address;
                            _this.updateMarker();
                            _this.setMarkers();
                            // uni.showToast({
                            //     title: '操作成功'
                            // });
                        }
                    },
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        let obj = {
                            redirectTo: redirectTo
                        };
                        if (formData.lng) {
                            obj.longitude = formData.lng;
                        }
                        if (formData.lat) {
                            obj.latitude = formData.lat;
                        }
                        res.eventChannel.emit('emitChildData', obj);
                    }
                })
            },
            setMarkers() {
                let _this = this;
                let markers = [{
                    latitude: _this.latitude,
                    longitude: _this.longitude,
                    iconPath: '../../../../../../static/mark_bs.png'
                }];
                _this.markers = markers;
            },
            updateMarker() {
                let batchDetail = this.batchDetail;
                let formData = this.formData;
                let url = "/app.assess/basicEstateTagging/saveAndUpdate";
                var userInfo = this.$helper.fetchLocalUser();
                formData.creator = userInfo.userAccount;
                let query = utils.filterEmptyData(formData);
                query.applyId = batchDetail.id;
                let option = {
                    url: url,
                    query: query,
                    successCallback: function (resultData) {
                        // uni.showToast({
                        //     title: '标记成功'
                        // });
                        console.log(resultData);
                    },
					errorCallback:function(){
						uni.showToast({
						    title: '数据上传服务器失败!',
							icon:"error"
						});
					}
                };
                utils.requestDefault(option);
                console.log("updateMarker", formData);
            },
            currencyClooseMaker() {
                let option = this.option;
                if (this.formData.id) {
                    option.id = this.formData.id;
                }
                if (this.formData.lat) {
                    option.latitude = this.formData.lat;
                }
                if (this.formData.lng) {
                    option.longitude = this.formData.lng;
                }
                uni.redirectTo({
                    url: "assessCustomMapClooseMaker?" + utils.parseParam(option)
                });
            }
        }
    }
</script>

<style>
    .text {
        margin: 15 rpx 10 rpx;
        padding: 0 20 rpx;
        /* background-color: #ebebeb; */
        height: 70 rpx;
        line-height: 70 rpx;
        text-align: center;
        color: #777;
        font-size: 26 rpx;
    }
</style>
