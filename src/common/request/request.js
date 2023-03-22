 import helper from '../helper.js'
 import config from '../config.js'
 export default {
	 pmccRequest(options){
		 // uni.onNetworkStatusChange(function (res) {
		 //     console.log("NetworkStatus:"+res.isConnected);
		 //     console.log("NetworkStatus"+res.networkType);
		 // });
		let host = config.server.host;
		let userInfo = helper.fetchLocalUser();
		if((userInfo && userInfo.userAccount) || options.login){
			let deviceCode = uni.getStorageSync('deviceCode');
			let header = {
				"sign-value": helper.requestSign(options.data || {}),
				"company-key": userInfo.userAccount,
				"deviceCode":deviceCode
			};
			
			return new Promise((resolve,reject)=>{
				if(options.showLoading){
					uni.showLoading({
						mask:true
					});
				}
				uni.request({
					url: host + options.url,
					header: header,
					timeout:80000,
					method: options.method || 'GET',
					data: options.urlParam ? {} :(options.data || {}),
					success: (res)=>{
						// console.log(JSON.stringify(res))
						if(res.data.code === -1){
							return uni.showModal({
								content: res.data.errmsg,
								confirmText: "确定",
								showCancel:false,
								success: (r) => {
									uni.reLaunch({
										url:'/pages/login/login'
									}) 
									if(options.showLoading){
										uni.hideLoading();
									}
								}
							}) 
						}
						uni.hideLoading();
						resolve(res)
					},
					fail: (err)=>{
						console.log("err:"+JSON.stringify(err))
						if(err.errMsg.indexOf('statusCode:-1')>0){
							uni.showToast({
								title: '网络连接超时',
								icon:'error',
								duration:3000
							})
						}else{
							uni.showToast({
								title: '请求接口异常',
								icon:'error',
								duration:3000
							})
						}
						
						if(options.showLoading){
							uni.hideLoading();
						}
						reject(err)
					},
					complete:()=>{
						if(options.showLoading){
							uni.hideLoading();
						}
					}
				})
			})
		}else{
			uni.showModal({
				content: '登录信息已过期,请重新登录!',
				confirmText: "确定",
				showCancel:false,
				success: (r) => {
					//console.log("跳转到登录页面");
					uni.reLaunch({
						url:'/pages/login/login'
					}) 
					uni.hideLoading();
				},
			})
		}
	}
}
