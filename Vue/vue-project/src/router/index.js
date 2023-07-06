import { createRouter, createWebHistory } from 'vue-router'
import EsceneView1 from '../views/Trasformaciones_vista.vue'
import EscenaLuzAmb from '../views/Luz_Ambiental_vista.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/trasformaciones',
      name: 'trasformaciones',
      component: EsceneView1
    },
    {
      path: '/luzAmbiental',
      name: 'luzAmbiental',
      component: EscenaLuzAmb
    },
  ]
})

export default router
