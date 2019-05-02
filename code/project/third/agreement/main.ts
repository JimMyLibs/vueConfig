
import "isomorphic-fetch"
import "@babel/polyfill"
import { Vue } from 'vue-property-decorator'
import router from './router'
import store from 'comm/vues/store'
import App from './App.vue'
import 'comm/utils/page'
// import VConsole from 'vconsole'


import 'comm/public/reset';
import 'comm/public/style';
import './public/style';
import './resource/style/index.scss';

// const VC = new VConsole();

const app = new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
