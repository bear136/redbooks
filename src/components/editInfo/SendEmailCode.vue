<template>
  <div>
    <van-field v-model="mail"
               label="邮箱"
               placeholder="请输入邮箱"
               :rules="[{ pattern, message: '请输入正确的邮箱' }]"
               @input="$emit('inputMail',mail)">
      <template #button>
        <van-button v-show="show"
                    native-type="button"
                    size="small"
                    @click="sendCode()"
                    type="default">{{sendMailMsg}}</van-button>
        <van-button v-show="!show"
                    native-type="button"
                    size="small"
                    type="default">{{count}}</van-button>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mail: this.email,
      show: true,
      count: 0,
      sendMailMsg: '发送验证码',
      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    }
  },
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'mail',
    event: 'inputMail'
  },
  methods: {
    async sendCode () {
      if (!this.pattern.test(this.mail)) {
        return
      }
      const TIME_COUNT = 60
      this.sendMailMsg = '重新发送'
      if (!this.timer) {
        // 发送获取邮箱验证码的请求
        // 发送请求

        const { data: res } = await this.$http.get('/sendCode', {
          params: {
            email: this.mail
          }
        })
        if (res.status === 'success') {
          this.$Toast.success('验证码发送成功')
        }
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  }
}
</script>

<style>
</style>