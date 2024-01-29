import { createApp } from "vue"
import { createRouter, createWebHistory, Router } from "vue-router"
import App from "./App.vue"
import HomeVue from "./pages/Home.vue";
import LoginVue from "./pages/Login.vue";
import RegisterVue from "./pages/Register.vue";
import StanzeVue from "./pages/Stanze.vue"

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
      {path: "/", component: HomeVue},
      {path: "/login", component: LoginVue},
      {path: "/register", component: RegisterVue},
      {path: "/stanze", component: StanzeVue}
    ]
})

createApp(App).use(router).mount("#app");