<template>
  <div class="font-container">
    <div class="font-icon-container">
      <a-icon
        v-for="(value, key) in iconList"
        :key="key"
        :component="value"
        class="font-icon-item"
        :class="{'font-icon-selected': iconList[key].isSelected}"
        @click="selectIcon(key)" />
    </div>
    <a-button type="primary" @click="handleOk">确定</a-button>
  </div>
</template>

<script>
import * as iconfont from '../../core/icons.js'
export default {
    name: 'MenuIconList',
    props: {
        icon: {
            type: String,
            required: false,
            default: ''
        }
    },
    data () {
        return {
            iconList: iconfont
        }
    },
    methods: {
        selectIcon (id) {
            for (const key of Object.keys(this.iconList)) {
                if (key === id) {
                    this.$set(this.iconList[key], 'isSelected', true)
                } else {
                    this.$set(this.iconList[key], 'isSelected', false)
                }
            }
        },
        handleOk () {
            const icons = Object.keys(this.iconList).filter(key => {
                return this.iconList[key].isSelected === true
            })

            if (icons.length <= 0) {
                this.$message.info('请选择一个图标')
                return
            }
            const iconCls = icons[0]
            this.$emit('submit', iconCls)
        },
        resetSelectedIcon () {
            for (const key of Object.keys(this.iconList)) {
                if (key === this.icon) {
                    this.$set(this.iconList[key], 'isSelected', true)
                } else {
                    this.$set(this.iconList[key], 'isSelected', false)
                }
            }
        }
    },
    watch: {
        icon (val) {
            if (val === '') {
                for (const key in Object.keys(this.iconList)) {
                    this.$set(this.iconList[key], 'isSelected', false)
                }
            } else {
                for (const key in Object.keys(this.iconList)) {
                    if (key === val) {
                        this.$set(this.iconList[key], 'isSelected', true)
                    } else {
                        this.$set(this.iconList[key], 'isSelected', false)
                    }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.font-container{
    text-align: center;

    .font-icon-container{
        display: flex;
        flex-wrap: wrap;

        .font-icon-item{
            padding: 12px;
            margin: 8px;
            font-size: 26px;
            border: 1px solid #FFF;

            &:hover{
                border: 1px solid #4778C7;
                border-radius: 30px;
            }

            &.font-icon-selected{
                background: #F1F8FE;
                border: 1px solid #4778C7;
                border-radius: 30px;
            }
        }
    }
}
</style>
