<template lang="html">
  <div>
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
        <a-form-model-item label="文号名称" prop="numericdefineName">
          <a-input v-model="formData.numericdefineName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="文号标识" prop="flagName">
          <a-input v-model="formData.flagName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="文号格式" prop="numericCode">
          <a-input style="width:calc(100% - 80px)" v-model="formData.numericCode"></a-input>
          <a-button style="margin-left:8px" @click="EditFormat" >编辑</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <EditSymbolFormat
      :numericCode="formData.numericCode"
      :visible.sync="editSymbolFormatVisible"
      @submit="setSymbolFormat"
    />
  </div>
</template>
<script>
import EditSymbolFormat from './EditSymbolFormat'
export default {
  name: 'AddSymbolItem',
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
        numericdefineName: '',
        flagName: '',
        numericCode: '',
        referenceNumericId: ''
      },
      editSymbolFormatVisible: false,
      rules: {
        numericdefineName: [{
          required: true,
          message: '请输入文号名称'
        }],
        flagName: [
          {
            validator: (rule, value, callback) => {
              this.$bpmSystemProServices.systemService.validateNumberDefine({
                  flagName: value,
                  id: this.formData.id
                }).then(res => {
                  if (res) {
                    callback(new Error('文号标识已存在'))
                  } else {
                    callback()
                  }
              })
            },
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入文号标识'
          }
        ],
        numericCode: [{
          required: true,
          message: '请输入文号格式'
        }]
      }
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }

      return `${type}文号`
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
          this.formData.referenceNumericId = this.editData.referenceNumericId
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
            this.$bpmSystemProServices.systemService.saveOrUpdateSymbolItem(this.formData).then(res => {
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
      },
      EditFormat () {
        this.editSymbolFormatVisible = true
      },
      setSymbolFormat (formatVal) {
        this.formData.numericCode = formatVal
      }
  },
  components: {
    EditSymbolFormat
  }
}
</script>
