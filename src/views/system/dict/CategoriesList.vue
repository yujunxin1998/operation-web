<template>
  <a-modal
    title="类别管理"
    :visible.sync="visible"
    @cancel="handleCancel"
    centered
    width="700px"
    :footer="null"
  >
    <SystemList
      ref="categoriesList"
      :columns="categoryColumns"
      :render="$bpmSystemProServices.systemService.getCategoriesList"
      :params="categoryParams"
      :buttons="categoryButtons"
      :operations="operations"
    >
      <template slot="search-box">
        <a-form layout="inline">
          <a-form-item>
            <a-input-search
              placeholder="请输入类别名称"
              enter-button
              v-model="categoryParams.name"
              @search="onSearch"
            />
          </a-form-item>
        </a-form>
      </template>
    </SystemList>

    <AddCategory
      :visible.sync="addVisible"
      :editData.sync="editData"
      :type="openType"
      @submit="onCategorySubmit"
    />
  </a-modal>
</template>

<script>
import SystemList from '@/components/SystemList/SystemList'
import AddCategory from './AddCategory'

export default {
  name: 'Categories',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    const _this = this
    return {
      categoryParams: {
        name: ''
      },
      categoryColumns: [
        {
          title: '类别名称',
          dataIndex: 'name',
          width: '60%',
          editable: true
        },
        {
          title: '排序号',
          dataIndex: 'sortNum',
          width: '20%',
          align: 'center',
          editable: true
        },
        {
          title: '操作',
          key: 'action',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      categoryButtons: [
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
            _this.editData = _this.$refs.categoriesList.getSelected()
            if (_this.editData) {
              _this.openType = 'edit'
              _this.addVisible = true
            } else {
              _this.$message.warning('请选择一条记录！')
            }
          }
        }
      ],
      operations: [
        {
          name: '删除',
          click (record, rowIndex) {
            _this.$confirm({
              title: '提示',
              content: '确定删除记录?',
              okText: '确认',
              cancelText: '取消',
              onOk () {
                _this.$bpmSystemProServices.systemService
                  .deleteCategory({
                    id: record.id
                  })
                  .then((res) => {
                    if (res) {
                      _this.$message.success('删除成功')
                      // 删除成功后清除选中数据
                      _this.$refs.categoriesList.clearSelected()

                      _this.onSearch()
                    } else {
                      _this.$message.error('删除失败')
                    }
                  })
              },
              onCancel () {}
            })
          }
        }
      ],
      openType: '', // 打开类型  "edit"编辑 默认新增
      addVisible: false, // 增加字典类别
      editData: {}
    }
  },
  methods: {
    async onSearch () {
      return new Promise(async (resolve, reject) => {
        await this.$refs.categoriesList.getListData()
        resolve()
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    },
    async onCategorySubmit (id) {
      await this.onSearch()
      if (id) {
        this.$refs.categoriesList.setSelectedRow(id)
      }
    }
  },
  components: {
    SystemList,
    AddCategory
  }
}
</script>
