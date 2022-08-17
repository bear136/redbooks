import Vue from 'vue'
import Vuex from 'vuex'
import messInfo from './message.js'
import reviewInfo from './review'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    messInfo,
    reviewInfo
  }
})
