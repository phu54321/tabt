import AboutPage from './pages/AboutPage.vue'
import { createWebHashHistory, createRouter } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: AboutPage }
  ]
})
