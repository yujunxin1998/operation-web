<template>
  <div class="font-container">
    <div class="font-icon-container">
      <span
        class="font-icon-item"
        :class="{'font-icon-selected': iconItem.isSelected}"
        @click="selectIcon(iconItem.icon_id)"
        v-for="iconItem in glyphs"
        :key="iconItem.icon_id"
        style="display: flex;flex-direction: column;">
        <icon-font
          :type="iconList.css_prefix_text + iconItem.font_class"
          :key="iconItem.icon_id"
          :title="iconItem.name">
        </icon-font>
        <div style="font-size: 12px;">{{ iconItem.name }}</div>
      </span>
    </div>
  </div>
</template>

<script>
  import iconfont from '../../assets/bpm-icons/iconfont.json'
  export default {
    name: 'IconList',
    props: {
      icon: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        iconList: iconfont,
        searchTitle: '',
        glyphs: iconfont.glyphs
      }
    },
    computed: {

    },
    methods: {
      setSearchTitle (title) {
        if (title) {
          this.glyphs = iconfont.glyphs.filter(item => item.name.includes(title))
        } else {
          this.glyphs = iconfont.glyphs
        }
      },
      selectIcon (id) {
        this.iconList.glyphs.map(icon => {
          if (icon.icon_id === id) {
            this.$set(icon, 'isSelected', true)
          } else {
            this.$set(icon, 'isSelected', false)
          }
        })
      },
      resetSelectedIcon () {
        this.iconList.glyphs.map(icon => {
          if (this.iconList.css_prefix_text + icon.font_class === this.icon) {
            this.$set(icon, 'isSelected', true)
          } else {
            this.$set(icon, 'isSelected', false)
          }
        })
      }
    },
    watch: {
      icon (val) {
        if (val === '') {
          this.iconList.glyphs.map(icon => {
            this.$set(icon, 'isSelected', false)
          })
        } else {
          this.iconList.glyphs.map(icon => {
            if (this.iconList.css_prefix_text + icon.font_class === val) {
              this.$set(icon, 'isSelected', true)
            } else {
              this.$set(icon, 'isSelected', false)
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .font-container {
    padding: 16px;
    text-align: center;

    .font-icon-container {
      display: flex;
      flex-wrap: wrap;
      height: 400px;
      overflow: auto;

      .font-icon-item {
        padding: 12px;
        margin: 8px;
        font-size: 26px;
        border: 1px solid transparent;
        cursor: pointer;
        width: 76px;
        height: 76px;
        &:hover {
          border: 1px solid #4778C7;
          border-radius: 30px;
        }

        &.font-icon-selected {
          background: transparent;
          border: 1px solid #4778C7;
          border-radius: 30px;
        }
      }
    }
  }
</style>
