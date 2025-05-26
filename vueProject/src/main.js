import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faHeart, faMagnifyingGlass, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'   // 實心
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons' // 空心

// 加入需要的 icon
library.add(faBars, faHeart, faMagnifyingGlass, faUtensils, fasHeart,  farHeart)

dom.watch()

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
