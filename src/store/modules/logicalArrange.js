
const logicalArrange = {
  state: {
    // 全局变量
    globalVariable: [],
    // 入参变量
    inParamVariable: []
  },

  mutations: {
    SET_GLOBAL_V: (state, globalVariable) => {
      state.globalVariable = globalVariable
    },
    SET_IN_PARAM_V: (state, inParamVariable) => {
      state.inParamVariable = inParamVariable
    }

  },

  actions: {
  }
}

export default logicalArrange
