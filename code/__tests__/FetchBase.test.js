// ReferenceError: fetch is not defined
import FetchBase from '../comm/utils/core/FetchBase'

global.fetch = require('node-fetch')

const http = new FetchBase()
const url = 'https://test-civet-api.niiwoo.com'

const headers = {
  'Content-type': 'application/json'
}

const formHeaders = {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

const stringBody = 'key1=value1&key2=value2'

const objectBody = {
  key1: 'value1',
  key2: 'value2'
}

// not work
// test('getGetConf is ok', async () => {
//   // let mockFn = jest.fn(http.toFetch)
//   // expect.assertions(1)
//   // let mockFn = jest.spyOn(FetchBase, 'toFetch')
//   // http.toFetch(mockFn)
//   FetchBase.toFetch.mockResolvedValue({})

//   await http.toGet(url)

//   expect(mockFn()).toBeCalled()

// })

// getGetConf
test('getGetConf is ok', () => {
  // empty
  // no work
  // expect(http.getGetConf()).toThrow()

  // no data
  let {
    url: testUrl,
    conf
  } = http.getGetConf(url)
  expect(testUrl).toMatch(/\?t=\d+/)
  expect(conf).toEqual({
    method: 'GET'
  })

  // had data
  let {
    url: testUrl2,
    conf: conf2
  } = http.getGetConf(url, objectBody)

  expect(testUrl2).toMatch(/\?key1=value1&key2=value2&t=\d+/)
  expect(conf2).toEqual({
    method: 'GET'
  })

})

// getPostConf
test('getPostConf is ok', () => {

  // no data
  expect(http.getPostConf()).toEqual({
    method: 'POST'
  })

  // no headers had data
  expect(http.getPostConf(objectBody)).toEqual({
    method: 'POST',
    body: objectBody
  })

  // no headers had data
  expect(http.getPostConf({
    headers,
    body: objectBody
  })).toEqual({
    method: 'POST',
    headers,
    body: JSON.stringify(objectBody)
  })

  // no headers had data
  expect(http.getPostConf({
    headers: formHeaders,
    body: objectBody
  })).toEqual({
    method: 'POST',
    headers: formHeaders,
    body: stringBody
  })

})

// getContentFormat
test('getContentFormat is ok', () => {
  // empty
  expect(http.getContentFormat()).toEqual({})

  // no content-type
  expect(http.getContentFormat({
    token: '###'
  })).toEqual({
    headers: {
      token: '###'
    }
  })

  // application/json no body
  expect(http.getContentFormat(headers)).toEqual({
    headers
  })

  // application/json
  expect(http.getContentFormat(headers, objectBody)).toEqual({
    headers,
    body: JSON.stringify(objectBody)
  })

  // application/x-www-form-urlencoded
  expect(http.getContentFormat(formHeaders, objectBody)).toEqual({
    headers: formHeaders,
    body: stringBody
  })

})

// getReqConf
test('getReqConf is ok', () => {

  // empty
  expect(http.getReqConf()).toEqual({
    body: ''
  })

  // only body
  expect(http.getReqConf(stringBody)).toEqual({
    body: stringBody
  })

  // only headers
  expect(http.getReqConf({
    headers
  })).toEqual({
    headers,
    body: ''
  })

  // headers and body and body is string
  expect(http.getReqConf({
    headers,
    body: stringBody
  })).toEqual({
    headers,
    body: stringBody
  })

  // headers and body and body is object
  expect(http.getReqConf({
    headers,
    body: objectBody
  })).toEqual({
    headers,
    body: objectBody
  })
})
