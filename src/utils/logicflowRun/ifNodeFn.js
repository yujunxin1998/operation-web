import convertToType from './convertToType'
import evaluateExpression from './evaluateExpression'
function parseValue (value, variables) {
  if (typeof value === 'number') {
      return value
  } else {
      return typeof variables[value] !== 'undefined' ? JSON.stringify(variables[value]) : value
  }
}
function evaluateCondition (conditionString, variables) {
  const condition = conditionString.replace(/(\b\w+\b)/g, function (match) {
      return parseValue(match, variables)
  })
  // eslint-disable-next-line no-eval
  return eval(condition)
}
function ifNodeFn (option, variable) {
  if (option.type === 'js') {
   return evaluateCondition(option.ruleExpression, variable)
  } else {
  for (const rule of option.ruleList) {
    const { rightValue, rightValueType, compare } = rule
    const leftValueName = rule.leftValue
    // 根据rightValueType将rightValue转换成相应类型
    let convertedRightValue
    const leftValue = evaluateExpression(variable, leftValueName)
    if (rightValueType === 'constValue') {
      convertedRightValue = convertToType(rightValue)
    } else {
      convertedRightValue = evaluateExpression(variable, rightValue)
    }

    // 执行比较
    switch (compare) {
      case '==':
        if (convertedRightValue !== leftValue) {
          return false // 不满足条件，直接返回false
        }
        break
      case '!=':
        if (convertedRightValue === leftValue) {
          return false // 不满足条件，直接返回false
        }
        break
      case '>':
        if (leftValue <= convertedRightValue) {
          return false // 不满足条件，直接返回false
        }
        break
      case '<':
        if (leftValue >= convertedRightValue) {
          return false // 不满足条件，直接返回false
        }
        break
      case '>=':
        if (leftValue < convertedRightValue) {
          return false // 不满足条件，直接返回false
        }
        break
      case '<=':
        if (leftValue > convertedRightValue) {
          return false // 不满足条件，直接返回false
        }
        break
      // 其他比较方式
    }
  }
  return true // 所有规则都满足条件，返回true
 }
}

export default ifNodeFn
