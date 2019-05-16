import Vue from 'vue'
import Router from 'vue-router'
import HuntRoom from './views/HuntRoom.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/room/:roomName',
      name: 'room',
      component: HuntRoom
    }
  ]
})
