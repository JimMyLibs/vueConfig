const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const Mock = require('mockjs')
// const request = require('request')

const {
  mockPort = 3000,
  mockPath
} = require('./getConfInfo.js')

const app = express()

// 解析参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

// 设置允许跨域访问该服务.
app.all('*', (req, res, next) => {
  // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Headers', 'Content-Type, token')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})


// 代理处理，转发某服务器请求
// app.use((req, res, next) => {
//   let {
//     method,
//     body
//   } = req

//   // let url = `https://172.21.1.74:8089/contract-housekeeper-web${req.url}`

//   let headersObj = {}
//   let headers = {}
//   let contentType = req.get('Content-Type')
//   let token = req.get('token')

//   if (contentType) {
//     headersObj['Content-Type'] = contentType
//   }

//   if (token) {
//     headersObj.token = token
//   }

//   if (Object.keys(headersObj).length > 0){
//     headers = {
//       headers: {
//         ...headersObj
//       }
//     }
//   }

//   request({
//     ...headers,
//     method,
//     url,
//     body: JSON.stringify(body)
//   }, (err, response, body) => {
//     if(err){
//       console.log(err)
//     }else{
//       res.send(body)
//     }
//   })

// })



// use node mock file，使用当前node路由文件
if (fs.existsSync(`${mockPath}/mockRouter.js`)) {
  require(`${mockPath}/mockRouter.js`)(app, Mock)
}


// in node mock file example
// app.post('/test', (req, res, next) => {
//   // 请求参数处理
//   let {
//     body
//   } = req

//   let data = Mock.mock({
//     code: 200,
//     "msg|1-3": 'from service succ!'
//   })
//   res.send(data)
// })

// 其他请求读取json文件返回
app.use((req, res, next) => {

  let {
    method,
    path,
    query,
    body
  } = req
  // mock file path
  let jsonFile = `${mockPath.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}.json`

  // request data
  // let reqBody = method.toLocaleLowerCase() === 'get' ? query : body
  fs.readFile(jsonFile, 'utf-8', function (err, data) {
    if (err) {
      res.send({
        code: 500,
        msg: `接口： ${path} 不存在！`
      })
    } else {
      res.send({
        code: 200,
        data: Mock.mock(JSON.parse(data))
      })
    }
  })
})

app.listen(mockPort, () => console.log(`Example app listening on port ${mockPort}`))