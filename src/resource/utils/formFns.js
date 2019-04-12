// 请求基类，可根据实际需要进行扩展
export default class checkForm {

  // ele 需要校验的表单元素
  // rules需要校验的规则及提示语，如下

  constructor(checkObj) {

    // // checkObj: obj or Array
    // checkObj: {
    //
    //   // 需要校验的元素
    //   ele: element,
    //
    //   // 当前元素的校验规则
    //   rules: [
    //     {type: number, text: "请输入一个数字"},
    //     {required: true, text: "请输入充值金额"},
    //     {min: 100, text: "单次充值金额不能少于100元"},
    //     {max: 10000, text: "单笔充值金额不能大于1万"},
    //     {minlength: 100, text: "单次充值金额不能少于100元"},
    //     {maxlength: 10000, text: "单笔充值金额不能大于1万"},
    //     {pattern: true, text: "输入格式有误"}
    //   ]
    // }
    //

    // 将传入数据统一转换为数组，方便统一处理
    let checkObjs = []
    let temArr = []

    if (Array.isArray(checkObj)) {
      temArr = checkObj
    } else {
      temArr.push(checkObj)
    }

    // 将传入规则统一转换为数组，方便统一处理
    temArr.forEach(obj => {
      let {ele, rules} = obj
      checkObjs.push({ele, rules: this.getRules(rules)})
    })

    // 错误信息
    this.errorArr = []

    this.checkObjs = checkObjs

    // 根据设定规则，设置对应属性
    this.setInputRules()
  }

  // 根据校验规则，设置元素的属性
  setInputRules() {
    let checkAttr = this.getCheckAttr()
    // 设置表单元素校验属性
    this.checkObjs.forEach(obj => {
      let {ele, rules} = obj
      let attributes = ele.attributes
      rules.forEach(rule => {
        checkAttr.forEach(item => {
          if (item in rule && !attributes[rule]) {
            this.addCheckAttr(ele, item, rule[item])
          }
        })
      })

      // rule: [
      //   {type: number, text: "请输入一个数字"},
      //   {required: true, text: "请先输入"},
      //   {min: 0, text: "输入最小值为0"},
      //   {max: 10000, text: "超过最大值10000"},
      //   {minlength: 0, text: "请最少输入0个字符"},
      //   {maxlength: 10000, text: "超过最大输入字符10000"},
      //   {pattern: true, text: "输入项格式有误"}
      // ]

    })
  }

  // 获取元素校验规则数组
  getRules(rules) {
    if (Array.isArray(rules)) {
      return rules
    } else {
      return rules
        ? [rules]
        : []
    }
  }

  // 返回需要校验的属性
  getCheckAttr() {
    return [
      'required',
      'min',
      'max',
      'minlength',
      'maxlength',
      'pattern'
    ]
  }

  // 设置元素校验属性
  addCheckAttr(ele, item, val) {
    if (item === 'required' && val) {
      ele.setAttribute(item, val)
    } else {
      if (item === 'pattern') {
        val = this.getRealPattern(val)
        if (typeof val === 'object') {
          val = val.toString().replace(/^\/\^?/,'').replace(/\$?\//,'')
        }
      }
      ele.setAttribute(item, val)
    }
  }

  // 获取正式正则表达式
  getRealPattern(val) {
    // 特殊正则表达式处理
    let specialPattern = ['mobile', 'password', 'number']
    let reg = val
    if (specialPattern.includes(val)) {
      if (val === 'mobile') {
        reg = /^1[34578]\d{9}$/
      }
      // 密码规则待完善
      // if (val === 'password') {
      //   reg = /^1[34578]\d{9}$/
      // }
      if (val === 'number') {
        reg = /^\d+(\.\d+)?$/
      }
    }
    return reg
  }

  // 验证某个表单元素是否通过校验
  checkValidity() {
    // 校验结果
    let isCorrect = true
    let errorArr = []
    this.checkObjs.forEach(obj => {
      let {ele, rules} = obj
      let value = ele.value
      rules.forEach(rule => {

        // 必填项校验
        if (rule.required) {
          if (value.trim() === '') {
            isCorrect = false
            errorArr.push({
              ele,
              text: this.mixErrorMsg('required', rule.text)
            })
          }
        }

        // 最小值校验
        if (typeof rule.min !== 'undefined') {
          if (isNaN(value)) {
            isCorrect = false
            errorArr.push({ele, text: '输入值必须为数字'})
          } else {
            if (Number(value) < Number(rule.min)) {
              isCorrect = false
              errorArr.push({
                ele,
                text: this.mixErrorMsg('min', rule.text, rule.min)
              })
            }
          }
        }

        // 最大值校验
        if (typeof rule.max !== 'undefined') {
          if (isNaN(value)) {
            isCorrect = false
            errorArr.push({ele, text: '输入值必须为数字'})
          } else {
            if (Number(value) > Number(rule.max)) {
              isCorrect = false
              errorArr.push({
                ele,
                text: this.mixErrorMsg('max', rule.text, rule.max)
              })
            }
          }
        }

        // 最小字符数校验
        if (typeof rule.minlength !== 'undefined') {
          if (value.length < rule.minlength) {
            isCorrect = false
            errorArr.push({
              ele,
              text: this.mixErrorMsg('minlength', rule.text, rule.minlength)
            })
          }
        }

        // 最大字符数校验
        if (typeof rule.maxlength !== 'undefined') {
          if (value.length > rule.maxlength) {
            isCorrect = false
            errorArr.push({
              ele,
              text: this.mixErrorMsg('maxlength', rule.text, rule.maxlength)
            })
          }
        }

        // 正则校验
        if (typeof rule.pattern !== 'undefined') {
          let realPattern = this.getRealPattern(rule.pattern)
          if (!realPattern.test(value)) {
            isCorrect = false
            errorArr.push({
              ele,
              text: this.mixErrorMsg('pattern', rule.text)
            })
          }
        }

      })
    })

    this.errorArr = errorArr
    return isCorrect

  }

  // 获取错误提示语
  // isAll是否返回全部错误信息，默认只返回第一条
  getErrorText(isAll = false) {
    this.checkValidity()
    let errorArr = this.errorArr
    if (errorArr && errorArr.length > 0) {
      return isAll
        ? errorArr
        : errorArr[0].text
    }else{
      return ''
    }
  }

  // 混合错误提示信息
  mixErrorMsg(attr, text, num = '') {
    let defaultMsg = {
      'required': '请先输入',
      'min': `最小输入值为${num}`,
      'max': `最大输入值为${num}`,
      'minlength': `请最少输入${num}个字符`,
      'maxlength': `输入字符超过最大限制${num}`,
      'pattern': '输入格式有误'
    }
    return text || defaultMsg[attr]
  }

}
