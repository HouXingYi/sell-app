//import 引入资源模块
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import goods from 'components/goods/index'
import ratings from 'components/ratings/index'
import seller from 'components/seller/index'
Vue.config.productionTip = false
//css
import 'common/sass/index.scss'
//vue插件
Vue.use(vueResource);
/* eslint-disable no-new */
//实例化vue
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
