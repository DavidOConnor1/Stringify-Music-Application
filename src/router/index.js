
import { createRouter, createWebHistory } from 'vue-router'
import Signin from '@/componets/Signin.vue' 
import MainBody from '@/componets/MainBody.vue'
import Signup from '@/componets/Signup.vue'
import Songs from '@/componets/Songs.vue'
import Artists from '@/componets/Artists.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainBody
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
  {
    path:'/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/song',
    name: 'Songs',
    component: Songs
  },
  {
    path: '/artist',
    name: 'Artists',
    component: Artists
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
