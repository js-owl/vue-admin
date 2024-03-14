import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // TODO:DELETE
    if (config.type && config.type === 'local') {
      config.baseURL = process.env.VUE_APP_BASE_API
    } else {
      config.baseURL = process.env.VUE_APP_BACKEND_HOST + '/api'
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // TODO:DELETE
      if (config.type && config.type === 'local') {
        config.headers['X-Token'] = getToken()
      } else {
        config.headers['Authorization'] = 'Bearer  ' + getToken()
      }
    }
    console.log('🚀 REQ:', config.method, config.url)
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    console.log('🚀 RES:', res)
    if (res.status_code >= 404 && res.status_code < 501) {
      Notification({
        message: res.message,
        type: 'warning',
        duration: 10000
      })
      location.reload()
      return
    }
    // if the custom code is not 20000, it is judged as an error.
    if (
      !(
        res.status_code === 200 ||
        res.code === 20000 ||
        (res.status_code === undefined &&
          (response.status === 200 || response.status === 201))
      )
    ) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        res.status_code === 50008 ||
        res.status_code === 50012 ||
        res.status_code === 50014
      ) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error r2'))
    } else {
      return res
    }
  },
  (error) => {
    if (error.response.status === 422) {
      return error.response
    } else if (error.response.status === 500) {
      Notification({
        message: 'Ошибка на стороне сервера',
        type: 'warning',
        duration: 5000
      })
      return false
    } else if (error.response.status >= 404 && error.response.status <= 499) {
      Notification({
        message: error.message,
        type: 'warning',
        duration: 5000
      })
      console.log('🚀 ~ file: request.js:125 ~ error 404 - 499:', error)
      return false
    } else {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
