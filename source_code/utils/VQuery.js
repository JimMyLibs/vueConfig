// 请求基类，可根据实际需要进行扩展

// 特殊样式列表
const transformStyle = [
  'transform',
  'translate',
  'translateX',
  'translateY',
  'scale',
  'scaleX',
  'scaleY'
]

export class VQuery {
  // str string/element
  constructor(str) {
    return this.select(str)
  }

  // 选择元素
  select(str) {
    let eles = []
    if (typeof str === 'string') {
      let selectorEles = document.querySelectorAll(str)
      for (let ele of selectorEles) {
        eles.push(ele)
      }
    }

    if (typeof str === 'object' && str !== null) {
      eles.push(str)
    }

    this.eles = eles
    return this
  }

  // 设置当前元素为下标元素
  eq(index) {
    let current = this.eles[index]
    let arr = current
      ? [current]
      : []
    this.eles = arr
    return this
  }

  // 返回对应下标原生元素
  get(index) {
    return this.eles[index]
  }

  // 设置与获取样式
  css(styleName, value) {
    if( typeof styleName === 'object' ){
      Object.keys(styleName).forEach(theStyle=>{
        this.each(ele=>{
          ele.style[theStyle] = styleName[theStyle]
        })
      })
      return this
    }else{
      if (transformStyle.includes(styleName)) {
        return this.matrix(styleName, value)
      }
      if (typeof value === 'undefined') {
        return this.getStyle(styleName)
      } else {
        this.each(ele=>{
          ele.style[styleName] = value
        })
        return this
      }
    }
  }

  // 返回样式结果
  getStyle(styleName) {
    styleName = this.getSupportStyle(styleName)
    let result = window.getComputedStyle(this.get(0), null)[styleName]
    return result
      ? result.replace(/px$/, '')
      : result
  }

  // 遍历对象
  each(callback) {
    this.eles.forEach((item, index) => {
      callback(item, index)
    })
  }

  // 返回对象个数
  size() {
    return this.eles.length
  }

  // 对transform相关操作
  matrix(styleName, value) {
    let transformStyle = this.getSupportStyle('transform')
    let transform = this.getStyle(transformStyle)
    let defaultTrans = [
      '1',
      '0',
      '0',
      '1',
      '0',
      '0'
    ].join(',')
    transform = transform === 'none'
      ? defaultTrans
      : transform
    if (transform) {
      transform = transform.match(/-?(\d+|\d*\.\d+)/g)
    }

    if (transform) {
      transform = transform.map(item => {
        if (!isNaN(item)) {
          item = Number(item)
        }
        return item
      })
      if (typeof value === 'undefined') {
        let result = {
          transform: transform,
          scale: {
            x: transform[0],
            y: transform[3]
          },
          scaleX: transform[0],
          scaleY: transform[3],
          translate: {
            x: transform[4],
            y: transform[5]
          },
          translateX: transform[4],
          translateY: transform[5]
        }
        return result[styleName]
      } else {
        this.each(item => {
          if (styleName === 'transform') {
            item.style[transformStyle] = value
          } else {
            value = Array.isArray(value)
              ? value.join(',')
              : value.toString()
            value = value.replace(/\s+|px/g, '')
            let valueArr = value.split(',')

            if (valueArr.length === 1) {
              valueArr.push(valueArr[0])
            }

            if (styleName === 'scale') {
              transform[0] = valueArr[0]
              transform[3] = valueArr[1]
            }

            if (styleName === 'scaleX') {
              transform[0] = valueArr[0]
            }

            if (styleName === 'scaleY') {
              transform[3] = valueArr[1]
            }

            // 仅支持px单位
            if (styleName === 'translate') {
              transform[4] = valueArr[0]
              transform[5] = valueArr[1]
            }

            if (styleName === 'translateX') {
              transform[4] = valueArr[0]
            }

            if (styleName === 'translateY') {
              transform[5] = valueArr[1]
            }

            transform = transform.join(',')
            item.style[transformStyle] = `matrix(${transform})`

          }
        })
        return this
      }
    }
  }

  matrix3D(styleName, value) {
    let transformStyle = this.getSupportStyle('transform')
    let transform = this.getStyle(transformStyle)
    let defaultTrans = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0, // tx
      0, // ty
      0,
      1
    ]

    if( transform === 'none' ){
      transform = defaultTrans
    }else{
      transform = transform.match(/-?(\d+|\d*\.\d+)/g)
      if( transform && transform.length < 16 ){
        // 2d to 3d
        defaultTrans[12] = transform[4]
        defaultTrans[13] = transform[5]
        transform = defaultTrans
      }
    }

    if (transform) {
      transform = transform.map(item => {
        if (!isNaN(item)) {
          item = Number(item)
        }
        return item
      })

      if (typeof value === 'undefined') {
        let result = {
          translate: {
            x: transform[12],
            y: transform[13]
          },
          translateX: transform[12],
          translateY: transform[13]
        }
        return result[styleName]
      } else {
        this.each(item => {
          if (styleName === 'translateX') {
            transform[12] = value
          }
          if (styleName === 'translateY') {
            transform[13] = value
          }
          item.style[transformStyle] = `matrix3d(${transform.join(',')})`
        })
        return this
      }
    }

  }

  // 设置与获取元素属性
  attr(attrName, value) {
    if (typeof value === 'undefined') {
      return this.get(0).getAttribute(attrName)
    } else {
      this.each(item => {
        item.setAttribute(attrName, value)
      })
      return this
    }
  }

  find(tagName) {
    let eleArr = []
    if (typeof tagName === 'string') {
      tagName = tagName.replace(/\s+/g, '').split(',')
    }
    this.each(item => {
      tagName.forEach(name => {
        let tags = item.getElementsByTagName(name)
        for (let i = 0; i < tags.length; i++) {
          eleArr.push(tags[i])
        }
      })
    })
    this.eles = eleArr
    return this
  }

  // 获取浏览器支持的样式名
  getSupportStyle(style) {
    // 不支持该样式则返回空字符串
    let htmlStyle = document.documentElement.style
    let prefix = ['webkit', 'Moz', 'ms', 'O']
    let supportStyle = ''

    // 首字母大写的style
    let upperStyle = style.replace(/^(\w)/, $1 => {
      return $1.toUpperCase()
    })

    if (style in htmlStyle) {
      supportStyle = style
    } else {
      for (let val of prefix) {
        let mixStyle = `${val}${upperStyle}`
        if (mixStyle in htmlStyle) {
          supportStyle = mixStyle
          break
        }
      }
    }
    return supportStyle
  }

  addClass(className) {
    this.changeClass(className, (item, name) => {
      item.classList.add(name)
    })
    return this
  }

  removeClass(className) {
    this.changeClass(className, (item, name) => {
      item.classList.remove(name)
    })
    return this
  }

  hasClass(className) {
    return this.get(0).classList.contains(className)
  }

  toggleClass(className) {
    this.changeClass(className, (item, name) => {
      item.classList.toggle(name)
    })
    return this
  }

  changeClass(className, callback) {
    if (typeof className === 'string') {
      className = className.replace(/\s+/g, '').split(',')
    }
    this.each(item => {
      className.forEach(name => {
        callback(item, name)
      })
    })
  }

  on(eventName, fn) {
    this.each(item => {
      item.addEventListener(eventName, fn, false)
    })
    return this
  }
}

export default(str) => {
  return new VQuery(str)
}
