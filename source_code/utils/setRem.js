const maxWidth = 750
function setRem(){
  let htmlEle = document.querySelector('html')
  let docWidth = document.documentElement.clientWidth
  let realWidth = docWidth > maxWidth ? maxWidth : docWidth
  htmlEle.style.fontSize = realWidth / 7.5 + 'px'
}
setRem()
window.addEventListener('resize', setRem, false)
