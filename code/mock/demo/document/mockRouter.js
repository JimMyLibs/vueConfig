module.exports = (app, Mock) => {
  app.post('/test', (req, res, next) => {
    // 请求参数处理
    let {
      body
    } = req
    let data = Mock.mock({
      code: 200,
      "msg|1-3": 'from service succ2!'
    })
    res.send(data)
  })
}