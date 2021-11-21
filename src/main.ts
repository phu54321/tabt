import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMusic, faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

library.add(faMusic, faGithub, faPlayCircle)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
