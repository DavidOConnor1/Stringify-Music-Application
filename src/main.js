// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { securedAxiosInstance, plainAxiosInstance } from "./backend/axios";

const app = createApp(App);

app.config.globalProperties.$securedAxios = securedAxiosInstance;
app.config.globalProperties.$plainAxios = plainAxiosInstance;

app.use(router);

app.mount("#app");
