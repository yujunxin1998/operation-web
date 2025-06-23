<template>
  <div class="layout">
    <div class="header-box">
      <!-- <div class="header-logo">
        <img src="../assets/logo.svg">
      </div> -->
      <div class="header-title">{{ title }}</div>
      <nav-menu :menus="navMenu" @menuSelected="navMenuSelected"></nav-menu>
      <div class="header-message">
        <span class="header-message-item" @click="logout()"><icon-font type="iconfont-exit"/>注销</span>
      </div>
    </div>
    <div class="content">
      <sider-menu
        :menus="siderMenu"
        :navMenu="selectedMenu"
        :defaultSubMenuId="defaultSubMenuId"
        :currentUser="currentUser"
        v-show="siderMenu.length > 0"
        @showMenuBreadcrumb="showMenuBreadcrumb">
      </sider-menu>
      <div class="main-content">
        <div class="breadcrumb" v-if="showBreadcrumb">当前位置：{{ breadcrumb }}</div>
        <router-view class="router-view" :style="{height: routerHeight}"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import defaultSettings from '@/config/defaultSettings'
import NavMenu from '@/components/Menu/NavMenu.vue'
import SiderMenu from '@/components/Menu/SiderMenu.vue'

export default {
    name: 'Index',
    components: {
        NavMenu,
        SiderMenu
    },
    data () {
        return {
            currentUser: {},
            selectedMenu: {},
            defaultSubMenuId: '',
            title: defaultSettings.title,
            showBreadcrumb: defaultSettings.showBreadcrumb,
            breadcrumb: ''
        }
    },
    computed: {
        ...mapState({
            // 动态主路由
            mainMenu: state => state.permission.addRouters
        }),
        navMenu () {
          const routes = this.mainMenu.find(item => item.path === '/')
          return routes.children
        },
        siderMenu () {
            return Object.keys(this.selectedMenu).length > 0 ? this.selectedMenu.children || [] : []
        },
        routerHeight () {
          return this.showBreadcrumb ? 'calc(100% - 42px)' : '100%'
        }
    },
    mounted () {
        setTimeout(() => {
            this.currentUser = {
                name: '管理员',
                deptName: '北京数慧'
            }
        }, 1500)

        // this.$nextTick(() => {
        //   // TODO 查询一级菜单的待办数量
        //   const systemManage = this.navMenu.find(menu => {
        //     return menu.name === 'systemManage'
        //   })

        //   this.$set(systemManage, 'num', 11)
        // })
    },
    methods: {
        navMenuSelected (menuId, menu, subMenuId) {
          this.selectedMenu = menu
          // 只有一级菜单的情况
          if (!this.selectedMenu.children) {
            this.$router.push(menu.path)
            this.showMenuBreadcrumb(menu.meta.title)
          }

          // 如果存在subMenuId，默认选中
          this.defaultSubMenuId = subMenuId

          // TODO 获取当前菜单下的子菜单代办数量
          // const libManage = this.siderMenu.find(menu => {
          //   return menu.name === 'libManage'
          // })

          // this.$set(libManage, 'num', 11)
        },
        // 菜单面包屑展示
        showMenuBreadcrumb (breadcrumb) {
          this.breadcrumb = breadcrumb
        },
        logout () {
          this.$store.dispatch('Logout').then(() => {
            window.location.reload()
          })
        }
    }
}
</script>

<style lang="less" scoped>
html,
body,
.layout {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.header-box {
	width: 100%;
	height: 70px;
	float: left;
	background: @primary-color;
}

.header-logo {
	float: left;
}

.header-logo img {
	height: 40px;
	margin: 16px;
  margin-right: 0;
}

.header-title {
	height: 100%;
	display: flex;
	align-items: center;
	padding-left: 0px;
	font-size: 25px;
	color: #FFF;
	font-weight: bold;
	text-shadow: 0px 1px 2px #000000;
	letter-spacing: 1px;
	float: left;
  margin-left: 16px;
}

.header-message {
	float: right;
	color: #FFFFFF;
	padding-right: 10px;
	font-size: 14px;
  line-height: 70px;

  .header-message-item{
    cursor: pointer;
    padding: 10px;
  }

  .anticon{
    font-size: 18px;
    margin-right: 2px;
  }
}

.line {
	height: 14px;
	width: 2px;
	background: #FFF;
	display: inline-block;
	vertical-align: middle;
	margin: 0 5px;
}

.content {
	width: 100%;
	height: calc(100% - 70px);
	display: flex;
}

.main-content {
	flex: auto;
  background: #F0F0F3;;
	padding: 16px;
  width: calc(100% - 240px);
}

.main-content .router-view {
	background: #FFF;
}

.breadcrumb {
	background: #FFF;
	padding: 10px 5px;
	border-bottom: 1px solid #e6e6e6;
}
</style>
