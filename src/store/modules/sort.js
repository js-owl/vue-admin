import Vuex from 'vuex'

const state = {
  sort: {}
}

const mutations = {
  setSort(state, sort) {
    state.sort = sort
  },
  updateSort(state, { prop, order }) {
    const updatedSort = { prop, order }
    Object.assign(state.sort, updatedSort)
  }
}

const actions = {
  updateSort({ commit }, { prop, order }) {
    commit('updateSort', { prop, order })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
