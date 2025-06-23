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
      <a-form-model-item label="类别" prop="typeId">
        <a-select
          v-model="formData.typeId"
          style="width: 200px; margin-right: 16px;"
        >
          <a-select-option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="openCategories">
          类别管理
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="代码" prop="code">
        <a-input v-model.lazy="formData.code"></a-input>
      </a-form-model-item>
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="formData.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="formData.remark"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
    <CategoriesList :visible.sync="categoriesVisible"></CategoriesList>
  </a-modal>
</template>

<script>
import CategoriesList from './CategoriesList'

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
  created () {
    this.getCategories()
  },
  data () {
    return {
      categoriesVisible: false, // 类别管理
      categories: [],
      formData: {
        id: '',
        typeId: '',
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [
          {
            validator: (rule, value, callback) => {
              this.$bpmSystemProServices.systemService
                .validateDictCode({
                  code: value,
                  id: this.formData.id
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
            message: '请输入字典名称'
          }
        ],
        typeId: [
          {
            required: true,
            message: '请选择类别'
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

      return `${type}字典`
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.getCategories()

          this.resetFormData()
          if (this.type === 'edit') {
            this.formData = Object.assign(this.formData, this.editData)
          }
        })
      } else {
        this.resetFormData()
      }
    },
    categoriesVisible (val) {
      if (!val) {
        this.getCategories()
      }
    }
  },
  methods: {
    async getCategories () {
      const categories = await this.$bpmSystemProServices.systemService.getCategoriesList()
      this.categories = categories
    },
    resetFormData () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }

      for (const key in this.formData) {
        this.formData[key] = ''
      }
      const ggzd = this.categories.filter(item => item.name === '业务字典')
      if (ggzd.length > 0) {
        this.formData.typeId = ggzd[0].id
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
      this.$bpmSystemProServices.systemService.saveOrUpdateDict(this.formData).then(res => {
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
    },
    openCategories () {
      this.categoriesVisible = true
    }
  },
  components: {
    CategoriesList
  }
}
</script>
