import DateUtil from '../date'
import convertNumberToChinese from './convertNumberToChinese'
import assignmentGetValue from './assignment'
import ifNodeFn from './ifNodeFn'
// 获取函数的参数值
import getParamsValue from './getParamsValue'
import queryRequest from '../../components/KPageDesign/utils/queryFn'
import { renderTemplate, isFullUrl, getLocalhostPath } from '../../components/KPageDesign/utils/utils'
import CommonUtil from './commonUtil'
class LogicflowEngine {
  constructor () {
    // 页面vuex store对象
    this.store = {}
    // 编排节点数据
    this.graphData = {}
    // 所有变量、参数挂载
    this.variable = {}
    // 初始化参数列表
    this.inParamVariable = []
    // 编排执行节点列表
    this.nodeList = []
    // 输出内容值
    this.outParamValue = ''
  }
  load (data) {
    const { graphData, variable, eventParams, store } = data
    this.store = store
    this.nodeList = this.dataTransformation(graphData)
    // 全局变量处理
    variable.globalVariable.forEach(item => {
      this.variable[item.name] = undefined
    })
    variable.inParamVariable.forEach(item => {
      this.variable[item.name] = undefined
    })
    this.inParamVariable = variable.inParamVariable
    // 事件传递的参数
    this.eventParams = eventParams
    return this.run(this.nodeList)
  }
  // 初始数据排序转换
  dataTransformation (graphData) {
    const nodes = graphData.nodes
    const edges = graphData.edges
    const nodesIdMap = new Map()
    const edgesIdMap = new Map()
    let startId = ''
    // 建立node节点id和配置项映射
    for (const node of nodes) {
      if (node.properties.businessAttr.category === 'start') {
        startId = node.id
      }
      nodesIdMap.set(node.id, { ...node.properties.businessAttr, id: node.id, name: node.text.value })
    }
    // 建立边的前后联系映射
    for (const edge of edges) {
      const { properties, sourceNodeId, targetNodeId, id } = edge
      if (properties.textFlag) {
        if (edgesIdMap.get(sourceNodeId)) {
          const ynObj = edgesIdMap.get(sourceNodeId)
          ynObj[properties.textFlag] = targetNodeId
          edgesIdMap.set(sourceNodeId, ynObj)
        } else {
          edgesIdMap.set(sourceNodeId, { [properties.textFlag]: targetNodeId })
        }
      } else if (properties.businessAttr && properties.businessAttr.category === 'multiBranch') {
        nodesIdMap.set(id, { ...properties.businessAttr, id, name: edge.text.value })
        if (edgesIdMap.get(sourceNodeId)) {
          const childObj = edgesIdMap.get(sourceNodeId)
          const index = Object.keys(childObj).length
          childObj[`children${index}`] = id
          edgesIdMap.set(sourceNodeId, childObj)
          edgesIdMap.set(id, targetNodeId)
        } else {
          edgesIdMap.set(sourceNodeId, { children0: id })
          edgesIdMap.set(id, targetNodeId)
        }
      } else {
        edgesIdMap.set(sourceNodeId, targetNodeId)
      }
    }
    // 根据前后关系映射建立顺序数组
    function recursion (curId, isErgodic) {
      const nodeList = []
      while (curId) {
        const node = nodesIdMap.get(curId)
        nodeList.push(node)
        if (node.category === 'endErgodic' && isErgodic) {
          return { nodeList, curId: edgesIdMap.get(curId) }
        }
        // 遍历处理
        curId = edgesIdMap.get(curId)
        if (node.category === 'startErgodic') {
            const endErgodicRes = recursion(curId, true)
            node.children = endErgodicRes.nodeList
            curId = endErgodicRes.curId
        }
        // 条件分支处理
        if (typeof curId === 'object') {
          // 处理双条件分支
          if (curId.yes && curId.no) {
            const { yes, no } = curId
            node.yes = recursion(yes)
            node.no = recursion(no)
            curId = ''
          } else {
            // 处理多条件分支
            Object.keys(curId).forEach(item => {
              node[item] = recursion(curId[item])
            })
            curId = ''
          }
        }
      }
      return nodeList
    }
    return recursion(startId)
  }
  /**
   *  开始执行流程。
   */
  async run (nodeList) {
    for (const node of nodeList) {
      try {
        if (node.category !== 'end') {
          if (node.category === 'ifNode' || node.category === 'multiBranchNode') {
            const waitBranch = await this.execute(node)
            await this.run(waitBranch)
            break
          }
          await this.execute(node)
        } else {
          this.outParamValue = node.outParamName && this.variable[node.outParamName]
          return
        }
      } catch (error) {
        const log = `编排节点报错日志\n节点ID:${node.id}\n节点名称：${node.name}\n报错信息：${error}`
        if (process.env.VUE_APP_KFROM_LIB) {
          // eslint-disable-next-line no-undef
          consoleError(log)
        } else {
          console.error(log)
        }
        break // 中断循环
      }
    }
  }
  /**
   * 执行流程
   */
  async execute (option) {
    return new Promise((resolve, reject) => {
      try {
        let res = ''
        const interactiveNode = [
          'showNode',
          'hideNode',
          'readNode',
          'editNode',
          'requiredNode',
          'unrequiredNode',
          'requiredMarkNode',
          'unrequiredMarkNode'
        ]
        if (interactiveNode.includes(option.category)) {
          res = this.interactiveNode(option)
        } else {
          res = this[option.category](option)
        }
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

  // 相关节点操作
  // 开始节点
  start (option) {
    if (option.paramsList.length !== 0) {
      this.inParamVariable.forEach((item, index) => {
        this.variable[item.name] = this.eventParams[index]
      })
    }
  }
  // if节点
  ifNode (option) {
    if (ifNodeFn(option, this.variable)) {
      return option.yes
    } else {
      return option.no
    }
  }
  multiBranchNode (option) {
    let index = 0
    while (option[`children${index}`]) {
      const ruleOption = option[`children${index}`][0]
      if (ifNodeFn(ruleOption, this.variable)) {
        return option[`children${index}`].slice(1)
      } else {
        index += 1
      }
    }
    return option[`children${index - 1}`].slice(1)
  }
  // 赋值节点
  assignment (option) {
    option.assignmentList.forEach(item => {
      if (item.leftValue) {
        if (item.leftValue.includes('.')) {
          const objName = item.leftValue.split('.')[0]
          const field = item.leftValue.split('.')[1]
          if (typeof this.variable[objName] !== 'object') {
            this.variable[objName] = {}
          }
          this.variable[objName][field] = assignmentGetValue(item, this.variable, this.store)
        } else {
          this.variable[item.leftValue] = assignmentGetValue(item, this.variable, this.store)
        }
      }
    })
    console.log(this.variable)
  }
  callApi (option) {
    const callback = (flag, res) => {
      if (flag === 'success') {
        this.variable[option.outParamName] = res.data
      }
    }
    return queryRequest({ restOption: option.restData }, callback, this.variable)
  }
  callFn (option) {
    const fn = window[option.fnName] || (window.vm && window.vm[option.fnName])
    const paramsList = option.parameter.map(item => {
      return getParamsValue(item, this.variable)
    })
    if (fn) {
      fn(...paramsList)
    }
  }
  callJsFn (option) {
    const enhanceJs = this.store.state.global.jscode
    const fn = enhanceJs[option.fnName]
    const paramsList = option.parameter.map(item => {
      return getParamsValue(item, this.variable)
    })
    if (fn) {
      fn(...paramsList)
    }
  }
  callComponent (option) {
    const watchObj = this.store.state.global.watchObj
    const fn = watchObj && watchObj[option.componentId] && watchObj[option.componentId][option.componentFn]
    const paramsList = option.parameter.map(item => {
      return getParamsValue(item, this.variable)
    })
    if (fn) {
      fn(...paramsList)
    }
  }
  callCommonFn (option) {
    const fn = CommonUtil[option.fnName]
    const paramsList = option.parameter.map(item => {
      return getParamsValue(item, this.variable)
    })
    let res
    if (fn) {
      res = fn(...paramsList)
    }
    if (res) {
      this.variable[option.outParamName] = res
    }
  }
  interactiveNode (option) {
    this.store.state.global.kbObj.controlComponents(option)
  }
  setDataNode (option) {
    option.assignmentList.forEach(item => {
      const rightValue = assignmentGetValue(item, this.variable, this.store)
      this.store.state.global.kbObj.controlSetData(item.leftValue, rightValue)
    })
  }
  clearDataNode (option) {
    this.store.state.global.kbObj.controlClearData(option.componentList)
  }
  openWinNode (option) {
    const actionUrl = renderTemplate(option.winUrl, this.variable)
    const winUrl = isFullUrl(actionUrl) ? actionUrl : `${getLocalhostPath()}${actionUrl}`
    if (option.openType === '1') {
      window.open(winUrl)
    } else if (option.openType === '2') {
      // 使用bpm平台的公共方法打开流程页面
      // eslint-disable-next-line
      bpm.projectModule.projectOpt.openProject(this.variable[option.paramName])
    } else if (option.openType === '3') {
      // 使用miniUI打开
      window.top.mini.open({
        title: option.title,
        url: winUrl,
        width: option.width || window.top.innerWidth,
        height: option.height || window.top.innerHeight
      })
    }
  }
  formatDateChange (option) {
    this.variable[option.afterChange] = DateUtil.formatDate(this.variable[option.beforeChange], option.format)
  }
  addDate (option) {
    let res = ''
    console.log(this.variable[option.afterChange])
    if (option.changeType === 'year') {
      res = DateUtil.addYears(option.changeDate, this.variable[option.beforeChange])
    } else if (option.changeType === 'month') {
      res = DateUtil.addMonths(option.changeDate, this.variable[option.beforeChange])
    } else if (option.changeType === 'day') {
      res = DateUtil.addDays(option.changeDate, this.variable[option.beforeChange])
    }
    this.variable[option.afterChange] = DateUtil.formatDate(res, 'YYYY-MM-DD')
  }
  subtractDate (option) {
    let res = ''
    console.log(this.variable[option.afterChange])
    if (option.changeType === 'year') {
      res = DateUtil.subtractYears(option.changeDate, this.variable[option.beforeChange])
    } else if (option.changeType === 'month') {
      res = DateUtil.subtractMonths(option.changeDate, this.variable[option.beforeChange])
    } else if (option.changeType === 'day') {
      res = DateUtil.subtractDays(option.changeDate, this.variable[option.beforeChange])
    }
    this.variable[option.afterChange] = DateUtil.formatDate(res, 'YYYY-MM-DD')
  }
  dateToTime (option) {
    this.variable[option.afterChange] = DateUtil.dateToTime(this.variable[option.beforeChange])
  }
  timeToDate (option) {
    const res = DateUtil.timeToDate(this.variable[option.beforeChange])
    this.variable[option.afterChange] = DateUtil.formatDate(res, 'YYYY-MM-DD HH:mm:ss')
  }
  moneyChange (option) {
    this.variable[option.afterChange] = convertNumberToChinese(Number(this.variable[option.beforeChange]))
  }
  numToFixed (option) {
    this.variable[option.afterChange] = Number(this.variable[option.beforeChange]).toFixed(option.toFixed)
  }
  openMessage (option) {
    const { type, contentType, content } = option
    let contentString = content
    if (contentType === 'variableValue') {
      contentString = this.variable[content]
    }
      window.$message[type](contentString)
  }
  async startErgodic (option) {
    const dataArr = this.variable[option.ergodicVariable]
    if (Array.isArray(dataArr)) {
      const endOption = option.children.slice(-1)[0]
      option.children.pop()
      // 如果需要返回值
      if (endOption.outParamName && option.resItem) {
        const results = []
        for (let index = 0; index < dataArr.length; index++) {
          const item = dataArr[index]
          this.variable._item = item
          this.variable._index = index
          await this.run(option.children)
          results.push({ ...this.variable.result_item })
        }
        this.variable[endOption.outParamName] = results
      } else {
        for (let index = 0; index < dataArr.length; index++) {
          const item = dataArr[index]
          this.variable.item = item
          this.variable.index = index
          await this.run(option.children)
        }
      }
    }
    delete this.variable._item
    delete this.variable._index
    delete this.variable.result_item
  }
}
export default LogicflowEngine
