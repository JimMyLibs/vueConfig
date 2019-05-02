
import 'utils/vueFilters'
import 'utils/vueDirective'
import http from './http'

import setGlobalMixin from 'utils/vueMixin'
import setGlobalExtend from 'utils/vueUtils'


// 当不支持sessionStorage，或者localStorage的时候提示错误
import 'utils/checkAndWarn'

// rem设置
import 'utils/setRem'

// 判断是否启用vconsole
import 'utils/addSecretVconsole'

setGlobalMixin(http)
setGlobalExtend(http)
