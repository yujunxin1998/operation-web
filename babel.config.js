const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const IS_LIB = process.env.VUE_APP_KFROM_LIB === 'true'
const plugins = []
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

// lazy load ant-design-vue
// if your use import on Demand, Use this code
plugins.push(['import', {
  'libraryName': 'ant-design-vue',
  'libraryDirectory': 'es',
  'style': true // `style: true` 会加载 less 文件
}])
// if your use import on Demand, Use this code
plugins.push(['import', {
  libraryName: 'vant',
  libraryDirectory: 'es',
  style: true
}, 'vant'])
// 添加 @babel/plugin-proposal-class-properties 插件
plugins.push('@babel/plugin-proposal-class-properties')
// lazy load vxe-table
if (IS_LIB) {
  plugins.push(['import', {
    libraryName: 'vxe-table',
    style: true // 样式按需加载
  }, 'vxe-table'])
  plugins.push(['import', {
    libraryName: 'vxe-pc-ui',
    style: true // 样式按需加载
  }, 'vxe-pc-ui'])
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry',
        'corejs': 3
      }
    ]
  ],
  plugins
}
