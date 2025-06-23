import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// const bpmconfig = require('../../public/bpmconfig')
// import { bpmconfig } from '../../public/bpmconfig'

axios.defaults.headers['Accept'] = 'application/json;charset=UTF-8'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Cache-Control'] = 'no-cache'
axios.defaults.headers['pragma'] = 'no-cache'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: window.ServiceConfig.projectUrl,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // if (window.ServiceConfig.sfSso) {
  //     const satoken = window.ServiceConfig.satoken || window.top.sessionStorage.getItem('satoken')
  //     if (satoken) {
  //       config.headers[window.ServiceConfig.satokenHeader || 'satoken'] = satoken
  //     }
  // }

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Access-Token'] = token
  }

  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response, handler) => {
  if (!!response.headers && !!response.headers.redirect && response.headers.redirect === 'Redirect') {
    if (window.top) {
      window.top.location.href = window.ServiceConfig.ssoUrl || response.headers.redirecturl
    } else {
      window.location.href = window.ServiceConfig.ssoUrl || response.headers.redirecturl
    }
  }
  if (typeof response.data.data !== 'undefined') {
    return response.data.data
  } else {
    return response.data
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
