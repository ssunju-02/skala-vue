import { createRouter, createWebHistory } from 'vue-router'

const Assignment1View = () => import('../views/Assignment1View.vue')
const Assignment2View = () => import('../views/Assignment2View.vue')
const WeatherParent = () => import('../views/WeatherParent.vue')
const WeatherHomeView = () => import('../views/WeatherHomeView.vue')
const WeatherAboutView = () => import('../views/WeatherAboutView.vue')
const WeatherDetailView = () => import('../views/WeatherDetailView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'assignment1',
      component: Assignment1View,
    },
    {
      path: '/assignment2',
      name: 'assignment2',
      component: Assignment2View,
    },
    {
      path: '/assignment3',
      name: 'assignment3',
      component: WeatherParent,
    },
    {
      path: '/weather',
      name: 'weather-home',
      component: WeatherHomeView,
    },
    {
      path: '/weather/about',
      name: 'weather-about',
      component: WeatherAboutView,
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: WeatherDetailView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
