# 本组件作为特殊内置组件来使用 

> 和 uni.chooseLocation 功能相似  只不过越过了权限机制
```vuejs
uni.chooseLocation({
					success: (res) => {
						data.longitude = res.longitude;
						data.latitude = res.latitude;
						this.navList[index] = data;
						uni.showToast({
							title: '操作成功'
						});
					}
				});
```