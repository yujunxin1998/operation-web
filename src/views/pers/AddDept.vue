<template>
  <a-modal
    :title="title"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    width="50%"
  >
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="机构名称" prop="name">
            <a-input v-model="formData.name"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="简称" prop="shortName">
            <a-input v-model="formData.shortName"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="组织类型" prop="orgType">
            <a-select v-model="formData.orgType">
              <a-select-option
                v-for="bmxzItem in bmxz"
                :key="bmxzItem.id"
                :value="bmxzItem.code"
              >
                {{ bmxzItem.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="状态" prop="status">
            <a-select v-model="formData.status">
              <a-select-option
                v-for="bmxzItem in status"
                :key="bmxzItem.id"
                :value="bmxzItem.code"
              >
                {{ bmxzItem.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="顺序号" prop="sortNum">
            <a-input-number v-model="formData.sortNum" style="width: 100%"></a-input-number>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="行政区划" prop="xzqh">
            <a-tree-select
              v-model="formData.xzqh"
              :tree-data="xzqh"
              :replaceFields="xzqReplaceFields"
              allow-clear
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item label="所属分管领导" prop="ssldmc">
            <a-input v-model="formData.ssldmc" :disabled="true">
              <a-icon slot="addonAfter" type="small-dash" title="选择分管领导" @click="selectLeader"/>
            </a-input>
          </a-form-model-item>
        </a-col> -->
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="机构类型" prop="depType">
            <a-select v-model="formData.depType">
              <a-select-option
                v-for="bmxzItem in jglx"
                :key="bmxzItem.id"
                :value="bmxzItem.code"
              >
                {{ bmxzItem.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="上级部门" prop="pid">
            <a-tree-select
              v-model="formData.pid"
              :tree-data="depts"
              :replaceFields="replaceFields"
              allow-clear
            >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="部门所属领导" prop="ssld" >
            <a-select v-model="formData.ssld">
              <a-select-option value="">无</a-select-option>
              <a-select-option
                v-for="ssldItem in bmssld"
                :key="ssldItem.id"
                :value="ssldItem.name + (ssldItem.depname != null ? '('+ ssldItem.depname + ')' : '')"
              >
                {{ ssldItem.name + (ssldItem.depname != null ? '('+ ssldItem.depname + ')' : '') }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row> -->
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-model-item
            label="备注"
            prop="remark"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }">
            <a-textarea
              v-model="formData.remark"
              placeholder="备注"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <RoleSelect
      :visible.sync="selectVisible"
      :roleId="roleId"
      @submit="setSsld"
    />
  </a-modal>
</template>

<script>
import { deepTree } from '@/utils/util'
import RoleSelect from './RoleSelect'

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
    this.getDictInfo()
    this.getLeaderList()
  },
  data () {
    return {
      bmxz: [], // 部门性质
      xzqh: [], // 行政区
      ssld: [],
      bmssld: [], // 部门所属领导
      formData: {
        id: '',
        name: '',
        shortName: '',
        bmxz: '',
        xzqh: '',
        pid: '',
        ssld: '',
        ssldmc: '',
        sortNum: '',
        remark: '',
        status: '1',
        orgType: '',
        depType: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入部门名称'
        }],
        status: [{
          required: true,
          message: '请选择部门状态'
        }],
        bmxz: [{
          required: true,
          message: '请选择组织类型'
        }],
        // xzqh: [{
        //   required: true,
        //   message: '请选择行政区划'
        // }],
        sortNum: [{
          required: true,
          message: '请输入顺序号'
        }]
      },
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      xzqReplaceFields: {
        title: 'name',
        key: 'id',
        value: 'code'
      },
      depts: [],
      selectVisible: false, // 选择分管领导
      roleId: '7184a5a9b21e458f92757c7bc17a6749',
      status: [],
      jglx: []
    }
  },
  computed: {
    title () {
      let type = '新增'
      if (this.type === 'edit') {
        type = '编辑'
      }

      return `${type}部门`
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getDictInfo()

        this.$nextTick(() => {
          this.resetFormData()
          if (this.type === 'edit') {
            this.formData = Object.assign(this.formData, this.editData)
            // this.$bpmSystemProServices.persService.getUserInfo({
            //   id: this.editData.ssld
            // }).then(res => {
            //   this.formData.ssldmc = res.name
            //   this.formData.ssld = res.id
            // })
          } else {
            this.formData = Object.assign(this.formData, this.editData)
          }
        })
      } else {
        this.resetFormData()
      }
    }
  },
  methods: {
    getDictInfo () {
      this.getDepts()
      this.getBmxz()
      this.getXzq()
      this.getStatus()
    },
    async getDepts () {
      const depts = await this.$bpmSystemProServices.persService.getDeptList()
      const firstLevel = depts.filter(item => {
        return !item.pid || item.pid === ''
      })
      deepTree(firstLevel, depts)
      this.depts = firstLevel
    },
    async getBmxz () {
      var bmxz = await this.$bpmSystemProServices.systemService.getDictByCode('ZZLX')
      this.bmxz = bmxz
    },
    async getStatus () {
      const status = await this.$bpmSystemProServices.systemService.getDictByCode('YHZT')
      this.status = status
      this.jglx = await this.$bpmSystemProServices.systemService.getDictByCode('JGLX')
    },
    async getXzq () {
      var xzqh = await this.$bpmSystemProServices.systemService.getDictByCode('XZQH')
      const firstLevel = xzqh.filter(item => {
        return !item.pid || item.pid === ''
      })

      deepTree(firstLevel, xzqh)
      this.xzqh = firstLevel
    },
    async getLeaderList () {
      var ssld = await this.$bpmSystemProServices.persService.getLeaderList()
      this.bmssld = ssld
    },
    resetFormData () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }

      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.status = '1'
    },
    selectLeader () {
      this.selectVisible = true
    },
    setSsld (data) {
      if (data.length > 0) {
        this.ssld = data[0].id
        this.ssldmc = data[0].name
      } else {
        this.ssld = ''
        this.ssldmc = ''
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
      if (!this.formData.pid) {
        this.formData.pid = ''
      }
      if (this.type === 'edit') {
        this.$bpmSystemProServices.persService.updateDept(this.formData).then(res => {
          if (res) {
            this.$message.success('保存成功')
            this.$emit('submit', this.formData.id)
            this.$emit('update:visible', false)
          } else {
            this.$message.success('保存失败')
          }
        })
      } else {
        this.$bpmSystemProServices.persService.saveDept(this.formData).then(res => {
          if (res) {
            this.$message.success('保存成功')
            this.$emit('submit', this.formData.id)
            this.$emit('update:visible', false)
          } else {
            this.$message.success('保存失败')
          }
        })
      }
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  },
  components: {
    RoleSelect
  }
}
</script>

<style lang="less" scoped>
  .ant-input-group-addon{
    cursor: pointer;
  }
</style>
