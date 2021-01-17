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
		<van-field
			:value="linkAddress"
			class="text-input"
			label="链接"
			type="textarea"
			autosize
			placeholder="请输入链接"
			clearable
			@change="changeAddress"
		/>
		<van-button
			class="publish-btn"
			@click="handleSubmit"
			:loading="loading"
			type="info"
			loading-text="上传中..."
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
				linkAddress: '',
				loading: false,
				title: 'Hello'
			}
		},
		onLoad() {
				this.login()
		},
		methods: {
			// 获取用户标识码
			login(afterGerCode) {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						apiPost('/user/miniLogin', {code: loginRes.code})
						.then(res => {
							if (res.data.statusCode !== 201) {
								Toast.fail(res.data.message)
							}
						})
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
								url: `${baseUrl}/upload/`, //仅为示例，非真实的接口地址
								filePath: item.url,
								header: { Authorization: `Bearer ${uni.getStorageSync('token')}` },
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
		changeAddress(e) {
			// 去掉空格换行
			this.linkAddress = e.detail.replace(/[\r\n]/g,"").replace(/\ +/g,"")
		},
		// 处理提交数据
		handleSubmit() {
			uni.showLoading({
				title: '发布中，别急'
			});
			const {content, code, linkAddress, fileList} = this
			if (!content) {
				Toast.fail('请填写内容先啦~~')
    		uni.hideLoading()
			}
			const fileNameList = this.fileList.map(item => {
				return item.name
			})
			console.log(this)
			apiPost('/saliva/miniNew', {
				content,
				code,
				linkAddress,
				fileNameList
			}).then(res => {
				if (res.data.statusCode === 201) {
					Toast.success('发表成功咯- -')
					this.clearData()
				} else {
					Toast.fail('发表失败，请联系管理员')
				}
			}).then(res => {
    		uni.hideLoading()
			})
		},
		// 清楚数据
		clearData() {
			this.fileList = []
			this.content = ''
			this.linkAddress = ''
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
		padding-bottom: 160px;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		width: 100%;
		height: 200px;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.text-input {
		width: 100%;
	}
	/deep/.van-uploader {
		margin-top: 10px;
	}
	/deep/.publish-btn .van-button {
		width: 100px;
		height: 100px;
		position: fixed;
		z-index: 999;
		bottom: 60px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 50%;
		white-space: nowrap;
	}
</style>
