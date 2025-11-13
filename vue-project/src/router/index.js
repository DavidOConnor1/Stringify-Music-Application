
import { createRouter, createWebHistory } from 'vue-router'
import Signin from '@/components/Signin.vue' 
import MainBody from '@/components/MainBody.vue'
import Signup from '@/components/Signup.vue'
import Artists from '@/components/Artists.vue'
import Songs from '@/components/Songs.vue'




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
    path: '/artist',
    name: 'Artists',
    component: Artists
  },
  {
    path: '/song',
    name: 'Songs',
    component: Songs
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
