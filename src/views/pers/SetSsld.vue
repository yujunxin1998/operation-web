<template lang="html">
  <a-modal
    title="设置分管领导"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    width="500px"
  >
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item
            label="部门"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            prop="deptName">
            <a-input v-model="formData.deptName" disabled></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item
            label="选择人员"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            prop="userId">
            <a-tree-select
              v-model="formData.userId"
              :treeCheckable="false"
              :treeData="rolesTreeData"
              treeNodeFilterProp="title"
              :replaceFields="replaceFields"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :allowClear="true"
              tree-default-expand-all
              @change="handleChange"
            />
          </a-form-model-item>
        </a-col>

      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
// import Validation from '@/utils/validation'
// import DateUtil from '@/utils/date'
import { deepTree } from '@/utils/util'
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

  },
  computed: {
      replaceFields () {
          return {
              children: 'children',
              title: 'name',
              key: 'id',
              value: 'id'
          }
      }
  },
  data () {
    return {
      persStatus: [], // 员工状态
      sf: [], // 是否为可是负责人
      zw: [], // 职务
      gender: [], // 性别
      rolesTreeData: [],
      deptData: [],
      formData: {
        deptId: '',
        deptName: '',
        userId: ''
      },
      rules: {
        userId: [{
          required: true,
          message: '请选择人员名称'
        }]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getDeptTree()
        this.$nextTick(() => {
          this.resetFormData()
          this.editData.deptName = this.editData.name
          this.editData.deptId = this.editData.id
          this.editData.userId = this.editData.ssld
          this.formData = Object.assign(this.formData, this.editData)
        })
      } else {
        this.resetFormData()
      }
    }
  },
  methods: {
    async getDeptTree () {
        const res = await this.$bpmSystemProServices.flowService.getParticipantTree({})
        // 部门数据
        this.deptData = res
        // 部门人员树
        const deptFirstLevel = this.deptData.filter(item => {
          return !item.pid || item.pid === ''
        })

        deepTree(deptFirstLevel, this.deptData, true)
        this.rolesTreeData = deptFirstLevel
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
      params = this.formData
      this.$bpmSystemProServices.persService.updateSsld(params).then(res => {
        if (res) {
          this.$message.success('设置成功')
          this.$emit('submit')
          this.$emit('update:visible', false)
        } else {
          this.$message.success('设置失败')
        }
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    },
    handleChange (e) {
      const selectRow = this.deptData.filter(item => item.id === e)
      if (selectRow[0].type !== 'user') {
        this.formData.userId = ''
      }
    }
  }
}
</script>
