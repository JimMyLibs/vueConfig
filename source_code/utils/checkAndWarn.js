
let isOk = true
if( typeof window.sessionStorage === 'undefined' || typeof window.localStorage === 'undefined' ){
  isOk = false
}else{
  try{
    sessionStorage.setItem('isCanSave','1')
    localStorage.setItem('isCanSave','1')

    sessionStorage.getItem('isCanSave')
    localStorage.getItem('isCanSave')

    sessionStorage.removeItem('isCanSave')
    localStorage.removeItem('isCanSave')
  }catch(e){
    isOk = false
  }
}

if( !isOk ){
  alert('你的手机开启了无痕模式或版本过低，暂时无法为您提供服务！')
}
