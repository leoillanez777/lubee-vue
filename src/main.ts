import './assets/main.css'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

axios.defaults.baseURL = import.meta.env.VITE_URL_BACK

const app = createApp(App)

app.use(createPinia())
app.use(createBootstrap())
app.use(router)

app.mount('#app')
