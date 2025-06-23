function convertToType (value) {
  if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1) // 去掉双引号返回
  } else if (!Number.isNaN(Number(value))) {
      return parseInt(value) // 如果是数字，则转为整数
  } else if (value.toLowerCase() === 'false') {
      return false // 如果是字符串 'false'，则转为布尔值 false
  } else if (value.toLowerCase() === 'true') {
      return true // 如果是字符串 'true'，则转为布尔值 true
  } else if (value.toLowerCase() === 'undefined') {
      return undefined // 如果是字符串 'undefined'，则转为 undefined
  } else if (value.toLowerCase() === 'null') {
      return null // 如果是字符串 'null'，则转为 null
  } else {
      return value // 其他情况返回原始值
  }
}
export default convertToType
