
import Mock from 'mockjs'


export function fetchMock(url, {headers, body}){
  return new Promise((resolve, reject)=> {
    if(url.trim() === ''){  // url为空，可能为埋点等请求
      resolve({})
    }else{
      require(`mockPath/${url}.json`).then(module => {
        let result = {}
        if(typeof module === 'object' && typeof module.default !== 'undefined'){
          result = module.default
        }else{
          result = module
        }
        resolve(toMock(result))
      }).catch(reson=>{
        reject(reson)
      })
    }
  })
}

export function toMock(obj){
  return Mock.mock(obj)
}
