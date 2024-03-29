import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  token = 'admin-token'
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token },
    type: 'local'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    type: 'local'
  })
}
