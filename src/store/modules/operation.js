import request from '@/utils/request'
const state = {
  operation_action: {},
  operation_img_store: '',
  operation_img_json: '',
  operation_img_json_obj: {}
}

const mutations = {
  CLEAR_OPERATION_IMG: (state) => {
    state.operation_img_json = ''
    state.operation_img_store = ''
  },
  CLEAR_OPERATION_ACTION: (state) => {
    state.operation_action = {}
  },
  SET_OPERATION_ACTION: (state, v) => {
    state.operation_action = v
  },
  SET_OPERATION_IMG: (state, v) => {
    state.operation_img_store = v
  },
  SET_OPERATION_IMG_JSON: (state, v) => {
    state.operation_img_json = v
  },
  GET_OPERATION_IMG_JSON: (state, v) => {
    state.operation_img_json_obj = v
  },
  SAVE_OPERATION_IMG_JSON: (state, v) => {
    state.operation_img_json_obj = v
  },
  CLEAR_OPERATION_IMG_JSON: (state) => {
    state.operation_img_json = ''
    state.operation_img_json_obj = {}
  }
}
const actions = {
  clearOperationImg({ commit }) {
    commit('CLEAR_OPERATION_IMG')
    commit('CLEAR_OPERATION_IMG_JSON')
  },
  clearOperationAction({ commit }) {
    commit('CLEAR_OPERATION_ACTION')
  },
  saveOperationAction({ commit }, v) {
    commit('SET_OPERATION_ACTION', v)
  },
  async saveOperationTmp({ commit }, v) {
    const res = await request({
      url: '/files/uploadbase64',
      method: 'post',
      data: v
    })
    commit('SET_OPERATION_IMG', res.path)
    return res.path
  },
  async saveOperationJson({ commit }, v) {
    const res = await request({
      url: '/files/uploadjson',
      method: 'post',
      data: v
    })
    commit('SET_OPERATION_IMG_JSON', res.data)
    commit('SAVE_OPERATION_IMG_JSON', v)
    return res.data
  },
  async getOperationJson({ commit }, path) {
    const res = await request({
      url: path,
      method: 'get'
    })
    commit('GET_OPERATION_IMG_JSON', res.data)
    return res.data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
