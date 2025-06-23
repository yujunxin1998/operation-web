<template>
  <div class="left-content">
    <div class="pers-center" v-if="currentUser" v-show="menuExpand">
      <img id="" src="../..//assets/images/index/man.png" />
      <div class="user">
        <div id="username" class="username">{{ currentUser.name }}</div>
        <div id="deptName" class="deptname">{{ currentUser.deptName }}</div>
      </div>
    </div>
    <div id="left-menu" :style="{height: menuHeight}">
      <div id="left-menu-content" class="left-menu-content" :style="{width: menuWidth}">
        <div id="sub-menu-content" :class="[{'sub-menu-content-collapse': !menuExpand}, 'sub-menu-content']">
          <template v-for="menu in menus">
            <div
              :key="menu.name"
              :ref="menu.name"
              :title="menu.meta.title"
              :class="[{'sub-menu-item': !menu.children}, { 'sub-menu-selected': (selectedId === menu.name || parentId === menu.name)}, 'sub-menu']"
              @click="siderMenuClick(menu.name)"
              @mouseover="!menuExpand && showSubMenuBox(menu)"
            >
              <icon-font :type="menu.meta.icon"></icon-font>
              <span v-show="menuExpand">
                {{ menu.meta.title }}
                <span class="menu-num" v-show="menu.num && menu.num != 0">{{ menu.num > 99 ? '99+' : menu.num }}</span>
              </span>
              <icon-font v-if="menu.children" v-show="menuExpand" :type="menu.menuArrowType || 'iconfont-arrow-up'" class="icon-arrow"></icon-font>
            </div>
            <div
              :class="[{'sub-menu-box-right': subMenuRight}, 'sub-menu-box']"
              :style="{top: rightMenuTop}"
              v-if="menu.children"
              v-show="menu.menuArrowType === 'iconfont-arrow-down'"
              :key="'submenu-'+menu.name"
              @mouseleave="!menuExpand && hideSubMenuBox(menu)"
            >
              <div
                v-for="childmenu in menu.children"
                :key="childmenu.name"
                :class="[{'sub-menu-selected': selectedId === childmenu.name}, 'sub-menu', 'sub-menu-item']"
                @click="siderMenuClick(childmenu.name)">
                <span :title="childmenu.meta.title">{{ childmenu.meta.title }}</span>
              </div>
            </div>
          </template>
        </div>
        <div class="sub-menu-footer" v-if="showCollapseButton">
          <icon-font
            :type="footerArrowType"
            :title="arrowTitle"
            style="padding: 12px 16px;"
            @click="toggleMenu">
          </icon-font>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'SiderMenu',
	props: {
		menus: {
			type: Array,
			required: false,
			default: () => []
		},
		showCollapseButton: {
			type: Boolean,
			required: false,
			default: false
		},
		navMenu: {
			type: Object,
			required: false,
			default: () => {}
		},
		defaultSubMenuId: {
			type: String,
			required: false,
			default: ''
		},
		currentUser: {
			type: Object,
			required: false,
			default: () => {}
		}
	},
	data () {
		return {
			selectedId: '',
			parentId: '', // 用于记录当前的父级菜单
			footerArrowType: 'iconfont-arrow-close',
			menuExpand: true,
			menuHeight: 'calc(100% - 126px)',
			menuWidth: '206px',
			rightMenuTop: '0'
		}
	},
	computed: {
		arrowTitle () {
			return this.footerArrowType === 'iconfont-arrow-open' ? '展开' : '收起'
		},
		subMenuRight () {
			return this.footerArrowType === 'iconfont-arrow-open'
		},
		navMenuName () {
			return this.navMenu.meta.title
		}
	},
	watch: {
		navMenu: {
			handler (val) {
				let menuId
				this.$nextTick(() => {
					if (this.defaultSubMenuId) {
						menuId = this.defaultSubMenuId
					} else {
						if (this.menus.length > 0) {
							if (this.menus[0].children) {
								menuId = this.menus[0].children[0].name
							} else {
								menuId = this.menus[0].name
							}
						}
					}

					this.siderMenuClick(menuId)
				})
			},
			immediate: true
		}
	},
	methods: {
		siderMenuClick (menuId) {
			if (!menuId) return

			const menu = this.menus.find(menu => {
				return menu.name === menuId
			})
			let breadcrumb = ''

			if (menu && menu.children) {
				// 有子菜单的二级菜单
				if (this.menuExpand) {
					if (menu.menuArrowType === 'iconfont-arrow-down') {
						this.$set(menu, 'menuArrowType', 'iconfont-arrow-up')
					} else {
						this.$set(menu, 'menuArrowType', 'iconfont-arrow-down')
					}
				}
			} else {
				const menu = this.menus.find(menu => {
					return menu.name === menuId
				})
				if (menu) {
					// 没有子菜单的二级菜单
					this.parentId = ''
					this.selectedId = menuId
					this.$router.push(menu.path)

					breadcrumb = `${this.navMenuName}/${menu.meta.title}`
					this.$emit('showMenuBreadcrumb', breadcrumb)
				} else {
					// 三级菜单
					// 找到三级菜单对应的二级菜单
					let parentMenu
					this.menus.forEach(menu => {
						if (menu.children) {
							const selectedThirdMenu = menu.children.find(thirdMenu => {
								return thirdMenu.name === menuId
							})

							if (selectedThirdMenu) {
								parentMenu = menu
								return false
							}
						}
					})

					if (this.menuExpand) {
						this.$set(parentMenu, 'menuArrowType', 'iconfont-arrow-down')
					}
					this.parentId = parentMenu.name
					this.selectedId = menuId

					const menu = parentMenu.children.find(menu => {
						return menu.name === menuId
					})
					this.$router.push(menu.path)

					breadcrumb = `${this.navMenuName}/${parentMenu.meta.title}/${menu.meta.title}`
					this.$emit('showMenuBreadcrumb', breadcrumb)
				}
			}
		},
		showSubMenuBox (menu) {
			this.menus.forEach(menu => {
				this.$set(menu, 'menuArrowType', 'iconfont-arrow-up')
			})
			if (menu.children) {
				// 有子菜单的二级菜单
				this.$set(menu, 'menuArrowType', 'iconfont-arrow-down')
				const top = this.$refs[menu.name][0].getBoundingClientRect().top
				this.rightMenuTop = top + 'px'
			}
		},
		hideSubMenuBox (menu) {
			this.$set(menu, 'menuArrowType', 'iconfont-arrow-up')
		},
		toggleMenu () {
			if (this.footerArrowType === 'iconfont-arrow-close') {
				this.footerArrowType = 'iconfont-arrow-open'
				this.menuWidth = '54px'
				this.menuHeight = '100%'

				this.menus.forEach(menu => {
					this.$set(menu, 'menuArrowType', 'iconfont-arrow-up')
				})
			} else {
				this.footerArrowType = 'iconfont-arrow-close'
				this.menuWidth = '206px'
				this.menuHeight = 'calc(100% - 126px)'

				const parentMenu = this.menus.find(menu => {
					return menu.name === this.parentId
				})
				this.$set(parentMenu, 'menuArrowType', 'iconfont-arrow-down')
			}

			this.menuExpand = !this.menuExpand
		}
	}
}
</script>

<style lang="less" scoped>
.left-content {
	/* border-right: 1px solid #E6E6E6; */
    padding: 16px;
    box-sizing: border-box;
    max-width: 240px;
}

.pers-center {
	height: 90px;
	width: 100%;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	// margin: 16px;
	margin-bottom: 20px;
	background: #EFF5FF;
    border-radius: 5px;
	/* border-bottom: 1px solid #E6E6E6; */
}

.pers-center img {
	padding: 5px 12px;
}

.pers-center .user {
	max-width: 230px;
}

.pers-center .username {
	color: #666666;
	font-size: 18px;
	margin-bottom: 8px;
	letter-spacing: 0.1em;
}

.pers-center .deptname {
	color: #999999;
	font-size: 16px;
}

.left-menu-content {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;

	.anticon{
		font-size: 18px !important;
	}

	.icon-arrow {
		font-size: 16px !important;
	}

	.menu-num{
		display: inline-block;
		background: #F85C2D;
		color: #FFF;
		min-width: 24px;
		max-width: 36px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: normal;
		text-align: center;
		margin-left: 0px;
		height: 18px;
		line-height: 18px;
	}
}

.sub-menu .icon-arrow {
	color: #515A6E !important;
}

.sub-menu-selected .icon-arrow {
	color: #FFFFFF !important;
}

.sub-menu-footer {
	border-top: 1px solid #E6E6E6;
	height: 48px;
	line-height: 48px;
	cursor: pointer;
}

.sub-menu-content {
	flex: 1;
	overflow: auto;
	// margin: 16px;
	margin-top: 0;

	.sub-menu {
		height: 50px;
		padding: 0 16px;
		display: flex;
		align-items: center;
		font-size: 16px;
		cursor: pointer;
		/* border-bottom: 1px solid #EFEFEF; */
		color: #515A6E;
	}

	.sub-menu:not(.sub-menu-item){
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	.sub-menu:nth-child(5n+1) .anticon {
		color: #E15050;
	}

	.sub-menu:nth-child(5n+2) .anticon {
		color: #4FB751;
	}

	.sub-menu:nth-child(5n+3) .anticon {
		color: #F6A02D;
	}

	.sub-menu:nth-child(5n+4) .anticon {
		color: #3874E6;
	}

	.sub-menu:nth-child(5n) .anticon {
		color: #EE7A3F;
	}

	.sub-menu span {
		margin-left: 12px;
		flex: 1;
	}

	.sub-menu:hover{
		color: #4778C7;
	}

	.sub-menu-selected:hover{
		color: #FFFFFF;
	}

	.sub-menu-selected {
		background: @primary-color;
		color: #FFFFFF;
		border-radius: 5px;
	}

	/* .sub-menu:hover .anticon, */
	.sub-menu-selected .anticon{
		color: #FFFFFF !important;
	}

	/* .sub-menu:hover+.sub-menu-box, */
	.sub-menu-selected+.sub-menu-box {
		background: #EFF5FF;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.sub-menu-box .sub-menu {
		height: 44px;
		padding: 0 16px;
		display: flex;
		border-bottom: 1px solid #FFFFFF;
		font-size: 14px;
		align-items: center;
		cursor: pointer;
	}

	.sub-menu-box .sub-menu span {
		margin-left: 35px;
	}

	.sub-menu-box .sub-menu:hover,
	.sub-menu-box .sub-menu-selected {
		background: #EFF5FF;
		color: #4778C7;
	}

	.sub-menu-box-right {
		position: absolute;
		background: #FFF;
		z-index: 99;
		left: 54px;
		box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .12),
			0 6px 16px 0 rgba(0, 0, 0, .08),
			0 9px 28px 8px rgba(0, 0, 0, .05);
	}

	.sub-menu-box-right .sub-menu {
		padding: 0 32px;
	}

	.sub-menu-box-right .sub-menu span {
		margin-left: 0;
	}
}

.sub-menu-content-collapse{
	margin: 16px 6px;
	margin-top: 2px;

	.sub-menu{
		padding: 0 12px;
	}
}
</style>
