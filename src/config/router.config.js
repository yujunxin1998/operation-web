// 前端路由表
import constantRouterComponents from '@/router/constantRouterComponents'
import * as icons from '@/core/icons'

export const asyncRouterMap = [
  {
    'path': '/',
    'name': 'index',
    'component': constantRouterComponents.BlankLayout,
    'meta': {
      'title': '首页',
      'permission': 'index'
    },
    'redirect': '/pers',
    'children': [
      {
        'path': '/pers',
        'name': 'pers',
        'component': constantRouterComponents.RouteView,
        'meta': {
          'title': '人员管理',
          'icon': icons.btnPers,
          'permission': 'pers',
          'origin': ''
        },
        'redirect': '/pers/persList',
        'children': [
            {
              'path': '/pers/user',
              'name': 'persList',
              'component': constantRouterComponents.Users,
              'meta': {
                'title': '用户管理',
                'permission': 'persList',
                'origin': ''
              }
            },
            {
                'path': '/pers/persList',
                'name': 'persList',
                'component': constantRouterComponents.Pers,
                'meta': {
                  'title': '机构人员',
                  'permission': 'persList',
                  'origin': ''
                }
            },
            {
                'path': '/pers/roles',
                'name': 'roles',
                'component': constantRouterComponents.Roles,
                'meta': {
                    'title': '角色授权',
                    'permission': 'roles',
                    'origin': ''
                }
            }
        ]
      },
      {
        'path': '/system',
        'name': 'system',
        'component': constantRouterComponents.RouteView,
        'meta': {
            'title': '系统管理',
            'icon': icons.btnSystem,
            'permission': 'system',
            'origin': ''
        },
        'redirect': '/system/menus',
        'children': [
            {
                'path': '/system/menus',
                'name': 'menus',
                'component': constantRouterComponents.Menus,
                'meta': {
                    'title': '菜单管理',
                    'permission': 'menus',
                    'origin': ''
                }
            },
            {
                'path': '/system/dictList',
                'name': 'dictList',
                'component': constantRouterComponents.Dict,
                'meta': {
                    'title': '字典管理',
                    'permission': 'dictList',
                    'origin': ''
                }
            },
            {
              'path': '/system/counter',
              'name': 'counter',
              'component': constantRouterComponents.Counter,
              'meta': {
                  'title': '计数器管理',
                  'permission': 'counter',
                  'origin': ''
              }
            },
            {
                'path': '/system/symbolGl',
                'name': 'symbolGl',
                'component': constantRouterComponents.SymbolGl,
                'meta': {
                    'title': '文号管理',
                    'permission': 'symbolGl',
                    'origin': ''
                }
            }
        ]
      },
      {
        'path': '/mobile',
        'name': 'mobile',
        'component': constantRouterComponents.RouteView,
        'meta': {
            'title': '管理中心',
            'icon': icons.btnSystem,
            'permission': 'mobile',
            'origin': ''
        },
        'redirect': '/mobile/UserManage',
        'children': [
            {
              'path': '/mobile/UserManage',
              'name': 'userManage',
              'component': constantRouterComponents.UserManage,
              'meta': {
                  'title': '用户管理',
                  'permission': 'userManage',
                  'origin': ''
              }
            }
        ]
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: constantRouterComponents.UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
