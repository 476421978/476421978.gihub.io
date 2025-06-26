import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import AuthRouter from './auth'
// const mammoth = () => import('mammoth')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/editor/index.vue'),
    beforeEnter: (to, from, next) => {
      // mammoth().then((mammothLoad) => {
      //   window.mammoth = mammothLoad
      // })
      next()
    }
  },
  {
    path: '/editor/xlsx',
    name: 'Xlsx',
    component: () => import('@/views/editor/xlsx.vue')
  },
  {
    path: '/hooks',
    name: 'Hooks',
    component: () => import('@/views/hooks/index.vue')
  },
  {
    path: '/hooks/demo_1',
    name: 'demo_1',
    component: () => import('@/views/hooks/demo_1/index.vue')
  },
  {
    path: '/hooks/demo_2',
    name: 'demo_2',
    component: () => import('@/views/hooks/demo_2/index.vue')
  },
  {
    path: '/echarts/capaticy',
    name: 'Capaticy',
    component: () => import('@/views/echarts/capaticy/index.vue')
  },
  {
    path: '/echarts/capaticy3',
    name: 'Capaticy3',
    component: () => import('@/views/echarts/capaticy3/index.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/map/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// })

export default router
