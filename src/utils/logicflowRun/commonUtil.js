const CommonUtil = {
  // 获取查询参数
  getQueryString: function (name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg) // search,查询？后面的参数，并匹配正则
    if (r !== null) {
        return unescape(r[2])
    }
    return ''
  },
  // 当前页面获取url上所有的参数
  getUrlParam: function () {
    const result = {}
    const strs = window.location.search.substr(1).split('&')
    if (strs === null || strs === '') {
        return result
    }
    for (var i = 0; i < strs.length; i++) {
        const key = strs[i].split('=')[0]
        let value = strs[i].split('=')[1]
        value = value || ''
        result[key] = decodeURI(value)
    }
    return result
  },
  // 所传的url上的所有的参数
  getUrlParamByurl: function (ifmurl) {
    var theRequest = {}
    var strs
    var index = ifmurl.lastIndexOf('?')
    var itemBody = ifmurl.substring(index + 1, ifmurl.length)
    strs = itemBody.split('&')
    for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
    return theRequest
  },
  // 是否为全路径
  isFullUrl: function (url) {
    // 匹配协议://域名
    var reg = /^https?:\/\/.+$/
    return reg.test(url)
  },
  // 将对象转化为url参数
  setUrlParam: function (obj) {
    var res = ''
    Object.keys(obj).forEach((item) => {
        if (!obj[item]) {
            obj[item] = ''
        }
        res += item + '=' + obj[item] + '&'
    })
    return res
  },
  // 生成uuid
  generateUUID: function () {
    var d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now()
    }
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
}
export default CommonUtil
