const state = {
  dealer_lname: '',
  dealer_phone: '',
  dealer_email: '',
  request_id: '',
  dealer_id: ''
}

const mutations = {
  SET_DEALER_LNAME: (state, v) => {
    state.dealer_lname = v
  },
  SET_DEALER_PHONE: (state, v) => {
    state.dealer_phone = v
  },
  SET_DEALER_EMAIL: (state, v) => {
    state.dealer_email = v
  },
  SET_REQUEST_ID: (state, v) => {
    state.request_id = v
  },
  SET_DEALER_ID: (state, v) => {
    state.dealer_id = v
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
