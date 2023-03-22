<template>
    <view>

        <view>
            <!--<label class="" @click="initEvent()">-->
            <!--{{fullName}}-->
            <!--</label>-->

            <input class="uni-input picker-border" :value="fullName" placeholder="工程节点" :disabled="true"
                   :clearable="false"
                   @click="initEvent()"/>

            <!--<input class="uni-input picker-border" :value="fullName" placeholder="工程节点" :disabled="true" :clearable="false"-->
            <!--@focus="initEvent()" @click="initEvent()"/>-->


            <!--<uni-easyinput type="text" :value="fullName" placeholder="工程节点" :disabled="true" :clearable="false"-->
            <!--@focus="initEvent()" @click="initEvent()"-->
            <!--/>-->

        </view>

        <view>
            <tki-tree ref="tkitree" :border="false" cancelColor="#0055ff" confirmColor="#0055ff" titleColor="#0055ff"
                      :selectParent="true" :multiple="multiple" :range="dataTreeList" :foldAll="false" idKey="id"
                      rangeKey="name" @confirm="treeConfirm" @cancel="treeCancel"></tki-tree>

        </view>

    </view>
</template>

<script>
    import * as utils from "@/common/untils.js";
    import myMingPop from "@/components/ming-pop/ming-pop.vue";
    import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';


    export default {
        model: {
            prop: 'dataValue', // 默认是value
            event: 'emitResult', // 默认是input
        },
        props: {
            dataValue: {
                type: [String, Number],
                default: ""
            },
            projectId: {
                type: [String, Number],
                default: ""
            }
        },
        computed: {
            fullName: function () {
                let dataValue = this.dataValue;
                let dataList = this.dataList;
                let text = "";
                dataList.forEach(item => {
                    if (item.id == dataValue) {
                        text = item.name;
                    }
                });
                return utils.getItemShowName(text, 20);
            }
        },
        watch: {},
        components: {
            "my-ming-pop": myMingPop,
            "assess-picker": assessPicker,
        },
        data() {
            return {
                dataList: [],
                dataTreeList: [],
                multiple: false
            };

        },
        methods: {
            initEvent() {
                if (this.dataList.length == 0) {
                    this.initFun();
                }
                let projectId = this.projectId;
                this.$refs.tkitree._show();
                //手动关闭软键盘
                try {
                    uni.hideKeyboard();
                } catch (e) {
                }
                console.log("initEvent  projectId:" + projectId)
            },
            // 确定回调事件
            treeConfirm(selectedData) {
                this.$emit("getResults", selectedData[0]);
                this.$emit("emitResult", selectedData[0].id);
            },
            // 取消回调事件
            treeCancel(e) {

            },
            showDate(date) {
                if (date) {
                    return utils.formatTime(date, "YYYY-MM-DD");
                }
                return "";
            },
            initFun() {
                if (this.dataList.length > 0) {
                    return false;
                }
                let projectId = this.projectId;
                if (!projectId) {
                    return false;
                }
                this.$myRequest.pmccRequest({
                    url: "/app.costs/project/getProjectAuditPlanTreeAllotDto?projectId=" + projectId,
                    method: 'get',
                    data: {projectId: projectId},
                    urlParam: true
                }).then(res => {
                    if (res.data.ret) {
                        this.dataList = res.data.data;
                        this.dataTreeList = utils.tranListToTreeData(res.data.data, "id", "parentId");
                        this.$emit("emitParentResult", res.data.data);
                        console.log(this.dataTreeList);
                        console.log(this.dataList);
                    }
                });
            }
        },
        beforeCreate: function () {
            // console.group('beforeCreate 创建前状态===============》');
        },
        created: function () {
            // console.group('created 创建完毕状态===============》');
        },
        beforeMount: function () {
            // console.group('beforeMount 挂载前状态===============》');
            // console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
        },
        mounted: function () {
            // console.group('mounted 挂载结束状态===============》');
            if (this.dataList.length == 0) {
                this.initFun();
            }
        },
        beforeUpdate: function () {
            // console.group('beforeUpdate 更新前状态===============》');
            // this.initFun();
        },
        updated: function () {
            // console.group('updated 更新完成状态===============》');
            // this.initFun();
        },
        beforeDestroy: function () {
            // console.group('beforeDestroy 销毁前状态===============》');
        },
        destroyed: function () {
            // console.group('destroyed 销毁完成状态===============》');
        }
    }
</script>

<style>

</style>
