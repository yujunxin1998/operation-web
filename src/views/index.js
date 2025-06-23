import Vue from 'vue'
import '../core/lazy_use'
import Dict from './system/dict/Dict.vue'
import Counter from './system/counter/Counter.vue'
import SymbolGl from './system/symbol/SymbolGl.vue'
import Menus from './system/menus/Menus.vue'
import Pers from './pers/Pers.vue'
import Roles from './pers/Roles.vue'
import * as services from '../api'
Vue.prototype.$bpmSystemProServices = services

const components = [
  Dict, // 字典
  Counter, // 计数器
  SymbolGl, // 文号
  Menus, // 菜单
  Pers, // 机构
  Roles // 角色
]

const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    components.forEach(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

// 暴露安装方法和组件
const ChatRobotPlugin = {
  install,
  Dict,
  Counter,
  SymbolGl,
  Menus,
  Pers,
  Roles
}

export default ChatRobotPlugin
export {
  Dict,
  Counter,
  SymbolGl,
  Menus,
  Pers,
  Roles
}
