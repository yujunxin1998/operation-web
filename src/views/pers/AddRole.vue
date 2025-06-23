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
      <a-form-model-item label="角色名称" prop="name">
        <a-input v-model="formData.name"></a-input>
      </a-form-model-item>
      <!-- <a-form-model-item label="角色类型" prop="type">
        <a-select v-model="formData.type" :disabled="true">
          <a-select-option
            v-for="roleTypeItem in roleType"
            :key="roleTypeItem.id"
            :value="roleTypeItem.code"
          >
            {{ roleTypeItem.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-form-model-item label="角色编码" prop="code">
        <a-input v-model="formData.code"></a-input>
      </a-form-model-item>
      <a-form-model-item label="上级角色" prop="pid">
        <a-tree-select
          v-model="formData.pid"
          :tree-data="roles"
          :replaceFields="replaceFields"
          allow-clear
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item
        label="备注"
        prop="remark">
        <a-textarea
          v-model="formData.remark"
          placeholder="备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import DateUtil from '@/utils/date'
import { deepTree } from '@/utils/util'
export default {
  name: 'AddDept',
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
    this.getRoles()
    this.getRoleType()
  },
  data () {
    return {
      formData: {
        id: '',
        pid: '',
        name: '',
        code: '',
        remark: '',
        createTime: '',
        type: '',
        procDefKey: ''
      },
      roles: [],
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      rules: {
        name: [{
          required: true,
          message: '请输入角色名称'
        }],
        type: [{
          required: true,
          message: '请选择角色类型'
        }]
      },
      roleType: []
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }
      return `${type}角色`
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.resetFormData()
          if (this.type === 'edit') {
            this.formData = Object.assign(this.formData, this.editData)
          } else {
            this.formData.type = ''
            this.formData = Object.assign(this.formData, this.editData)
            this.createTime = DateUtil.getNowFormatDateTime()
          }
        })
      } else {
        this.resetFormData()
      }
    }
  },
  methods: {
    async getRoleType () {
      var roleType = await this.$bpmSystemProServices.systemService.getDictByCode('ROLETYPE')
      this.roleType = roleType
    },
    async getRoles () {
      const roles = await this.$bpmSystemProServices.persService.getRowList()
      const firstLevel = roles.filter(item => {
        return !item.pid || item.pid === ''
      })
      deepTree(firstLevel, roles)
      this.roles = firstLevel
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
      // eslint-disable-next-line no-unused-vars
      // this.formData.type = 'role'
      this.$bpmSystemProServices.persService.saveOrUpdateRole(this.formData).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.$emit('submit', this.formData.id)
          this.$emit('update:visible', false)
        } else {
          this.$message.success('保存失败')
        }
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
