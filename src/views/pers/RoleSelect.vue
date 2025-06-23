<template>
  <a-modal
    title="选择分管领导"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    width="800px"
  >
    <SystemList
      ref="leaderList"
      :columns="leaderColumns"
      :render="$bpmSystemProServices.persService.getRolesList"
      :params="leaderParams"
      :pagination.sync="pagination"
      type="radio"
      @change="onLeaerChange"
    >
    </SystemList>
  </a-modal>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'

export default {
  name: 'RoleList',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    roleId: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      leaderParams: {
        roleId: this.roleId
      },
      leaderColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${index + 1}`
          },
          width: '10%',
          align: 'center'
        },
        {
          title: '部门名称',
          dataIndex: 'dename',
          width: '50%',
          sorter: true
        },
        {
          title: '账号',
          dataIndex: 'loginName',
          width: '20%',
          align: 'center',
          sorter: true
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '20%',
          align: 'center',
          sorter: true
        }
      ],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    onSearch () {
      this.$refs.leaderList.getListData()
    },
    onLeaerChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.leaderParams.sortField = sorter.field
      this.leaderParams.sortOrder = sorter.order
      this.onSearch()
    },
    handleOk () {
      this.$emit('update:visible', false)
      this.$emit('submit', this.selectedRows)
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  },
  components: {
    SystemList
  }
}
</script>
