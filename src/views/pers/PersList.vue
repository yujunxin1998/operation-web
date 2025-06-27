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
      :render="$bpmSystemProServices.persService.selectPersList"
      :params="persParams"
      :searchItems="searchItems"
      :pagination.sync="pagination"
      type="checkbox"
      :defaultLoad="true"
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
    roleId: {
      type: String,
      required: true
    }
  },
  mounted () {},
  data () {
    return {
      persParams: {
        roleId: this.roleId,
        username: '',
        name: ''
      },
      persColumns: [
        {
          title: '序号',
          width: '15%',
          align: 'center',
          customRender: (text, record, index) => {
            return `${index + 1}`
          }
        },
        {
          title: '部门名称',
          dataIndex: 'depname',
          width: '30%',
          align: 'center',
          ellipsis: true,
          sorter: false
        },
        {
          title: '帐号',
          dataIndex: 'loginName',
          width: '20%',
          align: 'center',
          sorter: false
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '20%',
          align: 'center',
          sorter: false
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '15%',
          ellipsis: true
        }
      ],
      searchItems: [
        {
          id: 'username',
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
      selectedRowKeys: []
    }
  },
  methods: {
    onPersChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.persParams.sortField = sorter.field
      this.persParams.sortOrder = sorter.order
      this.$refs.persList.getListData()
    },
    handleOk () {
      const ids = this.$refs.persList.getSelectedKeys()
      this.$bpmSystemProServices.persService.addUserToRole({
        userIds: ids.join(','),
        roleId: this.roleId
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
    roleId (val) {
      this.persParams.roleId = val
    },
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
