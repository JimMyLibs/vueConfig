
// 项目信息session标识
const projectInfoSessionId = '__projectInfoSessionId__'

// 来源项目信息session标识
const referrerProjectSessionId = '__referrerProjectSessionId__'


// 打包配置信息
const ISDEV = process.env.ISDEV
const PROJECT_INFO = process.env.PROJECT_INFO


function getEnvInfo(){
  let {
    projectId = ''
  } = PROJECT_INFO
  let projectType = projectId.split('_')[0]
  return {
    ISDEV,
    projectType,
    ...PROJECT_INFO
  }
}

// 获取项目信息
export function getProjectInfo(){
  let info = JSON.parse(sessionStorage.getItem(projectInfoSessionId))
  let envInfo = getEnvInfo()
  if(info){
    return info
  }else{
    return envInfo
  }
}

/**
 * [setProjectInfo 存储项目信息，自动整合项目配置信息]
 * @param {Object} [info={}] [项目信息]
 */
export function setProjectInfo(info = {}){
  let envInfo = getEnvInfo()
  let {
    projectType,
  } = envInfo
  let projectInfo = {
    ...envInfo,
    ...info
  }

  let sessionInfo = getProjectInfo()
  let {projectType: sessionType} = sessionInfo
  if(typeof sessionType !== 'undefined' && sessionType !== projectType){
    setReferrerProject(sessionInfo)
  }

  sessionStorage.setItem(projectInfoSessionId, JSON.stringify(projectInfo))
}


// 获取来源项目（即从那个项目进入到的本项目）
export function getReferrerProject(){
  return JSON.parse(sessionStorage.getItem(referrerProjectSessionId)) || {}
}

/**
 * [setReferrerProject 存储来源项目信息]
 * @param {Object} [sessionInfo={}] [来源项目信息]
 */
export function setReferrerProject(sessionInfo = getProjectInfo()){
  sessionStorage.setItem(referrerProjectSessionId, JSON.stringify(sessionInfo))
}
