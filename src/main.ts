import Vue from 'vue'
import App from './App.vue'
import './plugins/view-ui'

// 按需引入 echarts
import echarts from './plugins/echarts'

// 字体图标
import './assets/iconfonts/iconfont.css'
import './assets/iconfonts/iconfont.js'
import './assets/fonts/font.scss'

// 通用样式
import './styles/common/reset.scss'
import './styles/common/utilities.scss'

// 全局
import './components/global/global-components'
import store from './store'
import router from './router'

import directives from './scripts/directives'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$EventBus = new Vue() // 事件总线
Vue.use(directives)

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
