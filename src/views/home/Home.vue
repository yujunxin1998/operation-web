<template>
  <div class="home-container">
    <a-button type="primary" @click="changeMenu('/libTable')">库表交换</a-button>
    <a-button type="primary" @click="changeMenu('/fileExchange/exchange')">交换情况分析</a-button>
    <a-button type="primary" @click="changeMenu('/systemManage')">系统运维</a-button>
    <a-button type="primary" @click="changeMenu('/systemManage/pers/persList')">人员管理</a-button>
    <a-button type="primary" @click="changeMenu('/systemManage/system/module')">系统管理</a-button>
    <a-button type="primary" @click="changeMenu('/systemManage/system/module')">菜单管理</a-button>
    <a-button type="primary" @click="changeMenu('/systemManage/system/dictList')">字典管理</a-button>
  </div>
</template>

<script>
import bus from '@/utils/bus'

export default {
    name: 'Home',
    methods: {
        changeMenu (route) {
            bus.$emit('changMenu', route)
        }
    }
}
</script>

<style lang="less" scoped>
.home-container{
  display: flex;

  /deep/ .ant-btn{
    margin: 10px;
  }
}
</style>
