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
      layout="horizontal"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="计数器名称" prop="counterName">
        <a-input v-model="formData.counterName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="初始值" prop="initialValue">
        <a-input-number v-model="formData.initialValue"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="当前值" prop="currentValue">
        <a-input-number v-model="formData.currentValue"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="步长" prop="stepLength">
        <a-input-number v-model="formData.stepLength"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="清零规则" prop="resetStrategy">
        <a-select v-model="formData.resetStrategy">
          <a-select-option
            v-for="resetStrategiesItem in resetStrategies"
            :key="resetStrategiesItem.id"
            :value="resetStrategiesItem.code"
          >
            {{ resetStrategiesItem.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="description">
        <a-textarea
          v-model="formData.description"
          placeholder="备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'AddCounter',
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
  mounted () {
    this.getResetStrategies()
  },
  data () {
    return {
      resetStrategies: [], // 资源类型
      formData: {
        counterNumeric: '',
        counterName: '',
        initialValue: '',
        currentValue: '',
        stepLength: '',
        resetStrategy: '',
        description: ''
      }
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }

      return `${type}计数器`
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
    async getResetStrategies () {
      const resetStrategies = await this.$bpmSystemProServices.systemService.getDictByCode(
        'QLGZ'
      )
      this.resetStrategies = resetStrategies
    },
    resetFormData () {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    handleOk () {
      // eslint-disable-next-line no-unused-vars
      this.$bpmSystemProServices.systemService.saveCounter(this.formData).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.$emit('submit', this.formData.counterNumeric)
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
