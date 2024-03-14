import request from '@/utils/request'

const state = {
  flowChart_id: '',
  request_state: '',
  comments: []
}
const mutations = {
  SET_FLOWCHART_ID: (state, v) => {
    state.flowChart_id = v
  },
  SET_REQUEST_STATE: (state, v) => {
    state.request_state = v
  },
  SET_COMMENTS: (state, v) => {
    state.comments = v
  },
  DELETE_COMMENT: (state, comment_id) => {
    state.comments = state.comments.filter((v) => v.comment_id !== comment_id)
  }
}
const actions = {
  async getRequestInfo({ commit }, id) {
    const res = await request({
      url: '/requests/' + id,
      method: 'get',
      params: {}
    })
    commit('SET_FLOWCHART_ID', res.new_object_id.toString())
    commit('SET_REQUEST_STATE', res.request_state)
  },
  async getRequestComments({ commit }, id) {
    const res = await request({
      url: '/comments/',
      method: 'get',
      params: {
        request_id: id
      }
    })
    commit('SET_COMMENTS', res.data)
  },
  async deleteCommentStore({ commit }, comment_id) {
    const res = await request({
      url: '/comments/' + comment_id,
      method: 'delete'
    })
    commit('DELETE_COMMENT', comment_id)
    return res
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
