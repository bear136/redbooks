import Vue from 'vue'
import Vuex from 'vuex'
import messInfo from './message.js'
import reviewInfo from './review'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      tel: '',
      mail: ''
    }
  },
  mutations: {
    holdingInfo (state, info) {
      const { email, number } = info
      state.userInfo.tel = number
      state.userInfo.mail = email
    }
  },
  actions: {
    changeInfo (content, value) {
      content.commit('holdingInfo', value)
    }
  },
  getters: {
    getInfo (state) {
      return state.userInfo
    }
  },
  modules: {
    messInfo,
    reviewInfo
  }
})
