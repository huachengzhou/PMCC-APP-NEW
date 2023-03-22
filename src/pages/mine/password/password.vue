<template>
	<view class="content">
		<uni-forms :value="passwordModel" ref="form" validate-trigger="bind" err-show-type="undertext" :rules="rules">
			<uni-group title="| 修改密码" top="0">
				<uni-forms-item name="oldPassword" label="原密码">
					<uni-easyinput type="password" :inputBorder="true" v-model="passwordModel.oldPassword">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="newPasswordA" required label="新密码">
					<uni-easyinput type="password" :inputBorder="true" v-model="passwordModel.newPasswordA">
					</uni-easyinput>
				</uni-forms-item>

				<uni-forms-item name="newPasswordB" required label="再输一次">
					<uni-easyinput type="password" :inputBorder="true" v-model="passwordModel.newPasswordB">
					</uni-easyinput>
				</uni-forms-item>
			</uni-group>

		</uni-forms>

		<view class="example">
			<button class="submit" type="primary" @click="modifyPassword()">修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				passwordModel: {
					oldPassword: "",
					newPasswordA: "",
					newPasswordB: ""
				},
				rules: {
					oldPassword: {
						rules: [{
							required: true,
							errorMessage: '请输入旧密码'
						}]
					},
					newPasswordA: {
						rules: [{
							required: true,
							errorMessage: '请输入新密码'
						}]
					},
					newPasswordB: {
						rules: [{
							required: true,
							errorMessage: '请再次输入新密码'
						}]
					}
				}
			}
		},
		methods: {
			async modifyPassword() {
				var _this = this;

				var userInfo = _this.$helper.fetchLocalUser();

				if (_this.passwordModel.newPasswordB == _this.passwordModel.newPasswordA) {
					var data = {
						userAccount: userInfo.userAccount,
						oldPassword: _this.$md5(_this.passwordModel.oldPassword),
						newPassword: _this.$md5(_this.passwordModel.newPasswordB)
					}

					uni.showLoading({
						title: '正在处理...',
						mask: true
					})
					let res = await _this.$myRequest.pmccRequest({
						url: `/app.auth/modifyPassword`,
						data: data,
						method: "POST",
						showLoading:true
					})
					uni.hideLoading();
					if (res.data.ret) {
						//修改成功
						uni.showModal({
							title: '提示',
							content: '修改成功',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									//修改完成重新登录
									uni.redirectTo({
										url: '/pages/login/login'
									})
								}
							}
						});
					
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.errmsg,
							showCancel: false
						});
					}
				} else {
					uni.showModal({
						title: '错误提示',
						content: '两次密码输入不一致',
						showCancel: false
					});
				}
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 12px;
		line-height: inherit;
	}

	.submit {
		margin-top: 5px;
		margin-bottom: 20px;
		margin-left: 20px;
		margin-right: 20px;
		color: white;
		background-color: rgba(0, 122, 255, 1.0);
		-webkit-tap-highlight-color: rgba(252, 44, 93, 1.0);

		&:active {
			color: #B6B6B6;
			background-color: rgba(252, 44, 93, 0.8);
		}
	}
</style>
