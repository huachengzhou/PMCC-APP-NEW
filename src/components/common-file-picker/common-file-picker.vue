<template>
	<view>
		<common-file-picker ref="fileCpn" :bisDeleteFlag="bisDeleteFlag" :bisImgFlag="bisImgFlag" :dataObj="dataObj" :count="count"  @initFun="initFun"></common-file-picker>

	</view>
</template>
<script>
	import commonFilePicker from '@/components/common-file-picker/file-cpn-picker.vue';
	export default {
		name: 'common-image-picker',
		props: {
			dataObj: {
				type: Object,
				default: {}
			},
			count: {
				type: [String, Number],
				default: 5
			},
			bisDeleteFlag: {
				type: [Boolean],
				default: function() {
					return true;
				}
			}
		},
		data() {
			return {
				bisImgFlag:false
			}
		},
		components: {
			"common-file-picker": commonFilePicker,
		},
		methods: {
			initFun: function() {
				this.$nextTick(() => {
					this.$refs.fileCpn.initFun();
				});
			}
		}
	}
</script>

