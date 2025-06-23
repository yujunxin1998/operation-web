<template>
  <div class="counter-container">
    <SystemList
      ref="counterList"
      title="计数器管理"
      rowKey="counterNumeric"
      :columns="counterColumns"
      :render="$bpmSystemProServices.systemService.getCounterList"
      :params="counterParams"
      :pagination.sync="pagination"
      :buttons="counterButtons"
      type="checkbox"
      :scroll="{y:scrollY}"
      @change="onCounterListChange"
      @rowClick="onRowClick"
      @rowDbClick="onRowDbclick"
    >
      <template slot="search-box">
        <a-form layout="inline">
          <a-form-item>
            <a-input-search
              placeholder="请输入计数器名称"
              enter-button
              allowClear
              v-model="counterParams.counterName"
              @search="onSearch"
            />
          </a-form-item>
        </a-form>
      </template>
    </SystemList>
    <AddCounter
      :visible.sync="addVisible"
      :editData.sync="editData"
      :type="openType"
      @submit="onCounterSubmit"
    />
  </div>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'
import AddCounter from './AddCounter'

export default {
  name: 'Counter',
  created () {
    this.getResetStrategies()
    this.getScrollY()
  },
  data () {
    const _this = this
    return {
      scrollY: null,
      addVisible: false,
      editData: {},
      openType: '',
      counterParams: {
        counterName: ''
      },
      selectedRows: [],
      selectedRowKeys: [],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      counterColumns: [
        {
          title: '计数器名称',
          dataIndex: 'counterName',
          ellipsis: true,
          width: '220px'
        },
        {
          title: '初始值',
          dataIndex: 'initialValue',
          align: 'center',
          width: '120px'
        },
        {
          title: '当前值',
          dataIndex: 'currentValue',
          align: 'center',
          width: '120px'
        },
        {
          title: '步长',
          dataIndex: 'stepLength',
          align: 'center',
          width: '120px'
        },
        {
          title: '清零规则',
          dataIndex: 'resetStrategy',
          align: 'center',
          ellipsis: true,
          customRender: text => {
            const curStratey = this.resetStrategies.filter(stratey => {
              return stratey.code === text
            })
            if (curStratey.length > 0) {
              return curStratey[0].name
            } else {
              return ''
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'currenttime',
          align: 'center',
          ellipsis: true,
          width: '220px'
        },
        {
          title: '备注',
          dataIndex: 'description',
          ellipsis: true
        }
      ],
      counterButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            _this.editData = {}
            _this.openType = ''
            _this.addVisible = true
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            const rows = _this.$refs.counterList.getSelecteds()
            if (rows && rows.length > 1) {
              _this.$message.warning('请选择一条数据')
              return
            }
            _this.editData = _this.$refs.counterList.getSelected()
            if (_this.editData) {
              _this.openType = 'edit'
              _this.addVisible = true
            } else {
              _this.$message.warning('请选择要编辑的计数器')
            }
          }
        },
        {
          id: 3,
          text: '删除',
          icon: 'iconfont-Delete',
          click () {
            const ids = _this.$refs.counterList.getSelectedKeys()
            if (ids && ids.length > 0) {
              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.systemService
                  .deleteCounter({
                    ids: ids.join(',')
                  }).then((res) => {
                    if (res) {
                      _this.$message.success('删除成功')
                      _this.$refs.counterList.clearSelected()
                      _this.onSearch()
                    } else {
                      _this.$message.error('删除失败')
                    }
                  })
                },
                onCancel () {}
              })
            } else {
              _this.$message.warning('请选择要删除的计数器')
            }
          }
        }
      ]
    }
  },
  methods: {
    getScrollY () {
      this.$nextTick(() => {
        const listHeight = this.$refs.counterList.$el.querySelector('.ant-table-wrapper')
        this.scrollY = listHeight.offsetHeight - 115
      })
    },
    async getResetStrategies () {
      const resetStrategies = await this.$bpmSystemProServices.systemService.getDictByCode(
        'QLGZ'
      )
      this.resetStrategies = resetStrategies
    },
    onCounterListChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.onSearch()
    },
    async onSearch () {
      return new Promise(async (resolve, reject) => {
        await this.$refs.counterList.getListData()
        resolve()
      })
    },
    onRowClick (record) {
      this.editData = record
    },
    onRowDbclick (record) {
      this.editData = record
      this.openType = 'edit'
      this.addVisible = true
    },
    async onCounterSubmit (id) {
      await this.onSearch()
      if (id) {
        this.$refs.counterList.setSelectedRow(id)
      }
    }
  },
  components: {
    SystemList,
    AddCounter
  }
}
</script>

<style lang="less" scoped>
.counter-container {
  padding: 16px;
  height: 100%;
}
</style>
