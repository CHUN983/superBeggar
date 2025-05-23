import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faHeart, faGear } from '@fortawesome/free-solid-svg-icons'

// 加入需要的 icon
library.add(faBars, faHeart, faGear)

dom.watch()

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
