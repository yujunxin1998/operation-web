<template lang="html">
  <a-modal
    title="选择图标"
    :visible.sync="visible"
    centered
    @ok="handelSubmit"
    @cancel="handleCancel"
    width="1000px"
  >
    <template slot="footer">
      <a-button class="copy-btn" @click="handleCopy" data-clipboard-action="copy" :data-clipboard-text="iconClass">复制代码</a-button>
      <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handelSubmit" type="primary">确定</a-button>
    </template>
    <!-- <MenuIconList v-if="type === 'menuIcon'" ref="menuIconList" :icon="icon" @submit="handelSubmit"></MenuIconList> -->
    <div style="display: flex;flex-direction: column;">
      <a-input-search
        placeholder="请输入图标名称"
        v-model="inputsearchTitle"
        allowClear
        style="width:250px;"
        enter-button
        @search="onSearch"></a-input-search>
      <IconList ref="iconList" :icon="icon" ></IconList>
    </div>
  </a-modal>
</template>

<script>
import IconList from './IconList'
import Clipboard from 'clipboard'
import MenuIconList from './MenuIconList'
export default {
  name: 'IconSelect',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted () {},
  data () {
    return {
      iconClass: '',
      inputsearchTitle: ''
    }
  },
  methods: {
    onSearch () {
      this.$refs.iconList.setSearchTitle(this.inputsearchTitle)
    },
    handleCancel () {
      if (this.type === 'menuIcon') {
        this.$refs.menuIconList.resetSelectedIcon()
      } else {
        this.$refs.iconList.resetSelectedIcon()
      }

      this.$emit('update:visible', false)
    },
    handelSubmit () {
      const icons = this.$refs.iconList.iconList.glyphs.filter(icon => {
          return icon.isSelected === true
      })
      if (icons.length <= 0) {
          this.$message.info('请选择一个图标')
          return
      }
      const iconCls = this.$refs.iconList.iconList.css_prefix_text + icons[0].font_class
      this.$emit('submit', iconCls)
      this.$emit('update:visible', false)
    },
    handleCopy () {
      const icons = this.$refs.iconList.iconList.glyphs.filter(icon => {
          return icon.isSelected === true
      })
      if (icons.length <= 0) {
          this.$message.info('请选择一个图标')
          return
      }
      this.iconClass = this.$refs.iconList.iconList.css_prefix_text + icons[0].font_class
      // 复制数据
      const clipboard = new Clipboard('.copy-btn')
      console.log(clipboard)
      clipboard.on('success', () => {
        this.$message.success('复制成功')
      })
      clipboard.on('error', () => {
        this.$message.error('复制失败')
      })
      setTimeout(() => {
        // 销毁实例
        clipboard.destroy()
      }, 100)
    }
  },
  components: {
    IconList,
    MenuIconList
  }
}
</script>
