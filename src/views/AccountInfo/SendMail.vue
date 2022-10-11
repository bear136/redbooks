<template>
  <div>
    <van-nav-bar title="邮箱验证"
                 left-text="返回"
                 left-arrow
                 @click-left="onClickLeft" />
    <div class="tips">
      <div class="tip_title">
        验证码将发送到{{getInfo.mail}}邮箱
      </div>
      <div class="tip_span">
        如果长时间未收到验证码，请检查垃圾箱
      </div>
    </div>
    <div class="sendCode">
      <van-field v-model="mailCode"
                 size="large"
                 center
                 clearable
                 label="填写验证码"
                 placeholder="请输入邮箱验证码">
        <template #button>
          <van-button v-show="show"
                      size="small"
                      @click="sendCode()"
                      type="default">{{sendMailMsg}}</van-button>
          <van-button v-show="!show"
                      size="small"
                      type="default">{{count}}</van-button>
        </template>
      </van-field>
    </div>
    <div class="nextStep">
      <van-button :type="disabled?'default':'info'"
                  @click="goToChangeInfo()"
                  :disabled='disabled'>下一步</van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      mailCode: '',
      show: true,
      count: 0,
      sendMailMsg: '发送验证码',
      disabled: true
    }
  },
  computed: {
    ...mapGetters(['getInfo'])
  },
  watch: {
    mailCode (newVal, oldVal) {
      if (newVal !== '') {
        return (this.disabled = false)
      } else if (newVal === '') {
        return (this.disabled = true)
      }
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async sendCode () {
      const TIME_COUNT = 60
      this.sendMailMsg = '重新发送'
      if (!this.timer) {
        // 发送获取邮箱验证码的请求
        // 发送请求
        const { data: res } = await this.$http.get('/sendCode', {
          params: {
            email: this.getInfo.mail
          }
        })

        if (res === 'success') {
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
    },
    // 判断修改的是什么
    async goToChangeInfo () {
      const { data: res } = await this.$http.post('/checkCode', {
        email: this.getInfo.mail,
        code: this.mailCode
      })
      if (res.status === 'success') {
        this.$router.push({ name: 'changeMail' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
    height: 150px;
    width: 100%;
    margin-top: 30px;
    // background-color: #f0f0f0;
    padding: 15px;
    box-sizing: border-box;
    .tip_title {
        width: 100%;
        line-height: 40px;
        font-size: 18px;
    }
    .tip_span {
        height: 40px;
        width: 100%;
        line-height: 40px;
        font-size: 18px;
        color: #ccc;
    }
}
.sendCode {
    width: 100%;

    box-sizing: border-box;
    height: 80px;
}
.nextStep {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
}
</style>