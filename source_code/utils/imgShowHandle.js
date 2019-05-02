/*
	1.请在mounted生命周期中使用此函数
	2.如果要在加载完执行某项操作,则使用then方法,例如imgFullShow().then(()=>console.log('所有图片加载完成'))
*/

function hasClass(ele, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length == 0) return false; 
  return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
  }
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ');
    }
    ele.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}

function addEvent(obj,ev,fn){
	if (obj.attachEvent) {
		obj.attachEvent("on" + ev, fn);
	}
	else {
		obj.addEventListener(ev, fn, false);
	}
}

function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr]
 	} else {
  	return getComputedStyle(obj, false)[attr]
 	}
}

function urlToSrc (url) {
	let src = url.split("(")[1].split(")")[0].replace(/"/g,'')
	src = src.split(location.origin).join('')
	return src
}

{
	let style = document.createElement('style')
	style.setAttribute('backLoadingTag', 'y')
	style.innerHTML = '.imgLoading{visibility:hidden} .backLoading{background-image:none !important}'
	if (!document.querySelector('[backLoadingTag]')) {
		document.querySelector('head').appendChild(style)
	}
}





// 图片一次性展示(图片加载完成前设置为visibility:hidden)
/*
	默认对所有不具备backupSrc属性的图片(已设置src)一次性展示,可设置选择器
*/
export function imgFullShow(selector='img') {
	let imgs = Array.from(document.querySelectorAll(selector))
	imgs = imgs.filter(x => {
		return x.nodeName === 'IMG' && x.src && !(x.getAttribute('backupSrc'))
	})
	let imgPromises = []
	imgs.map((x) => {
		addClass(x,'imgLoading')
		imgPromises.push(
			new Promise((resolve, reject) => {
				if (x.complete) {
					removeClass(x,'imgLoading')
					resolve()
				} else {
					addEvent(x, 'load', ()=>{
						removeClass(x,'imgLoading')
						resolve()
					})
				}
			})
		)
	})
	return Promise.all(imgPromises)
}
// 图片过渡展示(图片加载完成前使用过渡图片)
/*
	默认对所有具备backupSrc的图片(已设置src)过渡展示,可设置选择器
*/
export function imgTransitionShow(selector='img') {
	let imgs = Array.from(document.querySelectorAll(selector))
	imgs = imgs.filter(x => {
		return x.nodeName === 'IMG' && x.src && x.getAttribute('backupSrc')
	})
	let imgPromises = []
	imgs.map((x) => {
		imgPromises.push(
			new Promise((resolve, reject) => {
				let imgLoadComplete = false
				addClass(x, 'imgLoading')
				let img = new Image()
				img.src = x.src
				{
					let imglow = new Image()
					imglow.src = x.getAttribute('backupSrc')
					if (imglow.complete) {
						if (!imgLoadComplete) {
							removeClass(x, 'imgLoading')
							x.src = imglow.src
						}
					} else {
						imglow.onload = function () {
							if (!imgLoadComplete) {
								removeClass(x, 'imgLoading')
								x.src = imglow.src
							}
						}
					}
				}
				if (img.complete) {
					imgLoadComplete = true
					removeClass(x, 'imgLoading')
					x.src=img.src
					resolve()
				} else {
					img.onload = function () {  
						imgLoadComplete = true
						removeClass(x, 'imgLoading')
						x.src=img.src
						resolve()
					}
				}
			})
		)
	})
	return Promise.all(imgPromises)
}
// 图片混合展示
/*
	对所有不具备backupSrc属性的图片(已设置src)一次性展示,对所有具备backupSrc的图片(已设置src)过渡展示
*/
export function imgAutoShow (selector='img') {
	return Promise.all([imgFullShow(selector),imgTransitionShow(selector)])
}





// 背景图一次性展示(背景加载完成前设置background-image:none !important)
/*
	默认对所有设置了background-image且没设置backupUrl的元素使用,可使用选择器
*/
export function backFullShow(selector) {
	let targets = []
	if (!selector) {
		targets = Array.from(document.getElementsByTagName('*')).filter(x => {
			return getStyle(x, 'background-image') !== 'none' && !(x.getAttribute('backupUrl'))
		})
	} else {
		targets = Array.from(document.querySelectorAll(selector)).filter(x => {
			return getStyle(x, 'background-image') !== 'none' && !(x.getAttribute('backupUrl'))
		})
	}
	let targetPromises = []
	targets.map((x) => {
		targetPromises.push(
			new Promise((resolve, reject) => {
				let img = new Image()
				img.src = urlToSrc(getStyle(x, 'background-image'))
				addClass(x,'backLoading')
				if (img.complete) {
					removeClass(x,'backLoading')
					resolve()
				} else {
					img.onload = function () {
						removeClass(x,'backLoading')
						resolve()
					}
				}
			})
		)
	})
	return Promise.all(targetPromises)
}
// 背景图过渡展示(背景加载完成前使用过渡背景图片)
/*
	默认对所有设置了background-image和backupUrl的元素使用,可使用选择器
*/
export function backTransitionShow(selector) {
	let targets = []
	if (!selector) {
		targets = Array.from(document.getElementsByTagName('*')).filter(x => {
			return getStyle(x, 'background-image') !== 'none' && x.getAttribute('backupUrl')
		})
	} else {
		targets = Array.from(document.querySelectorAll(selector)).filter(x => {
			return getStyle(x, 'background-image') !== 'none' && x.getAttribute('backupUrl')
		})
	}
	let targetPromises = []
	targets.map((x) => {
		targetPromises.push(
			new Promise((resolve, reject) => {
				let imgLoadComplete = false
				let img = new Image()
				img.src = urlToSrc(getStyle(x, 'background-image'))
				x.style['background-image']= 'none'
				{
					let imglow = new Image()
					imglow.src = x.getAttribute('backupUrl')
					if (imglow.complete) {
						if (!imgLoadComplete) {
							x.style['background-image']= `url(${imglow.src})`
						}
					} else {
						imglow.onload = function () {
							if (!imgLoadComplete) {
								x.style['background-image']= `url(${imglow.src})`
							}
						}
					}
				}
				if (img.complete) {
					imgLoadComplete = true
					x.style['background-image']=`url(${img.src})`
					resolve()
				} else {
					img.onload = function () {
						imgLoadComplete = true
						x.style['background-image']=`url(${img.src})`
						resolve()
					}
				}
			})
		)
	})
	return Promise.all(targetPromises)
}
// 背景图混合展示
/*
	对所有不具备backupUrl属性的背景图一次性展示,对所有不具备backupUrl的背景图过渡展示
*/
export function backAutoShow (selector) {
	return Promise.all([backFullShow(selector),backTransitionShow(selector)])
}





export function imgShowHandle (selector) {
	return Promise.all([imgAutoShow(selector),backAutoShow(selector)])
}