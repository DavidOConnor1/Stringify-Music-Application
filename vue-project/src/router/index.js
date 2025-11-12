// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Signin from '@/componets/Signin.vue' 
import App from '@/App.vue'
import MainBody from '@/componets/MainBody.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainBody
  },
  {path: '/signin',
    name: 'Signin',
    component: Signin
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
