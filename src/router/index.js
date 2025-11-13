
import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD:vue-project/src/router/index.js
import Signin from '@/components/Signin.vue' 
import MainBody from '@/components/MainBody.vue'
import Signup from '@/components/Signup.vue'
import Artists from '@/components/Artists.vue'
import Songs from '@/components/Songs.vue'



=======
import Signin from '@/componets/Signin.vue' 
import MainBody from '@/componets/MainBody.vue'
import Signup from '@/componets/Signup.vue'
import Songs from '@/componets/Songs.vue'
import Artists from '@/componets/Artists.vue'
>>>>>>> 89398be (I am trying again):src/router/index.js

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
<<<<<<< HEAD:vue-project/src/router/index.js
    path: '/artist',
    name: 'Artists',
    component: Artists
  },
  {
=======
>>>>>>> 89398be (I am trying again):src/router/index.js
    path: '/song',
    name: 'Songs',
    component: Songs
  },
<<<<<<< HEAD:vue-project/src/router/index.js
=======
  {
    path: '/artist',
    name: 'Artists',
    component: Artists
  },
>>>>>>> 89398be (I am trying again):src/router/index.js
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
