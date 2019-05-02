const path = require('path')
const fs = require('fs')
const Client = require('sftpjs')
const {deepMkdir} = require('./copyFolder')
const pathExtend = require('./pathExtend')
const remoteConfig = require('../source_code/config/ftpConfig')

const {hostInfo: serverConfig} = remoteConfig

// 连接结束后的定时器
let endTimmer = null

// 成功上传数量
let succCount = 0

// 上传失败列表
let failedArr = []

/**
 * [connectServer 链接ftp服务器]
 * @param  {[Function]}  [链接后的回调函数]
 */
function connectServer(callback = () => {
  conn.end()
}) {
  const conn = Client()
  conn.on('ready', () => {
    clearTimeout(endTimmer)
    succCount = 0
    failedArr = []
    setEndConnect(conn)
    callback(conn)
  }).connect(serverConfig)
}

/**
 * [setEndConnect 定时器判断所有传输是否完成]
 * @param {[Object]} conn  [连接实例]
 */
function setEndConnect(conn) {
  clearTimeout(endTimmer)
  endTimmer = setTimeout(() => {
    conn.end()
    console.log(`成功${succCount}个文件`)
    console.log(`失败${failedArr.length}个文件`)
    if (failedArr.length > 0) {
      console.log('失败列表：')
      for (let item of failedArr) {
        console.log(item)
      }
    }
  }, 1000)
}

/**
 * [getFolder 下载服务器文件到本地]
 * @param  {[String]} localPath  [本地需上传目录]
 * @param  {[String]} remotePath [服务器上传目录]
 * @param  {[Object]} conn       [ftp连接实例]
 */
function getFolder(remotePath, localPath, conn) {
  let {isFile: isRemoteFile, name: remoteBase} = pathExtend(remotePath, false, '/')
  let {dir: localDir, isFile: isLocalFile} = pathExtend(localPath)

  if (isRemoteFile) { // file
    let localFilename = isLocalFile
      ? localPath
      : path.join(localPath, remoteBase)
    conn.get(remotePath, (err, stream) => {
      if (err) {
        failedArr.push(remotePath)
        setEndConnect(conn)
      } else {
        stream.pipe(fs.createWriteStream(localFilename)).on('close', () => {
          succCount++
          setEndConnect(conn)
        })
      }
    })
  } else { // folder
    conn.list(remotePath, function(err, arr) {
      if (err) {
        failedArr.push(remotePath)
        setEndConnect(conn)
      } else {
        arr.forEach((item, index) => {
          let {type, name} = item
          let nextDir = path.join(localDir, name)
          if (type === 'd' && !fs.existsSync(nextDir)) {
            fs.mkdirSync(nextDir)
            succCount++
          }
          getFolder(`${remotePath}/${name}`, nextDir, conn)
        })
      }
    })
  }
}

/**
 * [putFolder 上传本地文件到服务器]
 * @param  {[String]} localPath  [本地需上传目录]
 * @param  {[String]} remotePath [服务器上传目录]
 * @param  {[Object]} conn       [ftp连接实例]
 */
function putFolder(localPath, remotePath, conn) {
  let {dir: remoteDir, isFile: isRemoteFile} = pathExtend(remotePath, false, '/')
  let {name: localBase, isFile: isLocalFile} = pathExtend(localPath)

  if (isLocalFile) { // 上传文件
    let remoteFilename = isRemoteFile
      ? remotePath
      : `${remotePath}/${localBase}`

    conn.put(localPath, remoteFilename, err => {
      if (err) {
        failedArr.push(remotePath)
        setEndConnect(conn)
      } else {
        succCount++
        setEndConnect(conn)
      }
    })
  } else { // 遍历目录
    let pathArr = fs.readdirSync(localPath)
    pathArr.forEach(pathItem => {
      let itemLocal = path.join(localPath, pathItem)

      // eachRemote对应服务器地址，不能用path.join
      let eachRemote = `${remoteDir}/${pathItem}`

      let localItemStat = fs.statSync(itemLocal)

      if (localItemStat.isFile()) {
        putFolder(itemLocal, remoteDir, conn)
      }

      if (localItemStat.isDirectory()) {
        conn.exists(eachRemote, isExist => {
          if (isExist) {
            succCount++
            putFolder(itemLocal, eachRemote, conn)
          } else {
            conn.mkdir(eachRemote, err => {
              if (err) {
                failedArr.push(eachRemote)
                setEndConnect(conn)
              } else {
                succCount++
                putFolder(itemLocal, eachRemote, conn)
              }
            })
          }
        })
      }
    })
  }
}

/**
 * [description]
 * @param  {String}  localPath                本地需上传目录
 * @param  {String}  remotePath               服务器上传目录
 * @param  {Boolean} [isCreateLastPath=false] 若最后一级目录不存在，是否先创建该目录
 */
exports.upload = function(localPath, remotePath, isCreateLastPath = false) {
  if (!fs.existsSync(localPath)) {
    throw new Error('本地路径不能为空')
  }
  if (typeof remotePath === 'undefined') {
    throw new Error('服务器地址不能为空')
  }
  connectServer(conn => {
    console.log('uploading, please wait…')
    conn.exists(remotePath, isExist => {
      if (isExist) {
        putFolder(localPath, remotePath, conn)
      }else{
        if( isCreateLastPath ){
          let parentPath = remotePath.replace(/\/[^/]+\/?$/, '')
          conn.exists(parentPath, isExist => {
            if (isExist) {
              conn.mkdir(remotePath, err => {
                if (err) {
                  throw new Error('创建目录失败')
                } else {
                  putFolder(localPath, remotePath, conn)
                }
              })
            }else{
              throw new Error('服务器地址上级目录不存在')
            }
          })
        }else{
          throw new Error('服务器地址目录不存在')
        }
      }

    })
  })
}

/**
 * [ftp下载服务器文件到本地]
 * @param  {[String]} remotePath [服务器需下载的文件地址]
 * @param  {[String]} localPath  [下载文件保存到本地的目录]
 */
exports.download = function(remotePath, localPath) {
  if (typeof remotePath === 'undefined') {
    throw new Error('服务器地址不能为空')
  }
  if (typeof localPath === 'undefined') {
    throw new Error('本地路径不能为空')
  }
  deepMkdir(localPath)
  connectServer(conn => {
    console.log('downloading, please wait…')
    conn.exists(remotePath, isExist => {
      if (!isExist) {
        throw new Error('服务器地址目录不存在')
      }
      getFolder(remotePath, localPath, conn)
    })
  })
}
