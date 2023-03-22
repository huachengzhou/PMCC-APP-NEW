<template>
	<view class="assessbutton">
		<button @click.stop="submitFun()" :loading="loading">
			<!-- 插槽默认值 -->
			<slot>
				<view>提交</view>
			</slot>
		</button>
	</view>
</template>

<script>
	
	//处理
	
	export default {
		name: 'assess-submit-button',
		props: {
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		},
		computed: {

		},

		methods: {
			submitFun: function() {
				this.$emit("submit");
			}
		}
	}
</script>


