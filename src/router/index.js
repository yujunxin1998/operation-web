import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'

// const bpmconfig = require('../../public/bpmconfig')
// import { bpmconfig } from '../../public/bpmconfig'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

let routes = constantRouterMap
if (process.env.VUE_APP_PERMISSION === 'default') {
  routes = [
    ...asyncRouterMap,
    ...constantRouterMap
  ]
}
let routerCofig
if (process.env.VUE_APP_ROUTER_MODE === 'hash') {
  routerCofig = {
    mode: 'hash',
    routes: routes
  }
} else {
  routerCofig = {
    base: process.env.VUE_APP_APPLICATION_URL,
    mode: 'history',
    routes: routes
  }
}
export default new Router({
  // base: window.__MICRO_APP_BASE_ROUTE__ || window.bpmconfig.VUE_APPLICATION_URL,
...routerCofig
})
