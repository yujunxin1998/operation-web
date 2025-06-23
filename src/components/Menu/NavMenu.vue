<template>
  <div class="nav-menu-content">
    <div class="nav-menu-container" ref="navMenu" :style="{'max-width': maxMenuWidth}">
      <img
        id="scrollLeft"
        v-show="showArrow"
        @click="leftArrowClick"
        src="data:image/png;base64,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"
      >
      <div
        v-for="menu in menus"
        :key="menu.name"
        :ref="menu.name"
        :title="menu.meta.title"
        :class="[{ 'nav-menu-selected': selectedId === menu.name }, 'nav-menu']"
        @click="navMenuClick(menu.name)"
      >
        <icon-font :type="menu.meta.icon"></icon-font>
        <span>{{ menu.meta.title }}</span>
        <span class="menu-num" v-show="menu.num && menu.num != 0">{{ menu.num > 99 ? '99+' : menu.num }}</span>
      </div>
      <img
        id="scrollRight"
        v-show="showArrow"
        @click="rightArrowClick"
        src="data:image/png;base64,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"
      >
    </div>
  </div>
</template>

<script>
import bus from '@/utils/bus'
import { debounce } from '@/utils/util'

export default {
	name: 'NavMenu',
	props: {
		menus: {
          type: Array,
          required: false,
          default: () => []
		},
		selected: {
			type: String,
			required: false,
			default: ''
		}
	},
	data () {
		return {
			selectedId: '',
			maxMenuWidth: 0, // 菜单容器宽度
			winWidth: 0, // 窗口宽度
			lastMenuNum: 0, // 目前展示的最后一个菜单
			availLeftStep: 0, // 左侧可以移动的菜单个数
			availRightStep: 0 // 右侧可以移动的菜单个数
		}
	},
	computed: {
		showArrow () {
			return this.menus.length > this.maxMenuNum
		},
		maxMenuNum () {
			// 最多可同时展示的菜单个数
			let num = 0
			if (this.winWidth < 1200) {
				num = 4
			} else if (this.winWidth < 1400) {
				num = 5
			} else if (this.winWidth < 1600) {
				num = 6
			} else {
				num = 8
			}
			return num
		}
	},
	watch: {
		selected: {
			handler (val) {
				let menuId
				if (val) {
					menuId = val
				} else {
					menuId = this.menus.length > 0 ? this.menus[0].name : ''
				}

				this.navMenuClick(menuId)
			},
			immediate: true
		}
	},
	methods: {
		navMenuClick (menuId, subMenuId) {
			const menu = this.menus.filter(menu => {
				return menu.name === menuId
			})

			if (menu.length > 0 && !menu[0].component.name) {
				// 嵌入外部系统，直接跳转新的标签页面
				window.open(menu[0].meta.url)
				return
			}

			this.selectedId = menuId
			this.$emit('menuSelected', menuId, menu[0], subMenuId)
		},
		leftArrowClick () {
			if (this.availLeftStep > 0) {
				this.$refs.navMenu.scrollLeft -= (this.$refs[this.menus[this.lastMenuNum - 1].name][0].offsetWidth + 19)
				this.lastMenuNum--
				this.availLeftStep--
				this.availRightStep++
			}
		},
		rightArrowClick () {
			if (this.availRightStep > 0) {
				this.$refs.navMenu.scrollLeft += (this.$refs[this.menus[this.lastMenuNum].name][0].offsetWidth + 19)
				this.lastMenuNum++
				this.availLeftStep++
				this.availRightStep--
			}
		},
		setMenuContainerWidth () {
			this.winWidth = window.innerWidth
			this.lastMenuNum = this.maxMenuNum
			this.availLeftStep = 0
			this.availRightStep = this.menus.length - this.lastMenuNum
			// 菜单容器宽度
			let totalWidth = 0
			this.menus.forEach((menu, index) => {
				if (index < this.maxMenuNum) {
					totalWidth += (this.$refs[menu.name][0].offsetWidth + 19)
				}
			})
			this.maxMenuWidth = totalWidth + 'px'
		}
	},
	mounted () {
		bus.$on('changMenu', (params) => {
			const routes = params.split('/')
			if (routes.length > 2) {
				this.navMenuClick(routes[1], routes[routes.length - 1])
			} else {
				this.navMenuClick(routes[1])
			}
		})

		window.onresize = debounce(() => {
            return (() => {
				this.setMenuContainerWidth()
            })()
		}, 1000)

		this.$nextTick(() => {
			this.setMenuContainerWidth()
		})
	}
}
</script>

<style lang="less" scoped>
.nav-menu-content {
	height: 100%;
	float: left;
	margin: 0 20px;
	margin-left: 100px;
	position: relative;
}

.nav-menu-container {
	height: 100%;
	display: flex;
	align-items: center;
	color: #FFFFFF;
	font-size: 16px;
	margin: 0 10px;
	overflow: hidden;
	white-space: nowrap;
}

#scrollLeft {
	width: 20px;
	height: 20px;
	cursor: pointer;
	position: absolute;
	top: 25px;
	left: -10px;
}

#scrollRight {
	width: 20px;
	height: 20px;
	cursor: pointer;
	position: absolute;
	top: 25px;
	right: -10px;
}

.nav-menu {
	padding: 4px 8px;
	margin: 0 5px;
    margin-right: 14px;
	font-weight: bold;
	display: flex;
	align-items: center;
	cursor: pointer;
	position: relative;

	.anticon{
		font-size: 22px;
	}

	.menu-num{
		background: #F85C2D;
		color: #FFF;
		position: absolute;
		right: -14px;
		top: -8px;
		width: 36px;
		padding: 0 6px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: normal;
		text-align: center;
		height: 20px;
		line-height: 20px;
	}
}

.nav-menu span {
	margin-left: 5px;
}

.nav-menu:hover,
.nav-menu-selected {
	background: rgba(255,255,255,0.35);
	border-radius: 5px;
}
</style>
