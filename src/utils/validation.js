class Validation {
  // 身份证号验证
  static validateIDCard (value) {
    // 15或18位身份证号
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return pattern.test(value)
  }

  // 邮箱
  static validateEmail (value) {
    var pattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    return pattern.test(value)
  }

  // 验证邮编6位
  static validateZipCode (value) {
    var pattern = /^[0-9]{6}$/
    return pattern.test(value)
  }

  // 验证电话号码
  static validatePhoneNum (value) {
    // 手机号或固定电话  固话：区号-座机号（例如：0930-7898888） 手机：11位手机号码
    var pattern = /^((0\d{2,3}-\d{7,8})|(\d{7,8})|(1[35784]\d{9}))$/
    return pattern.test(value)
  }

  // 验证固定电话电话号码
  static validateFixedPhoneAreaCode (value) {
    // 固话格式：区号-座机号（例如：0930-7898888）
    var pattern = /^((0\d{2,3}-\d{7,8}(-\d{3,})?)|(\d{7,8}(-\d{3,})?))$/
    return pattern.test(value)
  }

  // 验证固定电话电话号码-带分机
  static validateFixedPhoneExtension (value) {
    // 固话格式：例如0931-76458961-626(分机是可选项)
    var pattern = /^((0\d{2,3}-\d{7,8}(-\d{3,})?)|(\d{7,8}(-\d{3,})?))$/
    return pattern.test(value)
  }

  // 验证区号
  static validateAreaCode (value) {
    var pattern = /^0\d{2,3}$/
    return pattern.test(value)
  }

  // 验证固话
  static validateFixedPhone (value) {
    // 固定电话，例如：76458961
    var pattern = /^(\d{7,8})$/
    return pattern.test(value)
  }

  // 验证手机号11位
  static validateMobilePhone (value) {
    var pattern = /^1\d{10}$/
    return pattern.test(value)
  }

  // 密码校验
  static validatePassword (value) {
    // 6-20位字母、数字或下划线
    var pattern = /^(\w){8,16}$/
    return pattern.test(value)
  }

  // 用户名校验
  static validateUsername (value) {
    // 2-30位字母或数字
    var pattern = /^[a-zA-Z0-9]{2,30}$/
    return pattern.test(value)
  }

  // 验证社会统一信用代码
  static validateSocialCode (value) {
    var pattern = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/
    return pattern.test(value)
  }

  // 非零
  static validateNeqZero (value) {
    return isNaN(value) || Number(value) === 0
  }

  // 大于0
  static validateGtZero (value) {
    return isNaN(value) || Number(value) <= 0
  }

  // 大于等于0
  static validateGteZero (value) {
    return isNaN(value) || Number(value) < 0
  }

  // 小于0
  static validateLtZero (value) {
    return isNaN(value) || Number(value) >= 0
  }

  // 小于等于0
  static validateLteZero (value) {
    return isNaN(value) || Number(value) > 0
  }
}

export default Validation
