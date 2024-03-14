import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query,
    type: 'local'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id },
    type: 'local'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv },
    type: 'local'
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data,
    type: 'local'
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data,
    type: 'local'
  })
}
