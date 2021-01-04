<template>
	<view class="content">
		<textarea
			placeholder="输入文本"
			class="text-area"
			focus
			:maxlength="-1"
			v-model="content"
		></textarea>
		<van-uploader
			multiple
			accept="image"
			:file-list="fileList"
			@after-read="afterRead"
			@delete="handleDelete"
		/>
		<van-button
			@click="handleSumbit"
			:loading="loading"
			type="info"
			loading-text="图片上传中..."
		>发表</van-button>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import { apiPost } from '../utils/api'
	import Toast from '../wxcomponents/vant/toast/toast'
	import Notify from '../wxcomponents/vant/notify/notify'
	import { baseUrl } from '../utils/api/request'
	export default {
		data() {
			return {
				fileList: [],
				content: '',
				code: '',
				loading: false,
				title: 'Hello'
			}
		},
		onLoad() {
		},
		methods: {
			// 获取用户标识码
			getLoginCode(afterGerCode) {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						this.code = loginRes.code
						afterGerCode && afterGerCode()
					}
				})
			},
			// 上传文件
			afterRead(event) {
				this.loading = true
				const { file } = event.detail
				let promiseList = file.map((item) => {
					return new Promise((resolve, reject) => {
						uni.uploadFile({
								url: `${baseUrl}upload/`, //仅为示例，非真实的接口地址
								filePath: item.url,
								name: 'file',
								success: (uploadFileRes) => {
									resolve(JSON.parse(uploadFileRes.data))
								},
								fail: (err) => {
									reject('err', err)
								}
						})
					})
			})
			// 后端返回的数组
			Promise.all(promiseList).then((res) => {
				// 记录失败
				const errorNum = []
				// 处理图片，回显
				res.forEach((item, index) => {
					item.statusCode === 201 ? this.fileList.push({...item.content}) : errorNum.push(index)
				})
				// 显示弹窗
				errorNum.length > 0 && Toast.fail(`${errorNum.join(',')}失败了`)
			}).catch((error) => {
				console.log('error', error)
			}).finally(() => {
				this.loading = false
			})
		},
		// 删除图片
		handleDelete(e) {
			this.fileList.splice(e.detail.index, 1)
		},
		// 点击提交
		handleSumbit() {
			// 获取loginCode
			uni.showLoading({
				title: '发布中'
			});
			this.getLoginCode(this.sumbitData)
		},
		// 处理提交数据
		sumbitData() {
			const fileList = this.fileList.map(item => {
				return item.name
			})
			apiPost('/saliva/miniNew', {
				content: this.content,
				code: this.code,
				fileNameList: [...fileList]
			}).then(res => {
				if (res.data.statusCode === 201) {
					Toast.success('发表成功')
					this.clearData()
				} else {

				}
			}).then(res => {
    		uni.hideLoading()
			})
		},
		// 清楚数据
		clearData() {
			this.fileList = []
			this.content = ''
		}
	}
}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-items: flex-start;
		padding: 10px;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		width: 100%;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	/deep/.van-uploader {
		margin-top: 10px;
	}
</style>
