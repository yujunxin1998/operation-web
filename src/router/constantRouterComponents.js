import { BasicLayout, BlankLayout, PageView, RouteView, UserLayout, IndexLayout } from '@/layouts'

export default {
  // 基础页面 layout 必须引入
  UserLayout: UserLayout,
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  IndexLayout: IndexLayout,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 人员管理
  'Pers': () => import(/* webpackChunkName: "pers" */ '@/views/pers/Pers'),
  'Users': () => import(/* webpackChunkName: "pers" */ '@/views/pers/Users'),
  'Roles': () => import(/* webpackChunkName: "pers" */ '@/views/pers/Roles'),
  // system
  'Menus': () => import(/* webpackChunkName: "system" */ '@/views/system/menus/Menus'),
  'Dict': () => import(/* webpackChunkName: "system" */ '@/views/system/dict/Dict'),
  'Counter': () => import(/* webpackChunkName: "system" */ '@/views/system/counter/Counter'),
  'SymbolGl': () => import(/* webpackChunkName: "system" */ '@/views/system/symbol/SymbolGl')
}
