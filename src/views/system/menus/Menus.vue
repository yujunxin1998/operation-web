<template>
  <div class="menus-container">
    <SystemList
      ref="menuList"
      title="菜单管理"
      :columns="menuColumns"
      :render="$bpmSystemProServices.systemService.getMenuList"
      :buttons="menuButtons"
      :scroll="{y:scrollY}"
      :pagination="false"
      :showAsTree="true"
      :defaultExpandAllRows="true"
      :expandIconColumnIndex="1"
      @rowClick="onRowClick"
      @rowDbClick="onRowDbClick"
      @datachange="getKey"
    >
      <!-- <template slot="tips">
        <span>提示：拖动序号列可以快速调整菜单顺序！</span>
      </template> -->
    </SystemList>
    <AddMenu
      :visible.sync="addVisible"
      :editData.sync="editData"
      :type="openType"
      :menus="menus"
      @submit="onSearch"
    />
  </div>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'
import AddMenu from './AddMenu'

export default {
  name: 'Menus',
  mounted () {},
  data () {
    const _this = this
    return {
      scrollY: null,
      menus: [],
      addVisible: false,
      editData: {},
      openType: '',
      currentRow: {}, // 当前选中行
      changeRow: {}, // 交换行
      menuItem: {},
      menuColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${index + 1}`
          },
          width: 40,
          align: 'center'
        },
        {
          title: '显示名称',
          dataIndex: 'name',
          ellipsis: true,
          width: 120
        },
        {
          title: '配置名称',
          dataIndex: 'confName',
          ellipsis: true,
          width: 120
        },
        {
          title: '菜单标识',
          dataIndex: 'code',
          ellipsis: true,
          width: 80
        },
        {
          title: '菜单路径',
          dataIndex: 'url',
          ellipsis: true,
          width: 300
        },
        {
          title: '顺序号',
          dataIndex: 'sortNum',
          ellipsis: true,
          width: 50,
          align: 'center'
        },
        {
          title: '菜单图标',
          dataIndex: 'icon',
          ellipsis: true,
          width: 50,
          align: 'center',
          scopedSlots: {
            customRender: 'icon'
          }
        }
      ],
      menuButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            _this.editData = {
              pid: _this.editData.id
            }
            _this.openType = ''

            _this.menus = JSON.parse(JSON.stringify(_this.$refs.menuList.getData()))

            _this.addVisible = true
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            _this.openType = 'edit'

            _this.menus = JSON.parse(JSON.stringify(_this.$refs.menuList.getData()))

            _this.addVisible = true
          }
        },
        {
          id: 3,
          text: '删除',
          icon: 'iconfont-Delete',
          click () {
            _this.$confirm({
              title: '提示',
              content: '确定删除记录?',
              okText: '确认',
              cancelText: '取消',
              onOk () {
                _this.$bpmSystemProServices.systemService
                  .deleteMenu({
                    resourceId: _this.editData.id
                  })
                  .then(() => {
                    _this.onSearch()
                  })
              },
              onCancel () {}
            })
          }
        },
        {
          id: 4,
          text: '上移',
          icon: 'iconfont-up',
          click () {
            _this.menuItem = _this.$refs.menuList.getSelected() || {}
            if (Object.keys(_this.menuItem).length === 0) {
              _this.$message.warning('请选择一条记录！')
            }
            const menus = _this.$refs.menuList.getData()
            let newList = []
            let curIndex = null
            if (_this.menuItem.pid) {
              // 如果是子级

              // 展开菜单
              const traverse = array => {
                array.forEach((element, index) => {
                  if (element.children) {
                    array = [...array, ...traverse(element.children)]
                  }
                })
                return array
              }
              newList = traverse(menus)
              // 获取父级
              const pList = newList.filter((pItem) => pItem.id === _this.menuItem.pid)
              // 同级的菜单
              var borList = pList[0].children
              curIndex = borList.findIndex(menu => {
                return menu.id === _this.menuItem.id
              })

              if (curIndex === 0) {
                _this.$message.warning('不能上移')
                return
              }
              _this.currentRow = _this.menuItem
              _this.changeRow = borList[curIndex - 1]
            } else {
              const curIndex = menus.findIndex(menu => {
                return menu.id === _this.menuItem.id
              })

              if (curIndex === 0) {
                _this.$message.warning('不能上移')
                return
              }
              _this.currentRow = _this.menuItem
              _this.changeRow = menus[curIndex - 1]
            }
            _this.updateList('sy')
          }
        },
        {
          id: 5,
          text: '下移',
          icon: 'iconfont-down',
          click () {
            _this.menuItem = _this.$refs.menuList.getSelected() || {}
            if (Object.keys(_this.menuItem).length === 0) {
              _this.$message.warning('请选择一条记录！')
            }
            const menus = _this.$refs.menuList.getData()
            let newList = []
            let curIndex = null
            if (_this.menuItem.pid) {
              // 如果是子级

              // 展开菜单
              const traverse = array => {
                array.forEach((element, index) => {
                  if (element.children) {
                    array = [...array, ...traverse(element.children)]
                  }
                })
                return array
              }
              newList = traverse(menus)
              // 获取父级
              const pList = newList.filter((pItem) => pItem.id === _this.menuItem.pid)
              // 同级的菜单
              var borList = pList[0].children
              curIndex = borList.findIndex(menu => {
                return menu.id === _this.menuItem.id
              })
              if (curIndex === borList.length - 1) {
                _this.$message.warning('不能下移')
                return
              }
              _this.currentRow = _this.menuItem
              _this.changeRow = borList[curIndex + 1]
            } else {
              // 父级
              curIndex = menus.findIndex(menu => {
                return menu.id === _this.menuItem.id
              })
              if (curIndex === menus.length - 1) {
                _this.$message.warning('不能下移')
                return
              }
              _this.currentRow = _this.menuItem
              _this.changeRow = menus[curIndex + 1]
            }
            _this.updateList('xy')
          }
        },
        {
          id: 6,
          text: '刷新',
          icon: 'iconfont-Refresh',
          click () {
            _this.onSearch()
          }
        }
      ]
    }
  },
  provide () {
      return {
        getList: this.getList
      }
   },
  methods: {
    getScrollY () {
      this.$nextTick(() => {
        const listHeight = this.$refs.menuList.$el.querySelector('.ant-table-wrapper')
        this.scrollY = listHeight.offsetHeight - 50
      })
    },
    // 获取当前菜单数据
    getList () {
        return JSON.parse(JSON.stringify(this.$refs.menuList.getData()))
    },
    onSearch () {
      this.$refs.menuList.getListData()
    },
    onRowClick (record) {
      // this.editData = Object.assign(this.editData, record)
      this.editData = record
    },
    onRowDbClick (record) {
      this.editData = record
      this.menus = JSON.parse(JSON.stringify(this.$refs.menuList.getData()))
      this.openType = 'edit'
      this.addVisible = true
    },
    async updateList (type) {
      if (!this.currentRow.sortNum || !this.changeRow.sortNum) {
        if (type === 'sy') {
          this.$message.error('选中的菜单和其上方的菜单的顺序号均不能为空！')
        } else {
          this.$message.error('选中的菜单和其下方的菜单的顺序号均不能为空！')
        }

        return
      }
      var sortNum = this.currentRow.sortNum
      this.currentRow.sortNum = this.changeRow.sortNum
      this.changeRow.sortNum = sortNum
      this.$bpmSystemProServices.systemService.updateMenu(this.changeRow).then(res => {
        if (res) {
        } else {
          this.$message.error('更新失败')
        }
      })
      this.$bpmSystemProServices.systemService.updateMenu(this.currentRow).then(res => {
        if (res) {
           this.onSearch()
        } else {
          this.$message.error('更新失败')
        }
      })
    },
    getKey () {
       this.$refs.menuList.setSelectedRow(this.currentRow.id)
    }

  },
  created () {
    this.getScrollY()
  },
  components: {
    SystemList,
    AddMenu
  }
}
</script>

<style lang="less" scoped>
.menus-container {
  padding: 16px;
  height: 100%;
}
</style>
