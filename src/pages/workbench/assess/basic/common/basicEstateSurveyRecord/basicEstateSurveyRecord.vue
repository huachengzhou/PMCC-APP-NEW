<template>
	<view class="content">

		<view class="uni-container">

			<uni-forms :modelValue="formData" ref="form" validate-trigger="bind" err-show-type="undertext">
				<uni-group title="查勘记录" mode="card">
					<uni-forms-item name="estateSurveyRecordFileId" label="上传查勘记录" label-align="right">
						<common-image-picker ref="estateSurveyRecordFileId"
							:dataObj="setImgFieldsName('estateSurveyRecordFileId')">
						</common-image-picker>
					</uni-forms-item>
				</uni-group>
			</uni-forms>
			
			<view v-for="(itemData, index) in imgs">
				<uni-group :title="getItemShowName(index)" mode="card" >
					<view class="uni-center" style="background:#FFFFFF; font-size:0;" >
						<image style="background-color: #FFFFFF" :id="'img'+itemData.attachmentId"  class="image" mode="widthFix"  :src="itemData.itemImg" />
					</view>
					<uni-icons @click="deleteAttachmentById(itemData.attachmentId)" type="closeempty" :color="'#007aff'" size="30" />
				</uni-group>
			</view>

			
		</view>

	</view>
</template>

<script>
	import * as utils from "../../../../../../common/untils.js";
	import * as estateCommonUtils from "../../../../../../common/assess/basic/examine.common.js";

	import * as Explore from '../../../../../../common/assess/Explore.key.js';
	import commonImagePicker from '@/components/common-file-picker/common-image-picker.vue';
	import commonFilePicker from '@/components/common-file-picker/common-file-picker.vue';

	const AssessDBKey = Explore.AssessDBKey;

	export default {
		data() {
			return {
				cardObj: null,
				batchDetail: null,
				DetailList: [],
				searchValue: null,
				total: 0,
				pulldownLoad: false,
				top: '30px',
				loading: false,
				formData: {},
				imgs: [],
				showImg:false
			}
		},
		async onLoad(option) {
			let cardObj = {};
			if (utils.isNotEmptyString(option.cardJson)) {
				cardObj = JSON.parse(option.cardJson);
			}
			let batchDetail = {};
			if (utils.isNotEmptyString(option.batchDetailJson)) {
				batchDetail = JSON.parse(option.batchDetailJson);
			}
			this.cardObj = cardObj;
			this.batchDetail = batchDetail;
			await this.setServerData();
			this.getImgs();
			
		},
		onBackPress() {
			let batchDetail = this.batchDetail;
			try{
				uni.getStorage({
					key: estateCommonUtils.childNavigationCacheKey(batchDetail.id),
					success: function(res) {
						let query = res.data ;
						if(query){
							let url = "../../home/surveyExploreHome" + "?" + utils.parseParam(query);
							uni.redirectTo({
								url: url
							});
							return true ;
						}else {
							return false ;
						}
					}
				});
			}catch(e){
				return false ;
			}
			console.log("拦截");
			return false;
		},
		onShow() {

		},
		components: {
			"common-image-picker": commonImagePicker,
			"common-file-picker": commonFilePicker,
		},
		methods: {
			getImgs() {
				let _this = this;
				let data = this.setImgFieldsName("basicSignature");
				let url = "/app.public/imgDownloadFtpFileToLocalByAttachmentDto";
				this.$myRequest.pmccRequest({
					url: url,
					method: "POST",
					urlParam: false,
					data: data
				}).then(res => {
					if (res.data.ret) {
						let arr = [];
						let oldArr = res.data.data;
						oldArr.forEach(item => {
							let qcCode =  "data:image/jpeg|png|gif;base64," + item.path ;
							qcCode = qcCode.replace(/[\r\n]/g, "");
							item.itemImg = qcCode;
							arr.push(item);
						});
						this.imgs = arr;
					}
				});
			},
			deleteAttachmentById(id){
				var _this = this;
				uni.showModal({
					title: "确定删除当前签名？",
					content: "删除相应的数据不可恢复",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor: "#DD524D",
					confirmColor: "#4CD964",
					success: (res) => {
						if (res.confirm) {
							let res = _this.$myRequest.pmccRequest({
								url:'/app.public/deleteAttachmentByIds?attachmentIds='+id,
								data:{attachmentIds:id},
								method:'POST'
							}).then(res => {
								if(res.data.ret){
									_this.getImgs();
								}
							});
						}
					}
				})
			},
			async setServerData() {
				let cardObj = this.cardObj;
				let data = {
					houseId: cardObj.masterId
				};
				let _this = this;
				let url = "/app.assess/basicEstateSurveyRecord/getEstateSurveyRecordByHouseId?" + utils.parseParam(
					data);
				await this.$myRequest.pmccRequest({
					url: url,
					method: "POST",
					urlParam: true,
					data: data
				}).then(res => {
					if (res.data.ret) {
						let formData = res.data.data;
						_this.formData = formData;
						commonImagePicker.dataObj=_this.setImgFieldsName('estateSurveyRecordFileId');
						_this.$refs.estateSurveyRecordFileId.initFun();
					}
				});
			},
			getItemShowName(index) {
				return "手写签名记录" + (index+1);
			},
			setImgFieldsName(fieldsName) {
				let _this = this;
				let appCacheKey = uni.getStorageSync(this.$commonKeys.keys.cacheAppKey)  ;
				let id = _this.formData.id;
				if (!id) {
					id = 0;
				}
				let obj = {
					fieldsName: fieldsName,
					tableId: id,
					tableName: AssessDBKey.BasicEstateSurveyRecord,
					appKey: appCacheKey
				};
				console.log(obj) ;
				return obj;
			}

		}
	}
</script>

<style>
	.image {
		margin: 40rpx 0;
		width: 200rpx;
	}
</style>
