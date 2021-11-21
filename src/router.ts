import BlindTest from './pages/BlindTest/index.vue'
import { createWebHashHistory, createRouter } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: BlindTest }
  ]
})
