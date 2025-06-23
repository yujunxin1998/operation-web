<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
// import { i18nRender } from '@/locales'

export default {
  data () {
    return {
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  mounted () {
    // 子页面向父页面发送消息-获取用户信息
    parent.postMessage('getUserInfo', '*')

    // 监听父页面发送的消息
    window.addEventListener('message', function (e) {
      // 对消息来源origin做一下过滤，避免接收到非法域名的消息导致的xss攻击
        const data = e.data
        // 接收到用户信息，存储到localStorage中
        localStorage.setItem('userName', data.userName)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('deptName', data.deptName)
        localStorage.setItem('deptId', data.deptId)
        localStorage.setItem('xzqh', data.xzqh)
    })
    // 判断是否在微应用中
    if (window.__MICRO_APP_ENVIRONMENT__) {
       // 监听
      window.microApp.addDataListener((data) => {
          console.log(data, '微应用接收')
          this.$router.push({ path: data.path })
      })
    }
  }
}
</script>
