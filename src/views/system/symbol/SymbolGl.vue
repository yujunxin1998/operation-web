<template>
  <div class="dict-container">
    <split-pane :min-percent="26" :default-percent="26" split="vertical">
      <template slot="paneL">
        <div class="symbol-left">
          <a-row
            :gutter="24"
            type="flex"
            justify="space-between"
            align="middle"
            class="table-title">
            <a-col :span="10">
              <span class="table-title-text">文号分类</span>
            </a-col>
          </a-row>
          <a-row type="flex" justify="space-between" align="middle" style="padding: 0 16px;">
            <a-col
              flex="auto"
              class="btns"
            >
              <a-button
                :type="btn.type || 'default'"
                v-for="(btn, index) in symbolButtons"
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
          <a-row style="flex: 1; overflow: auto; padding: 0 6px;">
            <a-col>
              <a-tree
                v-model="selectedKeys"
                :tree-data="treeData"
                :showIcon="true"
                :defaultExpandAll="true"
                :replaceFields="replaceFields"
                @select="onTreeNodeSelect"
                class="ant-tree-custom"
              >
                <icon-font slot="switcherIcon" type="iconfont-arrow-down" style="font-size: 16px;"></icon-font>
                <template slot="custom">
                  <icon-font type="iconfont-wjj"></icon-font>
                </template>
              </a-tree>
            </a-col>
          </a-row>
        </div>
      </template>
      <template slot="paneR">
        <SystemList
          ref="symbolItemList"
          title="文号列表"
          :columns="symbolItemColumns"
          :buttons="symbolItemButtons"
          :params="symbolItemParams"
          :render="$bpmSystemProServices.systemService.symbolItemList"
          :defaultLoad="false"
          :pagination="false"
          :scroll="{y:scrollY}"
          @rowClick="onSymbolItemRowClick"
          @rowDbClick="onSymbolItemRowDbClick"
        >
          <template slot="search-box">
            <a-form layout="inline">
              <a-form-item>
                <a-input-search
                  placeholder="请输入文号名称"
                  enter-button
                  allowClear
                  v-model="symbolItemParams.numericdefineName"
                  @search="treeSearch"
                />
              </a-form-item>
            </a-form>
          </template>
        </SystemList>
      </template>
    </split-pane>
    <!-- 新增文号分类 -->
    <AddSymbol
      ref="AddSymbol"
      :visible.sync="addVisible"
      :editData.sync="editData"
      :type="openType"
      @submit="onSymbolSubmit"
    />
    <AddSymbolItem
      ref="AddSymbolItem"
      :visible.sync="addItemVisible"
      :editData.sync="editItemData"
      :type="openSymbolItemType"
      @submit="onSymbolItemSubmit"
    />
  </div>
</template>
<script>
  import splitPane from 'vue-splitpane'
  import SystemList from '@/components/SystemList/SystemList'
  import AddSymbol from './AddSymbol'
  import AddSymbolItem from './AddSymbolItem'
  import { deepTree } from '@/utils/util'

  export default {
    name: 'SymbolGl',
    mounted () {
      this.onSearch()
    },
    data () {
      const _this = this
      return {
        scrollY: null,
        symbolColumns: [

        ],
        symbolButtons: [
          {
            id: 1,
            text: '增加分类',
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
              if (_this.selectedNode && Object.keys(_this.selectedNode).length > 0) {
                _this.editData = _this.selectedNode
                _this.openType = 'edit'
                _this.addVisible = true
              } else {
                _this.$message.warning('请选择要编辑的文号分类')
              }
            }
          },
          {
            id: 3,
            text: '删除',
            icon: 'iconfont-Delete',
            click () {
              if (_this.selectedKeys.length > 0) {
                _this.$confirm({
                  title: '提示',
                  content: '确定删除记录?',
                  okText: '确认',
                  cancelText: '取消',
                  onOk () {
                    _this.$bpmSystemProServices.systemService.delSymbolList({
                      id: _this.selectedKeys[0]
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        _this.onSearch()
                        _this.selectedKeys = []
                        _this.selectedNode = {}
                      } else {
                        _this.$message.error('删除失败')
                      }
                    })
                  },
                  onCancel () {}
                })
              } else {
                _this.$message.warning('请选择要删除的文号分类')
              }
            }
          }
        ],
        symbolItemButtons: [
          {
            id: 1,
            text: '增加文号',
            icon: 'iconfont-New',
            click () {
              if (_this.selectedKeys.length > 0) {
                _this.openSymbolItemType = ''
                _this.editItemData = {}
                _this.editItemData.referenceNumericId = _this.selectedKeys[0]
                _this.addItemVisible = true
              } else {
                _this.$message.warning('请选择文号分类')
              }
            }
          },
          {
            id: 2,
            text: '编辑',
            icon: 'iconfont-Editor',
            click () {
              _this.editItemData = _this.$refs.symbolItemList.getSelected()
              if (_this.editItemData) {
                _this.openSymbolItemType = 'edit'
                _this.addItemVisible = true
              } else {
                _this.$message.warning('请选择要编辑的文号')
              }
            }
          },
          {
            id: 3,
            text: '删除',
            icon: 'iconfont-Delete',
            click () {
              _this.editItemData = _this.$refs.symbolItemList.getSelected()
              if (_this.editItemData) {
                _this.$confirm({
                  title: '提示',
                  content: '确定删除记录?',
                  okText: '确认',
                  cancelText: '取消',
                  onOk () {
                    _this.$bpmSystemProServices.systemService.delSymbol({
                      id: _this.editItemData.id
                    })
                    .then((res) => {
                      if (res) {
                        _this.$message.success('删除成功')
                        _this.$refs.symbolItemList.clearSelected()
                        _this.onSearch()
                        _this.reloadSymbolItemList()
                      } else {
                        _this.$message.error('删除失败')
                      }
                    })
                  },
                  onCancel () {}
                })
              } else {

              }
            }
          }
        ],
        symbolItemColumns: [
          {
            title: '文号名称',
            dataIndex: 'numericdefineName',
            width: '260px',
            ellipsis: true
          },
          {
            title: '文号标识',
            dataIndex: 'flagName',
            width: '300px',
            ellipsis: true
          },
          {
            title: '文号格式',
            dataIndex: 'numericCode',
            ellipsis: true
          }
        ],
        symbolItemParams: {
          referenceNumberId: '',
          numericdefineName: ''
        },
        treeData: [],
        replaceFields: {
          title: 'numberName',
          key: 'id'
        },
        selectedKeys: [], // 文号分类选择
        editData: {},
        editItemData: {},
        openType: '', // 新建or编辑文号分类
        openSymbolItemType: '', // 新建or编辑文号
        addVisible: false, // 增加文号分类
        addItemVisible: false, // 增加文号
        selectedNode: {} // 选中树节点
      }
    },
    created () {
      this.getScrollY()
    },
    methods: {
      getScrollY () {
        this.$nextTick(() => {
          const listHeight = this.$refs.symbolItemList.$el.querySelector('.ant-table-wrapper')
          this.scrollY = listHeight.offsetHeight - 50
        })
      },
      async onSearch () {
        return new Promise(async (resolve, reject) => {
          this.$bpmSystemProServices.systemService
            .getSymbolList({})
            .then(res => {
              res.map(node => {
                node.scopedSlots = { icon: 'custom' }
              })

              const firstLevel = res.filter(item => {
                return !item.pid || item.pid === ''
              })

              deepTree(firstLevel, res)
              this.treeData = firstLevel

              resolve()
            })
        })
      },
      onTreeNodeSelect (selectedKeys, { selected, selectedNodes, node, event }) {
        this.selectedKeys = selectedKeys
        this.symbolItemParams.numericdefineName = ''
        this.getSelectedNode(this.treeData, this.selectedKeys[0])

        this.editItemData = {} // 清空选中数据

        this.reloadSymbolItemList()
        this.$refs.symbolItemList.clearSelected()
      },
      treeSearch () {
        this.reloadSymbolItemList()
        this.$refs.symbolItemList.clearSelected()
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
      async reloadSymbolItemList () {
        this.symbolItemParams.referenceNumberId = (this.selectedKeys[0]) ? this.selectedKeys[0] : ''
        return new Promise(async (resolve, reject) => {
          await this.$refs.symbolItemList.getListData()

          resolve()
        })
      },
      onSymbolItemRowClick (record) {
        this.editItemData = record
      },
      onSymbolItemRowDbClick (record) {
        this.editItemData = record
        this.openSymbolItemType = 'edit'
        this.addItemVisible = true
      },
      async onSymbolSubmit (id) {
        await this.onSearch()
        if (id) {
          this.selectedKeys = [id]
          this.getSelectedNode(this.treeData, id)
        }
      },
      async onSymbolItemSubmit (id) {
        await this.reloadSymbolItemList()
        if (id) {
          this.$refs.symbolItemList.setSelectedRow(id)
        }
      }
    },
    components: {
      splitPane,
      SystemList,
      AddSymbol,
      AddSymbolItem
    }
  }
</script>

<style lang="less" scoped>
.dict-container {
  padding: 0;
  height: 100%;

  & .btns{
    text-align: left;
    padding-bottom: 8px;
  }

  /deep/.splitter-pane-resizer.vertical{
    width: 12px !important;
    margin-left: -6px;
  }

  /deep/.splitter-pane.vertical.splitter-paneL,
  /deep/.splitter-pane.vertical.splitter-paneR {
    padding: 16px;
  }

  /deep/.splitter-pane.vertical.splitter-paneL{
    padding: 0;
  }
}

.symbol-left {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-title{
  color: #333;
  font-size: 18px;
  font-weight: bold;
  padding: 16px;
  padding-bottom: 18px;
  position: relative;

  .table-title-text{
    padding-left: 0;
  }

  .table-title-text::before{
    position: absolute;
    content: "";
    width: 4px;
    height: 18px;
    // background-size: contain;
    // background-image: url(../../../assets/images/title.png);
    // background-repeat: no-repeat;
    // background-position: center center;
    top: 5px;
    left: -4px;
    border-radius: 4px;
    background: #4778C7;
  }
}
</style>
