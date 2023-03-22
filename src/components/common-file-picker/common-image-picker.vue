<template>
	<view>
		<common-file-picker ref="fileCpn" :dataObj="dataObj" :count="count" :bisImgFlag="bisImgFlag" @initFun="initFun"></common-file-picker>
		
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
			bisImgFlag: {
				type: [Boolean],
				default: function() {
					return true;
				}
			}
		},
		data() {
			return {
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

