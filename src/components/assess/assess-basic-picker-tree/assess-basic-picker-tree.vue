<template>
	<view>
		<view @click="initEvent()">
			<slot></slot>
		</view>
		
		<tki-tree  ref="tkitree" :border="false" cancelColor="#0055ff" confirmColor="#0055ff" titleColor="#0055ff"
			:selectParent="true" :multiple="multiple" :range="dataTreeList" :foldAll="false" idKey="id"
			rangeKey="viewName" @confirm="treeConfirm" @cancel="treeCancel"></tki-tree>

	</view>
</template>

<script>
	export default {
		name: "assess-basic-picker-tree",
		props: {
			multiple: {
				type: Boolean,
				default: false
			},
			dataTreeList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				name: '',
			};
		},
		methods: {
			initEvent() {
				this.$refs.tkitree._show();
				//手动关闭软键盘
				uni.hideKeyboard();
			},
			// 确定回调事件
			treeConfirm(selectedData) {
				this.$emit("getResults", selectedData);
			},
			// 取消回调事件
			treeCancel(e) {
				
			}
		}
	}
</script>

<style>

</style>
