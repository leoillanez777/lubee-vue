import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OperacionView from '../views/OperacionView.vue'
import PropiedadView from '../views/PropiedadView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/operacion',
      component: OperacionView
    },
    {
      path: '/propiedad',
      component: PropiedadView
    }
  ]
})

export default router
