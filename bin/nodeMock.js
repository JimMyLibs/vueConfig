const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const {
  mockPort = 3000,
  mockType,
  mockPath
} = require('./getProjectInfo.js')

const app = express()

// 解析参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 设置允许跨域访问该服务.
app.all('*', (req, res, next) => {
  // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, token')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// if (mockType === 'json') {
//   app.use((req, res, next) => {
//     let {path: apiPath, query, body} = req
//     // mock file path
//     let filePath = path.join(mockPath, apiPath.replace('/mock', ''))
//     fs.readFile(filePath, 'utf-8', function(err, data) {
//       if (err) {
//         // res.send({code: 502, msg: `接口： ${path} 不存在！`})
//         next()
//       } else {
//         res.send(JSON.parse(data))
//       }
//     })
//   })
// }

// use node mock file，使用当前node路由文件
if (fs.existsSync(`${mockPath}/mockRouter.js`)) {
  require(`${mockPath}/mockRouter.js`)(app)
}

// 其他请求读取json文件返回
app.use((req, res, next) => {
  let {path} = req
  res.send({code: 500, msg: `接口： ${path} 不存在！`})
})

app.listen(mockPort, () => console.log(`Example app listening on port ${mockPort}`))
