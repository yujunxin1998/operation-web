<template lang="html">
  <a-modal
    :title="title"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="父级字典" prop="pid">
        <a-tree-select
          :showSearch="true"
          :treeData="allDic"
          treeNodeFilterProp="title"
          :replaceFields="replaceFields"
          v-model="formData.pid"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :allowClear="true"
        />
      </a-form-model-item>
      <a-form-model-item label="代码" prop="code">
        <a-input v-model.lazy="formData.code"></a-input>
      </a-form-model-item>
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="formData.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="顺序" prop="sort">
        <a-input-number v-model="formData.sort"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="formData.remark"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'AddDictItem',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    editData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    allDic: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data () {
    return {
      formData: {
        pid: '',
        dicId: '',
        id: '',
        sort: '',
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [
          {
            validator: (rule, value, callback) => {
              this.$bpmSystemProServices.systemService
                .validateDictItemCode({
                  code: value,
                  id: this.formData.id,
                  dicId: this.formData.dicId
                })
                .then(res => {
                  if (res !== 0 && res !== '0') {
                    callback(new Error('请输入唯一标识'))
                  } else {
                    callback()
                  }
                })
            },
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入唯一标识'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入字典项名称'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入顺序号'
          }
        ]
      }
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }

      return `${type}字典项`
    },
    replaceFields () {
        return {
            children: 'children',
            title: 'name',
            key: 'id',
            value: 'id'
        }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.resetFormData()
        this.$nextTick(() => {
          this.formData = Object.assign(this.formData, this.editData)
        })
      } else {
        this.resetFormData()
      }
    }
  },
  methods: {
    resetFormData () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }

      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleSubmit()
        } else {
          return false
        }
      })
    },
    handleSubmit () {
      this.formData.pid = this.formData.pid || ''
      this.$bpmSystemProServices.systemService.saveOrUpdateDictItem(this.formData).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.$emit('submit', this.formData.id)
        } else {
          this.$message.error('保存失败')
        }
        this.$emit('update:visible', false)
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
