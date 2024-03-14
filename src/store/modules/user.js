import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  roles: [],
  email: '',
  fname: '',
  lname: '',
  mname: '',
  role_id: '',
  role_name: '',
  user_id: '',
  dealer_id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },

  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_FNAME: (state, fname) => {
    state.fname = fname
  },
  SET_LNAME: (state, lname) => {
    state.lname = lname
  },
  SET_MNAME: (state, mname) => {
    state.mname = mname
  },
  SET_ROLEID: (state, role_id) => {
    state.role_id = role_id
  },
  SET_ROLENAME: (state, role_name) => {
    state.role_name = role_name
  },
  SET_USERID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_DEALERID: (state, dealer_id) => {
    state.dealer_id = dealer_id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: username.trim(), password: password })
        .then((response) => {
          const userRole = response.user_data.role_name
          if (userRole === 'subdialer' || userRole === 'fl') {
            Message.error('Недостаточно прав для входа в систему')
            reject('401')
          }
          commit('SET_EMAIL', response.user_data.email)
          commit('SET_FNAME', response.user_data.fname)
          commit('SET_LNAME', response.user_data.lname)
          commit('SET_MNAME', response.user_data.mname)
          commit('SET_ROLEID', response.user_data.role_id)
          commit('SET_ROLENAME', response.user_data.role_name)
          commit('SET_TOKEN', response.access_token)
          commit('SET_USERID', response.user_data.user_id)
          commit('SET_DEALERID', response.user_data.dealer_id)
          setToken(response.access_token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_USERNAME', '')
          commit('SET_ROLENAME', '')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
