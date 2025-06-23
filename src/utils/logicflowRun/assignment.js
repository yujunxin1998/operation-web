import convertToType from './convertToType'
import evaluateExpression from './evaluateExpression'
function getQueryString (name) {
	const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	const r = window.location.search.substr(1).match(reg) // search,查询？后面的参数，并匹配正则
	if (r != null) {
		return unescape(r[2])
	}
	return ''
}

function assignmentGetValue (item, variable, store) {
  switch (item.rightValueType) {
    case 'constValue':
      return convertToType(item.rightValue)
      case 'variableValue':
      return evaluateExpression(variable, item.rightValue)
      case 'pageValue':
      return store.state.global.kbObj.getPageValue(item.rightValue)
      case 'urlParameterValue':
      return getQueryString(item.rightValue)
      case 'storageFieldValue':
      return sessionStorage.getItem(item.rightValue) || localStorage.getItem(item.rightValue)
  }
}
export default assignmentGetValue
