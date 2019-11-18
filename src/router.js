import Vue from 'vue'
import Router from 'vue-router'
import Ebook from './views/ebook/index'
import EookReader from './components/ebook/EookReader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      component: Ebook,
      children: [
        {
          path: ':fileName',
          component: EookReader
        }
      ]
    }
  ]
})
