var ace = require('brace')
require('brace/ext/emmet')
require('brace/mode/javascript') // js格式化用
require('brace/ext/searchbox') // 引入搜索框扩展
module.exports = {
  render: function (h) {
    var height = this.height ? this.px(this.height) : '100%'
    var width = this.width ? this.px(this.width) : '100%'
    return h('div', {
      attrs: {
        style: 'height: ' + height + '; width: ' + width
      }
    })
  },
  props: {
    value: String,
    lang: true,
    theme: String,
    height: true,
    width: true,
    options: Object,
    autoComplete: Boolean
  },
  data: function () {
    return {
      editor: null,
      contentBackup: ''
    }
  },
  methods: {
    px: function (n) {
      if (/^\d*$/.test(n)) {
        return n + 'px'
      }
      return n
    }
  },
  watch: {
    value: function (val) {
      if (this.contentBackup !== val) {
        this.editor.session.setValue(val, 1)
        this.contentBackup = val
      }
    },
    theme: function (newTheme) {
      this.editor.setTheme('ace/theme/' + newTheme)
    },
    lang: function (newLang) {
      this.editor.getSession().setMode(typeof newLang === 'string' ? ('ace/mode/' + newLang) : newLang)
    },
    options: function (newOption) {
      this.editor.setOptions(newOption)
    },
    height: function () {
      this.$nextTick(function () {
        this.editor.resize()
      })
    },
    width: function () {
      this.$nextTick(function () {
        this.editor.resize()
      })
    }
  },
  beforeDestroy: function () {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted: function () {
    var vm = this
    var lang = this.lang || 'text'
    var theme = this.theme || 'chrome'
    var autoComplete = this.autoComplete || false

    var editor = vm.editor = ace.edit(this.$el)
    editor.$blockScrolling = Infinity

    this.$emit('init', editor)

    // editor.setOption("enableEmmet", true);
    editor.getSession().setMode(typeof lang === 'string' ? ('ace/mode/' + lang) : lang)
    editor.setTheme('ace/theme/' + theme)
    if (this.value) { editor.setValue(this.value, 1) }
    this.contentBackup = this.value

    editor.on('change', function () {
      var content = editor.getValue()
      vm.$emit('input', content)
      vm.contentBackup = content
    })
    if (vm.options) { editor.setOptions(vm.options) }

    // 插入以下代码块
    if (autoComplete) {
      editor.completers.push({
        getCompletions: function (editor, session, pos, prefix, callback) {
          vm.$emit('setCompletions', editor, session, pos, prefix, callback)
        }
      })

      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true// 智能补全
      })
    }

    // 添加搜索框快捷键（Ctrl-F）
    editor.commands.addCommand({
      name: 'showSearchBox',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: (editor) => {
        // ace.require('ace/ext/searchbox').Search(editor)
        editor.execCommand('find')
        editor.execCommand('replace')
        this.$nextTick(() => {
          // 获取所有具有特定类名的元素
          const aceSearchbtn = document.querySelectorAll('.ace_searchbtn')
          // 遍历所有匹配的元素并修改文本内容
          aceSearchbtn.forEach(element => {
            const action = element.attributes.action
            if (action && action.nodeValue === 'findAll') {
              element.textContent = '查找全部'
            }
            if (action && action.nodeValue === 'replaceAll') {
              element.textContent = '替换全部'
            }
            if (action && action.nodeValue === 'replaceAndFindNext') {
              element.textContent = '替换'
            }
          })
          const aceButton = document.querySelectorAll('.ace_button')
          aceButton.forEach(element => {
            const action = element.attributes.action
            if (action && action.nodeValue === 'toggleRegexpMode') {
              element.title = '正则搜索'
            }
            if (action && action.nodeValue === 'toggleCaseSensitive') {
              element.title = '区分大小写'
            }
            if (action && action.nodeValue === 'toggleWholeWords') {
              element.title = '全词匹配'
            }
            if (action && action.nodeValue === 'searchInSelection') {
              element.title = '根据选择内容搜索'
            }
          })
          const aceSearchField = document.querySelectorAll('.ace_search_field')
          aceSearchField.forEach(element => {
            console.log(element)
            if (element.placeholder === 'Search for') {
              element.placeholder = '请输入要查找的内容'
            }
            if (element.placeholder === 'Replace with') {
              element.placeholder = '请输入要替换的内容'
            }
          })
        })
      }
    })
  
    // 覆盖默认的 Ctrl-Z 撤销命令，使其无效
  editor.commands.addCommand({
    name: 'disableUndo',
    bindKey: { win: 'Ctrl-Z', mac: 'Command-Z' },
    exec: function(editor) {
      // 不执行任何操作，禁用撤销功能
      const session = editor.getSession()
      if (session.getUndoManager().$undoStack.length > 1) {
        session.getUndoManager().undo()
      }
    },
    readOnly: true // 在只读模式下也不执行
  })


  // 其他初始化设置
  editor.setTheme('ace/theme/chrome')
  editor.session.setMode('ace/mode/javascript')

  vm.$emit('editorReady', editor)
    vm.$emit('load', editor)
  }
}
