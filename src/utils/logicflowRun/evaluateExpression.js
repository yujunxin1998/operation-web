function evaluateExpression (obj, expression) {
  const keys = Object.keys(obj)
  const values = keys.map(key => obj[key])

  const funcStr = `
    return function(${keys.join(', ')}) {
      return ${expression};
    }
  `

  // eslint-disable-next-line no-new-func
  const func = new Function(funcStr)

  return func()(...values)
}
export default evaluateExpression
