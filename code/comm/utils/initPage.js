/**
 * 设置html页面相关方法
 */

//  设置html fontsize
export function setRem() {
  const maxWidth = 750
  let toSetRem = () => {
    let htmlEle = document.querySelector('html')
    let docWidth = document.documentElement.clientWidth
    let realWidth = docWidth > maxWidth
      ? maxWidth
      : docWidth
    htmlEle.style.fontSize = realWidth / 7.5 + 'px'
  }
  toSetRem()
  window.addEventListener('resize', toSetRem, false)
}

// 页面警告信息设置
export function setWarn() {
  let isOk = true
  if (typeof sessionStorage === 'undefined' || typeof window.localStorage === 'undefined') {
    isOk = false
  } else {
    try {
      sessionStorage.setItem('isCanSave', '1')
      localStorage.setItem('isCanSave', '1')

      if(sessionStorage.getItem('isCanSave') !== '1' || localStorage.getItem('isCanSave') !== '1' ){
        isOk = false
      }

      sessionStorage.removeItem('isCanSave')
      localStorage.removeItem('isCanSave')
    } catch (e) {
      isOk = false
    }
  }

  if (!isOk) {
    alert('你的手机开启了无痕模式或版本过低，暂时无法为您提供服务！')
  }

}

setRem()
setWarn()
