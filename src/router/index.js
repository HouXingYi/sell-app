import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/goods/index'
import ratings from 'components/ratings/index'
import seller from 'components/seller/index'

Vue.use(Router)

const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

export default new Router({
  routes
})
