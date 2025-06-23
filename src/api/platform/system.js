import request from '@/utils/request'
import request4workflow from '@/utils/request4workflow'
import request4project from '@/utils/request4project'

const SysApi = {
  // 字典管理
  DictList: '/dic/getAllPage',
  SaveOrUpdateDict: '/dic/saveOrUpdate',
  DeleteDict: '/dic/delete',
  ValidateDictCode: '/dic/validateExists',
  DictItemList: '/dicEntry/getByDicId',
  SaveOrUpdateDictItem: '/dicEntry/saveOrUpdate',
  DeleteDictItem: '/dicEntry/deleteCascadeById',
  ValidateDictItemCode: '/dicEntry/validateExists',
  CategoriesList: '/dicType/getList',
  SaveOrUpdateCategory: '/dicType/saveOrUpdate',
  DeleteCategory: '/dicType/removeById',
  GetDict: '/dicEntry/getByDicCode',
  // 菜单管理
  MenuList: '/resource/getAll',
  UpdateMenu: '/resource/saveOrUpdate',
  DeleteMenu: '/resource/deleteCascadeById',
  // 操作按钮管理
  ButtonList: '/opration/list',
  SaveOrUpdateButton: '/opration/saveOrUpdate',
  DeleteButton: '/opration/removeById',
  // 计数器管理
  CounterList: '/counter/getAllPage',
  SaveCounter: '/counter/saveOrUpdate',
  DeleteCounter: '/counter/deleteByIds',
  // 代码生成管理
  codeGenerateList: '/codeGenerate/page',
  queryTables: '/codeGenerate/queryTables',
  queryDefaultDataSource: '/codeGenerate/queryDefaultDataSource',
  saveCodeGenerate: '/codeGenerate/saveOrUpdate',
  delCodeGenerates: '/codeGenerate/removeByIds',
  getCodeById: '/codeGenerate/getById',
  batchSaveCodeGenerate: '/codeGenerate/batchSave',
  generate: '/codeGenerate/generate',
  querySupportDriver: '/codeGenerate/querySupportDriver',
  // 文号管理
  SymbolList: '/referenceNumber/list',
  SaveOrUpdateSymbolList: '/referenceNumber/saveOrUpdate',
  DelSymbolList: '/referenceNumber/removeById',
  SymbolItemList: '/number/getListByReferenceNumberId',
  SaveOrUpdateSymbol: '/number/saveOrUpdate',
  DelSymbol: '/number/removeById',
  CounterListForSymbol: 'counter/list',
  PreviewSymbol: '/number/getNumberDefineInstForPreview',
  ExistsNumberDefine: '/number/existsNumberDefine',
  // 节假日管理
  CalendarList: '/calendar/list',
  DeleteCalendar: '/calendar/removeById',
  SaveOrUpdateCalendar: '/calendar/saveOrUpdate',
  DaysByYear: '/calendarDetail/getDayByYear',
  CalendarDetail: '/calendarDetail/getListByCalendarId',
  SaveOrUpdateCalendarDetail: '/calendarDetail/saveOrUpdate',
  ExistsCalendar: '/calendar/existsCalendar',
  // 材料管理
  BusinessList: '/modelCatalog/getTreeContainProc',
  FormList: '/clInfo/getListByProcDefKey',
  SaveOrUpdateClfl: '/clInfo/saveOrUpdateClfl',
  SaveOrUpdateCl: '/clInfo/saveOrUpdateCl',
  DeleteCl: '/clInfo/deleteClByClid',
  PreviousVersion: '/clInfo/getPreviousVersion',
  ValidateUrl: '/cl/getClContent',
  // 材料管理-权限视图
  ClAuthList: '/clAuthView/getListByClid',
  SaveOrUpdateClAuth: '/clAuthView/updateOrSave',
  DeleteClAuth: '/clAuthView/removeById',
  ClAuthItemList: '/clInputAuth/getListByClAuthViewId',
  SaveClAuthItem: '/clInputAuth/save',
  // 材料管理-质检视图
  DatacheckViewList: '/clDatacheckView/getListByClid',
  SaveDataCheckView: '/clDatacheckView/save',
  // 邮箱模板管理
  getEmailTemList: '/appMailTemplate/getListPage',
  getEmailTemData: '/appMailTemplate/getById',
  saveEmailTemitem: '/appMailTemplate/saveOrUpdate',
  removeEmailTemitem: '/appMailTemplate/removeById',
  removeEmailTemitems: '/appMailTemplate/removeByIds',
  copyEmailTemplate: '/appMailTemplate/copyTemplate',
  getAllRyemail: '/appMailTemplate/list',

  saveEmailTem: '/confActMail/saveList',
  uploadFile: '/upload/uploadFile',
  // 公文管理
  getDocCatalogList: '/appDocCatalog/list',
  saveDocCatalog: '/appDocCatalog/saveOrUpdate',
  candelDocCatalog: 'appDocTemplate/existsTmplByCatalogId',
  delDocCatalog: '/appDocCatalog/removeById',
  getDocList: '/appDocTemplate/getListPage',
  saveDocItem: '/appDocTemplate/saveOrUpdate',
  delDocItem: '/appDocTemplate/removeById',
  getDocItemByID: '/appDocTemplate/getById',
  appDocTemplate: '/appDocTemplate/copyTemplate',
  existsTmplCode: '/appDocTemplate/existsTmplCode',
  // 操作日志
  getOperateLogList: '/appOperateLog/getPage',
  // 步骤
  saveOrUpdateBz: '/confActXdsInfo/saveOrUpdateBz',
  saveOrUpdateNew: '/confActXdsAuthview/saveOrUpdateNew',
  saveOrUpdateNewZj: '/confActXdsDatacheckview/saveOrUpdateNew',
  getQxListByXdsbzid: '/confActXdsAuthview/getListByXdsbzid',
  getZjListByXdsbzid: '/confActXdsDatacheckview/getListByXdsbzid'
}

export function getOperateLogList (parameter = {}) {
  return request({
    url: SysApi.getOperateLogList,
    method: 'post',
    data: parameter
  })
}
export function getDocCatalogList (parameter = {}) {
  return request({
    url: SysApi.getDocCatalogList,
    method: 'get',
    params: parameter
  })
}
export function saveDocCatalog (parameter = {}) {
  return request({
    url: SysApi.saveDocCatalog,
    method: 'post',
    data: parameter
  })
}
export function candelDocCatalog (parameter = {}) {
  return request({
    url: SysApi.candelDocCatalog,
    method: 'get',
    params: parameter
  })
}
export function delDocCatalog (parameter = {}) {
  return request({
    url: SysApi.delDocCatalog,
    method: 'delete',
    params: parameter
  })
}

export function getDocList (parameter = {}) {
  return request({
    url: SysApi.getDocList,
    method: 'post',
    data: parameter
  })
}
export function saveDocItem (parameter = {}) {
  return request({
    url: SysApi.saveDocItem,
    method: 'post',
    data: parameter
  })
}
export function delDocItem (parameter = {}) {
  return request({
    url: SysApi.delDocItem,
    method: 'delete',
    params: parameter
  })
}
export function getDocItemByID (parameter = {}) {
  return request({
    url: SysApi.getDocItemByID,
    method: 'get',
    params: parameter
  })
}
export function appDocTemplate (parameter = {}) {
  return request({
    url: SysApi.appDocTemplate,
    method: 'post',
    data: parameter
  })
}

export function existsTmplCode (parameter = {}) {
  return request({
    url: SysApi.existsTmplCode,
    method: 'get',
    params: parameter
  })
}
export function uploadFile (parameter = {}) {
  return request({
    url: SysApi.uploadFile,
    method: 'post',
    data: parameter
  })
}

export function getDictList (parameter = {}) {
  return request({
    url: SysApi.DictList,
    method: 'post',
    data: parameter
  })
}

export function saveOrUpdateDict (parameter = {}) {
  return request({
    url: SysApi.SaveOrUpdateDict,
    method: 'post',
    data: parameter
  })
}

export function deleteDict (parameter = {}) {
  return request({
    url: SysApi.DeleteDict,
    method: 'delete',
    params: parameter
  })
}

export function validateDictCode (parameter = {}) {
  return request({
    url: SysApi.ValidateDictCode,
    method: 'post',
    data: parameter
  })
}

export function getDictItemList (parameter = {}) {
  return request({
    url: SysApi.DictItemList,
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdateDictItem (parameter = {}) {
  return request({
    url: SysApi.SaveOrUpdateDictItem,
    method: 'post',
    data: parameter
  })
}

export function deleteDictItem (parameter = {}) {
  return request({
    url: SysApi.DeleteDictItem,
    method: 'delete',
    params: parameter
  })
}

export function validateDictItemCode (parameter = {}) {
  return request({
    url: SysApi.ValidateDictItemCode,
    method: 'post',
    data: parameter
  })
}

export function getCategoriesList (parameter = {}) {
  return request({
    url: SysApi.CategoriesList,
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdateCategory (parameter = {}) {
  return request({
    url: SysApi.SaveOrUpdateCategory,
    method: 'post',
    data: parameter
  })
}

export function deleteCategory (parameter = {}) {
  return request({
    url: SysApi.DeleteCategory,
    method: 'delete',
    params: parameter
  })
}

export function getDictByCode (code) {
  return request({
    url: SysApi.GetDict,
    method: 'get',
    params: {
      code: code
    }
  })
}

export function getMenuList (parameter = {}) {
  return request({
    url: SysApi.MenuList,
    method: 'get',
    data: parameter
  })
}

export function updateMenu (parameter = {}) {
  return request({
    url: SysApi.UpdateMenu,
    method: 'post',
    data: parameter
  })
}

export function deleteMenu (parameter = {}) {
  return request({
    url: SysApi.DeleteMenu,
    method: 'delete',
    params: parameter
  })
}

export function getButtonList (parameter = {}) {
  return request4workflow({
    url: SysApi.ButtonList,
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdateButton (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateButton,
    method: 'post',
    data: parameter
  })
}

export function updateButton (parameter = {}) {
  return request4workflow({
    url: SysApi.UpdateButton,
    method: 'post',
    data: parameter
  })
}

export function deleteButton (parameter = {}) {
  return request4workflow({
    url: SysApi.DeleteButton,
    method: 'delete',
    params: parameter
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}

export function getCounterList (parameter = {}) {
  return request4workflow({
    url: SysApi.CounterList,
    method: 'post',
    data: parameter
  })
}

export function codeGenerateList (parameter = {}) {
  return request4workflow({
    url: SysApi.codeGenerateList,
    method: 'post',
    data: parameter
  })
}

export function queryTables (parameter = {}) {
  return request4workflow({
    url: SysApi.queryTables,
    method: 'post',
    data: parameter
  })
}

export function saveCodeGenerate (parameter = {}) {
  return request4workflow({
    url: SysApi.saveCodeGenerate,
    method: 'post',
    data: parameter
  })
}
export function batchSaveCodeGenerate (parameter = {}) {
  return request4workflow({
    url: SysApi.batchSaveCodeGenerate,
    method: 'post',
    data: parameter
  })
}
export function generate (parameter = {}) {
  return request4workflow({
    url: SysApi.generate,
    method: 'post',
    data: parameter
  })
}
export function querySupportDriver (parameter = {}) {
  return request4workflow({
    url: SysApi.querySupportDriver,
    method: 'GET',
    params: parameter
  })
}
export function delCodeGenerates (parameter = {}) {
  return request4workflow({
    url: SysApi.delCodeGenerates,
    method: 'delete',
    params: parameter
  })
}
export function getCodeById (parameter = {}) {
  return request4workflow({
    url: SysApi.getCodeById,
    method: 'GET',
    params: parameter
  })
}

export function queryDefaultDataSource (parameter = {}) {
  return request4workflow({
    url: SysApi.queryDefaultDataSource,
    method: 'GET',
    params: parameter
  })
}

export function saveCounter (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveCounter,
    method: 'post',
    data: parameter
  })
}

export function deleteCounter (parameter = {}) {
  return request4workflow({
    url: SysApi.DeleteCounter,
    method: 'delete',
    params: parameter
  })
}

export function getSymbolList (parameter = {}) {
  return request4workflow({
    url: SysApi.SymbolList,
    method: 'GET',
    params: parameter
  })
}

export function saveOrUpdateSymbolList (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateSymbolList,
    method: 'POST',
    data: parameter
  })
}

export function delSymbolList (parameter = {}) {
  return request4workflow({
    url: SysApi.DelSymbolList,
    method: 'delete',
    params: parameter
  })
}

export function symbolItemList (parameter = {}) {
  return request4workflow({
    url: SysApi.SymbolItemList,
    method: 'GET',
    params: parameter
  })
}

export function getCounterListForSymbol (parameter = {}) {
  return request4workflow({
    url: SysApi.CounterListForSymbol,
    method: 'GET',
    params: parameter
  })
}

export function previewSymbol (parameter = {}) {
  return request4workflow({
    url: SysApi.PreviewSymbol,
    method: 'POST',
    data: parameter
  })
}

export function validateNumberDefine (parameter = {}) {
  return request4workflow({
    url: SysApi.ExistsNumberDefine,
    method: 'POST',
    data: parameter
  })
}

export function saveOrUpdateSymbolItem (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateSymbol,
    method: 'POST',
    data: parameter
  })
}

export function delSymbol (parameter = {}) {
  return request4workflow({
    url: SysApi.DelSymbol,
    method: 'delete',
    params: parameter
  })
}

export function getCalendarList (parameter = {}) {
  return request4workflow({
    url: SysApi.CalendarList,
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdateCalendar (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateCalendar,
    method: 'post',
    data: parameter
  })
}

export function deleteCalendar (parameter = {}) {
  return request4workflow({
    url: SysApi.DeleteCalendar,
    method: 'delete',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getDaysByYear (parameter = {}) {
  return request4workflow({
    url: SysApi.DaysByYear,
    method: 'post',
    data: parameter
  })
}

export function getCalendarDetail (parameter = {}) {
  return request4workflow({
    url: SysApi.CalendarDetail,
    method: 'get',
    params: parameter
  })
}

export function saveOrUpdateCalendarDetail (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateCalendarDetail,
    method: 'post',
    data: parameter
  })
}

export function validateCalendar (parameter = {}) {
  return request4workflow({
    url: SysApi.ExistsCalendar,
    method: 'post',
    data: parameter
  })
}

export function getBusinessList (parameter = {}) {
  return request4workflow({
    url: SysApi.BusinessList,
    method: 'GET',
    data: parameter
  })
}

export function getFormList (parameter = {}) {
  return request4workflow({
    url: SysApi.FormList,
    method: 'POST',
    data: parameter
  })
}

export function saveOrUpdateClfl (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateClfl,
    method: 'POST',
    data: parameter
  })
}

export function saveOrUpdateCl (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateCl,
    method: 'POST',
    data: parameter
  })
}

export function deleteCl (parameter = {}) {
  return request4workflow({
    url: SysApi.DeleteCl,
    method: 'POST',
    data: parameter
  })
}

export function getPreviousVersion (parameter = {}) {
  return request4workflow({
    url: SysApi.PreviousVersion,
    method: 'POST',
    data: parameter
  })
}

export function getClAuthList (parameter = {}) {
  return request4workflow({
    url: SysApi.ClAuthList,
    method: 'POST',
    data: parameter
  })
}

export function saveOrUpdateClAuth (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveOrUpdateClAuth,
    method: 'POST',
    data: parameter
  })
}

export function deleteClAuth (parameter = {}) {
  return request4workflow({
    url: SysApi.DeleteClAuth,
    method: 'DELETE',
    params: parameter
  })
}

export function getClAuthItemList (parameter = {}) {
  return request4workflow({
    url: SysApi.ClAuthItemList,
    method: 'POST',
    data: parameter
  })
}
export function getQxListByXdsbzid (parameter = {}) {
  return request4workflow({
    url: SysApi.getQxListByXdsbzid,
    method: 'POST',
    data: parameter
  })
}
export function getZjListByXdsbzid (parameter = {}) {
  return request4workflow({
    url: SysApi.getZjListByXdsbzid,
    method: 'POST',
    data: parameter
  })
}

export function saveClAuthItems (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveClAuthItem,
    method: 'POST',
    data: parameter
  })
}

export function getDatacheckViewList (parameter = {}) {
  return request4workflow({
    url: SysApi.DatacheckViewList,
    method: 'POST',
    data: parameter
  })
}

export function saveDataCheckView (parameter = {}) {
  return request4workflow({
    url: SysApi.SaveDataCheckView,
    method: 'POST',
    data: parameter
  })
}

export function validateUrl (parameter = {}) {
  return request4project({
    url: SysApi.ValidateUrl,
    method: 'POST',
    data: parameter
  })
}

export function getEmailTemData (parameter = {}) {
  return request({
    url: SysApi.getEmailTemData + '?id=' + parameter,
    method: 'GET',
    data: parameter
  })
}

export function getEmailTemList (parameter = {}) {
  return request({
    url: SysApi.getEmailTemList,
    method: 'post',
    data: parameter
  })
}
export function saveEmailTemitem (parameter = {}) {
  return request({
    url: SysApi.saveEmailTemitem,
    method: 'post',
    data: parameter
  })
}
export function removeEmailTemitem (parameter = {}) {
  return request({
    url: SysApi.removeEmailTemitem + '?id=' + parameter,
    method: 'DELETE'
  })
}
export function removeEmailTemitems (parameter = {}) {
  return request({
    url: SysApi.removeEmailTemitems + '?ids=' + parameter,
    method: 'DELETE'
  })
}
export function copyEmailTemplate (parameter = {}) {
  return request({
    url: SysApi.copyEmailTemplate,
    method: 'post',
    data: parameter
  })
}
export function getAllRyemail (parameter = {}) {
  return request({
    url: SysApi.getAllRyemail,
    method: 'GET'
  })
}

export function saveEmailTem (parameter = {}) {
  return request4workflow({
    url: SysApi.saveEmailTem,
    method: 'post',
    data: parameter
  })
}
export function saveOrUpdateBz (parameter = {}) {
  return request4workflow({
    url: SysApi.saveOrUpdateBz,
    method: 'post',
    data: parameter
  })
}
export function saveOrUpdateNew (parameter = {}) {
  return request4workflow({
    url: SysApi.saveOrUpdateNew,
    method: 'post',
    data: parameter
  })
}
export function saveOrUpdateNewZj (parameter = {}) {
  return request4workflow({
    url: SysApi.saveOrUpdateNewZj,
    method: 'post',
    data: parameter
  })
}
