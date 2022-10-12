<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!--不需要缓存的keep-alive 配置 展示内容-->
    <router-view v-if="!$route.meta.keepAlive" />
    <Notify />
  </div>
</template>
<script>
import Notify from './components/message/Notify.vue'
export default {
  data () {
    return {}
  },
  components: {
    Notify
  },
  mounted () {
    const token = window.localStorage.getItem('redBooksToken')
    if (token != null) {
      this.$ws.connectWebsocket(this.callback)
    }
  },
  destroyed () {
    this.$ws.websocketClose()
  },
  methods: {
    callback (msg) {
      if (msg !== '消息发送失败!' && msg !== 'ping') {
        const res = JSON.parse(msg)
        try {
          if (res.type === 'history') {
            this.$store.dispatch('messInfo/addOldInfo', res)
          } else if (res.msg_type === 5 || res.msg_type === 6 || res.msg_type === 7) {
            this.$bus.$emit('showNotify', res)
          } else {
            this.$store.dispatch('messInfo/addUserMsg', res)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.van-swipe-cell__right {
  right: -1px !important;
}

.van-tabs__nav--card {
  margin: 0 !important;
  font-size: 14px !important;
  border: none !important;
  color: #727274 !important;
}

.van-tabs__nav--card .van-tab.van-tab--active {
  color: #515056 !important;
  font-weight: bold !important;
  background-color: #f3f3f3 !important;
}

.van-tabs__nav--card .van-tab {
  color: #727274 !important;
  border-right: none !important;
  margin-left: 10px;
  background-color: #f3f3f3 !important;
  border-radius: 5px;
}
</style>
