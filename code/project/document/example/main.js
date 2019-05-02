import App from './App'
import router from './router'
import modules from './store'
import conf from './utils/conf'

import createApp from 'comm/vues/createApp'

import './public/public'

// import Vconsole from 'vconsole'
// new Vconsole()

// const filters = {
//   myFilter: (value, other) => {
//     return `${value}-${other}`
//   }
// }
//
// const methods = {
//   $who: (value) => {
//     console.log(`${value}-wto`)
//   }
// }
//
// const vueExtends = {
//   $who3: (value) => {
//     console.log(`${value}-wto`)
//   }
// }

createApp({
  App,
  conf,
  router,
  modules,
  // filters,
  // methods,
  // vueExtends
})
