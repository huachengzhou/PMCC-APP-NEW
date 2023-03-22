<template>
	<view>
			<z-paging ref="paging" fixed @query="queryPageList" v-model="logList">
				<view class="log-list">
					<block v-for="(item,index) in logList" :key="index">
						<view class="log-list-cell" hover-class="uni-list-cell-hover" >
							<view class="log-media-list">
								<view class="log-media-list-body">
									<view class="log-media-list-text-top">
										<text>{{ item.createrName }}</text>
										<text>{{ item.conclusion }}</text>
									</view>
									<view class="log-media-list-text-middle">
										<rich-text :nodes="item.opinions"></rich-text>
									</view>
									<view class="log-media-list-text-bottom">
										<text>{{ formatTime(item.mdified) }}</text>
										<text>{{item.activityName }}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				processInsId:'',
				appKey:'',
				logList:[]
			}
		},
		onLoad(option) {
			console.log("日志数据："+option.data)
			var data = JSON.parse(option.data);
			this.appKey = data.appKey;
			this.processInsId = data.processInsId;
			
			
		},
		methods: {
			async queryPageList(pageNo, pageSize) {
					var _this = this;
					var userInfo = _this.$helper.fetchLocalUser();
					var data = {
						pageNo:pageNo,
						pageSize:pageSize,
						appKey:_this.appKey,
						processInsId:_this.processInsId
					};
					let res = await _this.$myRequest.pmccRequest({
						url:`/app.bpm/approvalLogPage`,
						method:'POST',
						data:data
					});
					if(res.data.ret){
						this.$refs.paging.complete(res.data.data.rows);
					}else{
						uni.showToast({
							title: res.data.errmsg,
							mask: true,
							duration: 1000
						});
					}
			}
		}
	}
</script>

<style>
.log-list {
	background-color: #FFFFFF;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.log-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
/* 图文列表 */
.log-media-list {
	padding: 22rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	width: 100%;
	flex-direction: row;
	
}
.log-media-list-body {
	/* height: 124rpx; */
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	overflow: hidden;
	border-bottom: 1rpx solid #f4f4f4;
	border-top-width: 2rpx;
}
.log-media-list-text-top {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: space-between;
	flex-direction: row;
	width: 100%;
	line-height: 30rpx;
	font-size: 28rpx;
	/* color: #8f8f94; */
}
.log-media-list-text-middle {
	margin-top: 5px;
	width: 100%;
	line-height: 36rpx;
	font-size: 30rpx;
	
}
.log-media-list-text-bottom {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: space-between;
	flex-direction: row;
	margin-top: 8px;
	width: 100%;
	line-height: 30rpx;
	font-size: 26rpx;
	color: #8f8f94;
}

</style>
