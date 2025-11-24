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

const validateTokenOnAppStart = () => {
    const isSignedIn = localStorage.isSignedIn;
    const csrfToken = localStorage.csrf;

    if(isSignedIn && csrfToken){
        securedAxiosInstance.get('/api/v1/songs')
        .catch(error => {
            if(error.response && error.response.status === 401) {
                //if the token is invalid, delete authentication data
                delete localStorage.csrf;
                delete localStorage.isSignedIn;
                console.log('Token invalidated on app start')
            }
        })
    }
}
