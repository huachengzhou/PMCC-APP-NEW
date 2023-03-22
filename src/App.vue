<script>	
	export default {
		onLaunch: function() {
			
			uni.setStorageSync('deviceCode',this.getClientId())
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},
		methods:{
			getClientId() {
				let id = ''
				// #ifdef APP-PLUS
					const client = plus.push.getClientInfo();
					id = client.clientid  
				// #endif
				// #ifdef H5
					id= 'h5'
				// #endif
				//console.log('当前设备ID', id )
				return id;
			}
		}
	}
</script>

<style>
	@import url("./static/iconfont/iconfont.css");
	
	/* #ifndef APP-PLUS-NVUE */
	@import './common/uni.css';
	@import './common/assess/assessCommon.css';
	/* #endif */
	
	
	/*每个页面公共css */
	.picker-border{
		border: 1px solid rgba(0, 0, 0, .125);
		border-radius: 5px;
	}
	.approve-button-box{
		display: flex;
		flex-direction: row;
		height: 36px;
		line-height: 36px;
	}
	.approve-button-left{
		height: 35px;
		line-height: 35px;
		width: 91px;
		text-align: center;
		
	}
	.approve-button-right{
		
		height: 35px;
		line-height: 35px;
		text-align: center;
		width: 65px;
		
	}
	
	
	.approve-button{
		/* #ifndef APP-PLUS-NVUE */
		-webkit-flex: 1;flex: 1;
		/* #endif */
		height: 35px;
		line-height: 35px;
		text-align: center;
	}
</style>
