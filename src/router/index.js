import { createRouter, createWebHistory } from 'vue-router'

import EsceneView1 from '../views/Trasformaciones_vista.vue'
import EscenaLuzAmb from '../views/Luz_Ambiental_vista.vue'
import EscenaLuzDir from '../views/Luz_Direccional_vista.vue'
import EscenaLuzPnt from '../views/Luz_Puntual_vista.vue'
import EscenaLuzFoco from '../views/Luz_Foco_vista.vue'
import EscenaSeleccion from '../views/Seleccion_vista.vue'
import EscenaGrafo from '../views/Grafo_vista.vue'
import EscenaMallas from '../views/Mallas_vista.vue'
import EscenaBump from '../views/Bump_vista.vue'
import EscenaFiltros from '../views/Filtros_vista.vue'
import EscenaReflexion from '../views/Reflexion_vista.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'trasformaciones',
      component: EsceneView1
    },
    {
      path: '/luzAmbiental',
      name: 'luzAmbiental',
      component: EscenaLuzAmb
    },
    {
      path: '/luzDireccional',
      name: 'luzDireccional',
      component: EscenaLuzDir
    },
    {
      path: '/luzPuntual',
      name: 'luzPuntual',
      component: EscenaLuzPnt
    },
    {
      path: '/luzFoco',
      name: 'luzFoco',
      component: EscenaLuzFoco
    },
    {
      path: '/seleccion',
      name: 'seleccion',
      component: EscenaSeleccion
    },
    {
      path: '/grafo',
      name: 'grafo',
      component: EscenaGrafo 
    },
    {
      path: '/mallas',
      name: 'mallas',
      component: EscenaMallas
    },
    {
      path: '/bump',
      name: 'bump',
      component: EscenaBump
    },
    {
      path: '/aplicacion',
      name: 'aplicacion',
      component: EscenaFiltros
    },
    {
      path: '/reflexion',
      name: 'reflexion',
      component: EscenaReflexion
    }
  ]
})

export default router
