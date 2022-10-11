import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import ws from './utils/websocket'
import './plugins/vant'
import './index.css'
Vue.prototype.$ws = ws
Vue.prototype.$http = axios
Vue.prototype.defalutUrl = 'http://123.57.180.25:9000'

Vue.config.productionTip = false
new Vue({
  beforeCreate () {
    Vue.prototype.$bus = this
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.directive('lazy', {
  inserted (el, binding) {
    // 定义一个观察器，entries为状态改变元素的数组
    const observer = new IntersectionObserver((entries) => {
      // 遍历
      for (const i of entries) {
        // 如果改元素处于可视区
        if (i.isIntersecting > 0) {
          // 获取该元素
          const img = i.target

          // 重新设置src值
          img.src = binding.value

          // 取消对该元素的观察
          observer.unobserve(img)
        }
      }
    })
    // 为 img 标签添加一个观察
    observer.observe(el)
  },
  bind (el, binding, vnode) {
    const num = parseInt(Math.random() * 1000)
    vnode.key = num
  }
})
