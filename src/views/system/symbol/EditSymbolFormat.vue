<template lang="html">
  <a-modal
    title="文号格式"
    :visible.sync="visible"
    @cancel="handleCancel"
    centered
  >
    <a-form-model
      ref="form"
      :model="formData"
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >

      <div class="btn-container">
        <a-button class="operate-btn" @click="setSymbolFormat"><icon-font type="iconfont-save"></icon-font>保存</a-button>
      </div>
      <div class="tab-container">
        <a-tabs default-active-key="str" v-model="activeTabName">
          <a-tab-pane key="str" tab="添加字符">
            <a-form-model-item label="请输入字符" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="character">
              <a-input v-model="formData.character"></a-input>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="counter" tab="添加计数器">
            <a-form-model-item label="选择计数器" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="counterType">
              <a-select show-search v-model="formData.counterType" style="width: 100%" option-filter-prop="children" :filter-option="filterOption">
                <a-select-option
                  v-for="counter in counters"
                  :key="counter.counterNumeric"
                  :value="counter.counterNumeric">
                  {{ counter.counterName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="补零规则" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="counterRule">
              <a-radio-group v-model="formData.counterRule">
                <a-radio v-for="counterRuleItem in counterRule" :key="counterRuleItem.code" :value="counterRuleItem.code">
                  {{ counterRuleItem.name }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="最大长度" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="counterLength">
              <a-input-number v-model="formData.counterLength" :min="1" :max="9"/>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="date" tab="添加日期">
            <a-form-model-item label="日期规则" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="dateRule">
              <a-select v-model="formData.dateRule" style="width: 100%">
                <a-select-option
                  v-for="dateRuleItem in dateRule"
                  :key="dateRuleItem.id"
                  :value="dateRuleItem.code"
                >
                  {{ dateRuleItem.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="日期长度" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="dateLength">
              <a-radio-group v-model="formData.dateLength" :default-value="4">
                <a-radio v-for="dateLengthItem in dateLength" :key="dateLengthItem.code" :value="dateLengthItem.code">
                  {{ dateLengthItem.name }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
      </div>
      <a-form-model-item label="文号格式" :label-col="{ span: 4}" :wrapper-col="{ span: 20}" prop="symbolFormat">
        <a-input style="width:calc(100% - 125px)" v-model="formData.symbolFormat" disabled="disabled"></a-input>
        <a-button style="margin-left:8px;margin-right:8px" @click="clearSymbol">清除</a-button>
        <a-button type="primary" @click="previewSymbol">预览</a-button>
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button type="default" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>
<script>

export default {
  name: 'EditSymbolFormat',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    numericCode: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      formData: {
        symbolFormat: '',
        character: '',
        counterType: '',
        counterRule: '',
        counterLength: '',
        dateRule: '',
        dateLength: ''
      },
      dateRule: [],
      dateLength: [],
      counterRule: [],
      activeTabName: 'str',
      symbolFormatResult: '',
      counters: [], // 计数器
      tempstr: ''
    }
  },
  created () {
    this.getCounters()
    this.getDateRule()
    this.getDateLength()
    this.getCounterRule()
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => {
          this.resetFormData()
          if (this.numericCode) {
            this.formData.symbolFormat = this.numericCode
            this.updateDateTab()
            this.updateNumTab()
          }
        })
      } else {
        this.resetFormData()
      }
    }
  },
  methods: {
    async getCounters () {
        var counters = await this.$bpmSystemProServices.systemService.getCounterListForSymbol()
        this.counters = counters
    },
    async getType () {
      var zylx = await this.$bpmSystemProServices.systemService.getDictByCode('ZYLX')
      this.zylx = zylx.map(item => {
        return { ...item, code: parseInt(item.code) }
      })
    },
    async getDateRule () {
      var rqgz = await this.$bpmSystemProServices.systemService.getDictByCode('RQGZ')
      this.dateRule = rqgz
    },
    async getDateLength () {
      var rqcd = await this.$bpmSystemProServices.systemService.getDictByCode('RQCD')
      this.dateLength = rqcd
    },
    async getCounterRule () {
      var blgz = await this.$bpmSystemProServices.systemService.getDictByCode('BLGZ')
      this.counterRule = blgz
    },
    resetFormData () {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    handleOk () {
      this.$message.success('设置成功')
      this.$emit('update:visible', false)
      this.$emit('submit', this.formData.symbolFormat)
    },
    handleCancel () {
      this.$emit('update:visible', false)
    },
    setSymbolFormat () {
      if (this.activeTabName === 'str') {
        if (this.formData.character) {
          this.symbolFormatResult += this.formData.character
        } else {
          this.$message.warning('请输入要添加的字符')
          return false
        }
      } else if (this.activeTabName === 'counter') {
        if (!this.formData.counterType) {
          this.$message.warning('请选择具体计数器')
        } else if (!this.formData.counterRule) {
          this.$message.warning('请选择补零规则')
        } else if (!this.formData.counterLength) {
          this.$message.warning('请选择计数器最大长度')
        } else {
          if (this.formData.counterRule === 'B') {
            this.symbolFormatResult += '%'
            this.symbolFormatResult += this.formData.counterRule
            this.symbolFormatResult += this.formData.counterLength
            this.symbolFormatResult += '[&'
            this.symbolFormatResult += this.formData.counterType
            this.symbolFormatResult += ']'
          } else {
            this.symbolFormatResult += '%'
            this.symbolFormatResult += this.formData.counterLength
            this.symbolFormatResult += '[&'
            this.symbolFormatResult += this.formData.counterType
            this.symbolFormatResult += ']'
          }
        }
      } else if (this.activeTabName === 'date') {
        if (!this.formData.dateRule) {
          this.$message.warning('请选择日期规则')
        } else if (!this.formData.dateLength) {
          this.$message.warning('请选择日期长度')
        } else {
          this.symbolFormatResult += '%'
          this.symbolFormatResult += this.formData.dateLength
          this.symbolFormatResult += this.formData.dateRule
        }
      }
      this.formData.symbolFormat = this.symbolFormatResult
    },
    clearSymbol () {
      this.formData.symbolFormat = ''
      this.symbolFormatResult = ''
      this.$refs.form.resetFields()
    },
    updateDateTab () {
      this.tempstr = new RegExp('%[2-4][YMD]').exec(this.numericCode)
      if (this.tempstr && this.tempstr.length > 0) {
        this.tempstr = this.tempstr[0].replace('%', '')
        this.formData.dateLength = this.tempstr.charAt(0)
        this.formData.dateRule = this.tempstr.charAt(1)
      }
    },
    updateNumTab () {
      this.tempstr = /%[1-9]\[&[0-9a-z]{8}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{12}]/
      this.tempstr = this.tempstr.exec(this.numericCode)
      if (this.tempstr && this.tempstr.length > 0) {
        this.formData.counterLength = this.tempstr[0].charAt(1)
        this.formData.counterRule = 'Y'
        this.formData.counterType = this.tempstr[0].split('&')[1].split(']')[0]
      } else {
        this.tempstr = /%[B][1-9]\[&[0-9a-z]{8}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{4}[0-9a-z]{12}]/
        this.tempstr = this.tempstr.exec(this.numericCode)
        this.formData.counterLength = this.tempstr[0].charAt(2)
        this.formData.counterRule = 'B'
        this.formData.counterType = this.tempstr[0].split('&')[1].split(']')[0]
      }
    },
    previewSymbol () {
      if (this.formData.symbolFormat) {
        this.$bpmSystemProServices.systemService.previewSymbol({
          numberCode: this.formData.symbolFormat
        }).then(res => {
          this.$message.info(res)
        })
      } else {
        this.$message.warning('请先设置文号格式')
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .btn-container{
    width: 116px;
    position: absolute;
    z-index: 99;
    right: 0;
    top: 46px;
  }
  .btn-container .operate-btn{
    width: 100px;
    text-align: center;
    color: #4778C7;
    border: none;
  }
  .tab-container{
    height:calc(100% - 200px);
    border-bottom: 1px solid #DDD;
    margin-bottom: 10px;
  }
  /deep/ .ant-tabs-bar{
    border-bottom: 2px solid rgba(12, 109, 254, 0.25);
  }
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  .ant-tabs-nav .ant-tabs-tab-active{
    font-weight: 900;
  }
</style>
