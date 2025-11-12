import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'

Vue.config.productionTip = false

// Make axios instances available globally
app.config.globalProperties.$securedAxios = securedAxiosInstance
app.config.globalProperties.$plainAxios = plainAxiosInstance

createApp(App).mount('#app')