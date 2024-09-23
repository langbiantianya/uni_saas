<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// 客户端发起调用云函数hellocf，并传入data数据
			uniCloud.callFunction({
				name: 'init',
				data: {
					url: 'sysAdmin/login',
					data: {
						userName: "123",
						password: "456"
					},
					userInfo: {
						token: "123456"
					}
				}
			}).then((res) => {
				console.log(res.result) // 结果是 {sum: 3}
			}).catch((err) => {
				console.error(err)
			})
		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>