<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<textarea v-model="text"></textarea>
			<van-uploader multiple accept="image" :file-list="fileList" @after-read="afterRead" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList: [],
				text: 2,
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			afterRead(event) {
				const { file } = event.detail;
				uni.uploadFile({
            url: 'http://127.0.0.1:3004/api/upload/', //仅为示例，非真实的接口地址
            filePath: file[0].url,
            name: 'file',
            success: (uploadFileRes) => {
                console.log(uploadFileRes.data);
						},
						fail: (err) => {
							console.log('err', err)
						}
        });
			},
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
		margin: 200rpx auto 50rpx auto;
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
