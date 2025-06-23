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
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-model-item label="文号分类名称" prop="numberName">
        <a-input v-model="formData.numberName"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  name: 'AddSymbol',
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
      default: '',
      required: false
    }
  },
  data () {
    return {
      formData: {
        id: '',
        numberName: ''
      },
      rules: {
        numberName: [
          {
            required: true,
            message: '请输入文号分类名称'
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

      return `${type}文号分类`
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
        this.formData.id = ''
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
          this.$bpmSystemProServices.systemService.saveOrUpdateSymbolList(this.formData).then(res => {
            if (res) {
              this.$message.success('保存成功')
              this.$emit('submit', this.formData.id)
            } else {
              this.$message.error('保存失败')
            }
            this.$emit('update:visible', false)
          })
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
