<template>
    <view>
        <view>
            <uni-group mode="card">
                <view v-if="dataDicList.length > 0">
                    <uni-forms-item name="category" label="类型" label-align="right">
                        <picker @change="initFormPickerResult('category','categoryId',$event)" :value="dataIndex"
                                :range="dataDicList" range-key="name">
                            <view class="uni-input">{{dataDicList[dataIndex].name}}</view>
                        </picker>
                    </uni-forms-item>
                </view>
                <uni-forms-item name="webServiceKeyWord" label="关键词" label-align="right">
                    <uni-easyinput type="text" v-model="webServiceKeyWord" placeholder="关键词">
                    </uni-easyinput>
                </uni-forms-item>

                <uni-forms-item name="webServiceRadius" label="搜索半径" label-align="right">
                    <uni-easyinput type="digit" v-model="webServiceRadius" placeholder="搜索半径"/>
                </uni-forms-item>

                <view class="uni-flex uni-row">
                    <view class="flex-item">
                        <button @click.stop="openMapSearch('draw')" class="mini-btn" type="primary" size="mini">
                            搜索地图数据
                            <uni-icons color="'#8f8f94'" type="map-pin" size="15"></uni-icons>
                        </button>
                    </view>

                    <view v-show="dataDicList.length > 0" class="flex-item " style="margin-left: 20rpx;">
                        <label style="color: #DD524D;">类型为保存后数据类型</label>
                    </view>
                </view>
            </uni-group>
        </view>

        <my-ming-pop ref="draw" direction="below" :is_close="false" :is_mask="true" :width="100" height="fit-content"
                     :maskFun="true">
            <view style="margin-top: 20rpx;" class="uni-container">
                <view style="margin-top:20rpx;">
                    <view>
                        <uni-title type="h3" align="center" :title="fullName"></uni-title>
                    </view>
                </view>
                <view>
                    <view v-show="filterContentList.length > 0">
                        <uni-row>
                            <uni-col :span="6">
                                <view class="text">过滤词组</view>
                            </uni-col>
                            <uni-col :span="18">
                                <uni-data-checkbox multiple v-model="filterContent" :localdata="filterContentList"/>
                            </uni-col>
                        </uni-row>
                    </view>

                    <checkbox-group @change="checkboxChange">
                        <label v-for="item in currentDataList" class="uni-list-cell uni-list-cell-pd" :key="item.value"
                               style="font-size: 12px;">
                            <view>
                                <checkbox :value="item.name" :checked="item.checked"/>
                            </view>
                            <!-- <view>{{item.address}}</view> -->
                            <view>{{item.name}} &nbsp;&nbsp; 距离</view>
                            <view>&nbsp;&nbsp;&nbsp;&nbsp; : {{item.distance?item.distance + '米':'无'}}</view>
                        </label>
                    </checkbox-group>

                    <uni-pagination @change="paginationCurrentEvent" title="标题文字" show-icon="true" :pageSize="pageSize"
                                    :total="total" :current="current"></uni-pagination>
                </view>
                <view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
                    <button @click="confirm('draw')" class="mini-btn" type="primary"
                            size="mini">{{'确认('+values.length+')'}}
                    </button>
                    <button @click="abandon('draw')" class="mini-btn" type="primary" size="mini"> 放弃
                    </button>
                    <button @click="onchecked(true)" class="mini-btn" type="primary" size="mini"> 全选
                    </button>
                    <button @click="onchecked(false)" class="mini-btn" type="primary" size="mini"> 全不选
                    </button>
                    <button @click="openModel()" class="mini-btn" type="primary" size="mini"> 词组+
                    </button>
                </view>
            </view>
        </my-ming-pop>


        <div id="containerSearchMap" style="display: none;" tabindex="0">
        </div>


        <view>
            <my-ming-pop ref="myMingPop" direction="below" :is_close="false" :is_mask="true" :width="100"
                         height="fit-content" :maskFun="true">
                <view style="margin-top: 20rpx;" class="uni-container">
                    <view style="margin-top:20rpx;">
                        <view>
                            <uni-title type="h3" align="center" title="词组名称"></uni-title>
                        </view>
                    </view>
                    <view>
                        <uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext"
                                   :rules="rules">
                            <uni-group mode="card">
                                <uni-forms-item required name="name" label="词组名称" label-align="right">
                                    <uni-easyinput type="text" v-model="formData.name" placeholder="词组名称">
                                    </uni-easyinput>
                                </uni-forms-item>
                            </uni-group>
                        </uni-forms>
                    </view>
                    <view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
                        <button class="uni-button" size="mini" type="primary" @click.stop="sureFunModel">确定</button>
                        <button class="uni-button" size="mini" type="warn" @click.stop="closeModel">关闭</button>
                    </view>
                </view>
            </my-ming-pop>
        </view>
    </view>


</template>

<script>
    var amapFile = require('@/common/assess/AMapWX_SDK/amap-wx.js');
    import * as utils from "@/common/untils.js";
    import * as estateCommonUtils from "@/common/assess/basic/examine.common.js";
    import * as Explore from '@/common/assess/Explore.key.js';
    import myMingPop from "@/components/ming-pop/ming-pop.vue";
    import aMapAdcodeCitycodeList from "@/common/map/AMap_adcode_citycode.js";

    const AssessDicKey = Explore.AssessDicKey;
    const AssessDBKey = Explore.AssessDBKey;


    export default {
        name: 'common-map-poi-search',
        props: {
            search: {
                type: [String],
                default: ''
            },
            radius: {
                type: [Number], //默认  抓取半径
                default: 3000
            },
            querytype: {
                type: [String],
                default: ''
            },
            position: {
                type: [String], //经纬度 必须
                default: '' //如"104.083767,30.630319" 这样
            },
            citylimit: {
                type: Boolean, //默认
                default: true
            },
            multiple: {
                type: Boolean, //默认
                default: false
            },
            funType: {
                type: [Number], //默认  选取方式
                default: 2 //2 表示调用getPoiAround  1表示调用getInputtips
            },
            dataKey: {
                type: [String],
                default: ''
            },
            dataFilterDicByKey: {
                type: [String],
                default: ''
            }
        },
        data() {
            return {
                current: 1,
                total: 0,
                pageSize: 5,

                filterContent: [],
                formData: {
                    name: '',
                },
                key: 'ebc081d7abb00991693bcf48639da17d',
                webServicekey: "0b87682382ed2b00ed9d19cf0f27b9ba",
                webServiceRadius: 3000,
                webServiceKeyWord: '',
                //可滑动区域起始位置
                scrollTop: 0,
                //可滑动区域高度
                scrollHeight: '',
                //抽屉弹窗宽度
                drawerWidth: '',
                values: [],
                dataList: [],
                currentDataList: [],
                filterDataList: [],
                enableDataList: [],
                distanceList: [],
                dataDicList: [],
                filterContentList: [],
                dataIndex: 0,
                category: '',
                categoryId: 0,
                rules: {
                    name: {
                        rules: [{
                            required: true,
                            errorMessage: '请输入数据'
                        }]
                    }
                }
            }
        },
        watch: {
            filterContent: function (words, oldVal) {
                this.filterWordBtnEvent();
            }
        },
        components: {
            "my-ming-pop": myMingPop
        },
        computed: {
            fullName() {
                if (this.querytype && this.search) {
                    if (this.querytype == this.search) {
                        return this.querytype + " 抓取地图数据";
                    }
                }
                return this.querytype + this.search + " 抓取地图数据";
            },
            centerLon() {
                if (this.position) {
                    let arr = this.position.split(",");
                    let lng = arr[0];
                    return lng;
                }
                return 0;
            },
            centerLat() {
                if (this.position) {
                    let arr = this.position.split(",");
                    let lat = arr[1];
                    return lat;
                }
                return 0;
            }
        },
        methods: {
            initFormPickerResult(name, nameId, e) {
                let _this = this;
                let data = this.$data;
                _this.dataIndex = e.detail.value;
                data[name] = _this.dataDicList[_this.dataIndex].name;
                if (!this.webServiceKeyWord) {
                    this.webServiceKeyWord = _this.dataDicList[_this.dataIndex].name;
                }
                data[nameId] = _this.dataDicList[_this.dataIndex].id;
            },
            getPageList() {
                let dataAllList = this.enableDataList;
                this.total = dataAllList.length;
                let currentPage = this.current;
                let limit = this.pageSize;
                let total = this.total;
                let start = (currentPage - 1) * limit;
                let end = currentPage * limit;
                if (end > total) {
                    end = total;
                }
                let tempList = dataAllList.slice(start, end);
                this.currentDataList = tempList;
            },
            paginationCurrentEvent(e) {
                this.current = e.current;
                this.getPageList();
            },
            checkboxChange(e) {
                let that = this;
                let currentDataList = this.currentDataList;
                //第一步先删除本次的所有元素

                let Arr = this.values;
                let ToDeleteArr = this.currentDataList;
                for (let x = 0; x < ToDeleteArr.length; x++) {
                    for (let y = 0; y < Arr.length; y++) {
                        if (Arr[y].id == ToDeleteArr[x].id) {
                            Arr.splice(y, 1);
                            break;
                        }
                    }
                }


                //第二步  把本次选中的全部加入 结果集合数组中
                var values = e.detail.value;
                currentDataList.forEach(function (item) {
                    if (values.indexOf(item.name) != -1) {
                        item.checked = true;
                        Arr.push(item);
                    }
                });

                this.values = Arr;
            },
            onchecked(flag) {
                let result = [];
                var enableDataList = this.enableDataList;
                enableDataList.forEach(function (item) {
                    item.checked = flag;
                    result.push(item);
                });
                this.enableDataList = result;
                if (flag) {
                    this.values = result;
                } else {
                    this.values = [];
                }
            },
            confirm(e) {
                let _this = this;
                let values = this.values;
                let result = [];
                values.forEach(function (item) {
                    let distance = item.distance;
                    _this.distanceGetFun(distance, function (dataId) {
                        distance = dataId;
                    });
                    let obj = {
                        name: item.name,
                        address: item.address,
                        distance: distance,
                        category: _this.categoryId
                    };
                    result.push(obj);
                });
                this.$emit("outputResult", result);
                this.$refs[e].close();
            },
            abandon(e) {
                this.$refs[e].close();
            },
            openMapSearch(e) {
                let primaryKey = 1;
                this.initBaseData();
                if (utils.isEmptyString(this.position)) {
                    uni.showToast({
                        title: '未标记!'
                    });
                    return false;
                }
                uni.showToast({
                    title: '加载数据中请稍后!'
                });
                this.dataList = [];
                this.values = [];
                let _this = this;
                if (this.funType == 2) {
                    this.getPoiAround(function (poisData) {
                        if (utils.isArrayEmpty(poisData)) {
                            uni.showToast({
                                title: '无数据考虑重新标记或者仔细管理员'
                            });
                            return false;
                        }
                        let dataList = [];
                        poisData.forEach(function (item) {
                            let obj = {
                                name: item.name,
                                address: item.address,
                                distance: item.distance,
                                checked: false,
                                id: primaryKey++
                            };
                            dataList.push(obj);
                        });
                        _this.dataList = dataList;
                        _this.updateUseMapArray();
                        _this.getPageList();
                        _this.$refs[e].show();
                    });
                }
                if (this.funType == 1) {
                    this.getInputtips(function (poisData) {
                        if (utils.isArrayEmpty(poisData)) {
                            uni.showToast({
                                title: '无数据考虑重新标记或者仔细管理员'
                            });
                            return false;
                        }
                        let dataList = [];
                        poisData.forEach(function (item) {
                            let location = item.location;
                            let obj = {
                                name: item.name,
                                address: item.address,
                                distance: item.distance,
                                checked: false,
                                id: primaryKey++
                            };
                            if (location) {
                                let arr = [];
                                try {
                                    arr = location.split(",");
                                } catch (e) {
                                    //TODO handle the exception
                                    console.log(e);
                                }
                                if (arr.length == 2) {
                                    obj.lng = arr[0];
                                    obj.lat = arr[1];
                                }
                            }
                            dataList.push(obj);
                        });
                        _this.$refs[e].show();
                        //先赋值
                        _this.dataList = dataList;
                        _this.updateUseMapArray();
                        _this.getPageList();
                    });
                }
            },
            distanceGetFun(value, callback) {
                let _this = this;
                var a500 = {};
                var a1000 = {};
                var a1500 = {};
                var a2000 = {};
                var a2000Max = {};
                if (!value) {
                    return false;
                }
                value = Number(value);
                let distanceList = this.distanceList;
                distanceList.forEach(function (v) {
                    var number = _this.getNumber(v.name);
                    number = Number(number);
                    if (v.name == '小于等于500m') {
                        a500.number = number;
                        a500.id = v.id;
                    }
                    if (v.name == '小于等于1000m') {
                        a1000.number = number;
                        a1000.id = v.id;
                    }
                    if (v.name == '小于等于1500m') {
                        a1500.number = number;
                        a1500.id = v.id;
                    }
                    if (v.name == '小于等于2000m') {
                        a2000.number = number;
                        a2000.id = v.id;
                    }
                    if (v.name == '大于2000m') {
                        a2000Max.number = number;
                        a2000Max.id = v.id;
                    }
                });
                var id = null;
                //开始判断
                if (value < a500.number) {
                    id = a500.id;
                } else if (a500.number <= value && value < a1000.number) {
                    id = a1000.id;
                } else if (a1000.number <= value && value < a1500.number) {
                    id = a1500.id;
                } else if (a1500.number <= value && value < a2000.number) {
                    id = a2000.id;
                } else if (a2000Max.number <= value) {
                    id = a2000Max.id;
                }
                if (id) {
                    if (callback) {
                        callback(id);
                    }
                }
            },
            filterWordBtnEvent() {
                let words = this.filterContent;
                var allList = this.dataList;
                var groups = [];
                this.filterContentList.forEach(item => {
                    groups.push(item.value);
                });
                for (var i = 0; i < groups.length; i++) {
                    var word = groups[i];
                    var flag = false;
                    if (words.length != 0) {
                        flag = words.indexOf(word) != -1;
                    }
                    let filterList = this.filterDataList;
                    if (flag) {
                        //过滤
                        let arr = filterList;
                        for (let k = 0; k < allList.length; k++) {
                            let item = allList[k];
                            if (item.name) {
                                if (item.name.indexOf(word) != -1) {
                                    arr.push(item);
                                }
                            }
                        }
                        filterList = arr;
                    } else {
                        //将已经过滤的恢复
                        let array = [];
                        for (let k = 0; k < filterList.length; k++) {
                            let item = filterList[k];
                            if (item.name) {
                                if (item.name.indexOf(word) == -1) {
                                    array.push(item);
                                }
                            }
                        }
                        filterList = array;
                    }
                    this.filterDataList = this.distinctArray(filterList);
                }
                this.updateUseMapArray();
            },
            updateUseMapArray() {
                var all = this.dataList;
                var filter = this.filterDataList;
                // console.log("filterSize:" + filter.length);
                // console.log("dataSize:" + all.length);
                var enableData = [];
                if (filter.length != 0) {
                    for (var k = 0; k < all.length; k++) {
                        let data = all[k];
                        var flag = true;
                        for (var i = 0; i < filter.length; i++) {
                            let item = filter[i];
                            if (item.name == data.name) {
                                flag = false;
                            }
                        }
                        if (flag) {
                            enableData.push(data);
                        }
                    }
                } else {
                    enableData = all;
                }
                this.enableDataList = enableData;
                this.getPageList();
            },
            getNumber(str) {
                var reg = /[1-9][0-9]*/g;
                return str.match(reg)[0];
            },
            initBaseData() {
                this.map = uni.createMapContext("containerSearchMap", this);
                let _this = this;
                estateCommonUtils.loadAsyncDataDicByKey(AssessDicKey.estate_distance, function (result) {
                    _this.distanceList = result;
                });
                if (this.dataKey) {
                    estateCommonUtils.loadAsyncDataDicByKey(_this.dataKey, function (result) {
                        _this.dataDicList = result;
                        _this.category = _this.dataDicList[_this.dataIndex].name;
                        if (!_this.webServiceKeyWord) {
                            _this.webServiceKeyWord = _this.dataDicList[_this.dataIndex].name;
                        }
                        _this.categoryId = _this.dataDicList[_this.dataIndex].id;

                    });
                }
                if (this.dataFilterDicByKey) {
                    estateCommonUtils.loadAsyncDataDicByKey(_this.dataFilterDicByKey, function (result) {
                        let filterContentList = [];
                        result.forEach(item => {
                            filterContentList.push({
                                text: item.name,
                                value: item.name
                            });
                        });
                        _this.filterContentList = filterContentList;
                        result.forEach(item => {
                            if (_this.filterContent.indexOf(item.name) == -1) {
                                _this.filterContent.push(item.name);
                            }
                        });
                        setTimeout(function () {
                            _this.filterWordBtnEvent();
                        }, 1500);
                    });
                }
            },
            //---------------------------------------------------||---------------------------------
            getInputtips(callback) {
                var that = this;
                var myAmapFun = new amapFile.AMapWX({
                    key: that.key
                });
                let keywords = that.search;
                if (this.category) {
                    keywords = this.category;
                }
                let query = {
                    key: that.webServicekey,
                    keywords: keywords,
                    citylimit: true,
                    output: "JSON",
                    radius: that.webServiceRadius,
                    location: that.position,
                    offset: 20,
                    page: 1
                };
                if (this.webServiceKeyWord) {
                    query.keywords = this.webServiceKeyWord;
                }
                const pageAllSize = 10;
                let poisList = [];
                for (let i = 1; i <= pageAllSize; i++) {
                    query.page = i;
                    uni.request({
                        url: "https://restapi.amap.com/v3/place/around?" + utils.parseParam(query),
                        data: query,
                        header: {},
                        method: "GET",
                        success: (res) => {
                            if (res.statusCode == 200) {
                                let data = res.data;
                                let pois = data.pois;
                                poisList = poisList.concat(pois);
                                if (i == pageAllSize) {
                                    if (callback) {
                                        callback(poisList);
                                    }
                                }
                            }
                            // console.log(res);
                        },
                        fail: (err) => {

                        }
                    });
                }
            },
            getPoiAround(callback) {
                var that = this;
                var myAmapFun = new amapFile.AMapWX({
                    key: that.key
                });
                let keywords = that.search;
                let querytypes = that.querytype;
                let query = {
                    key: that.webServicekey,
                    keywords: keywords,
                    citylimit: true,
                    output: "JSON",
                    radius: that.webServiceRadius,
                    location: that.position,
                    types: querytypes,
                    offset: 20,
                    page: 1
                };
                //当自定义的时候
                if (this.webServiceKeyWord) {
                    query.keywords = this.webServiceKeyWord;
                    delete query.types;
                }
                const pageAllSize = 10;
                let poisList = [];
                for (let i = 1; i <= pageAllSize; i++) {
                    query.page = i;
                    uni.request({
                        url: "https://restapi.amap.com/v3/place/around?" + utils.parseParam(query),
                        data: query,
                        header: {},
                        method: "GET",
                        success: (res) => {
                            if (res.statusCode == 200) {
                                let data = res.data;
                                let pois = data.pois;
                                poisList = poisList.concat(pois);
                                if (i == pageAllSize) {
                                    if (callback) {
                                        callback(poisList);
                                    }
                                }
                            }
                            // console.log(res);
                        },
                        fail: (err) => {

                        }
                    });
                }
            },
            getCenterLocation(callback) {
                var that = this;
                let flagPosition = 1;
                uni.getLocation({
                    type: 'gcj02',
                    // altitude :true,
                    geocode: true, //返回可以用于uni.openLocation的经纬度
                    success: function (res) {
                        // console.log(res);
                        let address = {};
                        try {
                            address = res["address"];
                        } catch (e) {
                            //TODO handle the exception
                        }
                        // address = {
                        // 	"country": "中国",
                        // 	"province": "四川省",
                        // 	"city": "成都市",
                        // 	"district": "锦江区",
                        // 	"street": "三色路",
                        // 	"streetNum": "163号1栋",
                        // 	"poiName": "银海芯座A座",
                        // 	"cityCode": "028"
                        // };
                        if (!utils.isNotBlankObjectProperty(address)) {
                            // uni.showToast({
                            // 	title: '当前平台定位失败!'
                            // })
                            return false;
                        }
                        let serverData = {
                            province: address.province,
                            city: address.city,
                            district: address.district,
                        };
                        //假如高德地图名称变换了 那么单独一个属性一个属性的设置
                        let option = {
                            url: "/app.public/collectAreaData",
                            method: 'POST',
                            data: serverData
                        };
                        that.$myRequest.pmccRequest(option).then(result => {
                            if (result.data.ret) {
                                let data = result.data.data;
                                data.provinceName = serverData.province;
                                data.cityName = serverData.city;
                                data.districtName = serverData.district;
                                if (res.latitude && res.longitude) {
                                    data.latitude = res.latitude;
                                    data.longitude = res.longitude;
                                }
                                if (address.location) {
                                    var tempArr = address.location.split(',');
                                    if (tempArr.length == 2) {
                                        if (utils.isNumber(tempArr[0])) {
                                            if (utils.isNumber(tempArr[1])) {
                                                data.latitude = tempArr[1];
                                                data.longitude = tempArr[0];
                                            }
                                        }
                                    }
                                }
                                data.address = address;
                                if (flagPosition != 0) {
                                    flagPosition = 0;
                                    if (callback) {
                                        callback(data, 'uniapp');
                                    }
                                }
                            }
                        });
                    }
                });

                new Promise((resolved, rejected) => {
                    // 微信小程序高德sdk定位
                    try {
                        wx.getLocation({
                            type: "gcj02",
                            success: function (res) {
                                resolved(res);
                            }
                        });
                    } catch (e) {
                        //TODO handle the exception
                    }
                }).then(res => {
                    //利用高德地图webService 逆向编码地理
                    let regeoQuery = {
                        key: that.webServicekey
                    };
                    regeoQuery.location = res.longitude + "," + res.latitude;
                    regeoQuery.extensions = 'base';
                    regeoQuery.output = 'JSON';
                    return new Promise((resolve, reject) => {
                        uni.request({
                            url: "https://restapi.amap.com/v3/geocode/regeo",
                            data: regeoQuery,
                            header: {},
                            method: "GET",
                            success: (resA) => {
                                resolve([resA.data, res]);
                            }
                        });
                    });
                }).then(params => {
                    let res = params[0];
                    let sourceData = params[1];
                    //4:筛选出需要的数据
                    return new Promise((resolve, reject) => {
                        if (!res) {
                            return false;
                        }
                        if (res.status != '1') {
                            return false;
                        }
                        let regeocode = res.regeocode;
                        let addressComponent = regeocode.addressComponent;
                        resolve([addressComponent, sourceData]);
                    });
                }).then(params => {
                    let address = params[0];
                    let sourceData = params[1];
                    if (!address) {
                        return false;
                    }
                    //5:把行政区域地理传回服务端获取正确的地理id
                    let serverData = {
                        province: address.province,
                        city: address.city,
                        district: address.district,
                    };
                    let option = {
                        url: "/app.public/collectAreaData",
                        method: 'POST',
                        data: serverData
                    };
                    that.$myRequest.pmccRequest(option).then(result => {
                        if (result.data.ret) {
                            let data = result.data.data;
                            data.provinceName = serverData.province;
                            data.cityName = serverData.city;
                            data.districtName = serverData.district;
                            data.address = address;
                            if (flagPosition != 0) {
                                flagPosition = 0;
                                data.latitude = sourceData.latitude;
                                data.longitude = sourceData.longitude;
                                if (callback) {
                                    callback(data, 'wx');
                                }
                            }
                        }
                    });
                });
                /*
                {
                    "province": "25",
                    "city": "321",
                    "district": "2722",
                    "provinceName": "四川省",
                    "cityName": "成都市",
                    "districtName": "锦江区",
                    "latitude": 30.588913,
                    "longitude": 104.085111,
                    "address": {
                        "country": "中国",
                        "province": "四川省",
                        "city": "成都市",
                        "district": "锦江区",
                        "street": "三色路",
                        "streetNum": "163号1栋",
                        "poiName": "银海芯座",
                        "cityCode": "028"
                    }
                }
                */
            },
            getUseCenterFullLocation(location, callback) {
                var that = this;
                let dataResult = {
                    longitude: location.longitude,
                    latitude: location.latitude,
                };
                let regeoQuery = {location: dataResult.longitude + "," + dataResult.latitude, key: this.webServicekey};
                uni.request({
                    url: 'https://restapi.amap.com/v3/geocode/regeo?' + utils.parseParam(
                        regeoQuery),
                    method: 'GET',
                    success: resAParent => {
                        let resA = resAParent.data;
                        let regeocode = resA.regeocode;
                        let addressComponent = regeocode.addressComponent;
                        let adcode = '';
                        if (addressComponent.adcode) {
                            adcode = addressComponent.adcode;
                        } else if (addressComponent.citycode) {
                            aMapAdcodeCitycodeList.forEach(item => {
                                if (item.cityCode == addressComponent.citycode) {
                                    adcode = item.adcode;
                                }
                            });
                        } else {
                            let cityName = '';
                            if (addressComponent.province) {
                                cityName = addressComponent.province;
                            }
                            if (addressComponent.city) {
                                cityName = addressComponent.city;
                            }
                            if (addressComponent.district) {
                                cityName = addressComponent.district;
                            }
                            if (cityName) {
                                aMapAdcodeCitycodeList.forEach(item => {
                                    if (item.cityName == cityName) {
                                        adcode = item.adcode;
                                    }
                                });
                            }
                        }

                        if (!adcode) {
                            callback(dataResult);
                            uni.showToast({
                                title: '操作失败!'
                            });
                            return false;
                        }

                        if (addressComponent.province) {
                            dataResult.provinceName = addressComponent.province;
                        }
                        if (addressComponent.city) {
                            dataResult.cityName = addressComponent.city;
                        }
                        if (addressComponent.district) {
                            dataResult.districtName = addressComponent.district;
                        }
                        dataResult.address = addressComponent;
                        let weatherQuery = {
                            city: adcode,
                            key: that.webServicekey
                        };

                        uni.request({
                            url: 'https://restapi.amap.com/v3/weather/weatherInfo?' + utils.parseParam(
                                weatherQuery),
                            method: 'GET',
                            success: resA => {
                                let data = resA.data;
                                if (data.lives) {
                                    if (data.lives.length > 0) {
                                        dataResult.weather = data.lives[0];
                                    }
                                }
                                callback(dataResult);
                            },
                            fail: () => {
                                callback(res);
                            },
                            complete: () => {
                            }
                        })

                    },
                    fail: () => {
                        callback(res);
                    },
                    complete: () => {
                    }
                });
                /*
                {
                    "longitude": 116.322056,
                    "latitude": 39.89491,
                    "provinceName": "北京市",
                    "cityName": [],
                    "districtName": "丰台区",
                    "address": {
                        "city": [],
                        "province": "北京市",
                        "adcode": "110106",
                        "district": "丰台区",
                        "towncode": "110106002000",
                        "streetNumber": {
                            "number": "118号",
                            "location": "116.321395,39.894988",
                            "direction": "西",
                            "distance": "57.0667",
                            "street": "莲花池东路"
                        },
                        "country": "中国",
                        "township": "太平桥街道",
                        "businessAreas": [
                            {
                                "location": "116.328253,39.873074",
                                "name": "太平桥",
                                "id": "110106"
                            },
                            {
                                "location": "116.343174,39.882633",
                                "name": "广安门",
                                "id": "110102"
                            },
                            {
                                "location": "116.305696,39.904917",
                                "name": "公主坟",
                                "id": "110108"
                            }
                        ],
                        "building": {
                            "name": "北京西站",
                            "type": "交通设施服务;火车站;火车站"
                        },
                        "neighborhood": {
                            "name": [],
                            "type": []
                        },
                        "citycode": "010"
                    },
                    "weather": {
                        "province": "北京",
                        "city": "丰台区",
                        "adcode": "110106",
                        "weather": "霾",
                        "temperature": "13",
                        "winddirection": "西",
                        "windpower": "≤3",
                        "humidity": "7",
                        "reporttime": "2023-03-22 10:20:15",
                        "temperature_float": "13.0",
                        "humidity_float": "7.0"
                    }
                }
                *
                * */
            },
            getCenterFullLocation(callback) {
                var that = this;
                this.getCenterLocation(function (res) {
                    let cityName = '';
                    let adcode = '';
                    if (res.provinceName) {
                        cityName = res.provinceName;
                    }
                    if (res.cityName) {
                        cityName = res.cityName;
                    }
                    if (res.districtName) {
                        cityName = res.districtName;
                    }
                    aMapAdcodeCitycodeList.forEach(item => {
                        if (item.cityName == cityName) {
                            adcode = item.adcode;
                        }
                    });
                    let weatherQuery = {
                        city: adcode,
                        key: that.webServicekey
                    };

                    uni.request({
                        url: 'https://restapi.amap.com/v3/weather/weatherInfo?' + utils.parseParam(
                            weatherQuery),
                        method: 'GET',
                        success: resA => {
                            let data = resA.data;
                            if (data.lives) {
                                if (data.lives.length > 0) {
                                    res.weather = data.lives[0];
                                }
                            }
                            callback(res);
                        },
                        fail: () => {
                            callback(res);
                        },
                        complete: () => {
                        }
                    })
                });
                /**
                 {
				     "province": "25",
				     "city": "321",
				     "district": "2722",
				     "provinceName": "四川省",
				     "cityName": "成都市",
				     "districtName": "锦江区",
				     "latitude": 30.588913,
				     "longitude": 104.085111,
				     "address": {
				         "country": "中国",
				         "province": "四川省",
				         "city": "成都市",
				         "district": "锦江区",
				         "street": "三色路",
				         "streetNum": "163号1栋",
				         "poiName": "银海芯座",
				         "cityCode": "028"
				     },
				     "weather": {
				         "province": "四川",
				         "city": "锦江区",
				         "adcode": "510104",
				         "weather": "多云",
				         "temperature": "18",
				         "winddirection": "东北",
				         "windpower": "≤3",
				         "humidity": "43",
				         "reporttime": "2023-03-16 13:32:11",
				         "temperature_float": "18.0",
				         "humidity_float": "43.0"
				     }
				 }
                 * */
            },
            getRegion(callback) {
                var that = this;
                this.map = uni.createMapContext("containerSearchMap", this);
                this.map.getRegion({
                    success: ret => {
                        console.log(ret);
                        if (callback) {
                            callback(ret);
                        }
                    }
                })
            },
            distinctArray(arr) {
                var result = [];
                var obj = {};
                for (var i = 0; i < arr.length; i++) {
                    if (!obj[arr[i].name]) {
                        result.push(arr[i]);
                        obj[arr[i].name] = true;
                    }
                }
                return result;
            },
            openModel() {
                this.$refs.myMingPop.show();
                this.formData.name = '';
            },
            closeModel() {
                this.$refs.myMingPop.close();
                this.formData.name = '';
            },
            sureFunModel() {
                // 手动提交表单
                var _this = this;
                //特殊处理一些兼容性东西
                let userInfo = this.$helper.fetchLocalUser();
                let formData = this.formData;
                var groups = [];
                this.filterContentList.forEach(item => {
                    groups.push(item.value);
                });
                this.$refs.form.validate().then((res) => {
                    if (groups.indexOf(formData.name) != -1) {
                        uni.showModal({
                            title: '提示',
                            content: '过滤词组中已经包含此词组了!',
                            showCancel: false
                        });
                        return false;
                    }
                    this.filterContentList.push({
                        value: formData.name,
                        text: formData.name
                    });
                    this.filterContent.push(formData.name);
                    this.closeModel();
                });
            }
        },
        created() {
            this.webServiceKeyWord = this.search;
        }

    }
</script>

<style>
    .uni-list-cell {
        justify-content: flex-start
    }

    .scroll-view {
        height: 700 upx;
    }

    .work-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .workgroup-box {
        width: 90%;
        margin-left: 5%;
        height: 900 upx;
    }

    .worker-bar {
        width: 200 upx;
        display: flex;
        flex-direction: row;
    }
</style>
