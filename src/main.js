// with polyfills
import './public-path'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import defaultSettings from '@/config/defaultSettings'
import moment from 'moment'
import { start } from './sso'

import { Icon, Collapse } from 'ant-design-vue'

import * as services from './api'

import './assets/bpm-icons/iconfont'
import './assets/bpm-icons/iconfont.css'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
// import './permission' // permission control
import './utils/filter' // global filter
import './global.less'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
window.Vue = Vue

// eslint-disable-next-line import/first
// import ywLib from '../ywLib.umd.min.js'

moment.locale('zh-cn') // 设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`

Vue.use(VueAxios)
// Vue.use(ywLib)
Vue.use(Collapse)
Vue.use(VXETable)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl
})
Vue.component('IconFont', IconFont)

Vue.prototype.$bpmSystemProServices = services

window.umi_plugin_ant_themeVar = themePluginConfig.theme

if (process.env.VUE_APP_PERMISSION !== 'default') {
  require('./permission')
}

// new Vue({
//   router,
//   store,
//   i18n,
//   // init localstorage, vuex
//   created: bootstrap,
//   render: h => h(App)
// }).$mount('#systemApp')

function setup () {
  if (window.__POWERED_BY_WUJIE__) {
    let instance
    window.__WUJIE_MOUNT = () => {
      instance = new Vue({
        router,
        store,
        i18n,
        // init localstorage, vuex
        created: bootstrap,
        render: h => h(App)
      }).$mount('#systemApp')
    }
    window.__WUJIE_UNMOUNT = () => {
      instance.$destroy()
    }
  } else {
    new Vue({
      router,
      store,
      i18n,
      // init localstorage, vuex
      created: bootstrap,
      render: h => h(App)
    }).$mount('#systemApp')
  }
}

start(() => {
    setup()
})
