<template>
  <div class="roles-container">
    <split-pane :min-percent="45" :default-percent="45" split="vertical">
      <template slot="paneL">
        <div class="roles-left">
          <SystemList
            ref="funcList"
            title="角色列表"
            id="roleList"
            :columns="rolesColumns"
            :render="$bpmSystemProServices.persService.getRowList"
            :pagination="false"
            :buttons="rolesButtons"
            :params="rolesParams"
            :showAsTree="true"
            :scroll="{y:scrollY}"
            @change="onRolesListChange"
            @rowClick="onRolesRowClick"
            @rowDbClick="onRolesRowDbClick"
          >
            <!-- :scroll="{y:tableHeight}" -->
            <template slot="search-box-title">
              <a-form layout="inline" :model="rolesParams">
                <a-form-item label="角色编码">
                  <a-input-search
                    style="width: 150px"
                    placeholder="请输入角色编码"
                    enter-button
                    :allowClear="true"
                    v-model="rolesParams.code"
                    @change="onSearch"
                  />
                </a-form-item>
                <a-form-item label="角色名称">
                  <a-input-search
                    style="width: 150px"
                    placeholder="请输入角色名称"
                    enter-button
                    :allowClear="true"
                    v-model="rolesParams.name"
                    @change="onSearch"
                  />
                </a-form-item>
              </a-form>
            </template>
          </SystemList>
        </div>
      </template>
      <template slot="paneR">
        <a-tabs
          default-active-key="userList"
          tabPosition="top"
          @change="onTabChange"
          style="height: 100%;"
        >
          <a-tab-pane key="userList" tab="用户列表">
            <div id="roleList" style="height: 100%;">
              <SystemList
                ref="persList"
                :columns="persColumns"
                :render="$bpmSystemProServices.persService.getUserList"
                :params="persParams"
                :pagination="false"
                :buttons="persButtons"
                :scroll="{y:scrollY2}"
                :defaultLoad="false"
                type="checkbox"
                @change="onPersListChange"
              >
                <template slot="search-box">
                  <a-form layout="inline" :form="form">
                    <a-form-item label="姓名">
                      <a-input
                        placeholder="请输入姓名"
                        enter-button
                        v-decorator="['nickname']"
                        @pressEnter="reloadPers"
                      />
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" @click="reloadPers">
                        查询
                      </a-button>
                      <a-button :style="{ marginLeft: '8px' }" @click="reset">
                        重置
                      </a-button>
                    </a-form-item>
                  </a-form>
                </template>
              </SystemList>
            </div>
          </a-tab-pane>
          <a-tab-pane key="menuList" tab="系统菜单" style="overflow: auto;">
            <a-row type="flex" justify="space-between" align="middle" style="position:absolute;top:45px;width:100%;background-color:#FFFFFF;z-index:2">
              <a-col
                flex="auto"
                class="btns"
                style="text-align: left;"
              >
                <a-button
                  :type="btn.type || 'default'"
                  v-for="(btn, index) in menuButtons"
                  :key="btn.id || index"
                  @click="
                    () => {
                      btn.click && btn.click();
                    }
                  "
                >
                  <icon-font v-if="btn.icon" :type="btn.icon"></icon-font>
                  {{ btn.text }}
                </a-button>
              </a-col>
            </a-row>
            <a-row style="margin-top:50px">
              <a-col>
                <a-tree
                  v-model="checkedKeys"
                  checkable
                  :tree-data="treeData"
                  :showIcon="true"
                  :defaultExpandAll="false"
                  :replaceFields="replaceFields"
                  @check="onTreeNodeChecked"
                >
                  <icon-font slot="switcherIcon" type="iconfont-arrow-down" style="font-size: 16px;"></icon-font>
                  <template slot="custom" slot-scope="{ icon }">
                    <icon-font :type="icon === '' ? 'iconfont-wj' : 'iconfont-wjj'"></icon-font>
                  </template>
                </a-tree>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- <a-tab-pane key="alcharCard" tab="aichat卡片" style="overflow: auto;">
            <a-col
              flex="auto"
              class="btns"
              style="text-align: left;"
            >
              <a-button type="default" @click="saveCards">
                <icon-font type="iconfont-save" />保存
              </a-button>
            </a-col>
            <a-row>
              <a-col>
                <a-tree
                  v-model="cardCheckedKeys"
                  checkable
                  :tree-data="cardTreeData"
                  :showIcon="true"
                  :defaultExpandAll="false"
                  :replaceFields="cardReplaceFields"
                  @check="onCardTreeNodeChecked"
                >
                  <icon-font slot="switcherIcon" type="iconfont-arrow-down" style="font-size: 16px;"></icon-font>
                  <template slot="custom" slot-scope="{ icon }">
                    <icon-font :type="icon === '' ? 'iconfont-wj' : 'iconfont-wjj'"></icon-font>
                  </template>
                </a-tree>
              </a-col>
            </a-row>
          </a-tab-pane> -->
        </a-tabs>
      </template>
    </split-pane>

    <!-- 新增人员弹窗 -->
    <PersList
      :visible.sync="addVisible"
      :roleId="String(selectRoleId)"
      :type="openType"
      @submit="onPersSubmit"
    />

    <!-- 新增角色弹窗 -->
    <AddRole
      :visible.sync="addRoleVisible"
      :editData.sync="editData"
      :type="openRoleType"
      @submit="onRoleSubmit"
    />
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import SystemList from '@/components/SystemList/SystemList'
import PersList from './PersList'
import AddRole from './AddRole'

export default {
  name: 'Roles',
  created () {
    this.getPersStatus()
    this.getRoleType()
    this.getScrollY()
  },
  mounted () {
  },
  data () {
    const _this = this
    return {
      scrollY: null,
      scrollY2: null,
      form: _this.$form.createForm(_this, { name: 'rolesForm' }),
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      rolesParams: {
        code: '',
        name: ''
      },
      rolesType: {
        type: '2'
      },
      persParams: {
        roleId: '',
        username: '',
        name: '' // 修改为name字段，符合Java实体类定义
      },
      selectRoleId: '',
      selectPersRows: [],
      rolesColumns: [
        {
          title: '角色名称',
          dataIndex: 'name',
          width: '100px',
          ellipsis: true
        },
        {
          title: '角色编码',
          dataIndex: 'code',
          width: '100px',
          ellipsis: true
        },
        // {
        //   title: '角色类型',
        //   dataIndex: 'type',
        //   ellipsis: true,
        //   customRender: text => {
        //     const roleType = this.roleType.filter(roleTypeItem => {
        //       return roleTypeItem.code === text
        //     })
        //     if (roleType.length > 0) {
        //       return roleType[0].name
        //     } else {
        //       return ''
        //     }
        //   }
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '200px',
          ellipsis: true
        }
      ],
      rolesButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            _this.editData = {
              type: _this.rolesType.type,
              procDefKey: _this.rolesParams.procDefKey,
              pid: _this.editData.id || ''
            }
            _this.openRoleType = ''
            _this.addRoleVisible = true
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            if (_this.rolesType.type === '2') {
              _this.editData = _this.$refs.funcList.getSelected()
            } else if (_this.rolesType.type === '1') {
              _this.editData = _this.$refs.rolesList.getSelected()
            }
            if (_this.editData) {
              _this.openRoleType = 'edit'
              _this.addRoleVisible = true
            } else {
              _this.$message.warning('请选择一条记录！')
            }
          }
        },
        {
          id: 3,
          text: '删除',
          icon: 'iconfont-Delete',
          click () {
            if (_this.rolesType.type === '2') {
              _this.editData = _this.$refs.funcList.getSelected()
            } else if (_this.rolesType.type === '1') {
              _this.editData = _this.$refs.rolesList.getSelected()
            }
            if (_this.editData) {
              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.persService
                    .deleteRoles({
                      id: _this.editData.id
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        if (_this.rolesType.type === '2') {
                          _this.$refs.funcList.clearSelected()
                        } else if (_this.rolesType.type === '1') {
                          _this.$refs.rolesList.clearSelected()
                        }
                        _this.onSearch()

                        _this.selectRoleId = ''
                        _this.reloadPers()
                        _this.reloadMenus()
                        // _this.reloadCards()
                      } else {
                        _this.$message.error('删除失败')
                      }
                    })
                    .catch((error) => {
                      console.error('删除接口调用失败:', error)
                      _this.$message.error('删除接口调用失败: ' + error.message)
                    })
                },
                onCancel () {}
              })
            } else {
              _this.$message.warning('请选择一条记录！')
            }
          }
        }
      ],
      persColumns: [
        {
          title: '序号',
          width: 80,
          align: 'center',
          customRender: (text, record, index) => {
            return `${index + 1}`
          }
        },
        {
          title: '账号',
          dataIndex: 'username',
          width: 150,
          sorter: false,
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'nickname',
          width: 130,
          sorter: false,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          sorter: false,
          align: 'center',
          customRender: text => {
            const curStatus = this.persStatus.filter(status => {
              return status.code === text
            })
            if (curStatus.length > 0) {
              return curStatus[0].name
            } else {
              return ''
            }
          }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          ellipsis: true
        }
      ],
      persButtons: [
        {
          id: 1,
          text: '新增人员',
          icon: 'iconfont-New',
          click () {
            if (_this.selectRoleId) {
              _this.openType = ''
              _this.addVisible = true
            } else {
              _this.$message.warning('请选择一个角色！')
            }
          }
        },
        {
          id: 3,
          text: '删除人员',
          icon: 'iconfont-Delete',
          click () {
            const ids = _this.$refs.persList.getSelectedKeys()
            if (ids.length > 0) {
              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.persService
                    .deleteUser({
                      userIds: ids.join(','),
                      roleId: _this.selectRoleId
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        _this.$refs.persList.clearSelected()
                        _this.reloadPers()
                      } else {
                        _this.$message.error('删除失败')
                      }
                    })
                },
                onCancel () {}
              })
            } else {
              _this.$message.warning('请选择一条记录！')
            }
          }
        }
      ],
      menuButtons: [
        {
          id: 1,
          text: '保存',
          icon: 'iconfont-save',
          click () {
            _this.$bpmSystemProServices.persService.saveMenu({
              resourceIds: _this.checkedKeys.join(','),
              roleId: _this.selectRoleId
            }).then(res => {
              _this.$message.success('保存成功')
              _this.reloadMenus()
            })
          }
        }
      ],
      treeData: [],
      replaceFields: {
        title: 'confName',
        key: 'id'
      },
      cardReplaceFields: {
        title: 'name',
        key: 'id'
      },
      replaceFields4Ywml: {
        title: 'name',
        key: 'id'
      },
      openRoleType: '', // 打开类型  "edit"编辑 默认新增
      addRoleVisible: false, // 增加角色
      editData: {}, // 编辑角色数据
      openType: '', // 打开类型  "edit"编辑 默认新增
      addVisible: false, // 增加人员
      selectedRowKeys: [],
      checkedKeys: [], // 系统菜单选择
      persStatus: [],
      roleType: [],
      treeSelectedKeys: [],
      treeRoleData: [],
      roleListService: '',
      tableHeight: document.documentElement.clientHeight - 287 + 'px',
      cardCheckedKeys: [],
      cardTreeData: []
    }
  },
  methods: {
    getScrollY () {
      this.$nextTick(() => {
        const listHeight = this.$refs.funcList.$el.querySelector('.ant-table-wrapper')
        this.scrollY = listHeight.offsetHeight - 50

        const listHeight2 = this.$refs.persList.$el.querySelector('.ant-table-wrapper')
        this.scrollY2 = listHeight2.offsetHeight - 51
      })
    },
    async getPersStatus () {
      const status = await this.$bpmSystemProServices.systemService.getDictByCode('ZAIZHI')
      this.persStatus = status
    },
    async getRoleType () {
      var roleType = await this.$bpmSystemProServices.systemService.getDictByCode('ROLETYPE')
      this.roleType = roleType
    },
    changeRole (activeKey) {
      if (activeKey === 'flowRole') {
        this.rolesType.type = '1'
        this.onFlowSearch()
      } else {
        this.rolesType.type = '2'
        this.rolesParams.procDefKey = ''
        this.onSearch()
      }
    },
    async onSearch () {
      return new Promise(async (resolve, reject) => {
        if (this.rolesType.type === '1') {
          await this.$refs.rolesList.getListData()
        } else if (this.rolesType.type === '2') {
          await this.$refs.funcList.getListData()
        }
        resolve()
      })
    },
    async onFlowSearch () {
      return new Promise(async (resolve, reject) => {
        this.$bpmSystemProServices.systemService.getBusinessList({}).then(res => {
          res.map(node => {
            node.scopedSlots = { icon: 'custom' }
          })

          const firstLevel = res.filter(item => {
            return !item.pid || item.pid === ''
          })

          this.deepTree(firstLevel, res)
          this.treeRoleData = firstLevel
          resolve()
        })
      })
    },
    async reloadPers () {
      this.form.validateFields((error, values) => {
        if (!error) {
          this.persParams.roleId = this.selectRoleId
          this.persParams.username = values.username || ''
          this.persParams.name = values.nickname || '' // 将前端nickname字段映射为后端name字段，符合Java实体类定义
          return new Promise(async (resolve, reject) => {
            if (this.selectRoleId) {
              await this.$refs.persList.getListData()
            }
            resolve()
          })
        }
      })
    },
    saveCards () {
      this.$bpmSystemProServices.persService.saveCards({
        cardIdList: this.cardCheckedKeys,
        roleId: this.selectRoleId
      }).then(res => {
        this.$message.success('保存成功')
        // this.reloadCards()
      })
    },
    async reloadCards () {
      return new Promise(async (resolve, reject) => {
        await this.$bpmSystemProServices.persService.getCardTreeByRoleId({
          roleId: this.selectRoleId
        }).then(res => {
          this.cardCheckedKeys = []
          res.map(node => {
            if (node.checked) {
              this.cardCheckedKeys.push(node.id)
            }
            node.name = node.name.replace('<br>', '').replace('</br>', '').replace('<br/>', '')
            node.scopedSlots = { icon: 'custom' }
          })

          const firstLevel = res.filter(item => {
            return !item.pid || item.pid === ''
          })

          this.deepTree(firstLevel, res)
          this.cardTreeData = firstLevel
        })
        resolve()
      })
    },
    async reloadMenus () {
      return new Promise(async (resolve, reject) => {
        if (!this.selectRoleId) {
          // 如果没有选中角色，清空菜单数据
          this.checkedKeys = []
          this.treeData = []
          resolve()
          return
        }

        await this.$bpmSystemProServices.persService.getMenuInfo({
          roleId: this.selectRoleId
        }).then(res => {
          this.checkedKeys = []
          // 确保res是数组
          if (res && Array.isArray(res)) {
            res.map(node => {
              if (node.url && node.checked) {
                this.checkedKeys.push(node.id)
              }
              node.name = node.name.replace('<br>', '').replace('</br>', '').replace('<br/>', '')
              node.scopedSlots = { icon: 'custom' }
            })

            const firstLevel = res.filter(item => {
              return !item.pid || item.pid === ''
            })

            this.deepTree(firstLevel, res)
            this.treeData = firstLevel
          } else {
            this.treeData = []
          }
        })
        resolve()
      })
    },
    deepTree (parentList, data) {
      parentList.forEach(item => {
        item.children = []
        const childrenList = data.filter(children => {
          return children.pid === item.id
        })

        if (childrenList.length > 0) {
          item.children.push(...childrenList)
        } else {
          item.children = ''
        }

        if (typeof item.children === 'object') {
          this.deepTree(item.children, data)
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    onRolesListChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.onSearch()
    },
    onRolesRowClick (record) {
      this.selectRoleId = record.id
      if (this.rolesType.type === '2') {
        this.editData = this.$refs.funcList.getSelected()
      } else if (this.rolesType.type === '1') {
        this.editData = this.$refs.rolesList.getSelected()
      }
      this.$refs.persList.clearSelected()
      this.reloadPers()
      this.reloadMenus()
      // this.reloadCards()
    },
    onRolesRowDbClick (record) {
      this.editData = record
      this.openRoleType = 'edit'
      this.addRoleVisible = true
    },
    onPersListChange (pagination, filters, sorter, { currentDataSource }) {
      this.persPagination.pageIndex = pagination.current
      this.persParams.sortField = sorter.field
      this.persParams.sortOrder = sorter.order
      this.reloadPers()
    },
    onTreeNodeChecked (selectedKeys, info) {
      this.checkedKeys = selectedKeys
    },
    onCardTreeNodeChecked (selectedKeys, info) {
      this.cardCheckedKeys = selectedKeys
    },
    onTabChange () {},
    reset () {
      this.form.resetFields()
      this.reloadPers()
    },
    async onPersSubmit (id) {
      await this.reloadPers()
      // if (id) {
      //   this.$refs.persList.setSelectedRow(id)
      // }
    },
    getSelectedNode (treeData, selectedKey) {
      treeData.forEach(item => {
        if (item.id === selectedKey) {
          this.selectedNode = item
        }

        if (typeof item.children === 'object') {
          this.getSelectedNode(item.children, selectedKey)
        }
      })
    },
    async onRoleSubmit (id) {
      await this.onSearch()
      if (this.rolesType.type === '1') {
        if (id) {
          this.$refs.rolesList.setSelectedRow(id)
        }
      } else if (this.rolesType.type === '2') {
        if (id) {
          this.$refs.funcList.setSelectedRow(id)
        }
      }
    },
    onTreeNodeSelect (selectedKeys, { selected, selectedNodes, node, event }) {
      this.rolesParams.procDefKey = selectedKeys[0]
      this.$refs.rolesList.getListData()
    }
  },
  components: {
    splitPane,
    SystemList,
    PersList,
    AddRole
  }
}
</script>

<style lang="less" scoped>
.roles-container {
  padding: 0;
  height: 100%;

  .btns {
    text-align: left;
    padding: 8px 0;
    .ant-btn {
      margin-left: 6px;
    }
  }

  /deep/.ant-tabs-bar{
    margin: 0;
  }

  /deep/.ant-tabs-tabpane{
    padding: 16px;
    padding-top: 0;
  }

  /deep/.splitter-pane-resizer.vertical{
    width: 12px !important;
    margin-left: -6px;
  }

  /deep/.splitter-pane.vertical.splitter-paneL .roles-list{
    padding: 16px;
    padding-top: 0;
    height: calc(100% - 67px);
  }

  .roles-left {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px !important;
    .roles-tabs{
      height: 100%;
    }
  }

  /deep/.ant-tabs-content {
    height: calc(100% - 44px);
  }

  /deep/.ant-tabs-nav .ant-tabs-tab{
    font-size: 18px;
    font-weight: bold;
  }
}
.role-container{
  display: flex;
  height: 100%;
  position: relative;
  .role-left-container{
    flex: 1;
    background: #FAFBFC;
    margin-right: 16px;
    height: calc(100% - 62px);
    margin-top: 62px;
    border: #DDDDDD 1px solid;
    padding: 16px !important;
    // .role-tree{
    //   height: calc(100% - 46px);
    //   overflow: auto;
    // }
  }
  .role-right-container{
    flex: 1;
    background: #FAFBFC;
    height: calc(100% - 62px);
    margin-top: 62px;
    border: #DDDDDD 1px solid;

    /deep/ .table-toolbar{
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 12px;
    }
  }
  .role-title{
    height: 45px;
    line-height: 45px;
    width: 56px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    text-align: center;
    border-bottom: 1px solid #DDDDDD;
    width: 100%;
  }
}
</style>
