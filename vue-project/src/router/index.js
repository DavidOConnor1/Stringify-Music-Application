// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Signin from '@/componets/Signin.vue' // 👈 check spelling!

const routes = [
  {
    path: '/',
    name: 'Signin',
    component: Signin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
