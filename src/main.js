import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import ruLang from 'element-ui/lib/locale/lang/ru-RU'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import JsonViewer from 'vue-json-viewer' // форматирование JSON-файлов

import '@/css/main.css'
import * as filters from './filters' // global filters
import moment from 'moment/moment'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (
  process.env.NODE_ENV === 'production' ||
  process.env.VUE_APP_STAGE === 'build'
) {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: ruLang
})

Vue.use(JsonViewer)

Vue.prototype.$addRow = function (activeRow, modalData, isModalOpen) {
  this[activeRow] = null
  this[modalData] = {}
  this[isModalOpen] = true
}
Vue.prototype.$localeDate = (vdate) =>
  new Date(vdate).toLocaleDateString() +
  ' ' +
  new Date(vdate).toLocaleTimeString()
Vue.prototype.$utcDate = (d) =>
  moment(new Date(d)).utc().format('DD.MM.YYYY HH:mm:ss')

Vue.prototype.$transformStatus = (status) => {
  switch (status) {
    case 'draft':
      return 'Черновик'
    case 'wait':
      return 'В ожидании'
    case 'work':
      return 'В работе'
    case 'send':
      return 'Отправлено'
    case 'correction':
      return 'На корректировке'
    case 'agreed':
      return 'На согласовании'
    case 'executed':
      return 'Опубликовано'
    default:
      return status
  }
}
// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
