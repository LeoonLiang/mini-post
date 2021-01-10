export const baseUrl = 'https://leoon.test.utools.club/api/'
export const request = (url = '', params) => {
  const {
    method = 'GET',
    data = {},
    contentType = 'application/json;charset=UTF-8',
    cookies
  } = params
  const requestURL = baseUrl + url
  const option = {
    url: requestURL,
    data: data,
    method: method,
    header: {
      Authorization: `Bearer ${uni.getStorageSync('token')}`,
      'content-type': contentType,
      'helpers-lang': 'zh-cn'
    }
  }
  return new Promise((resolve, reject) => {
    uni.request({
      ...option,
      success: (res) => {
       if (res.data && res.data.token) {
        uni.setStorage({
          key: 'token',
          data: res.data.token
        })
       }
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
