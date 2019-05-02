module.exports = (app, Mock) => {
  // 特殊请求处理
  app.post('/app/contract/queryList', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data|3-5": [{
        "id|10010-11000": 11000,
        "name|1-3": "选项1",
        "userType": ""
      }],
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })

  app.post('/app/contract/queryContractList', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": {
        "items|3-5": [{
          "categoryId|1-100": 0,
          "categoryName": "合同类型名称",
          "contractFiterType|1-3": 0,
          "contractName": "合同名称",
          "contractNumber": "合同编号",
          "createTime": Date.now(),
          "historyDetailId": 0,
          "id": 0,
          "remark": "",
          "supplementType|0-3": 0
        }],
        "totalCount": 30,
        "totalPage": 3
      },
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })

  app.post('/app/contract/queryContractDetail', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": {
        "approvalRecord": [
          1,
          2,
          3
        ],
        "attachmentUrl": "123456",
        "contractType": 2,
        "historyDetailId": 0,
        "id": 0,
        "needUploadPhoto": 1,
        "showSignTime": 0,
        "signPosition": "",
        "supplementType": 1,
        "urls": [
          "https://cn.vuejs.org/images/logo.png",
          "https://cn.vuejs.org/images/logo.png",
          "https://cn.vuejs.org/images/logo.png"
        ]
      },
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })


  app.post('/app/contractAudit/queryPage', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": {
        "items|3-5": [{
          "categoryId|1-100": 0,
          "categoryName": "合同类型名称",
          "contractFiterType|1-3": 0,
          "contractName": "合同名称",
          "contractNumber": "合同编号",
          "createTime": Date.now(),
          "historyDetailId": 0,
          "id": 0,
          "remark": "",
          "isAllowBack|0-1": 1,
          "supplementType|0-3": 0
        }],
        "totalCount": 30,
        "totalPage": 3
      },
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })

  app.post('/app/contractAudit/queryDetail', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": {
        "attachmentUrl": "123456",
        "attachmentUrlList": [
          "https://cn.vuejs.org/images/logo.png",
          "https://cn.vuejs.org/images/logo.png",
          "https://cn.vuejs.org/images/logo.png"
        ],
        
        "auditDetailId": 100,
        "contractAuditResultList": [{
          "copyUserIds": "",
          "copyUserRealNames": "抄送用户",
          "createTime": Date.now(),
          "reason": "说明原因",
          "supplementType|0-2": 1
        }],
        "showAuditBtn": "1",
        "contractNumber": ""
      },
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })

  app.post('/app/contractAudit/queryCopyToUserList', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": [{
        "realName|1-3": '姓名',
        "userId|1-200": 10
      }],
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })


  app.post('/app/billCheck/queryPage', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      "data": {
        "items|3-5": [{
          "billDetailUrl": "账单地址",
          "billDetailUrlList": [
            "http://img5.imgtn.bdimg.com/it/u=3365018759,2226705862&fm=26&gp=0.jpg",
            "http://www.pptok.com/wp-content/uploads/2012/08/xunguang-4.jpg",
            "http://pic1.nipic.com/2009-02-10/2009210213644146_2.jpg"
          ],
          "billTitle": "账单名称",
          "billType": "账单类型",
          "createTime": Date.now(),
          "id": 0,
          "receiveStatus|0-1": 0
        }],
        "totalCount": 30,
        "totalPage": 3
      },
      "errorMessage": "",
      "errorMessageDetail": {},
      "message": "",
      "respCode": "0000"
    })
    res.send(data)
  })

}