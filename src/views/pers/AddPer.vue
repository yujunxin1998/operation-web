<template lang="html">
  <a-modal
    :title="title"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="spinning"
    width="50%"
  >
    <a-spin :spinning="spinning">
      <a-form-model
        ref="form"
        :model="formData"
        :rules="rules"
        layout="horizontal"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="账号名" prop="loginName">
              <a-input v-model.lazy="formData.loginName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="真实姓名" prop="name">
              <a-input v-model="formData.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="性别" prop="sex">
              <a-select v-model="formData.sex">
                <a-select-option
                  v-for="genderItem in gender"
                  :key="genderItem.id"
                  :value="genderItem.code"
                >
                  {{ genderItem.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="出生日期" prop="bornDate">
              <a-date-picker v-model="formData.bornDate" format="YYYY-MM-DD" style="width: 100%;"></a-date-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="移动电话" prop="phone">
              <a-input v-model="formData.phone"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="用户邮箱" prop="email">
              <a-input v-model="formData.email"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="用户状态" prop="status">
              <a-select v-model="formData.status">
                <a-select-option
                  v-for="status in persStatus"
                  :key="status.id"
                  :value="status.code"
                >
                  {{ status.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              label="备注"
              prop="remark"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }">
              <a-textarea
                v-model="formData.remark"
                placeholder="备注"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import Validation from '@/utils/validation'
import DateUtil from '@/utils/date'
export default {
  name: 'AddPers',
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
  created () {
    this.getPersStatus()
    this.getSf()
    this.getGender()
  },
  data () {
    return {
      persStatus: [], // 员工状态
      sf: [], // 是否为可是负责人
      gender: [], // 性别
      spinning: false,
      formData: {
        departmentId: '',
        password: '',
        id: '',
        name: '',
        sex: '',
        phone: '',
        loginName: '',
        status: '',
        sffzr: '',
        cjgzsj: '',
        rzsj: '',
        sx: '',
        remark: '',
        bornDate: '',
        email: '',
        createTime: ''
      },
      rules: {
        loginName: [
          {
            validator: (rule, value, callback) => {
              if (!this.formData.id) {
                this.$bpmSystemProServices.persService.validateLoginName({
                  loginName: value,
                  id: this.formData.id
                }).then(res => {
                  if (res !== 0 && res !== '0') {
                    callback(new Error('账号已存在'))
                  } else {
                    callback()
                  }
                })
              } else {
                callback()
              }
            },
            trigger: 'blur'
          },
          {
            required: true,
            message: '请输入账号'
          }
        ],
        sffzr: [
          {
            validator: (rule, value, callback) => {
              if (value === '1') {
                this.$bpmSystemProServices.persService
                  .validateManager({
                    departmentId: this.formData.departmentId
                  })
                  .then(res => {
                    if (res > 0) {
                      callback(new Error('该部门负责人已存在'))
                    } else {
                      callback()
                    }
                  })
              } else {
                callback()
              }
            }
          }
        ],
        name: [{
          required: true,
          message: '请输入姓名'
        }],
        phone: [
          {
            validator: (rule, value, callback) => {
              const res = Validation.validateMobilePhone(value)
              if (res || value === '') {
                callback()
              } else {
                callback(new Error('请输入11位手机号码'))
              }
            }
          }
        ],
        cjgzsj: [{
          required: false,
          message: '请输入参加工作时间'
        }],
        status: [{
          required: true,
          message: '请选择员工状态'
        }]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.resetFormData()
          this.formData = Object.assign(this.formData, this.editData)
          if (this.type !== 'edit') {
            this.formData.password = '000000'
            this.formData.createTime = DateUtil.getNowFormatDateTime()
            this.formData.status = this.persStatus[0].code
          }
        })
      } else {
        this.resetFormData()
        this.spinning = false
      }
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }

      return `${type}人员`
    }
  },
  methods: {

    async getPersStatus () {
      var status = await this.$bpmSystemProServices.systemService.getDictByCode('YHZT')
      this.persStatus = status
    },
    async getSf () {
      var sf = await this.$bpmSystemProServices.systemService.getDictByCode('SF')
      this.sf = sf
    },
    async getGender () {
      var gender = await this.$bpmSystemProServices.systemService.getDictByCode('SEX')
      this.gender = gender
    },
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
      let params = {}
      this.spinning = true
      if (this.type === 'edit') {
        params = this.formData
        this.$bpmSystemProServices.persService.updatePers(params).then(res => {
          if (res) {
            this.$message.success('保存成功')
            this.$emit('submit', this.formData.id)
            this.$emit('update:visible', false)
          } else {
            this.$message.error('保存失败')
          }
        })
      } else {
        params = { ...this.formData }
        // 将 loginName 改为 username
        if (params.loginName) {
          params.username = params.loginName
          delete params.loginName
        }
        // params.departmentId = this.formData.departmentId
        this.$bpmSystemProServices.persService.commonPostRequest('/user/insert3', params).then(res => {
          if (res) {
            this.$message.success('保存成功')
            this.$emit('submit', this.formData.id)
            this.$emit('update:visible', false)
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
