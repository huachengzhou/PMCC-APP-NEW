<template>

	<view>
		<view class="switch-wrapper">
			<text>{{defaultExpandAll ? '点击折叠全部' : '点击展开全部'}}</text>
			<switch :checked="defaultExpandAll" @change="switchChange"></switch>
		</view>
		<view class="content">
			<ly-tree
				ref="tree"
				:showRadio="showRadio" 
				node-key="id" 
				:tree-data="dataTreeList"
				:toggle-expend-all="defaultExpandAll"
				@node-expand="" 
				@radio-change="handleRadioChange"
				@node-click="" />
		</view>
		
		<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
			<view style="margin-right:30px;"><uni-tag :circle="true" :inverted="true" :text="batchDetail.name? '选中 '+ batchDetail.name:'未选择'" type="primary" /></view>
			<view style="margin-left:30px;"><button @click.stop="openView" class="mini-btn" type="primary" size="mini">修改</button></view>
		</view>
		
		<common-copower-approveEdit :taskInfo="taskInfo"  @submit="submitNew">
		</common-copower-approveEdit>

	</view>



</template>

<script>
	import * as utils from "../../../../../../common/untils.js";

	import LyTree from '@/components/ly-tree/ly-tree.vue' ;
	
	import commonCopowerApproveEdit from '@/components/bpm/assess-copower-approveEdit.vue';

	export default {
		data() {
			return {
				defaultExpandAll:false,
				showRadio:true,
				//防止重复提交
				taskInfo: {},
				batchDetail: {}, //树节点  选中数据
				applyBatch: {},
				batchDetailArray: [],
				dataTreeList: []
			}
		},
		onLoad(option) {
			var data = JSON.parse(option.data);
			this.taskInfo = data.taskInfo;
			this.setBatchDetailArray();
			
			console.log(this.taskInfo);
		},
		components: {
			"ly-tree" : LyTree ,
			"common-copower-approveEdit" : commonCopowerApproveEdit
		},
		methods: {
			submitNew(){
				uni.showToast({
					title: '操作成功',
					mask: true,
					success() {
						uni.setStorageSync("isDoBacklogRefresh", 1);
						uni.switchTab({
							url: '../../../../../backlog/backlog'
						});
					}
				});
			},
			setBatchDetailArray() {
				let processInsId = this.taskInfo.processInsId;
				let _this = this;
				this.$myRequest.pmccRequest({
					data: {
						processInsId: processInsId
					},
					method: "POST",
					url: "/app.assess/basicApplyBatch/getBasicApplyBatchDtoByProcessInsId?processInsId=" +
						processInsId,
					urlParam: true
				}).then(res => {
					if (res.data.ret) {
						let applyBatch = res.data.data;
						this.applyBatch = applyBatch;
						if(! applyBatch){
							return false ;
						}
						let option = {
							data: {
								applyBatchId: applyBatch.id,
							},
							url: '/app.assess/basicApplyBatchDetail/getBasicApplyBatchDetailTreeData',
							method: "POST",
							urlParam: false
						};
						return this.$myRequest.pmccRequest(option);
					}
				}).then(res => {
					if(! res){
						return false ;
					}
					if (res.data.ret) {
						this.batchDetailArray = res.data.data;
						this.selectTreeNodeFun();
					}
				});
			},
			selectTreeNodeFun() {
				let list = this.batchDetailArray;
				if (list.length == 0) {
					uni.showToast({
						title: "数据未完全渲染请等待!"
					});
					return false;
				}
				//1:找出pid = 0;
				//2:第二步 递归列表
				let firstData = {};
				list.forEach(function(item) {
					if (item.pid == 0) {
						firstData = item;
					}
				});
				let viewName = firstData.name + "(" + firstData.executorName + ")";
				if (firstData.executorName) {
					viewName = firstData.name + "(" + firstData.creatorName + ")";
				}
				let obj = Object.assign({
					id: firstData.id,
					pid: firstData.pid,
					label: viewName,
					name: firstData.name,
					children: []
				}, firstData);
				this.traverseFun(obj, list);
				this.dataTreeList = [obj];
			},
			traverseFun(root, list) {
				let that = this;
				var newArr = list.filter(item => root.id == item.pid);
				if (newArr.length == 0) {
					return;
				} else {
					list.forEach(function(item) {
						if (root.id == item.pid) {
							let viewName = item.name + "(" + item.executorName + ")";
							if (item.executorName) {
								viewName = item.name + "(" + item.creatorName + ")";
							}
							let obj = Object.assign({
								id: item.id,
								pid: item.pid,
								label: viewName,
								name: item.name,
								children: []

							}, item);
							that.traverseFun(obj, list);
							root.children.push(obj);
						}
					});
				}
			},
			switchChange(e) {
				this.defaultExpandAll = !this.defaultExpandAll;
			},
			handleRadioChange(e){
				let node = e.node;
				let checked = e.checked;
				let batchDetail = {} ;
				if(checked){
					this.batchDetailArray.forEach(item => {
						if(item.id == node.key){
							batchDetail = item ;
						}
					});
				}
				this.batchDetail = batchDetail;
			},
			openView(){
				let batchDetail = this.batchDetail ;
				let obj = this.applyBatch;
				if(! batchDetail.id) {
					uni.showToast({
						title: "没有选择节点",
						icon: 'closeempty',
						duration: 2000
					});
					return false; 
				}
				let query = {
					projectId: '',
					type: obj.type,
					applyBatchId: obj.id,
					modelPhoneType: obj.modelPhoneType,
					planDetailsId: ''
				}
				if (obj.projectId) {
					query.projectId = obj.projectId;
				}
				if (obj.planDetailsId) {
					query.planDetailsId = obj.planDetailsId;
				}
				query.transferId = batchDetail.id;
				uni.navigateTo({
					url:"../../home/surveyExploreHome?"+ utils.parseParam(query)
				});
			}
		}
	}
</script>

<style>
	.switch-wrapper {
		background-color: #f7f7f7;
		display: flex;
		padding: 30rpx;
		justify-content: space-between;
	}
</style>
