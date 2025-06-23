<template>
  <a-modal
    title="选择人员"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
    centered
  >
    <SystemList
      ref="persList"
      :columns="persColumns"
      :render="$bpmSystemProServices.persService.getNotExistsDepartmentIdPage"
      :params="{
        departmentId: editData.departmentId
      }"
      :searchItems="searchItems"
      :pagination.sync="pagination"
      type="checkbox"
      :defaultLoad="false"
      @change="onPersChange"
    >
    </SystemList>
  </a-modal>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'

export default {
  name: 'Categories',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    editData: {
      type: Object,
      required: true
    }
  },
  mounted () {},
  data () {
    return {
      persColumns: [
        {
          title: '序号',
          width: '15%',
          align: 'center',
          customRender: (text, record, index) => {
            return `${index + 1}`
          }
        },
        // {
        //   title: '部门名称',
        //   dataIndex: 'depname',
        //   width: '30%',
        //   align: 'center',
        //   ellipsis: true,
        //   sorter: false
        // },
        {
          title: '账号名',
          dataIndex: 'loginName',
          width: '30%',
          align: 'center',
          sorter: false
        },
        {
          title: '真实姓名',
          dataIndex: 'name',
          width: '25%',
          align: 'center',
          sorter: false
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          align: 'center',
          width: '30%',
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
        }
      ],
      searchItems: [
        {
          id: 'loginName',
          label: '账号',
          type: 'input'
        },
        {
          id: 'name',
          label: '姓名',
          type: 'input'
        }
      ],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      selectedRows: [],
      selectedRowKeys: [],
      persStatus: []
    }
  },
  created () {
    this.getPersStatus()
  },
  methods: {
    async getPersStatus () {
      const status = await this.$bpmSystemProServices.systemService.getDictByCode('YHZT')
      this.persStatus = status
    },
    onPersChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.persParams.sortField = sorter.field
      this.persParams.sortOrder = sorter.order
      this.$refs.persList.getListData()
    },
    handleOk () {
      const ids = this.$refs.persList.getSelectedKeys()
      this.$bpmSystemProServices.persService.commonPostRequest('/user/addUserToDepartment', {
        userIds: ids.join(','),
        departmentId: this.editData.departmentId
      }).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.$emit('update:visible', false)
          this.$emit('submit')
        } else {
          this.$message.error('保存失败')
        }
        this.$refs.persList.clearSelected()
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
      this.$refs.persList.clearSelected()
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.persList.getListData()
        })
      } else {
        this.selectedRowKeys = []
        this.selectedRows = []
      }
    }
  },
  components: {
    SystemList
  }
}
</script>
