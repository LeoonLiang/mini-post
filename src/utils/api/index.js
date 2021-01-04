import qs from 'qs'
import { request } from './request'
export function apiGet(url, params = {}) {
  const queryString = qs.stringify(params, {
    arrayFormat: 'repeat',
    skipNulls: true,
    addQueryPrefix: true
  })
  return request(`${url}${queryString}`, {})
}

export function apiPost(url, params) {
  return request(url, {
    method: 'POST',
    data: params
  })
}