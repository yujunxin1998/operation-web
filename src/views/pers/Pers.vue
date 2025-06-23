<template>
  <div class="pers-container">
    <split-pane :default-percent="34" :min-percent="34" split="vertical">
      <template slot="paneL">
        <div class="pers-left">
          <SystemList
            ref="deptList"
            title="机构列表"
            :columns="deptColumns"
            :render="$bpmSystemProServices.persService.getDeptList"
            :params="deptParams"
            :buttons="deptButtons"
            @rowClick="onDeptRowClick"
            @rowDbClick="onDeptRowDbClick"
            :pagination="false"
            :showAsTree="true"
            :defaultExpandAllRows="true"
          >
          </SystemList>
        </div>
      </template>
      <template slot="paneR">
        <SystemList
          ref="persList"
          title="关联用户"
          :columns="persColumns"
          :buttons="persButtons"
          :render="$bpmSystemProServices.persService.getPersList"
          :params="persParams"
          :pagination.sync="pagination"
          @change="onPerListChange"
          type="checkbox"
          :defaultLoad="false"
        >
          <template slot="search-box-title">
            <a-form layout="inline" :model="persParams">
              <a-form-item label="员工状态">
                <a-select
                  style="width: 120px"
                  v-model="persParams.status"
                  @change="reloadPers"
                >
                  <a-select-option key="empty" :value="''">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="status in persStatus"
                    :key="status.id"
                    :value="status.code"
                  >
                    {{ status.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-input-search
                  style="width: 200px"
                  placeholder="请输入姓名/账号"
                  enter-button
                  :allowClear="true"
                  v-model="persParams.name"
                  @search="reloadPers"
                />
              </a-form-item>
            </a-form>
          </template>
        </SystemList>
      </template>
    </split-pane>

    <!-- 新增弹窗 -->
    <AddDept
      :visible.sync="addDeptVisible"
      :editData.sync="editData"
      :type="openDeptType"
      @submit="onDeptSubmit"
    />
    <SetSsld
      :visible.sync="setSsldVisible"
      :editData.sync="editData"
      @submit="onDeptSubmit"
    />
    <AddPer
      :visible.sync="addPerVisible"
      :editData.sync="editItemData"
      :type="openPerType"
      @submit="onPerSubmit"
    />

    <a-modal
      title="人员调动"
      :visible="changeDeptVisible"
      okText="确定"
      cancelText="取消"
      centered
      @ok="changeDept"
      @cancel="() => {changeDeptVisible = false}"
      width="600px"
    >
      <a-form-model
        ref="form"
        layout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              label="姓名"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }">
              <a-select v-model="usersList" mode="multiple">
                <a-select-option
                  v-for="item in users"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-model-item label="账号" prop="loginName">
              <a-input v-model="editItemData.loginName" disabled></a-input>
            </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              label="调动部门"
              prop="departmentId"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
            >
              <a-tree-select
                v-model="departmentId"
                :tree-data="depts"
                :replaceFields="replaceFields"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }">
              </a-tree-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import SystemList from '@/components/SystemList/SystemList'
import AddPer from './UsersList'
import AddDept from './AddDept'
import SetSsld from './SetSsld'
export default {
  name: 'Pers',
  created () {
    this.getPersStatus()
    this.getPersPost()
    this.getSF()
    this.getGender()
  },
  data () {
    const _this = this
    return {
      depts: [],
      users: [],
      usersList: [],
      departmentId: '',
      changeDeptVisible: false,
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      deptParams: {},
      deptColumns: [
        {
          title: '部门名称',
          dataIndex: 'name',
          ellipsis: true,
          width: 150
        },
        // {
        //   title: '分管领导',
        //   dataIndex: 'ssldmc',
        //   ellipsis: true,
        //   width: 100
        // },
        {
          title: '人数',
          dataIndex: 'usernum',
          align: 'right',
          width: 60
        },
        {
          title: '序号',
          dataIndex: 'sortNum',
          align: 'right',
          width: 60
        },
        {
          title: '状态',
          dataIndex: 'stauts',
          align: 'right',
          width: 80,
          customRender: text => {
            const curStatus = this.persStatus.filter(status => {
              return status.id === text
            })
            if (curStatus.length > 0) {
              return curStatus[0].name
            } else {
              return ''
            }
          }
        }
      ],
      deptButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            _this.editData = _this.$refs.deptList.getSelected()
            if (_this.editData) {
              _this.editData = {
                pid: _this.editData.id || ''
              }
            }
            _this.openDeptType = ''
            _this.addDeptVisible = true
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            _this.editData = _this.$refs.deptList.getSelected()
            if (_this.editData) {
              _this.openDeptType = 'edit'
              _this.addDeptVisible = true
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
            _this.editData = _this.$refs.deptList.getSelected()
            if (_this.editData) {
              if (parseInt(_this.editData.usernum) > 0 || _this.editData.children.length > 0) {
                _this.$message.warning('请先删除部门下的人员')
                return
              }

              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.persService
                    .deleteDept({
                      id: _this.editData.id
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        _this.$refs.deptList.clearSelected()
                        _this.reloadDeptAndPers()
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
        },
        {
          id: 4,
          text: '上移',
          icon: 'iconfont-up',
          click () {
            _this.deptItem = _this.$refs.deptList.getSelected() || {}
            if (Object.keys(_this.deptItem).length === 0) {
              _this.$message.warning('请选择一条记录！')
            }
            const dept = _this.$refs.deptList.getData()
            let newList = []
            let curIndex = null
            if (_this.deptItem.pid) {
              // 如果是子级

              // 展开
              const traverse = array => {
                array.forEach((element, index) => {
                  if (element.children) {
                    array = [...array, ...traverse(element.children)]
                  }
                })
                return array
              }
              newList = traverse(dept)
              // 获取父级
              const pList = newList.filter((pItem) => pItem.id === _this.deptItem.pid)
              // 同级的
              var borList = pList[0].children
              curIndex = borList.findIndex(menu => {
                return menu.id === _this.deptItem.id
              })

              if (curIndex === 0) {
                _this.$message.warning('不能上移')
                return
              }
              _this.currentRow = _this.deptItem
              _this.changeRow = borList[curIndex - 1]
            } else {
              const curIndex = dept.findIndex(menu => {
                return menu.id === _this.deptItem.id
              })

              if (curIndex === 0) {
                _this.$message.warning('不能上移')
                return
              }
              _this.currentRow = _this.deptItem
              _this.changeRow = dept[curIndex - 1]
            }
            _this.updateList('sy')
          }
        },
        {
          id: 5,
          text: '下移',
          icon: 'iconfont-down',
          click () {
            _this.deptItem = _this.$refs.deptList.getSelected() || {}
            if (Object.keys(_this.deptItem).length === 0) {
              _this.$message.warning('请选择一条记录！')
            }
            const dept = _this.$refs.deptList.getData()
            let newList = []
            let curIndex = null
            if (_this.deptItem.pid) {
              // 如果是子级
              const traverse = array => {
                array.forEach((element, index) => {
                  if (element.children) {
                    array = [...array, ...traverse(element.children)]
                  }
                })
                return array
              }
              newList = traverse(dept)
              // 获取父级
              const pList = newList.filter((pItem) => pItem.id === _this.deptItem.pid)
              // 同级
              var borList = pList[0].children
              curIndex = borList.findIndex(menu => {
                return menu.id === _this.deptItem.id
              })
              if (curIndex === borList.length - 1) {
                _this.$message.warning('不能下移')
                return
              }
              _this.currentRow = _this.deptItem
              _this.changeRow = borList[curIndex + 1]
            } else {
              // 父级
              curIndex = dept.findIndex(menu => {
                return menu.id === _this.deptItem.id
              })
              if (curIndex === dept.length - 1) {
                _this.$message.warning('不能下移')
                return
              }
              _this.currentRow = _this.deptItem
              _this.changeRow = dept[curIndex + 1]
            }
            _this.updateList('xy')
          }
        }
        // {
        //   id: 6,
        //   text: '设置分管领导',
        //   icon: 'iconfont-xtyw',
        //   click () {
        //     _this.editData = _this.$refs.deptList.getSelected()
        //     if (_this.editData) {
        //       _this.setSsldVisible = true
        //     } else {
        //       _this.$message.warning('请选择一条记录！')
        //     }
        //   }
        // }
      ],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      persColumns: [
        {
          title: '序号',
          width: 80,
          align: 'center',
          customRender: (text, record, index) => {
            return `${index + 1}`
          }
        },
        // {
        //   title: '性别',
        //   dataIndex: 'sex',
        //   width: 80,
        //   align: 'center',
        //   customRender: text => {
        //     const curGender = this.gender.filter(genderItem => {
        //       return genderItem.code === text
        //     })
        //     if (curGender.length > 0) {
        //       return curGender[0].name
        //     } else {
        //       return ''
        //     }
        //   }
        // },
        {
          title: '账号名',
          dataIndex: 'loginName',
          ellipsis: true,
          width: 140,
          align: 'center'
        },
        {
          title: '真实姓名',
          dataIndex: 'name',
          ellipsis: true,
          width: 160,
          align: 'center'
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          align: 'center',
          width: 80,
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
        // {
        //   title: '职务',
        //   dataIndex: 'zw',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 100,
        //   customRender: text => {
        //     const curPost = this.persPost.filter(post => {
        //       return post.code === text
        //     })

        //     if (curPost.length > 0) {
        //       return curPost[0].name
        //     } else {
        //       return '无'
        //     }
        //   }
        // },
        // {
        //   title: '是否为部门领导',
        //   dataIndex: 'bmld',
        //   align: 'center',
        //   width: 150,
        //   customRender: text => {
        //     if (text === '1') {
        //       return '是'
        //     } else {
        //       return '否'
        //     }
        //   }
        // },
        // {
        //   title: '座机电话',
        //   dataIndex: 'tel',
        //   align: 'center',
        //   width: 140
        // },
        // {
        //   title: '移动电话',
        //   dataIndex: 'phone',
        //   align: 'center',
        //   width: 140
        // },
        {
          title: '所属机构',
          dataIndex: '',
          width: 180,
          align: 'center',
          customRender: () => {
            return this.$refs.deptList.getSelected().name
          }
        }
      ],
      persButtons: [
        {
          id: 1,
          text: '添加人员',
          icon: 'iconfont-New',
          click () {
            _this.editData = _this.$refs.deptList.getSelected()
            if (_this.editData) {
              _this.editItemData = {
                departmentId: _this.editData.id,
                sx: (Number(_this.editData.usernum) + 1)
              }
              _this.openPerType = ''
              _this.addPerVisible = true
            } else {
              _this.$message.warning('请选择部门！')
            }
          }
        },
        // {
        //   id: 2,
        //   text: '编辑',
        //   icon: 'iconfont-Editor',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     if (Object.keys(_this.editItemData).length > 0) {
        //       _this.openPerType = 'edit'
        //       _this.addPerVisible = true
        //     } else {
        //       _this.$message.warning('请选择一条记录！')
        //     }
        //   }
        // },
        {
          id: 6,
          text: '人员调动',
          icon: 'iconfont-rygl',
          click () {
            _this.depts = _this.$refs.deptList.getData()
            _this.users = _this.$refs.persList.getData()
            if (_this.users.length > 0) {
              _this.departmentId = ''
              _this.usersList = []
              _this.changeDeptVisible = true
            } else {
              _this.$message.warning('没有可以调整的人员')
            }
          }
        },
        {
          id: 3,
          text: '移除人员',
          icon: 'iconfont-Delete',
          click () {
            const selectedList = _this.$refs.persList.getSelectedKeys() || []
            if (selectedList.length > 0) {
              _this.$confirm({
                title: '提示',
                content: '确定移除人员?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.persService
                    .commonPostRequest('/user/removeUserFromDepartment', {
                      departmentId: _this.editData.id,
                      userIds: selectedList.join(',')
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        _this.$refs.persList.clearSelected()
                        _this.reloadDeptAndPers()
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
        // {
        //   id: 4,
        //   text: '上移',
        //   icon: 'iconfont-up',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     if (Object.keys(_this.editItemData).length === 0) {
        //       _this.$message.warning('请选择一条记录！')
        //       return
        //     }

        //     const pers = _this.$refs.persList.getData()
        //     const curIndex = pers.findIndex(per => {
        //       return per.id === _this.editItemData.id
        //     })
        //     if (curIndex === 0) {
        //       _this.$message.warning('不能上移')
        //     }

        //     _this.currentRow = _this.editItemData
        //     _this.changeRow = pers[curIndex - 1]
        //     _this.updateUserBh()
        //   }
        // },
        // {
        //   id: 5,
        //   text: '下移',
        //   icon: 'iconfont-down',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     if (Object.keys(_this.editItemData).length === 0) {
        //       _this.$message.warning('请选择一条记录！')
        //     }
        //     const pers = _this.$refs.persList.getData()
        //     const curIndex = pers.findIndex(per => {
        //       return per.id === _this.editItemData.id
        //     })

        //     if (curIndex === pers.length - 1) {
        //       _this.$message.warning('不能下移')
        //     }

        //     _this.currentRow = _this.editItemData
        //     _this.changeRow = pers[curIndex + 1]
        //     _this.updateUserBh()
        //   }
        // },
        // {
        //   id: 6,
        //   text: '人员调动',
        //   icon: 'iconfont-rygl',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     if (Object.keys(_this.editItemData).length > 0) {
        //       _this.depts = _this.$refs.deptList.getData()
        //       _this.changeDeptVisible = true
        //     } else {
        //       _this.$message.warning('请选择人员！')
        //     }
        //   }
        // },
        // {
        //   id: 7,
        //   text: '重置密码',
        //   icon: 'iconfont-reset',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     if (Object.keys(_this.editItemData).length > 0) {
        //       _this.$bpmSystemProServices.persService.resetPassword({
        //         userId: _this.editItemData.id
        //       }).then(res => {
        //         if (res) {
        //           _this.$message.success('重置密码成功！')
        //         } else {
        //           _this.$message.error('重置密码失败！')
        //         }
        //       })
        //     } else {
        //       _this.$message.warning('请选择人员！')
        //     }
        //   }
        // },
        // {
        //   id: 8,
        //   text: '设为部门领导',
        //   icon: 'iconfont-Editor',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     _this.editData = _this.$refs.deptList.getSelected()
        //     const userIdList = []
        //     userIdList.push(_this.editItemData.id)
        //     if (Object.keys(_this.editItemData).length > 0) {
        //       _this.$bpmSystemProServices.persService.updateBmld({
        //         userIdList: userIdList,
        //         sf: 1,
        //         departmentId: _this.editData.id
        //       }).then(res => {
        //         if (res) {
        //           _this.$message.success('设置成功！')
        //           _this.reloadDeptAndPers()
        //         } else {
        //           _this.$message.error('设置失败！')
        //         }
        //       })
        //     } else {
        //       _this.$message.warning('请选择人员！')
        //     }
        //   }
        // },
        // {
        //   id: 9,
        //   text: '撤销部门领导',
        //   icon: 'iconfont-Editor',
        //   click () {
        //     _this.editItemData = _this.$refs.persList.getSelected() || {}
        //     _this.editData = _this.$refs.deptList.getSelected()
        //     const userIdList = []
        //     userIdList.push(_this.editItemData.id)
        //     if (Object.keys(_this.editItemData).length > 0) {
        //       _this.$bpmSystemProServices.persService.updateBmld({
        //         userIdList: userIdList,
        //         sf: 0,
        //         departmentId: _this.editData.id
        //       }).then(res => {
        //         if (res) {
        //           _this.$message.success('设置成功！')
        //           _this.reloadDeptAndPers()
        //         } else {
        //           _this.$message.error('设置失败！')
        //         }
        //       })
        //     } else {
        //       _this.$message.warning('请选择人员！')
        //     }
        //   }
        // }
      ],
      persStatus: [], // 员工状态
      persPost: [], // 职务
      sf: [], // 是否
      gender: [], // 性别
      persParams: {
        status: '',
        name: ''
      },
      addDeptVisible: false, // 增加部门
      editData: {},
      openDeptType: '',
      addPerVisible: false, // 增加人员
      editItemData: {},
      openPerType: '',
      currentRow: {}, // 当前选中行
      changeRow: {}, // 交换行
      selectedRowKeys: [],
      setSsldVisible: false// 设置分管领导
    }
  },
  methods: {
    async getPersStatus () {
      const status = await this.$bpmSystemProServices.systemService.getDictByCode('YHZT')
      this.persStatus = status
    },
    async getPersPost () {
      const post = await this.$bpmSystemProServices.systemService.getDictByCode('ZW')
      this.persPost = post
    },
    async getSF () {
      const sf = await this.$bpmSystemProServices.systemService.getDictByCode('SF')
      this.sf = sf
    },
    async getGender () {
      const gender = await this.$bpmSystemProServices.systemService.getDictByCode('SEX')
      this.gender = gender
    },
    async onSearch () {
      return new Promise(async (resolve, reject) => {
        await this.$refs.deptList.getListData()
        resolve()
      })
    },
    async reloadDeptAndPers () {
      await this.onSearch()
      this.$refs.deptList.setSelectedRow(this.editData.id)
      this.reloadPers()
    },
    async reloadPers () {
      return new Promise(async (resolve, reject) => {
        this.persParams.departmentId = this.editData.id
        await this.$refs.persList.getListData()
        resolve()
      })
    },
    onDeptRowClick (record) {
      this.editData = this.$refs.deptList.getSelected()
      this.persParams.departmentId = record.id
      this.$refs.persList.getListData()
      this.$refs.persList.clearSelected()
    },
    onDeptRowDbClick (record) {
      this.editData = record
      this.openDeptType = 'edit'
      this.addDeptVisible = true
    },
    onPerRowClick (record) {
      this.editItemData = record
    },
    onPerRowDbClick (record) {
      this.editItemData = record
      this.openPerType = 'edit'
      this.addPerVisible = true
    },
    async updateUserBh () {
      await this.$bpmSystemProServices.persService.updateUserNum({
        bUserId: this.currentRow.id,
        bBh: this.changeRow.sx,
        xUserId: this.changeRow.id,
        xBh: this.currentRow.sx
      })

      await this.reloadPers()
      // 选中当前行
      this.$refs.persList.setSelectedRow(this.currentRow.id)
    },
    onPerListChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.reloadPers()
    },
    async onDeptSubmit (id) {
      await this.onSearch()
      if (id) {
        this.$refs.deptList.setSelectedRow(id)
      }
    },
    async onPerSubmit (id) {
      await this.onSearch()
      this.$refs.deptList.setSelectedRow(this.editData.id)
      await this.reloadPers()
      if (id) {
        this.$refs.persList.setSelectedRow(id)
      }
    },
    changeDept () {
      if (!this.departmentId) {
        this.$message.error('请选择要调动的部门！')
        return
      }
      if (this.usersList.length === 0) {
        this.$message.error('请选择人员')
        return
      }
      this.$bpmSystemProServices.persService
      .commonPostRequest('/user/changeDept', {
        userId: this.usersList.join(','),
        oldDepartmentId: this.persParams.departmentId,
        departmentId: this.departmentId
      })
      .then((res) => {
        if (res) {
          this.changeDeptVisible = false
          this.$message.success('操作成功')
          this.$refs.persList.clearSelected()
          this.reloadDeptAndPers()
        } else {
          this.$message.error('操作失败')
        }
      })
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
      this.$bpmSystemProServices.persService.updateDept(this.changeRow).then(res => {
        if (res) {
        } else {
          this.$message.error('更新失败')
        }
      })
      this.$bpmSystemProServices.persService.updateDept(this.currentRow).then(res => {
        if (res) {
           this.onSearch()
        } else {
          this.$message.error('更新失败')
        }
      })
    }
  },
  components: {
    splitPane,
    SystemList,
    AddPer,
    AddDept,
    SetSsld
  }
}
</script>

<style lang="less" scoped>
.pers-container {
  padding: 0;
  height: 100%;

  /deep/.splitter-pane-resizer.vertical{
    width: 12px !important;
    margin-left: -6px;
  }

  /deep/.splitter-pane.vertical.splitter-paneL,
  /deep/.splitter-pane.vertical.splitter-paneR {
    padding: 16px;
  }

  .pers-left {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
