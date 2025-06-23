
import convertToType from './convertToType'
import evaluateExpression from './evaluateExpression'
function getParamsValue (item, variable) {
  const type = item.paramValueType
  switch (type) {
      case 'constValue':
      return convertToType(item.paramValue)
      case 'variableValue':
      return evaluateExpression(variable, item.paramValue)
      default:
      return item.paramValue
  }
}
export default getParamsValue
