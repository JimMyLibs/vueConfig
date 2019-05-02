# 快速开始
## 下载及安装项目依赖
1. clone项目master分支
```
git clone git@192.168.18.14:html5/lixiong.git
```
2. 安装项目依赖  
*切换到项目根目录（及package.json文件所在目录）*
```
git npm install
```

## 创建项目
1. 修改配置文件（/projectConfig.js）
  * 根据文件中注释说明，修改“PROJECT_DIR_NAME”项的值为新建项目名
  * “PROJECT_DIR_NAME”值格式为：项目类型/项目名
  * 建议项目名与git分支名一致
2. 创建项目
```
npm run create
```

## 启动本地服务
* 启动服务切自动打开浏览器
```
npm start
```
* 仅启动服务，不打开浏览器
```
npm run dev
```
*以上命令二选一即可。start通常用于初次启动服务，后续修改需重启可使用dev命令，避免重复打开浏览器*



# 项目主要目录及文件说明
```
config # 打包配置文件  
 |    |--utils # 打包工具方法，暂时只有获取本机ip地址方法  
 |    |--webpack.base.js # webpack基本配置文件  
 |    |--webpack.dev.js # 开发环境webpack配置文件  
 |    |--webpack.prod.js # 生产环境webpack配置文件  
node_modules # node模块目录  
release # 打包文件输出目录，会根据项目名及当前日期自动生成文件夹
source_code # 工程源码目录。  
 |--activity # 活动统一目录，每一个文件夹对应一个单独的活动  
 |--assets # 工程资源目录，目前为工程图片资源目录  
 |    |--icon # icon图片存放目录  
 |--business # 工程公共业务目录  
 |--components # 工程公共组件库
 |--config # 公共配置文件
 |    |--apiConf.js # 接口地址配置
 |    |--apiInfo.js # 远程接口配置
 |    |--responseInfo.js # 接口正确错误的通用判断配置   
 |    |--weChatApi.js # 微信授权等配置
 |--demo # demo类型项目目录
 |    |--example(示例项目及创建项目源文件)  
 |    |    |--assets # 项目资源目录，目前为图片资源目录  
 |    |    |--components # 项目公共组件目录  
 |    |    |--mock # mock数据文件夹目录  
 |    |    |--pages # 项目路由对应页面目录  
 |    |    |--public # 项目公共样式目录
 |    |    |--router # 路由配置目录  
 |    |    |--static # 项目静态资源，编译时不进行处理的资源都放这里  
 |    |    |--store # 基于vuex的状态管理模块  
 |    |    |    |--index.js # xuex相关配置文件，可自行扩展
 |    |    |--utils # 项目公共方法及配置文件  
 |    |    |    |--http.js # 全局请求api配置文件
 |    |    |    |--init.js # 项目初始化配置文件
 |    |    |--App.vue # 项目根视图  
 |    |    |--main.js # 项目项目入口文件  
 |    |    |--index.html # 项目html模板文件   
 |--project_static # 项目静态资源，编译时不进行处理的资源都放这里  
 |--public # 项目公共样式目录，统一使用.css文件，可以使用PreCSS语法  
 |--store # 全局vuex相关文件
 |--utils # 公共库函数  
 |    |--core # 工程核心层目录，底层文件，请勿随意更改  
 |    |--addSecretVconsole.js # 动态增加vconsole文件  
 |    |--checkForm.js # 表单验证相关处理
 |    |--CollectBehavior.js # 埋点封装类
 |    |--dateFormat.js # 时间格式化处理  
 |    |--encrypt.js # 网络传输加密处理  
 |    |--Http.js # 网络请求服务，实现了对fetch的二次封装  
 |    |--init.js # 项目初始化操作  
 |    |--mockAction.js # 关于mock文件行为的处理  
 |    |--Native.js # 与客户端操作封装处理  
 |    |--numberFormat.js # 数字相关处理  
 |    |--setRem.js # rem单位初始化的处理  
 |    |--url.js # url地址相关处理  
 |    |--utils.js # 其他零散功能  
 |    |--vueDirective.js # vue指令扩展处理  
 |    |--vueFilters.js # vue过滤扩展处理  
 |    |--vueMixin.js # vue方法扩展处理  
 |    |--vueRouter.js # vue-router扩展处理  
 |    |--vueUtils.js # vue工具类方法扩展处理  
 |    |--WeChat.js # 微信相关操作  
.babelrc # babel配置文件（删除会出错）  
.eslintrc.json # eslint配置文件
package.json # package依赖配置  
projectConfig.js # 项目配置文件（新建项目以后，首先需要配置这个文件）  
README.md # 项目说明文件  
webpack.config # webpack配置入口文件  
```

# api请求说明
## 配置
* 本地开发环境默认使用测试环境接口地址，如需修改，可修改/source_code/config/apiConf.js文件中对应项
* 打包后的文件会自动使用当前环境的配置文件，本地配置自动失效
## 使用方法
*vue中引入了/source_code/utils/vueMixin.js的情况下（使用create命令创建的项目已引入该文件了）*
* 通用情况
```
// apiPath为接口相对地址，options为接口请求参数或请求配置
this.$post('apiPath', options).then(res=>{
    // 成功时的逻辑，此时如果接口请求出错，会自动tip提示语
})
```
* 自行处理错误，无须自动提示的情况

```
// apiPath为接口相对地址，isShowError为是否自动处理错误，params为请求参数
this.$post('apiPath', {
  isShowError: false,
  params: {}
}).then(res=>{
    // 成功时的逻辑
}).catch(res=>{
  let {respCode, message} = res
  if( respCode === 'TRD1000012'){
    // 处理特定情况的错误
  }else{
    this.G_SetTip(message || '服务器异常，请稍后重试')
  }
})
```
* 其他常用配置项说明

```
{
  apiType: 'product'  // 接口类型，product产品类型，activity活动类型，shendun神盾类型
  headers: {},  // 自定义headers
  apiInfo: '',  // 自定义接口类型及地址信息
  isShowConsole: true,  // 本地开发环境是否自动打印请求日志,
  isShowLoading: true // 请求前后是否自动显示及影藏loading
}

```
* *若请求中有其他配置的情况，则params字段为必须字段，接口请求参数置位该字段内，无请求参数则为"{}"*
* *未集成vueMixin.js文件的情况，请自行引入/source_code/utils/core/HttpBase.js文件进行封装*
* *以上仅以post请求为例，其他请求方式类似，如"$get"方法为get请求*

# 存储用户信息及登录判断
## 判断用户是否登录
*vue中引入了/source_code/utils/vueMixin.js的情况下（未引入则请自行封装）*
```
// isAutoLogin (Boolean false):
false：仅返回用户登录信息，未登录则返回“{}”, 可通过获取有token判断是否登录
true: web端未登录则会自动跳转到loginUrl地址完成登录操作，登录完成后，返回backUrl对应地址，你我金融客户端则直接弹出登录框完成登录操作
// backUrl (String location.href): web端需要先登录的情况下，完成登录后的回跳地址
// loginUrl (String location.href): web端需要先登录的情况下，去登录的地址
this.G_CheckLogin(isAutoLogin, backUrl, loginUrl).then(res=>{
  const {token} = res // res: 登录信息
  if(token){
    // 已登录的处理
  }else{
    // 未登录的处理
  }
})
```
## 存储用户登录或授权等信息
*vue中引入了/source_code/utils/vueMixin.js的情况下（未引入则请自行封装）*
```
// info:
{
  token: '',
  userId: '',
  openId: '',
  ...
}
this.G_SetUserInfo(info)
```

# 客户端交互说明
*vue中引入了/source_code/utils/vueMixin.js的情况下（未引入则请自行封装）*
## js调用你我金融app方法
```
// actionName: 协议方法名
// data: 发送给客户端的数据
this.$native(actionName, data).then(res=>{
  // 处理回调逻辑
})
```
## 你我金融app调用js注册方法
```
// fnName: 注册方法名
this.$setNative('fnName', ()=>{
  // 客户端调用该方法后的处理逻辑
})
```
## 示例:
*设置app导航栏右侧文字，点击后触发js方法*
```
this.$setNative('clickRight', ()=>{
  // 点击右上角文字后的处理逻辑
})
this.$native('clickRight', {
  "isShow": true,
  "title": "页面标题",
  "type": 1,
  "rightText": "右边文字",
  "rightFnName": "clickRight",
  "src": ""
})
```


# 埋点功能
## 旧埋点方法
* 项目中引入与/source_code/demo/example相同公共文件的时候   
*包括router/index.js, store/index.js, utils/init.js, App.vue, main.js中涉及到的文件及方法*
### 页面埋点
* 修改当前项目中router/index.js文件，为每个路由配置meta的pageName项，该值即为页面埋点id
```
// 是否需要埋点开关
const isNeedCollect = true
{
    path: '/index',
    component: Index,
    meta: {
      pageName: '测试首页埋点', // 该值即为页面埋点id
      title: '测试首页'
      // 当前路由是否一定需要登录后才能访问，默认为false
      // isNeedLogin: true
    }
  }
```
### 页面元素埋点
* 非跳转链接元素，设置元素data-event_id属性，值为事件id，即可完成埋点操作   
*使用data-event_id属性埋点的元素必须为的最内层元素，可以多层埋点，仅会触发一次*
```
<span data-event_id="test_eventId">此处可埋点</span>
```
* 跳转链接元素，需同时设置元素data-event_id和data-page_url属性，其中data-page_url值未当前页面地址  
*使用data-event_id属性埋点的元素必须为的最内层元素，可以多层埋点，仅会触发一次*
```
<!-- herf值为location.href -->
<a href="https://www.niiwoo.com/" data-event_id="test_eventId" :data-page_url="herf">此处可埋点</a>
```
### 调用事件埋点
*vue中引入了/source_code/utils/vueMixin.js的情况下（未引入则请自行封装）*
```
// eventId为当前事件id
this.G_SendEvent('eventId')
```

* 项目未引入公共文件的时候

```
// 1.引入埋点所需库文件collectBehavior
import collectBehavior from 'utils/CollectBehavior'

// 2.项目启动及路由切换事件埋点，一般为每个html加载完成后或者切换路由时执行
// pageName (String): 页面id
// isAutoCollect (Boolean true): 是否可以通过设置元素data-event_id属性来自动埋点
// proTypeName (String): 'yd'为云贷项目，非云贷项目不用传该参数
collectBehavior.start('pageName', isAutoCollect, proTypeName)

// 3.事件埋点
// eventId为当前事件id(或者通过上述设置元素data-event_id属性埋点)
collectBehavior.sendBehavior('eventId')
```
*可根据实际情况自行封装*

## 新埋点方法
*开发中*

# 分享功能
## 使用组件
```
// 相关配置请查看组件说明
import Share from 'components/Share'
```

## 调用事件
* 微信分享设置  

```
import WeChat from 'utils/WeChat'
const isAuth = true // 分享是否为授权分享，默认false
const options = {
  title:'分享标题',
  desc:'分享描述',
  link:'https://www…', // 支持绝对地址或者hash(如/index)值路径
  imgUrl: '分享图标地址',
  success: ()=>{
    // 分享成功的操作，通常可不传该参数
  },
  cancel: ()=>{
    // 分享失败的操作，通常可不传该参数
  },
}
WeChat.setShareInfo(options, isAuth)
```
* 显示客户端分享弹窗功能

```
import Native from 'utils/Native'
const isAuth = true // 分享是否为授权分享，默认false
const options = {
  // 0: 微信好友, 1：朋友圈, 2：微博, 3：短信,4：你我好友,5：你我圈,6：QQ,7：QQ空间
  type: ["0","1"],
  title:'分享标题',
  desc:'分享描述',
  link:'https://www…', // 支持绝对地址或者hash(如/index)值路径
  imgUrl: '分享图标地址',
  success: ()=>{
    // 分享成功的操作，通常可不传该参数（Android中成功失败判断可能不准确）
  },
  cancel: ()=>{
    // 分享失败的操作，通常可不传该参数（Android中成功失败判断可能不准确）
  },
}
Native.share(options, isAuth)
```

# mock功能
## 开启mock功能
1. 设置/projectConfig.js文件的isUseMock为true，此时真实网络请求无效
2. 为当前项目添加mock文件夹（当前项目根目录）
3. mock文件夹中增加mock文件，mock文件需与接口一一对应

```
// 如接口名为：homePage/getProductList
// 则需在mock目录中新增：homePage_getProductList.json文件（即替换"/"为"_"）
```
## mock语法
```
// mock文件可以为简单json文件，也可以为符合mock语法的动态json文件
{
  "list|5-10": [  // 属性 list 的值是一个数组，其中含有 5到10 中的随机个元素
    {
      "number|1-100": 100   // number为1个1到100的随机数
      'firstName|1-3':'fei',// 重复fei这个字符串 1到3 中的随机次。
    }
  ]
}
```
*其他详细语法请搜索mockjs文档说明*   
*注意：实际json文件中不能有注释*

# 公共组件
* /source_code/components目录为公共组件目录
* 使用方法示例：
```
// EleNav组件参数请查看该组件文件
import EleNav from 'components/EleNav'
```

# 公共方法
*vue中引入了/source_code/utils/vueMixin.js的情况下（未引入则请自行封装）*
## 原理
*vue示例公共方法主要来自于/source_code/utils/vueMixin.js文件，使用Vue.mixin方法来集成方法*  
*同时还集成了/source_code/business/globalAction.js文件中所有导出方法*
* 使用方法示例：
```
// 设置web页面title及你我金融app中导航title文字
this.G_SetTitle('你我金融测试页')
```

# 集成filter
*vue中引入了/source_code/utils/vueFilters.js的情况下（未引入则请自行封装）*
## 原理
*vue示例公共方法主要来自于/source_code/utils/vueFilters.js文件，使用Vue.filter方式来集成*  
* 使用方法示例：

```
// 日期格式转化: 2018-8-10
{{1533868174999|dateFilter}}

// 日期格式转化: 2018年08月10日 10时09分
{{1533868174999|dateFilter('yyyy年MM月dd日 hh时mm分')}}
```

# 集成directive
*vue中引入了/source_code/utils/vueDirective.js的情况下（未引入则请自行封装）*
## 原理
*vue示例公共方法主要来自于/source_code/utils/vueFilters.js文件，使用Vue.directive方式来集成*  
* 使用方法示例：

```
<!--  长按触发事件，toDo为事件名 -->
<span v-longTap="toDo">长按是触发</span>
```

# 发布项目
1. build
```
npm run build
```
2. ftp
将/release目录下对应目录中的项目通过ftp工具上传到对应服务器


# 其他说明
## 项目打包说明
*项目使用webpack作为打包工具，项目中css语法使用postcss语法*

## 项目框架说明
*ES6、vue、vue-router、vuex*

## api请求方式
*使用ES6中fetch请求方式*

# 项目文档生成说明
*文档通过/README.md文件自动生成，使用docsify库完成说明文档构建*

*docsify生成文档后需修改的配置项参考如下*
```
<script>
  window.$docsify = {
    loadNavbar: true,
    maxLevel: 4,
    subMaxLevel: 2,
    coverpage: true,
    name: '你我金融',
    autoHeader: true,
    formatUpdated: '{MM}/{DD} {HH}:{mm}',
    search: {
      maxAge: 86400000,
      paths: 'auto',
      depth: 2,
      placeholder: '关键词搜索',
      noData: '未匹配到相关搜索项'
    },
    repo: 'http://192.168.18.14:81/html5/lixiong'
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
```
