<template>
  <div class="dict-container">
    <split-pane :min-percent="30" :default-percent="60" split="vertical">
      <template slot="paneL">
        <div class="dict-left">
          <SystemList
            ref="dictList"
            title="字典管理"
            :columns="dictColumns"
            :render="$bpmSystemProServices.systemService.getDictList"
            :params="dictParams"
            :scroll="{y:scrollY}"
            :buttons="dictButtons"
            :defaultLoad="false"
            :pagination.sync="pagination"
            @change="onDictListChange"
            @rowClick="onDictRowClick"
            @rowDbClick="onDictRowDbClick"
          >
            <template slot="search-box">
              <a-form layout="inline">
                <a-form-item label="类别">
                  <a-select
                    style="width: 120px"
                    v-model="dictParams.typeId"
                    @change="onSearch"
                  >
                    <a-select-option key="empty" :value="''">
                      全部
                    </a-select-option>
                    <a-select-option
                      v-for="category in dictCategories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-input-search
                    placeholder="请输入字典名称"
                    enter-button
                    v-model="dictParams.name"
                    @search="onSearch"
                  />
                </a-form-item>
              </a-form>
            </template>
          </SystemList>
        </div>
      </template>
      <template slot="paneR">
        <SystemList
          ref="dictItemList"
          title="字典项"
          :columns="dictItemColumns"
          :buttons="dictItemButtons"
          :render="$bpmSystemProServices.systemService.getDictItemList"
          :params="dictItemParams"
          :pagination="false"
          :defaultLoad="false"
          :showAsTree="true"
          @rowClick="onDictItemRowClick"
          @rowDbClick="onDictItemRowDbClick"
        ></SystemList>
      </template>
    </split-pane>

    <!-- 新增弹窗 -->
    <AddDict
      :visible.sync="addVisible"
      :editData.sync="editData"
      :type="openType"
      @submit="onDictSubmit"
    />

    <AddDictItem
      :visible.sync="addItemVisible"
      :editData.sync="editItemData"
      :type="openItemType"
      :allDic="allDic"
      @submit="onDictItemSubmit"
    />
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import SystemList from '@/components/SystemList/SystemList'
import AddDict from './AddDict'
import AddDictItem from './AddDictItem'

export default {
  name: 'Dict',
  created () {
    this.getCategories()
    this.getScrollY()
  },
  data () {
    const _this = this
    return {
      scrollY: null,
      dictCategories: [],
      dictParams: {
        lbmc: '',
        name: '',
        sortField: '',
        sortOrder: '',
        typeId: ''
      },
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      dictItemParams: {
        dicId: ''
      },
      allDic: [], // 目前所有的字典项
      dictColumns: [
        {
          title: '序号',
          customRender: (text, record, index) => {
            return `${index + 1}`
          },
          width: 80,
          align: 'center'
        },
        {
          title: '类别',
          dataIndex: 'typeId',
          customRender: text => {
            const category = this.dictCategories.filter(category => {
              return category.id === text
            })

            if (category.length > 0) {
              return category[0].name
            } else {
              return ''
            }
          }
        },
        {
          title: '字典代码',
          dataIndex: 'code',
          ellipsis: true,
          sorter: false
        },
        {
          title: '字典名称',
          dataIndex: 'name',
          ellipsis: true,
          sorter: false
        }
      ],
      dictButtons: [
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
            _this.editData = _this.$refs.dictList.getSelected()
            if (_this.editData) {
              _this.openType = 'edit'
              _this.addVisible = true
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
            _this.editData = _this.$refs.dictList.getSelected()
            if (_this.editData) {
              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.systemService
                    .deleteDict({
                      id: _this.editData.id
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        // 删除成功后清除选中数据
                        _this.$refs.dictList.clearSelected()

                        _this.onSearch()
                        _this.reloadDictItem()
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
      dictItemColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          ellipsis: true,
          align: 'left',
          width: 200
        },
        {
          title: '代码',
          dataIndex: 'code',
          align: 'center',
          width: 100
        },
        {
          title: '顺序',
          dataIndex: 'sort',
          align: 'center',
          width: 80
        }
      ],
      dictItemButtons: [
        {
          id: 1,
          text: '新增',
          icon: 'iconfont-New',
          click () {
            _this.editData = _this.$refs.dictList.getSelected()
            _this.editItemData = _this.$refs.dictItemList.getSelected()
            if (_this.editData) {
              _this.editItemData = {
                pid: _this.editItemData ? (_this.editItemData.id || '') : '',
                dicId: _this.editData.id
              }
              _this.allDic = _this.$refs.dictItemList.getData()
              _this.openItemType = ''
              _this.addItemVisible = true
            } else {
              _this.$message.warning('请选择一个字典！')
            }
          }
        },
        {
          id: 2,
          text: '编辑',
          icon: 'iconfont-Editor',
          click () {
            _this.editItemData = _this.$refs.dictItemList.getSelected()
            if (_this.editItemData) {
              _this.openItemType = 'edit'
              _this.allDic = _this.$refs.dictItemList.getData()
              _this.addItemVisible = true
            } else {
              _this.$message.warning('请选择一个字典项！')
            }
          }
        },
        {
          id: 3,
          text: '删除',
          icon: 'iconfont-Delete',
          click () {
            _this.editItemData = _this.$refs.dictItemList.getSelected()
            if (_this.editItemData) {
              _this.$confirm({
                title: '提示',
                content: '确定删除记录?',
                okText: '确认',
                cancelText: '取消',
                onOk () {
                  _this.$bpmSystemProServices.systemService
                    .deleteDictItem({
                      id: _this.editItemData.id
                    })
                    .then(() => {
                      // 删除成功后清除选中数据
                      _this.$refs.dictItemList.clearSelected()
                      _this.reloadDictItem()
                    })
                },
                onCancel () {}
              })
            } else {
              _this.$message.warning('请选择一个字典项')
            }
          }
        },
        {
          id: 4,
          text: '刷新',
          icon: 'iconfont-Refresh',
          click () {
            _this.reloadDictItem()
          }
        }
      ],
      openType: '', // 打开类型  "edit"编辑 默认新增
      addVisible: false, // 增加字典
      editData: {},
      openItemType: '', // 打开类型  "edit"编辑 默认新增
      addItemVisible: false, // 增加字典项,
      editItemData: {}
    }
  },
  methods: {
    getScrollY () {
      this.$nextTick(() => {
        const listHeight = this.$refs.dictList.$el.querySelector('.ant-table-wrapper')
        this.scrollY = listHeight.offsetHeight - 115
      })
    },
    async getCategories () {
      const categories = await this.$bpmSystemProServices.systemService.getCategoriesList()
      this.dictCategories = categories
      const ggzd = this.dictCategories.filter(item => item.name === '业务字典')
      if (ggzd.length > 0) {
        this.dictParams.typeId = ggzd[0].id
      }
      this.onSearch()
    },
    onSearch () {
      this.$refs.dictList.getListData()
    },
    reloadDictItem () {
      this.dictItemParams.dicId = this.editData.id
      this.onSearch()
    },
    onDictListChange (pagination, filters, sorter, { currentDataSource }) {
      this.pagination.pageIndex = pagination.current
      this.dictParams.sortField = sorter.field
      this.dictParams.sortOrder = sorter.order
      this.onSearch()
    },
    onDictRowClick (record) {
      this.editData = this.$refs.dictList.getSelected()
      this.dictItemParams.dicId = record.id
      this.$refs.dictItemList.getListData()

      // 清空DictItemList选中
      this.$refs.dictItemList.clearSelected()
    },
    onDictRowDbClick (record) {
      this.editData = record
      this.openType = 'edit'
      this.addVisible = true
    },
    onDictItemRowClick (record) {
      this.editItemData = this.$refs.dictItemList.getSelected()
    },
    onDictItemRowDbClick (record) {
      this.editItemData = record
      this.openType = 'edit'
      this.addItemVisible = true
    },
    async onDictSubmit (id) {
      await this.onSearch()
      if (id) {
        this.$refs.dictList.setSelectedRow(id)
      }
    },
    async onDictItemSubmit (id) {
      await this.reloadDictItem()
      if (id) {
        this.$refs.dictItemList.setSelectedRow(id)
      }
    }
  },
  components: {
    splitPane,
    SystemList,
    AddDict,
    AddDictItem
  }
}
</script>

<style lang="less" scoped>
.dict-container {
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

  .dict-left {
    height: 100%;
    display: flex;
    flex-direction: column;

    form:not(.ant-form-vertical) :not(.ant-input-group-wrapper) > .ant-input-group, form:not(.ant-form-vertical) .ant-input-group-wrapper{
      top: -3px;
    }
  }
}
</style>
