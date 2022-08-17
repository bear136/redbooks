<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted () {
    const token = window.localStorage.getItem('redBooksToken')
    if (token !== null) {
      this.$ws.initWebSocket(this.callback)
    }
  },
  destroyed () {
    this.$ws.websocketClose()
  },
  methods: {
    callback (msg) {
      if (msg !== '消息发送失败!') {
        const res = JSON.parse(msg)
        try {
          if (res.type == 'history') {
            this.$store.dispatch('messInfo/addOldInfo', res)
          } else {
            console.log('实时测试', res)
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
}
.van-swipe-cell__right {
    right: -1px !important;
}
</style>

