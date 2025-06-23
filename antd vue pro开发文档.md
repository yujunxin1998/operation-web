# 脚手架使用
## 下载脚手架项目并安装依赖
1. 通过SVN下载脚手架项目
    SVN地址：

  **注意：脚手架项目下载后要修改为项目SVN地址，不要在脚手架项目中提交代码**

2. 进入项目根目录，安装项目所属依赖
    `npm install`或`cnpm install`或`yarn install`
    **不需要的项目依赖，可以在package.json中删除后在进行`npm install`安装**

3. 启动项目
    `npm run serve` 或`yarn run serve`

## 目录结构
```bash
├── public
│   └── logo.png             # LOGO
|   └── index.html           # Vue 入口模板
├── src
│   ├── api                  # Api ajax 等
│   ├── assets               # 本地静态资源
│   ├── config               # 项目基础配置，包含路由，全局设置
│   ├── components           # 业务通用组件
│   ├── core                 # 项目引导, 全局配置初始化，依赖包引入等
│   ├── router               # Vue-Router
│   ├── store                # Vuex
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── views                # 业务页面入口和常用模板
│   ├── App.vue              # Vue 模板入口
│   └── main.js              # Vue 入口 JS
│   └── permission.js        # 路由守卫(路由权限控制)
│   └── global.less          # 全局样式
├── tests                    # 测试工具
├── README.md
└── package.json
```



## 动态路由说明

**@/permission.js**

`router.beforeEach`：路由跳转前获取用户角色、路由权限，调用`GenerateRoutes`动态生成可访问路由表，通过`router.addRoutes`动态添加

**@/store/modules/async-router.js**

`GenerateRoutes`调用`generatorDynamicRouter`获取动态路由，添加到状态管理

**@/router/generator-routers.js**

根据后台获取的数据，转换成树形，动态生成层级路由表，**只需要修改接口即可**



## 项目依赖

* antv/g2 - v4.0.7

  [g2教程](https://g2.antv.vision/zh/docs/manual/getting-started)

* antv/g6 -3.4.8

  关系数据可视化引擎与图分析工具。

  [g6文档](https://g6.antv.vision/zh/docs/manual/introduction)

* ant-design-vue - 1.2.4

  [Ant Design of Vue 组件](https://www.antdv.com/docs/vue/introduce-cn/)

* axios - 0.19.2

  Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

  [axios中文说明](https://www.kancloud.cn/yunye/axios/234845)

* moment - 2.24.0

  JavaScript日期处理类库

  [moment.js中文文档](http://momentjs.cn/docs/)

* normalize.css - 8.0.1

  Normalize.css是一种CSS reset的替代方案。它在默认的HTML元素样式上提供了跨浏览器的高度一致性。

* v-viewer - 1.5.1

  [Vue图片浏览组件v-viewer中文文档]([https://mirari.cc/2017/08/27/Vue%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E7%BB%84%E4%BB%B6v-viewer%EF%BC%8C%E6%94%AF%E6%8C%81%E6%97%8B%E8%BD%AC%E3%80%81%E7%BC%A9%E6%94%BE%E3%80%81%E7%BF%BB%E8%BD%AC%E7%AD%89%E6%93%8D%E4%BD%9C/](https://mirari.cc/2017/08/27/Vue图片浏览组件v-viewer，支持旋转、缩放、翻转等操作/))

* vue-gemini-scrollbar - 2.0.1

  [vue-gemini-scrollbar文档](https://www.npmjs.com/package/vue-gemini-scrollbar/v/2.0.0)

* vue-pdf - 4.0.8

  [vue-pdf文档](https://developer.aliyun.com/mirror/npm/package/vue-pdf/v/4.0.8)

* ol - 5.2.0

  [openlayers官网](https://openlayers.org/)

* vue2-leaflet - 2.5.2

* vue-splitpane

	Vue分割面板

* bpmn.js

  流程图

  [bpmn.js官网](https://bpmn.io/toolkit/bpmn-js/)

  [vue 中使用 bpmn.js](https://www.cnblogs.com/lemoncool/p/12660812.html)

## 公共函数

### antdUtil.js

| 函数名          | 描述                               | 默认值 |
| --------------- | ---------------------------------- | ------ |
| setHeaderAlign  | 设置antd vue table表格表头对齐方式 | center |
| getSelectedKeys | 单击行选中checkbox或radio          |        |



### validation.js

validation.js中的校验用于表单字段校验，返回校验是否通过**true/false**

#### 通用：

| 函数名                      | 参数                | 描述                   | 校验规则                |
| --------------------------- | ------------------- | ---------------------- | ----------------------- |
| validateIDCard              | value: 需要校验的值 | 身份证号校验           | 15位或18位身份证号      |
| validateEmail               | value: 需要校验的值 | 邮箱校验               | 邮箱                    |
| validateZipCode             | value: 需要校验的值 | 邮编校验               | 6位邮政编码             |
| validatePhoneNum            | value: 需要校验的值 | 电话（手机或固话）校验 | 11位手机号或区号-座机号 |
| validateFixedPhone          | value: 需要校验的值 | 固话（不带区号）校验   | 例如：76458961          |
| validateFixedPhoneAreaCode  | value: 需要校验的值 | 固话（带区号）校验     | 例如：0930-7898888      |
| validateFixedPhoneExtension | value: 需要校验的值 | 固话（带分机）校验     | 例如：0931-76458961-626 |
| validateAreaCode            | value: 需要校验的值 | 区号校验               | 例如：0930              |
| validateMobilePhone         | value: 需要校验的值 | 手机号校验             | 11位手机号码            |

#### 数字校验：

| 函数名          | 参数                | 描述          |
| --------------- | ------------------- | ------------- |
| validateNeqZero | value: 需要校验的值 | 非0校验       |
| validateGtZero  | value: 需要校验的值 | 大于0校验     |
| validateLtZero  | value: 需要校验的值 | 小于0校验     |
| validateGteZero | value: 需要校验的值 | 大于等于0校验 |
| validateLteZero | value: 需要校验的值 | 小于等于0校验 |

#### 业务：

| 函数名             | 参数                | 描述                 | 校验规则                                                     |
| ------------------ | ------------------- | -------------------- | ------------------------------------------------------------ |
| validateSocialCode | value: 需要校验的值 | 社会统一信用代码校验 | 登记管理部门代码1位<br />机构类别代码1位<br />登记管理机关行政区代码6位<br />主题标识码（组织机构代码）9位<br />检验码1位 |

### request.js

* 请求拦截器：在请求发起之前执行的一些处理逻辑，如请求头添加token
* 响应拦截器：接口返回数据后先进入响应拦截器，可针对不同响应码进行处理，如token失效跳转登录

| 函数名                              | 参数                                                         | 描述                                               |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| **post**(url, data, otherConfig)    | url: 请求接口地址<br />data: 请求参数<br />otherConfig：其他请求参数，如headers等 | post请求                                           |
| **get**(url, data, otherConfig)     | 同上                                                         | get请求                                            |
| **del**(url, data, otherConfig)     | 同上                                                         | delete请求（通用，支持data、params两种形式的参数） |
| **delData**(url, data, otherConfig) | 同上                                                         | delete请求（接口只接收data类型的参数）             |

## 公共样式

暂无

## 公共组件

### SystemList.vue

SytstemList是系统公用列表组件，根据需要展示查询条件、工具栏、表格

#### 配置项

| 配置项                | 类型           | 默认值                                                    | 描述                                                         |
| --------------------- | -------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| ajaxOptions           | Object         | {<br />url: "",<br />method: "GET"<br />params: {}<br />} | 列表数据请求参数                                             |
| headerAlign           | String         | ”center“                                                  | 表头行 列对齐方式                                            |
| buttons               | Array          | []                                                        | 工具栏按钮<br />{<br />type: "按钮类型",<br />id: "按钮id",<br />icon: "按钮图标"<br />text: "按钮文字"<br />} |
| columns               | Array          | []                                                        | 表格列，同Antd                                               |
| pagination            | Object/Boolean | {}                                                        | 分页信息，同Antd，`flase`表示不展示分页                      |
| showAsTree            | Boolean        | false                                                     | 是否按照树形展示，设置为”true“，会将数据封装成children的形式，用于树展示 |
| expandIconColumnIndex | Number         | 0                                                         | 默认展开图标的列索引，同Antd                                 |
| defaultExpandAllRows  | Boolean        | false                                                     | 默认展开所有行，同Antd                                       |
| defaultLoad           | Boolean        | true                                                      | 是否默认进行数据加载                                         |
| rowSelection          | Object         |                                                           | 用于展示Table行多选、单选按钮，同Antd                        |
| rowKey                | String         | ”id“                                                      | 表格行唯一索引                                               |
| searchItems           | Array          | []                                                        | 查询条件                                                     |
| allowEdit             | Boolean        | false                                                     | 是否可编辑，设置为`true`                                     |
| operations            | Array          | []                                                        | 自定义操作列<br />{<br />name: "按钮名称"<br />click: () => {<br />//点击事件处理函数<br />}<br />} |

#### 函数

调用方式： 

1. table绑定ref="list"
2. this.$refs.list.methods();

| 函数                | 参数                   | 描述     |
| ------------------- | ---------------------- | -------- |
| addRow(row)         | row: 新增行            | 新增一行 |
| deleteRow(rowIndex) | rowIndex：删除行的索引 | 删除一行 |



#### 回调

| 函数       | 参数                         |
| ---------- | ---------------------------- |
| change     | 分页、过滤、排序触发，同Antd |
| rowClick   | 表格行点击事件               |
| rowDbClick | 表格行双击事件               |



# 常见问题处理

## 自定义图标

* 自定义业务系统图标

  1. 在[iconfont网站](https://www.iconfont.cn/)将字体图标下载，并放在**@/assets/fonts**文件夹下

  2. **@/config/defaultSettings.js**设置iconfontUrl

  ```js
  export default {
    // ......
    // iconfontUrl: '//at.alicdn.com/t/font_1815484_kgempt9gh9o.js',
    iconfontUrl: require('@/assets/fonts/iconfont.js')
  }
  ```

  3. **main.js**自定义图标组件

  ```js
  import { Icon } from 'ant-design-vue'
  import defaultSettings from '@/config/defaultSettings'   //图标js配置
  
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: defaultSettings.iconfontUrl
  })
  Vue.component('IconFont', IconFont)
  ```

  4. 使用

  ```vue
  <icon-font type="iconfont-settings"></icon-font>
  ```

  

* 自定义路由菜单图标

  1. 将菜单svg图标下载并放在**@/assets/icons**文件夹下

  ```js
  import btnPers from '@/assets/icons/btn-pers.svg?inline'
  import btnSystem from '@/assets/icons/btn-system.svg?inline'
  import btnFlow from '@/assets/icons/btn-flow.svg?inline'
  import btnFlowConfig from '@/assets/icons/btn-flow-config.svg?inline'
  import btnDict from '@/assets/icons/btn-dict.svg?inline'
  
  export { btnPers, btnSystem, btnFlow, btnFlowConfig, btnDict }
  ```

  3. 在渲染路由菜单时**@/router/generator-routers.js**使用svg图标

  ```js
  import * as icons from '@/core/icons'
  
  meta: {
      // ......
      icon: icons[icon] || icon || undefined,
      // ......
  }
  ```

  4. 增加图标

     新增图标放在**@/assets/icons**文件夹下，在**@/core/icons.js**引入菜单图标svg，并导出即可