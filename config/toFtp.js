const {upload} = require('./sftpUpload')

// 获取项目相关信息
const utils = require('./utils')

const remoteConfig = require('../source_code/config/ftpConfig')

const {remotePath} = remoteConfig
const {PROJECT_DIR_NAME} = utils.projectPathInfo

// 获取项目详细信息
let {releasePath} = utils.projectPathInfo

// ftp上传
upload(releasePath, `${remotePath}/${PROJECT_DIR_NAME}`, true)
