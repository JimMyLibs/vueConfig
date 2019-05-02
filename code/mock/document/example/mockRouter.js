const fs = require('fs')
const path = require('path')
const request = require('request')
const Mock = require('mockjs')

module.exports = (app) => {

  // 返回数据
  // app.post('/homeBannerAndPopup/homeBannerAndPopup', (req, res, next) => {
  //    请求参数处理
  //   let {body} = req
  //   let data = Mock.mock({
  //     "respCode": "0000",
  //     "message": "success",
  //     "data": {
  //       "homeBannerPicList": [],
  //       "homePageConfigRespVO|3": [
  //         {
  //           "configId": 1,
  //           "orderNum": 3,
  //           "imgUrl": "https://test.niiwoo.com:5007/activity-manage/20190130/93ac1227-d3f9-47cb-8220-a85728fceebf.png",
  //           "title": "邀请好友",
  //           "skipType": 0,
  //           "skipUrl": "https://testh5.niiwoo.com/html5/project/inviting_friend",
  //           "skipCode": "FINANCING_LIST",
  //           "isShard": 0,
  //           "shardImg": "",
  //           "updateTime": 1548829935000,
  //           "updateManagerName": "袁光路"
  //         }
  //       ],
  //       "homePopup": {}
  //     }
  //   })
  //   res.send(data)
  // })

  // 获取json文件返回数据
  // app.post('/homeBannerAndPopup/homeBannerAndPopup', (req, res, next) => {
  //    请求参数处理
  //   let {
  //      method,
  //     path: apiPath,
  //      query,
  //      body
  //   } = req
  //    mock file path
  //   let jsonFile = path.join(__dirname, `./${apiPath.replace(/^\/+/, '')}.json`)
  //
  //    request data
  //    let reqBody = method.toLocaleLowerCase() === 'get' ? query : body
  //   fs.readFile(jsonFile, 'utf-8', function (err, data) {
  //     if (err) {
  //       res.send({
  //         code: 502,
  //         msg: `接口： ${path} 不存在！`
  //       })
  //     } else {
  //       res.send(JSON.parse(data))
  //     }
  //   })
  // })

  // 代理其他服务器
  app.post('/homeBannerAndPopup/homeBannerAndPopup', (req, res, next) => {
    let {method, body} = req
    let url = `https://test-activity-api.niiwoo.com/activity${req.url}`
    let headersObj = {}
    let headers = {}
    let contentType = req.get('Content-Type')
    let token = req.get('token')

    if (contentType) {
      headersObj['Content-Type'] = contentType
    }

    if (token) {
      headersObj.token = token
    }

    if (Object.keys(headersObj).length > 0) {
      headers = {
        headers: {
          ...headersObj
        }
      }
    }

    request({
      ...headers,
      method,
      url,
      body: JSON.stringify(body)
    }, (err, response, body) => {
      if (err) {
        console.log(err)
      } else {
        res.send(body)
      }
    })

  })

}
