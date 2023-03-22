<template>
	<view>
		<uni-section :title="taskData.creatorName" type="line"></uni-section>
		<view >
			<uni-card :title="taskData.processNameCn" :extra="taskData.createdName" isShadow note="Tips" @click="clickCard(taskData.taskId)">
				<text class="content-box-text">
					{{taskData.description}}
				</text>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskData: {}
			}
		},
		onLoad(option) {
			let data = JSON.parse(option.data);
			this.taskData = data;
		},
		components: {

		},
		methods: {
			getTitle() {
				let title = '';
				if (this.taskData.processNameCn) {
					title += this.taskData.processNameCn + ' ';
				}
				if (this.taskData.creatorName) {
					title += this.taskData.creatorName + ' ';
				}
				return title;
			},
			
			onShow() {

			},
			clickCard(taskId) {
				console.log(taskId) ;
			}
		}
	}
</script>

<style scoped>


	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}
</style>
