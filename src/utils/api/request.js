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
      'content-type': contentType,
      'helpers-lang': 'zh-cn'
    }
  }
  return new Promise((resolve, reject) => {
    uni.request({
      ...option,
      success: (res) => {
        console.log(29, res)
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
