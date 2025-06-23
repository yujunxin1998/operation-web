import Mock from 'mockjs2'
import { builder } from '../util'

const info = (options) => {
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'name': '管理员',
    'username': 'admin',
    'password': '',
    'avatar': '/avatar2.jpg',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'merchantCode': 'TLif2btpzg079h15bk',
    'deleted': 0,
    'roleId': 'admin',
    'role': {}
  }
  // role
  const roleObj = {
    'id': 'admin',
    'name': '管理员',
    'describe': '拥有所有权限',
    'status': 1,
    'creatorId': 'system',
    'createTime': 1497160610259,
    'deleted': 0,
    'permissions': [{
      'roleId': 'admin',
      'permissionId': 'index',
      'permissionName': '首页'
    }, {
      'roleId': 'admin',
      'permissionId': 'pers',
      'permissionName': '人员管理'
    }, {
      'roleId': 'admin',
      'permissionId': 'persList',
      'permissionName': '机构人员'
    }, {
      'roleId': 'admin',
      'permissionId': 'roles',
      'permissionName': '角色授权'
    }, {
      'roleId': 'admin',
      'permissionId': 'system',
      'permissionName': '系统管理'
    }, {
      'roleId': 'admin',
      'permissionId': 'menus',
      'permissionName': '菜单管理'
    }, {
      'roleId': 'admin',
      'permissionId': 'dictList',
      'permissionName': '字典管理'
    }, {
      'roleId': 'admin',
      'permissionId': 'counter',
      'permissionName': '计数器管理'
    },
    {
      'roleId': 'admin',
      'permissionId': 'symbolGl',
      'permissionName': '文号管理'
    }, {
      'roleId': 'admin',
      'permissionId': 'userManage',
      'permissionName': '用户管理'
    }
    ]
  }

  userInfo.role = roleObj
  return builder(userInfo)
}

const userNav = (options) => {
  const nav = [
    {
      'route': 'pers',
      'pid': 0,
      'id': 1,
      'icon': 'iconfont-rygl',
      'name': '人员管理',
      'show': true,
      'component': 'RouteView',
      'redirect': '/pers/persList'
    },
    {
      'route': 'users',
      'pid': 1,
      'id': 103,
      'name': '用户管理',
      'show': true,
      'component': 'Users'
    },
    {
      'route': 'persList',
      'pid': 1,
      'id': 101,
      'name': '机构人员',
      'show': true,
      'component': 'Pers'
    },
    {
      'route': 'roles',
      'pid': 1,
      'id': 102,
      'name': '角色授权',
      'show': true,
      'component': 'Roles'
    },
    {
      'route': 'system',
      'pid': 0,
      'id': 2,
      'icon': 'iconfont-system',
      'name': '系统部署',
      'show': true,
      'component': 'RouteView',
      'redirect': '/system/menus'
    },
    {
      'route': 'menus',
      'pid': 2,
      'id': 201,
      'name': '菜单管理',
      'show': true,
      'component': 'Menus'
    },
    {
      'route': 'dictList',
      'pid': 2,
      'id': 202,
      'name': '字典管理',
      'show': true,
      'component': 'Dict'
    },
    {
      'route': 'counter',
      'pid': 2,
      'id': 203,
      'name': '计数器管理',
      'show': true,
      'component': 'Counter'
    },
    {
      'route': 'symbolGl',
      'pid': 2,
      'id': 204,
      'name': '文号管理',
      'show': true,
      'component': 'SymbolGl'
    }
  ]
  const json = builder(nav)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
