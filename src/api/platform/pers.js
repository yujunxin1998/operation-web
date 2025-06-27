import request from '@/utils/request'

const PersApi = {
  DeptList: '/department/getAllDepAndDepUserNum',
  InsertDept: '/department/saveOrUpdate',
  UpdateDept: '/department/saveOrUpdate',
  DeleteDept: '/department/delete',
  PersList: '/user/getByDepId',
  InsertPers: '/user/insert2',
  UpdatePers: '/user/update',
  DeletePers: '/user/deleteByIds',
  ChangeDept: '/user/changeDept',
  LeaderList: '/user/list',
  ResetPassword: '/user/resetPassword',
  UpdateUserNum: '/user/changeSx',
  ValidateLoginName: '/user/validateExists',
  ValidateManager: '/department/checkSffzrUnqiue',
  RolesList: '/role/getAllPage',
  UserList: '/user/getByRoleId',
  DeleteUser: '/user/removeUserFromRole',
  RoleList: '/user/getByRoleId',
  UpdateRole: 'role/update',
  SaveRole: 'role/insert',
  UserInfo: 'user/getById',
  DeleteRoles: 'role/removeById',
  MenuList: 'user/getByRoleId',
  SaveMenu: 'resource/addResourceToRole',
  SelectPersList: 'user/getNotExistsRoleIdPage',
  AddUserToRole: 'user/addUserToRole',
  SaveOrUpdateRole: '/role/saveOrUpdate',
  getRowList: '/role/getList',
  // FlowRoleList: '/role/getRole4Flow',
  // NotFlowRoleList: '/role/getRole4NotFlow'
  updateBmld: '/user/updateBmld',
  updateSsld: '/department/updateSsld',
  getCardTreeByRoleId: '/chatAppCardRole/getCardTreeByRoleId',
  saveCards: '/chatAppCardRole/addCardToRole',
  getNotExistsDepartmentIdPage: '/user/getNotExistsDepartmentIdPage', // 查询不在机构里的用户
  addUserOnly: '/user/insert3', // 新增不属于机构的用户
  addUserToDepartment: '/user/addUserToDepartment', // 机构添加用户
  removeUserFromDepartment: '/user/removeUserFromDepartment', // 删除机构里的用户
  getAllUser: '/user/getAllUser', // 获取所有用户
  deleteUsers: '/user/deleteUsers' // 批量删除用户
}
export function commonPostRequest (url, parameter = {}) {
  return request({
    url: url,
    method: 'post',
    data: parameter
  })
}
export function commonGetRequest (url, parameter = {}, type = 'get') {
  return request({
    url: url,
    method: type,
    params: parameter
  })
}
export function getNotExistsDepartmentIdPage (parameter = {}) {
  return request({
    url: PersApi.getNotExistsDepartmentIdPage,
    method: 'post',
    data: parameter
  })
}
export function getAllUser (parameter = {}) {
  return request({
    url: PersApi.getAllUser,
    method: 'post',
    data: parameter
  })
}
export function getDeptList (parameter = {}) {
  return request({
    url: PersApi.DeptList,
    method: 'get',
    data: parameter
  })
}

export function saveDept (parameter = {}) {
  return request({
    url: PersApi.InsertDept,
    method: 'post',
    data: parameter
  })
}

export function updateDept (parameter = {}) {
  return request({
    url: PersApi.UpdateDept,
    method: 'post',
    data: parameter
  })
}

export function deleteDept (parameter = {}) {
  return request({
    url: PersApi.DeleteDept,
    method: 'delete',
    params: parameter
  })
}

export function getPersList (parameter = {}) {
  return request({
    url: PersApi.PersList,
    method: 'post',
    data: parameter
  })
}

export function updateUserNum (parameter = {}) {
  return request({
    url: PersApi.UpdateUserNum,
    method: 'post',
    data: parameter
  })
}

export function savePers (parameter = {}) {
  return request({
    url: PersApi.InsertPers,
    method: 'post',
    data: parameter
  })
}

export function updatePers (parameter = {}) {
  return request({
    url: PersApi.UpdatePers,
    method: 'post',
    data: parameter
  })
}

export function deletePers (parameter = {}) {
  return request({
    url: PersApi.DeletePers,
    method: 'get',
    params: parameter
  })
}

export function changeDept (parameter = {}) {
  return request({
    url: PersApi.ChangeDept,
    method: 'post',
    data: parameter
  })
}

export function getLeaderList (parameter = {}) {
  return request({
    url: PersApi.LeaderList,
    method: 'get',
    data: parameter
  })
}

export function resetPassword (parameter = {}) {
  return request({
    url: PersApi.ResetPassword,
    method: 'post',
    data: parameter
  })
}

export function validateLoginName (parameter = {}) {
  return request({
    url: PersApi.ValidateLoginName,
    method: 'post',
    data: parameter
  })
}

export function validateManager (parameter = {}) {
  return request({
    url: PersApi.ValidateManager,
    method: 'get',
    data: parameter
  })
}

export function getRolesList (parameter = {}) {
  return request({
    url: PersApi.RolesList,
    method: 'post',
    data: parameter
  })
}

export function getUserList (parameter = {}) {
  return request({
    url: PersApi.UserList,
    method: 'get',
    params: parameter
  })
}

export function deleteUser (parameter = {}) {
  return request({
    url: PersApi.DeleteUser,
    method: 'post',
    data: parameter
  })
}

export function getRoleList (parameter = {}) {
  return request({
    url: PersApi.RoleList,
    method: 'get',
    params: parameter
  })
}

export function getUserInfo (parameter = {}) {
  return request({
    url: PersApi.UserInfo,
    method: 'get',
    params: parameter
  })
}

export function getMenuInfo (parameter = {}) {
  return request({
    url: PersApi.MenuList,
    method: 'get',
    params: parameter
  })
}

export function getCardTreeByRoleId (parameter = {}) {
  return request({
    url: PersApi.getCardTreeByRoleId,
    method: 'post',
    data: parameter
  })
}

export function saveMenu (parameter = {}) {
  return request({
    url: PersApi.SaveMenu,
    method: 'post',
    data: parameter
  })
}
export function saveCards (parameter = {}) {
  return request({
    url: PersApi.saveCards,
    method: 'post',
    data: parameter
  })
}
export function saveRole (parameter = {}) {
  return request({
    url: PersApi.SaveRole,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter = {}) {
  return request({
    url: PersApi.UpdateRole,
    method: 'post',
    data: parameter
  })
}

export function deleteRoles (parameter = {}) {
  return request({
    url: PersApi.DeleteRoles,
    method: 'get',
    params: parameter
  })
}

export function selectPersList (parameter = {}) {
  // 处理分页参数，将前端的pageIndex转换为后端需要的pageNum
  const requestData = { ...parameter }
  if (parameter.page) {
    requestData.pageNum = parameter.page.pageIndex || parameter.page.current || 1
    requestData.pageSize = parameter.page.pageSize || 20
    // 删除page对象，避免传递不需要的参数
    delete requestData.page
  }

  return request({
    url: PersApi.SelectPersList,
    method: 'post',
    data: requestData
  })
}

export function addUserToRole (parameter = {}) {
  return request({
    url: PersApi.AddUserToRole,
    method: 'post',
    data: parameter
  })
}

export function saveOrUpdateRole (parameter = {}) {
  return request({
    url: PersApi.SaveOrUpdateRole,
    method: 'post',
    data: parameter
  })
}

export function getRowList (parameter = {}) {
  return request({
    url: PersApi.getRowList,
    method: 'post',
    data: parameter
  })
}

export function updateBmld (parameter = {}) {
  return request({
    url: PersApi.updateBmld,
    method: 'post',
    data: parameter
  })
}

export function updateSsld (parameter = {}) {
  return request({
    url: PersApi.updateSsld,
    method: 'post',
    data: parameter
  })
}
