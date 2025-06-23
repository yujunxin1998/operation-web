<template>
  <div class="wrapper" ref="wrapper">
    <!-- 表格标题行 -->
    <a-row v-if="title" type="flex" justify="space-between" align="middle" class="table-title">
      <a-col flex="auto" style="text-align: left;">
        <span v-text="title" class="table-title-text"></span>
      </a-col>
      <a-col flex="auto" class="search-box-title">
        <slot name="search-box-title"></slot>
      </a-col>
    </a-row>
    <a-row>
      <a-col style="margin-bottom: 2px;">
        <slot name="description"></slot>
      </a-col>
    </a-row>
    <!-- 查询条件 -->
    <a-row ref="searchRow" v-if="searchItems.length > 0">
      <a-col>
        <div id="components-form-demo-advanced-search">
          <a-form class="ant-advanced-search-form" :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-row :gutter="24">
              <a-col
                v-for="(searchItem, index) in searchItems"
                :key="index"
                :span="searchItems.length === 4 ? 5 : 6"
                :style="{ display: index < count ? 'block' : 'none' }">
                <a-form-item :label="searchItem.label">
                  <!-- input类型 -->
                  <a-input
                    v-if="searchItem.type === 'input'"
                    v-decorator="[
                      `${searchItem.id}`,
                      {
                        initialValue: searchItem.initialValue
                      }
                    ]"
                    :placeholder="searchItem.placeholder"
                    allowClear />
                  <!-- select类型 -->
                  <a-select
                    v-if="searchItem.type === 'select'"
                    v-decorator="[
                      `${searchItem.id}`,
                      {
                        initialValue: searchItem.initialValue
                      }
                    ]"
                    :placeholder="searchItem.placeholder"
                    allowClear
                    style="width: 100%;">
                    <a-select-option
                      v-for="(opt, idx) in searchItem.options"
                      :key="idx"
                      :value="opt[searchItem.valueProp] || opt.code">
                      {{ opt[searchItem.labelProp] || opt.name }}
                    </a-select-option>
                  </a-select>
                  <!-- 日期类型 -->
                  <a-date-picker
                    v-if="searchItem.type === 'datePicker'"
                    v-decorator="[
                      `${searchItem.id}`,
                      {
                        initialValue: searchItem.initialValue
                      }
                    ]"
                    :placeholder="searchItem.placeholder" />
                  <a-range-picker
                    v-if="searchItem.type === 'rangePicker'"
                    v-decorator="[
                      `${searchItem.id}`,
                      {
                        initialValue: searchItem.initialValue
                      }
                    ]"
                    :placeholder="searchItem.placeholder" />
                  <!-- 树选择器类型 -->
                  <a-tree-select
                    v-if="searchItem.type === 'treeSelect'"
                    v-decorator="[
                      `${searchItem.id}`,
                      {
                        initialValue: searchItem.initialValue
                      }
                    ]"
                    :placeholder="searchItem.placeholder"
                    :tree-data="searchItem.options"
                    :replaceFields="searchItem.replaceFields">
                  </a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :span="searchItems.length === 4 ? 4 : 6" v-if="searchItems.length <= 4">
                <a-form-item :wrapper-col="{ span: 24 }">
                  <a-button type="primary" @click="handleSearch">
                    查询
                  </a-button>
                  <a-button :style="{ marginLeft: '8px', marginRight: '8px' }" @click="handleReset">
                    重置
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="searchItems.length > 4" style="margin-bottom: 12px;">
              <a-col :span="24" :style="{ textAlign: 'right' }">
                <a-button type="primary" @click="handleSearch">
                  查询
                </a-button>
                <a-button :style="{ marginLeft: '8px', marginRight: '8px' }" @click="handleReset">
                  重置
                </a-button>
                <a :style="{ fontSize: '12px' }" @click="expand = !expand">
                  <span> {{ expand ? "收缩" : "展开" }} </span>
                  <a-icon :type="expand ? 'up' : 'down'" />
                </a>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-col>
    </a-row>
    <!-- 展示信息 -->
    <a-row type="flex" justify="space-between" align="middle">
      <a-col flex="auto" style="text-align: left;">
        <slot name="info"></slot>
      </a-col>
      <a-col flex="auto" style="text-align: right; padding-left: 12px;">
        <slot name="info-search-box"></slot>
      </a-col>
    </a-row>
    <!-- 操作按钮、提示信息、简单查询条件 -->
    <a-row
      class="table-toolbar"
      ref="btnRow"
      v-if="buttons.length > 0"
      type="flex"
      justify="space-between"
      align="middle">
      <a-col flex="auto" class="btns" style="text-align: left;">
        <slot name="buttons">
          <a-button
            :type="btn.type || 'default'"
            v-for="(btn, index) in buttons"
            :key="btn.id || index"
            @click="(e) => {
              btn.click && btn.click(e);
            }
            ">
            <icon-font v-if="btn.icon" :type="btn.icon"></icon-font>
            {{ btn.text }}
          </a-button>
        </slot>
      </a-col>
      <a-col flex="auto" style="text-align: right;">
        <slot name="tips"></slot>
        <slot name="search-box"></slot>
      </a-col>
    </a-row>
    <!-- 表格行 -->
    <a-row ref="tableRow" style="flex: 1;overflow: auto;">
      <a-col style="height: 100%;">
        <a-table
          style="height: 100%;"
          :indentSize="indentSize"
          :columns="columns"
          :data-source="listData"
          :rowKey="rowKey"
          :pagination="pagination"
          :loading="loading"
          :row-selection="rowSelection"
          :rowClassName="getRowClass"
          :defaultExpandAllRows="defaultExpandAllRows"
          :expandIconColumnIndex="expandIconColumnIndex"
          :scroll="scroll"
          :customHeaderRow="column => {
            return antUtil.setHeaderAlign(column, headerAlign);
          }
          "
          :customRow="customRow"
          @change="onListChange">
          <template
            v-for="(column, index) in columns"
            :slot="column.scopedSlots ? column.scopedSlots.customRender : ''"
            slot-scope="text, record, rowIndex">
            <!-- 单独处理操作列 -->
            <slot
              v-if="column.scopedSlots.customRender === 'action'"
              :name="column.scopedSlots.customRender"
              :text="text"
              :record="record"
              :rowIndex="rowIndex">
              <template v-for="(operation, idx) in operations">
                <a-button
                  type="link"
                  class="custom-button-link"
                  :disabled="getOperationDisabled(record, operation.disabled)"
                  v-show="getOperationShow(record, operation.show)"
                  :key="'a-' + idx"
                  @click.stop="operation.click(record, rowIndex)">
                  {{ operation.name }}
                </a-button>
                <a-divider :key="'divider-' + idx" v-if="idx < operations.length - 1" type="vertical" />
              </template>
            </slot>
            <template v-if="column.scopedSlots.customRender !== 'action'">
              <editable-cell
                :key="rowIndex + '-' + index"
                :text="text"
                :editable="getColumnEditable(record, column)"
                :editType="column.editType"
                :mode="column.mode"
                :isTreeFirstCol="index === 0 && showAsTree"
                :options="getEditOptions(record, column)"
                @change="onCellChange(record[rowKey], column.dataIndex, $event)" />
            </template>
          </template>
          <template
            v-for="(subCol, cidx) in columns.filter(col => col.children).map(col => col.children).flat()"
            :slot="subCol.scopedSlots ? subCol.scopedSlots.customRender : ''"
            slot-scope="text, record, rowIndex">
            <editable-cell
              :key="rowIndex + '-' + cidx"
              :text="text"
              :editable="getColumnEditable(record, subCol)"
              :editType="subCol.editType"
              :mode="subCol.mode"
              :options="getEditOptions(record, subCol)"
              @change="onCellChange(record[rowKey], subCol.dataIndex, $event)" />
          </template>
          <a slot="icon" slot-scope="text," href="javascript:;">
            <icon-font :type="text"></icon-font>
          </a>

        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import EditableCell from './EditableCell'
import antUtil from '@/utils/antdUtil'
import { deepTree } from '@/utils/util'
import Vue from 'vue'

export default {
  name: 'SystemList',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    render: {
      type: Function,
      required: false,
      default: () => { }
    },
    dataSource: {
      type: Array,
      required: false,
      default: () => []
    },
    params: {
      type: Object,
      required: false,
      default: () => { }
    },
    headerAlign: {
      type: String,
      default: 'center',
      required: false
    },
    buttons: {
      type: Array,
      default: () => [],
      required: false
    },
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    indentSize: {
      type: Number,
      default: 15,
      required: false
    },
    pagination: {
      type: [Object, Boolean],
      required: false,
      default: false
    },
    // 表格是否可编辑
    editable: {
      type: Boolean,
      required: false,
      default: false
    },
    editableCanClick: {
      type: Boolean,
      required: false,
      default: false
    },
    showAsTree: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否联动选择父子节点。比如选中父节点，自动全选子节点。
    checkRecursive: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否自动选择父节点。比如选中子节点，将父节点也自动选中。
    autoCheckParent: {
      type: Boolean,
      required: false,
      default: false
    },
    expandIconColumnIndex: {
      type: Number,
      required: false,
      default: 0
    },
    defaultExpandAllRows: {
      type: Boolean,
      required: false,
      default: false
    },
    defaultLoad: {
      // 是否默认加载
      type: Boolean,
      required: false,
      default: true
    },
    // rowSelection: {
    //   type: Object,
    //   required: false,
    //   default: null
    // },
    type: {
      type: String,
      required: false,
      default: ''
    },
    requestType: {
      type: String,
      required: false,
      default: ''
    },
    rowKey: {
      type: String,
      required: false,
      default: 'id'
    },
    searchItems: {
      type: Array,
      required: false,
      default: () => []
    },
    operations: {
      type: Array,
      require: false,
      default: () => []
    },
    scroll: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  data () {
    return {
      Vue,
      antUtil,
      loading: false,
      listData: [],
      expand: false,
      advancedParams: [],
      form: this.$form.createForm(this, { name: 'systemList' }),
      selectedRows: [], // 选中行数据
      selectedRowKeys: [], // 选中行key
      rows: [], // 根据选中key获取选中行用
      cellRow: {} // 编辑的单元格行数据
    }
  },
  computed: {
    count () {
      return this.expand ? this.searchItems.length + 1 : 4
    },
    rowSelection () {
      if (this.type) {
        return {
          type: this.type,
          selectedRowKeys: this.selectedRowKeys,
          // onChange: (selectedRowKeys, selectedRows) => {
          //   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          //   this.selectedRows = selectedRows
          //   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          //   this.selectedRowKeys = selectedRowKeys
          // },
          onSelectAll: (selected, selectedRows, changeRows) => {
            const _this = this
            if (selected) {
              const listData = _this.listData
              const arr = []
              setVal(listData, arr)
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              _this.selectedRowKeys = arr
              _this.selectedRows = selectedRows
            } else {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              _this.selectedRowKeys = []
              _this.selectedRows = []
            }
            function setVal (list, arr) {
              list.forEach(v => {
                arr.push(v[_this.rowKey])
                if (v.children) {
                  setVal(v.children, arr)
                }
              })
            }
          },
          onSelect: (record, selected, selectedRows) => {
            const _this = this
            const set = new Set(_this.selectedRowKeys)
            const listData = _this.listData
            const key = record[_this.rowKey]
            if (this.type === 'radio') {
              _this.selectedRowKeys = antUtil.getSelectedKeys(
                _this.type,
                _this.selectedRowKeys,
                record,
                _this.rowKey
              )
              _this.selectedRows = antUtil.getSelectedRows(
                _this.type,
                _this.selectedRows,
                record,
                _this.rowKey
              )

              return
            }

            if (selected) {
              set.add(key)
              if (_this.checkRecursive) {
                record.children && setChildCheck(record.children)
              }

              if (_this.autoCheckParent) {
                setParentCheck(key)
              }
            } else {
              set.delete(key)
              if (_this.checkRecursive) {
                record.children && setChildUncheck(record.children)
              }
              if (_this.autoCheckParent) {
                setParentUncheck(key)
              }
            }

            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            // _this.selectedRowKeys = Array.from(set)
            _this.setSelectedRows(Array.from(set))

            // 设置父级选择
            function setParentCheck (key) {
              const parent = getParent(key)
              if (parent) {
                set.add(parent[_this.rowKey])
                setParentCheck(parent[_this.rowKey])
              }
            }
            // 设置父级取消，如果父级的子集有选择，则不取消
            function setParentUncheck (key) {
              let childHasCheck = false
              const parent = getParent(key)
              if (parent) {
                const childlist = parent.children
                childlist.forEach(function (v) {
                  if (set.has(v[_this.rowKey])) {
                    childHasCheck = true
                  }
                })
                if (!childHasCheck) {
                  set.delete(parent[_this.rowKey])
                  setParentUncheck(parent[_this.rowKey])
                }
              }
            }
            // 获取当前对象的父级
            function getParent (key) {
              for (let i = 0; i < listData.length; i++) {
                if (listData[i][_this.rowKey] === key) {
                  return null
                }
              }
              return _getParent(listData)
              function _getParent (list) {
                let childlist
                let isExist = false
                for (let i = 0; i < list.length; i++) {
                  if ((childlist = list[i].children)) {
                    childlist.forEach(function (v) {
                      if (v[_this.rowKey] === key) {
                        isExist = true
                      }
                    })
                    if (isExist) {
                      return list[i]
                    }
                    if (_getParent(childlist)) {
                      return _getParent(childlist)
                    }
                  }
                }
              }
            }
            // 设置child全选
            function setChildCheck (list) {
              list.forEach(function (v) {
                set.add(v[_this.rowKey])
                v.children && setChildCheck(v.children)
              })
            }
            // 设置child取消
            function setChildUncheck (list) {
              list.forEach(function (v) {
                set.delete(v[_this.rowKey])
                v.children && setChildUncheck(v.children)
              })
            }
          }
        }
      } else {
        return null
      }
    }
  },
  methods: {
    handleSearch () {
      const _this = this
      if (this.searchItems && this.searchItems.length > 0) {
        this.form.validateFields((error, values) => {
          if (!error) {
            _this.advancedParams = values
            _this.getListData()
            _this.$emit('search')
          }
        })
      }
    },
    handleReset () {
      this.form.resetFields()
      this.handleSearch()
    },
    async getListData () {
      return new Promise(async (resolve, reject) => {
        if (this.params && this.params.sortOrder) {
          this.params.sortOrder =
            this.params.sortOrder === 'ascend' || this.params.sortOrder === 'asc'
              ? 'asc'
              : 'desc'
        }
        this.loading = true
        const queryParams = {
          ...this.params,
          ...this.advancedParams
        }

        if (this.pagination) {
          queryParams.page = this.pagination
        }

        let res = null
        if (this.requestType) {
          res = await this.render(this.requestType, queryParams)
        } else {
          res = await this.render(queryParams)
        }
        // 处理删除数据后分页查询问题
        if (this.pagination) {
          if (res.pages < res.current && res.current > 1) {
            const newPagination = {
              ...this.pagination,
              pageIndex: res.current - 1,
              current: res.current - 1
            }
            this.$emit('update:pagination', newPagination)

            queryParams.page = newPagination
            if (this.requestType) {
              res = await this.render(this.requestType, queryParams)
            } else {
              res = await this.render(queryParams)
            }
          }
        }
        this.loading = false

        if (this.showAsTree) {
          const data = res

          const firstLevel = data.filter(item => {
            return !item.pid || item.pid === ''
          })

          deepTree(firstLevel, data)
          this.listData = firstLevel
        } else if (this.pagination) {
          this.listData = res.records ? res.records : res.data ? res.data : res
          if (res.total) {
            this.$emit('update:pagination', {
              ...this.pagination,
              ...{ total: res.total }
            })
          }
        } else {
          this.listData = res
        }

        resolve()
      })
    },
    onListChange () {
      this.$emit('change', ...arguments)
    },
    onListDataChange (data) {
      this.$emit('datachange', data)
    },
    // 点击行选中
    customRow (record, index) {
      return {
        on: {
          click: (e) => {
            e.stopPropagation()
            if (!this.editableCanClick && this.editable) {
              // 如果是单元格可编辑，取消点击行选中
              return
            }
            if (this.rowSelection) {
              this.selectedRowKeys = antUtil.getSelectedKeys(
                this.type,
                this.selectedRowKeys,
                record,
                this.rowKey
              )
              this.selectedRows = antUtil.getSelectedRows(
                this.type,
                this.selectedRows,
                record,
                this.rowKey
              )
            } else {
              // 不展示radio/checkbox的情况，单选，只设置样式，选中情况由click回调函数处理
              this.unselectAllRows(this.listData)
              this.$set(record, 'selected', true)
              this.selectedRows.unshift(record)
              this.selectedRowKeys.unshift(record[this.rowKey])
            }

            this.$emit('rowClick', record, index)
          },
          dblclick: () => {
            this.$emit('rowDbClick', record)
          }
        }
      }
    },
    // 取消选中所有行
    unselectAllRows (rows) {
      rows.forEach(row => {
        this.$set(row, 'selected', false)

        if (row.children) {
          this.unselectAllRows(row.children)
        }
      })
    },
    // 获取行选中样式
    getRowClass (record, index) {
      if (record.selected) {
        return 'ant-table-row-selected'
      }
      return ''
    },
    // 获取操作列的显示状态
    getOperationDisabled (record, disabled) {
      if (disabled && typeof disabled === 'function') {
        return disabled(record)
      } else {
        return disabled || false
      }
    },
    // 获取操作列的显示状态
    getOperationShow (record, show) {
      if (show && typeof show === 'function') {
        return show(record)
      } else {
        return show || true
      }
    },
    // 获取列是否可编辑
    getColumnEditable (record, column) {
      if (this.editable === true) {
        if (column.editable && typeof column.editable === 'function') {
          // 自定义编辑规则
          return column.editable(record)
        } else {
          return column.editable !== false
        }
      } else {
        return false
      }
    },
    async getEditOptions (record, column) {
      if (column.editData && typeof column.editData === 'function') {
        const options = await column.editData(record)
        return options
      } else {
        return column.editData || []
      }
    },
    // 单元格编辑值改变事件
    onCellChange (key, dataIndex, value) {
      const listData = [...this.listData]
      this.getCellRowData(listData, key)
      if (this.cellRow) {
        this.cellRow[dataIndex] = value
        this.listData = listData
      }
    },
    getCellRowData (treeData, key) {
      treeData.forEach(row => {
        if (row[this.rowKey] === key) {
          this.cellRow = row
          return false
        }

        if (typeof row.children === 'object') {
          this.getCellRowData(row.children, key)
        }
      })
    },
    // 清空table的选中项
    clearSelected () {
      if (this.rowSelection) {
        this.selectedRows = []
        this.selectedRowKeys = []
      } else {
        // 不展示radio/checkbox的情况
        this.unselectAllRows(this.listData)
        this.selectedRows = []
        this.selectedRowKeys = []
      }
    },
    setSelectedRow (rowKey) {
      this.rows = []
      this.getSelectedRows(this.listData, rowKey)

      if (this.rows.length > 0) {
        const row = this.rows[0]
        if (this.rowSelection) {
          this.selectedRows = [row]
          this.selectedRowKeys = [rowKey]
        } else {
          // 不展示radio/checkbox的情况
          this.unselectAllRows(this.listData)
          this.$set(row, 'selected', true)
          this.selectedRows = [row]
          this.selectedRowKeys = [rowKey]
        }
      } else {
        this.clearSelected()
      }
    },
    setSelectedRows (rowKeys) {
      this.rows = []
      this.getSelectedRows(this.listData, rowKeys)

      if (this.rows.length > 0) {
        if (this.rowSelection) {
          this.selectedRows = this.rows
          this.selectedRowKeys = rowKeys
        } else {
          // 不展示radio/checkbox的情况
          this.unselectAllRows(this.listData)
          this.$set(this.rows[0], 'selected', true)
          this.selectedRows = [this.rows[0]]
          this.selectedRowKeys = [rowKeys[0]]
        }
      } else {
        this.clearSelected()
      }
    },
    // 根据选中的key获取选中行数据
    getSelectedRows (treeData, rowKeys) {
      let type = 'radio'
      if (typeof rowKeys === 'object') {
        type = 'checkbox'
      }

      treeData.forEach(row => {
        if (type === 'checkbox') {
          if (rowKeys.indexOf(row[this.rowKey]) > -1) {
            this.rows.push(row)
          }
        } else {
          if (rowKeys === row[this.rowKey]) {
            this.rows.push(row)
          }
        }

        if (typeof row.children === 'object') {
          this.getSelectedRows(row.children, rowKeys)
        }
      })
    },
    updateListData (row, index) {
      if (index > -1) {
        Object.assign(this.listData[index], row)
      } else {
        const rows = this.listData.filter(item => item[this.rowKey] === row[this.rowKey])
        if (rows.length > 0) {
          rows[0] = Object.assign(rows[0], row)
        } else {
          this.addRow(row)
        }
      }
    },
    findAndRemoveObjectById (arr, id, remove) {
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i]

        if (obj[this.rowKey] === id) {
          if (remove) {
            Vue.delete(arr, i)
          }
          return obj
        }

        if (obj.children && obj.children.length > 0) {
          const result = this.findAndRemoveObjectById(obj.children, id, remove)

          if (result) {
            if (remove && obj.children.length === 0) {
              delete obj.children // 如果子元素已全部删除，则删除 children 属性
            }
            return result
          }
        }
      }

      return null
    },
    addChildUpDateListData (rowId, row) {
      const addRow = this.findAndRemoveObjectById(this.listData, rowId)
      if (addRow && !addRow.children) {
        addRow.children = []
      }
      addRow.children.push(JSON.parse(JSON.stringify({ ...row, pEntityId: rowId })))
    },
    // 新增行
    addRow (row) {
      this.listData.push(JSON.parse(JSON.stringify(row)))
    },
    addRows (rows) {
      this.listData.push(...JSON.parse(JSON.stringify(rows)))
    },
    // 删除行
    deleteRow (rowIndex, record) {
      if (this.showAsTree) {
        this.findAndRemoveObjectById(this.listData, record[this.rowKey], true)
        this.listData = [...this.listData]
      } else {
        this.listData.splice(rowIndex, 1)
      }
    },
    // 删除多行
    deleteRows (rows) {
      rows.forEach(row => {
        const index = this.listData.findIndex(item => {
          return item[this.rowKey] === row[this.rowKey]
        })

        this.listData.splice(index, 1)
      })
    },
    // 获取表格数据
    getData () {
      return this.listData
    },
    setData (data) {
      this.listData = data
    },
    clearData () {
      this.listData = []
    },
    // 获取选中数据-单选
    getSelected () {
      return this.selectedRows[0]
    },
    // 获取选中数据-多选
    getSelecteds () {
      return this.selectedRows
    },
    getSelectedKeys () {
      return this.selectedRowKeys
    },
    getSelectedKey () {
      return this.selectedRowKeys[0]
    },
    // 获取查询参数
    getAdvancedParams () {
      return this.advancedParams
    }
  },
  mounted () {
    if (this.defaultLoad) {
      this.getListData()
    } else if (this.dataSource) {
      if (this.showAsTree) {
        const data = this.dataSource

        const firstLevel = data.filter(item => {
          return !item.pid || item.pid === ''
        })

        deepTree(firstLevel, data)
        this.listData = firstLevel
      } else {
        this.listData = this.dataSource
      }
    }
  },
  watch: {
    'dataSource': {
      handler: function (newValue, oldValue) {
        if (this.showAsTree) {
          const data = newValue

          const firstLevel = data.filter(item => {
            return !item.pid || item.pid === ''
          })

          deepTree(firstLevel, data)
          this.listData = firstLevel
        } else {
          this.listData = newValue
        }
      },
      deep: true
    },
    listData (val) {
      if (val) {
        this.onListDataChange(val)
      }
    }
  },
  components: {
    EditableCell
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  /deep/ .ant-table-bordered .ant-table-body>table {
    border: none;
  }

  /deep/ .ant-table-bordered.ant-table-empty .ant-table-placeholder {
    border-left: none;
    border-right: none;
    border-bottom: none;
  }

  /deep/ .ant-table:not(.ant-table-empty) {
    height: 100%;
    border: 1px solid #D5D5D5;

    .ant-table-fixed {
      // border-right: 1px solid #D5D5D5 !important;
      // border-top: 1px solid #D5D5D5 !important;
      // .ant-table-row-cell-last {
      //   border-right: none !important;
      // }
    }

    /*.ant-table-scroll {
      height: 100%;
    }
    .ant-table-fixed-left {
      height: 100%;
    }*/
  }

  /deep/ .ant-table-empty {
    height: 100%;
    border: 1px solid #D5D5D5 !important;
  }

  /deep/ .ant-table-thead>tr:first-child>th:last-child {
    border-right: none !important;
  }

  /deep/ .ant-table-fixed-right table {
    // border-left: none !important;
    border: none !important;
  }

  /deep/ tr {
    td {
      &:last-child {
        border-right: none !important;
      }
    }
  }
}

.formList {

  /deep/ .ant-table-thead>tr>th,
  /deep/ .ant-table-tbody>tr>td {
    padding: 0 8px !important;
    line-height: 20px;
  }
}

.table-toolbar {
  // background: #FAFAFA;
  // border: 1px solid #E6E6E6;
  border-bottom: 0;
  padding-bottom: 10px;
  // height: 50px;
  line-height: 40px;
  box-sizing: border-box;

  & .btns {
    padding-bottom: 0px;
  }

  & /deep/.ant-form-inline .ant-form-item:last-child {
    margin-right: 0;
  }
}

.table-title {
  color: #333;
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 0px;
  position: relative;

  .table-title-text {
    padding-left: 0;
  }

  .table-title-text::before {
    position: absolute;
    content: "";
    width: 4px;
    height: 18px;
    // background-size: contain;
    // background-image: url(../../assets/images/title.png);
    // background-repeat: no-repeat;
    // background-position: center center;
    top: 5px;
    left: -16px;
    border-radius: 4px;
    background: #4778C7;
  }

  & .search-box-title {
    text-align: right;
    padding: 0;
    padding-left: 12px;
    font-weight: normal !important;
  }

  & .search-box-title /deep/.ant-form-inline .ant-form-item:last-child {
    margin-right: 0 !important;
  }
}

.ant-advanced-search-form .ant-form-item {
  margin-bottom: 4px;
  // margin-top: 4px;
}

.custom-button-link {
  padding: 0 4px;
  border-color: transparent !important;
}

.custom-button-link[disabled]:hover {
  color: rgba(0, 0, 0, 0.25) !important;
}
/deep/.ant-table-thead > tr > th {
  background: @primary-color-light !important;
}
</style>
