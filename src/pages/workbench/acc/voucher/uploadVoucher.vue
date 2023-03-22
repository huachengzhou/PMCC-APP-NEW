<template>

	<view style="margin-top: 40px;">

		<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<view>
				<common-custom-panel-grid-item :icon="false" :titles="fieldList" :itemData="formData">
				</common-custom-panel-grid-item>
			</view>

			<uni-group title="附件" mode="card">
				<uni-forms-item name="voucherCheck" label="凭证附件" label-align="right">
					<common-file-picker ref="fileCpn" :bisImgFlag="false" :dataObj="setImgFieldsName('voucherCheck')">
					</common-file-picker>
				</uni-forms-item>
			</uni-group>
		</uni-forms>
	</view>
</template>

<script>
	import * as utils from "@/common/untils.js";


	import assessPicker from '@/components/assess/assess-picker/assess-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/file-cpn-picker.vue';
	import common_custom_panel_grid_item from '@/components/common-custom-panel/common-custom-panel-grid-item.vue';

	let fieldList = [{
			label: "凭证编号",
			field: "groupUuid"
		},
		{
			label: "项目名称",
			field: "projectName"
		},
		{
			label: "账套",
			field: "companyName"
		},
		{
			label: "发生额",
			field: "amount"
		},
		{
			label: "格式化发生额",
			field: "formatAmount"
		},
		{
			label: "摘要",
			field: "remarks"
		},
	];

	export default {
		data() {
			return {
				fieldList: fieldList,
				disabled: true,
				formData: {
					groupUuid: '',
					projectName: '',
					companyName: '',
					amount: '',
					formatAmount: '',
					remarks: ''
				},
				rules: {}
			};
		},
		computed: {

		},
		watch: {
			formData: {
				handler(newValue, oldValue) {
					let data = this.$data;
					var _this = this;
				},
				deep: true //true 深度监听
			}
		},
		onLoad(option) {
			this.formData = JSON.parse(option.json);
			let title = "";
			if (this.formData.projectName) {
				title += this.formData.projectName;
			}
			if (title) {
				if (this.formData.groupUuid) {
					title += "——" + this.formData.groupUuid;
				}
			} else {
				if (this.formData.groupUuid) {
					title += this.formData.groupUuid;
				}
			}
			if (title) {
				uni.setNavigationBarTitle({
					title: title
				});
			}
			// console.log(this.formData);
			this.$nextTick(() => {
				this.$refs.fileCpn.initFun();
			});
		},
		onShow() {

		},
		onReady() {
			// 需要在onReady中设置规则
			// this.$refs.form.setRules(this.rules);
		},
		components: {
			"assess-picker": assessPicker,
			"common-custom-panel-grid-item": common_custom_panel_grid_item,
			"common-file-picker": commonFilePicker,
		},
		methods: {
			setImgFieldsName(fieldsName) {
				let formData = this.formData;
				let obj = {
					fieldsName: fieldsName,
					tableId: formData.id,
					tableName: 'tb_bom_base_voucher_group',
					appKey: formData.appKey
				};
				return obj;
			}
		}
	}
</script>

<style>

</style>
