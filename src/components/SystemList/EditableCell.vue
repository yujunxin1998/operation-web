<template>
  <span :class="isTreeFirstCol ? 'tree-editable-cell' :'editable-cell'" :title="(!editType || editType === 'input')?value:name">
    <div v-if="cellEditable" class="editable-cell-input-wrapper">
      <!-- 输入框 -->
      <a-input
        ref="input"
        v-if="editType === 'input'"
        v-model="value"
        @pressEnter="check"
        @blur="check" />

      <!-- 下拉框 -->
      <a-select
        ref="select"
        v-if="editType === 'select'"
        v-model="value"
        show-search
        :filter-option="filterOption"
        :options="editOptions"
        :mode="mode"
        @change="docheck"
        @blur="check"
        style="width: 100%;"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper" @click="edit">
      <template v-if="!editType || editType === 'input'">
        {{ value || ' ' }}
      </template>
      <template v-if="editType === 'select' || editType === 'treeSelect'">
        {{ name }}
      </template>
      <template v-if="editType === 'checkbox'">
        <a-checkbox v-if="editable" @change="onChange" :checked="checked"></a-checkbox>
      </template>
    </div>
  </span>
</template>

<script>
export default {
    name: 'EditableCell',
    props: {
        text: {
          type: [String, Number],
          required: false,
          default: ''
        },
        editable: {
          type: Boolean,
          required: false,
          default: true
        },
        editType: {
          type: String,
          required: false,
          default: null
        },
        mode: {
          type: String,
          required: false,
          default: 'default'
        },
        options: {
          type: [Array, Promise],
          required: false,
          default: () => []
        },
        isTreeFirstCol: {
          type: Boolean,
          required: false,
          default: false
        }
    },
    data () {
        return {
          value: '',
          cellEditable: false,
          name: '',
          editOptions: [],
          titlevalue: ''
        }
    },
    computed: {
      checked () {
        return this.value === '1'
      }
    },
    methods: {
        docheck () {
          if (this.editType === 'select' && this.mode === 'default') {
            this.check()
          }
        },
        check () {
          this.cellEditable = false
          if (this.editType === 'select') {
            if (this.mode === 'default') {
              const res = this.editOptions.filter(option => {
                return option.value === this.value
              })
              if (res.length > 0) {
                this.name = res[0].label
              } else {
                this.name = this.value
              }

              this.$emit('change', this.value)
            } else {
              const names = []
              const values = []
              this.value.forEach(item => {
                const res = this.editOptions.filter(option => {
                  return option.value === item
                })

                if (res.length > 0) {
                  names.push(res[0].label)
                } else {
                  if (item) {
                    names.push(item)
                  }
                }

                if (item) {
                  values.push(item)
                }
              })

              this.name = names.join(',')
              this.value = values

              this.$emit('change', this.value.join(','))
            }
          } else {
            this.$emit('change', this.value)
          }
        },
        onChange (e) {
          this.value = e.target.checked ? '1' : '0'
          this.$emit('change', this.value)
        },
        edit () {
          if (this.editable && this.editType !== 'checkbox') {
            this.cellEditable = true

            this.$nextTick(() => {
              this.$refs[this.editType].focus()
            })
          }
        },
        editOptionsChange (options) {
          const res = options.filter(option => {
            if (this.editType === 'select' && this.mode !== 'default') {
              return this.value.indexOf(option.value) > -1
            } else {
              return option.value === this.value
            }
          })
          if (res.length > 0) {
            if (this.editType === 'select' && this.mode !== 'default') {
              const names = res.map(item => item.label)
              this.name = names.join(',')
            } else {
              this.name = res[0].label
            }
          } else {
            if (this.editType === 'select' && this.mode !== 'default') {
              this.name = this.value.join(',')
            } else {
              this.name = this.value
            }
          }
        },
        filterOption (input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            )
        }
    },
    watch: {
      text: {
        handler (val) {
          if (this.editType === 'select' && this.mode !== 'default') {
            this.value = val ? val.split(',') : []
          } else {
            this.value = val
          }
        },
        immediate: true
      },
      options: {
        handler (val) {
          if (val instanceof Array) {
            this.editOptions = val
            this.editOptionsChange(val)
          } else {
            val.then(data => {
              this.editOptions = data
              this.editOptionsChange(data)
            })
          }
        },
        immediate: true
      }
    }
}
</script>

<style>
.editable-cell {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: inline-block;
}
.tree-editable-cell{
    position: relative;
    width: 60%;
    height: 30px;
    line-height: 46px;
    display: inline-block;
    text-align: left;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 5px;
  height: 100%;
}

.editable-cell-text-wrapper {
  padding: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.formList .ant-select-selection--single,
.formList .ant-select-selection--multiple{
  height: 30px;
  min-height: 30px;
  border: none;
}

.formList .ant-select-arrow {
  right: 4px;
}

.formList .ant-table .ant-table-tbody .ant-table-row .anticon {
  font-size: 14px;
}
</style>
