<template>
	<view class="content">
		<mix-tree 
			:list="list" 
			:params="treeParams"
			@treeItemClick="treeItemClick"
		></mix-tree>
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	let testList = [{
			id: 1,
			name: '题库',
			children: [{
				id: 11,
				name: '语文',
				children: [{
					id: 111,
					name: '高一卷',
					
				},{
					id: 112,
					name: '高二卷',
					
				}]
			},{
				id: 12,
				name: '数学',
				
			} ]
		},
		{
			id: 2,
			name: '高考',
			children: [{
				id: 21,
				name: '高考1',
				
			},{
				id: 22,
				name: '高考2',
				
			},{
				id: 23,
				name: '高考3',
				
			}, ]
		},
		{
			id: 3,
			name: '课程'
		},
		{
			id: 4,
			name: '论文',
			children: [{
				id: 41,
				name: '论文分享',
				
			}]
		}
	]
	export default {
		components: {
			mixTree
		},
		data() {
			return {
				list: [],
				treeParams: {
					defaultIcon: '/static/i2.png', // 默认图标
					currentIcon: '/static/i1.png', // 展开图标
					lastIcon: '/static/i3.png', //最后一级图标
					border: true   // 边框， 默认不显示
				}
			}
		},
		onLoad() {
			setTimeout(()=>{
				this.list = testList;
			}, 500)
		},
		methods: {
			//点击最后一级时触发该事件
			treeItemClick(item) {
				let {
					id,
					name,
					parentId
				} = item;
				uni.showModal({
					content: `点击了${parentId.length+1}级菜单, ${name}, id为${id}, 父id为${parentId.toString()}`
				})
				console.log(item)
			}
		}
	}
</script>

<style>

</style>
