<template lang="html">
  <a-modal
    :title="title"
    :visible.sync="visible"
    okText="确定"
    cancelText="取消"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-form-model
      ref="formData"
      :model="formData"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      @submit="handleSubmit"
    >
      <a-form-model-item label="父节点" prop="pid">
        <a-tree-select
          v-model="formData.pid"
          :tree-data="menus"
          :replaceFields="replaceFields"
          allow-clear>
        </a-tree-select>
      </a-form-model-item>
      <!-- <a-form-model-item label="类型" prop="type">
        <a-select v-model="formData.type">
          <a-select-option
            v-for="zylxItem in zylx"
            :key="zylxItem.id"
            :value="zylxItem.code"
          >
            {{ zylxItem.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
      <a-form-model-item label="显示名称" prop="name">
        <a-input v-model="formData.name"></a-input>
      </a-form-model-item>
      <a-form-model-item label="配置名称" prop="confName">
        <a-input v-model="formData.confName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="菜单标识" prop="code">
        <a-input v-model="formData.code"></a-input>
      </a-form-model-item>
      <!-- <a-form-model-item label="唯一标识" prop="id" :help="type !== 'edit'? '唯一标识为空或者确保输入值在数据库中唯一': ''">
        <a-input v-model="formData.id" :disabled="type === 'edit'"></a-input>
      </a-form-model-item> -->
      <a-form-model-item label="URL" prop="url" style="line-height: 26px;">
        <a-input v-model="formData.url"></a-input>
        <span style="color:red">注：父菜单项的url必须为空，子菜单项的url不能为空！</span>
      </a-form-model-item>

      <a-form-model-item label="图标" prop="icon">
        <a-input v-model="formData.icon">
          <a-icon slot="addonAfter" type="small-dash" title="选择图标" @click="selectIcon"/>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="打开方式" prop="type">
        <a-select v-model="formData.openMode">
          <a-select-option
            v-for="item in openModeList"
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="顺序号" prop="sortNum">
        <a-input-number v-model="formData.sortNum"></a-input-number>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="formData.remark"
          placeholder="备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
    </a-form-model>
    <IconSelect
      :visible.sync="iconVisible"
      :icon.sync="formData.icon"
      @submit="setIcon"
    />
  </a-modal>
</template>

<script>
import IconSelect from '@/components/Icon/IconSelect'
// 前端路由表
import constantRouterComponents from '@/router/constantRouterComponents'
export default {
  name: 'AddMenu',
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
    },
    menus: {
      type: Array,
      default: () => ([]),
      required: false
    }
  },
  inject: ['getList'],
  mounted () {
    this.getType()
  },
  data () {
    return {
      zylx: [], // 资源类型
      openModeList: [
        { code: 'inside', name: '框架内打开' },
        { code: 'noPadding', name: '框架内打开（无边距）' },
        { code: 'fullScreen', name: '全屏打开' }
      ],
      iconVisible: false, // 图标选择
      formData: {
        id: '',
        pid: '',
        type: '',
        name: '',
        confName: '',
        openMode: 'inside',
        code: '',
        icon: '',
        sortNum: '',
        component: '',
        route: '',
        url: '',
        remark: ''
      },
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      constantRouterComponents: constantRouterComponents,
      rules: {
        // id: [
        //   {
        //     validator: (rule, value, callback) => {
        //       this.$bpmSystemProServices.systemService
        //         .getMenuList()
        //         .then(res => {
        //           const result = res.filter(menu => {
        //             return menu.id === value
        //           })
        //           if (result.length) {
        //             callback(new Error('请输入唯一标识'))
        //           } else {
        //             callback()
        //           }
        //         })
        //     },
        //     trigger: 'blur'
        //   },
        //   {
        //     required: true,
        //     message: '请输入唯一标识'
        //   }
        // ],
        confName: [
          {
            required: true,
            message: '请输入配置名称'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入显示名称'
          }
        ],
        sortNum: [
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
      let openType = '新增'
      if (this.type === 'edit') {
        openType = '编辑'
      }

      return `${openType}菜单`
    },
    iconShow () {
      const zylxItems = this.zylx.filter(item => {
        return item.name === '菜单项'
      })
      return zylxItems.length > 0 && this.formData.type !== zylxItems[0].code
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.formData.resetFields()
          this.resetFormData()
          this.formData = Object.assign(this.formData, this.editData)
          if (!this.formData.openMode) {
            this.formData.openMode = 'inside'
          }
        })
      } else {
        this.resetFormData()
      }
    },
    iconShow (val) {
      if (!val) {
        this.formData.icon = ''
      }
    },
    'formData.name' (val) {
      if (!this.formData.confName) {
        this.formData.confName = val
      }
    },
    'formData.pid' (val, old) {
      // 通过父节点判断顺序号,新增的时候执行
      if (old || !this.type) {
        var allList = this.getList()
        if (val) {
          console.log(val)

          // 展开菜单
          const traverse = array => {
            array.forEach((element, index) => {
              if (element.children) {
                array = [...array, ...traverse(element.children)]
              }
            })
            return array
          }

           var newList = traverse(allList)
           // 获取父级
           const pList = newList.filter((pItem) => pItem.id === val)
           // 同级的菜单
           var borList = pList[0].children
           if (borList.length > 0) {
             this.formData.sortNum = borList[borList.length - 1].sortNum + 1
           } else {
             this.formData.sortNum = 1
           }
        } else {
          if (allList.length > 0) {
            this.formData.sortNum = allList[allList.length - 1].sortNum + 1
          } else {
            this.formData.sortNum = 1
          }
        }
      }
    }
  },
  methods: {
    async getType () {
      var zylx = await this.$bpmSystemProServices.systemService.getDictByCode('ZYLX')
      this.zylx = zylx.map(item => {
        return { ...item, code: parseInt(item.code) }
      })
    },
    selectIcon () {
      this.iconVisible = true
    },
    setIcon (iconCls) {
      this.formData.icon = iconCls
    },
    resetFormData () {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    handleOk () {
      this.$refs.formData.validate(valid => {
          if (valid) {
            if (!this.formData.pid) {
              this.formData.pid = ''
            }
            if (this.type === 'edit') {
              this.$bpmSystemProServices.systemService.updateMenu(this.formData).then(res => {
                if (res) {
                  this.$message.success('保存成功')
                  this.$emit('submit', this.formData.id)
                  this.$emit('update:visible', false)
                } else {
                  this.$message.error('保存失败')
                }
              })
            } else {
              this.$bpmSystemProServices.systemService.updateMenu(this.formData).then(res => {
                if (res) {
                  this.$message.success('保存成功')
                  this.$emit('submit', this.formData.id)
                  this.$emit('update:visible', false)
                } else {
                  this.$message.error('保存失败')
                }
              })
            }
          }
      })
    },
    handleCancel () {
      this.$emit('update:visible', false)
    },
    handleSubmit () {}
  },
  components: {
    IconSelect
  }
}
</script>
