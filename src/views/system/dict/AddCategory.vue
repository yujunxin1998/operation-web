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
      <a-form-model-item label="类别名称" prop="name">
        <a-input v-model.lazy="formData.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="排序号" prop="sortNum">
        <a-input-number v-model="formData.sortNum"></a-input-number>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'AddDict',
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
    }
  },
  data () {
    return {
      formData: {
        id: '',
        name: '',
        sortNum: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入类别名称'
          }
        ],
        sortNum: [
          {
            required: true,
            message: '请输入排序号'
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

      return `${type}字典类别`
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.resetFormData()
          if (this.type === 'edit') {
            this.formData = Object.assign(this.formData, this.editData)
          }
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
      this.$bpmSystemProServices.systemService.saveOrUpdateCategory(this.formData).then(res => {
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
