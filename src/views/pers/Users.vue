<template>
  <div class="pers-container">
    <SystemList
      ref="persList"
      title="用户管理"
      :columns="persColumns"
      :buttons="persButtons"
      :render="$bpmSystemProServices.persService.getAllUser"
      :params="persParams"
      :pagination="false"
      @change="onPerListChange"
      type="radio"
      @rowClick="onPerRowClick"
      @rowDbClick="onPerRowDbClick"
    >
      <template slot="search-box-title">
        <a-form layout="inline" :model="persParams">
          <a-form-item label="用户状态">
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
          <a-form-item label="账号名">
            <a-input-search
              style="width: 200px"
              placeholder="请输入账号名"
              enter-button
              :allowClear="true"
              v-model="persParams.loginName"
              @search="reloadPers"
            />
          </a-form-item>
          <a-form-item label="真实姓名">
            <a-input-search
              style="width: 200px"
              placeholder="请输入真实姓名"
              enter-button
              :allowClear="true"
              v-model="persParams.name"
              @search="reloadPers"
            />
          </a-form-item>
        </a-form>
      </template>
    </SystemList>
    <AddPer
      :visible.sync="addPerVisible"
      :editData.sync="editItemData"
      :type="openPerType"
      @submit="onPerSubmit"
    />
  </div>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'
import AddPer from './AddPer'
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
      departmentId: '',
      changeDeptVisible: false,
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
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
          title: '性别',
          dataIndex: 'sex',
          width: 80,
          align: 'center',
          customRender: text => {
            const curGender = this.gender.filter(genderItem => {
              return genderItem.code === text
            })
            if (curGender.length > 0) {
              return curGender[0].name
            } else {
              return ''
            }
          }
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          align: 'center',
          width: 80,
          customRender: text => {
            const curStatus = _this.persStatus.filter(status => {
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
        {
          title: '出生日期',
          dataIndex: 'bornDate',
          align: 'center',
          width: 140
        },
        {
          title: '移动电话',
          dataIndex: 'phone',
          align: 'center',
          width: 140
        },
        {
          title: '电子邮箱',
          dataIndex: 'email',
          align: 'center',
          width: 140
        },
        {
           title: '创建时间',
           dataIndex: 'createTime',
           width: 180
        }
      ],
      persButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            // _this.editData = _this.$refs.deptList.getSelected()
            if (_this.editData) {
              _this.editItemData = {
                departmentId: '',
                sx: (Number(_this.editData.usernum) + 1)
              }
              _this.openPerType = ''
              _this.addPerVisible = true
            } else {
              _this.$message.warning('请选择部门！')
            }
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            _this.editItemData = _this.$refs.persList.getSelected() || {}
            if (Object.keys(_this.editItemData).length > 0) {
              _this.openPerType = 'edit'
              _this.addPerVisible = true
            } else {
              _this.$message.warning('请选择一条记录！')
            }
          }
        },
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
        {
          id: 3,
          text: '删除',
          icon: 'iconfont-Delete',
          click () {
            _this.editItemData = _this.$refs.persList.getSelected() || {}
            if (Object.keys(_this.editItemData).length > 0) {
              _this.$confirm({
                title: '提示',
                content: '确定移除人员?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.persService
                    .deletePers({
                      ids: _this.editItemData.id
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
        },
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
        {
          id: 7,
          text: '重置密码',
          icon: 'iconfont-reset',
          click () {
            _this.editItemData = _this.$refs.persList.getSelected() || {}
            if (Object.keys(_this.editItemData).length > 0) {
              _this.$bpmSystemProServices.persService.resetPassword({
                userId: _this.editItemData.id
              }).then(res => {
                if (res) {
                  _this.$message.success('重置密码成功！')
                } else {
                  _this.$message.error('重置密码失败！')
                }
              })
            } else {
              _this.$message.warning('请选择人员！')
            }
          }
        }
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
        //           _this.reloadPers()
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
        //           _this.reloadPers()
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
        name: '',
        loginName: ''
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
    reloadPers () {
      this.$refs.persList.getListData()
    },
    onPerRowClick (record) {
      this.editItemData = record
    },
    onPerRowDbClick (record) {
      this.editItemData = record
      this.openPerType = 'edit'
      this.addPerVisible = true
    },
    onPerListChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.reloadPers()
    },
    onPerSubmit () {
      this.reloadPers()
    }
  },
  components: {
    SystemList,
    AddPer
  }
}
</script>

<style lang="less" scoped>
.pers-container {
  padding: 16px;
  height: 100%;
}
</style>
