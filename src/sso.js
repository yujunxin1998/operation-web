export function start (next) {
    // const urlParam = getUrlParam()
    // const satoken = window.ServiceConfig.satoken || window.top.sessionStorage.getItem('satoken')
    // 单点登录不靠前端拦截，纯靠后端拦截
    if (window.ServiceConfig.sfLogin) {
      handleSflogin()
    } else {
      next()
    }
}

// 判断sessionStorage是否存在userId
export function handleSflogin (ticket, next) {
   const userId = sessionStorage.getItem('userId')
   if (!userId || typeof userId === 'undefined') {
     goSsoAuthUrl()
   } else {
     next()
   }
}

// 获取url上所有的参数
export function getUrlParam () {
  const result = {}
  const strs = window.location.search.substr(1).split('&')
  if (strs == null || strs === '') {
    return result
  }
  for (var i = 0; i < strs.length; i++) {
    const key = strs[i].split('=')[0]
    let value = strs[i].split('=')[1]
    value = value || null
    result[key] = decodeURI(value)
  }
  return result
}

// 重定向
export function goSsoAuthUrl () {
    var topWindow = window // 定义最顶层页面  把当前页面赋值给topWindow
    while (topWindow.parent !== topWindow) { // 不断的循环 把当前页面的父页面与顶层页面对象比较 直到相同
        topWindow = topWindow.parent
    }
    // 重定向到首页
    topWindow.location.href = window.ServiceConfig.ssoUrl
}
